// src/pages/Finance/GradeFeeBundler.tsx
import { useCallback, useEffect, useMemo, useState } from "react";
import ComponentCard from "../../components/common/ComponentCard";
import Button from "../../components/ui/button/Button";
import Badge from "../../components/ui/badge/Badge";
import { Modal } from "../../components/ui/modal";
import { useModal } from "../../hooks/useModal";
import {
  GraduationCap,
  Coins,
  Tags,
  Settings2,
  Save,
  Calculator,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

/* ==============================
   Types
   ============================== */
type ItemCategory = "Tuition & Fees";
type PlanType = "Yearly" | "Semestral" | "Quarterly";

export type MasterItem = {
  id: string;
  name: string;
  category: ItemCategory;
  defaultAmount: number;
};

type GradeItemConfig = {
  included: boolean; // toggled here; parents can't change later
  amount: number; // read-only (from product list)
};

type GradeBundle = {
  gradeKey: string;
  items: Record<string, GradeItemConfig>;
};

type Props = {
  catalog?: MasterItem[]; // optional mock injection
};

/* ==============================
   Constants (plain constants — no hooks at module scope)
   ============================== */

const CORE_INCLUDE_BY_DEFAULT = new Set<string>([
  "reg",
  "misc",
  "lms",
  "robotics",
]);

const TUITION_KEYS = [
  "tuition-preschool",
  "tuition-g1-g6",
  "tuition-g7-g10",
  "tuition-g11-g12",
] as const;

const INSTALLMENT_FEE = 575;

const GRADE_OPTIONS = [
  { key: "Pre-School", label: "Pre-School" },
  { key: "G1", label: "Grade 1" },
  { key: "G2", label: "Grade 2" },
  { key: "G3", label: "Grade 3" },
  { key: "G4", label: "Grade 4" },
  { key: "G5", label: "Grade 5" },
  { key: "G6", label: "Grade 6" },
];

const GRADE_DEFAULTS: Record<
  string,
  Partial<Record<string, Partial<GradeItemConfig>>>
> = {
  G3: {
    "tuition-g1-g6": { amount: 54200, included: true },
    misc: { amount: 18500, included: true },
    reg: { included: true },
    lms: { included: true },
    robotics: { included: true },
  },
  G5: {
    "tuition-g1-g6": { amount: 57200, included: true },
    misc: { amount: 19800, included: true },
    reg: { included: true },
    lms: { included: true },
    robotics: { included: true },
  },
  G6: {
    "tuition-g1-g6": { amount: 59800, included: true },
    misc: { amount: 20500, included: true },
    reg: { included: true },
    lms: { included: true },
    robotics: { included: true },
  },
};

const DEFAULT_CATALOG: MasterItem[] = [
  { id: "reg", name: "Registration", category: "Tuition & Fees", defaultAmount: 500 },
  { id: "tuition-preschool", name: "Tuition Preschool", category: "Tuition & Fees", defaultAmount: 57200 },
  { id: "tuition-g1-g6", name: "Tuition Grade 1 - 6", category: "Tuition & Fees", defaultAmount: 57200 },
  { id: "tuition-g7-g10", name: "Tuition Grade 7 - 10", category: "Tuition & Fees", defaultAmount: 60000 },
  { id: "tuition-g11-g12", name: "Tuition Grade 11 - 12", category: "Tuition & Fees", defaultAmount: 60000 },
  { id: "misc", name: "Miscellaneous Fees", category: "Tuition & Fees", defaultAmount: 19800 },
  { id: "lms", name: "LMS", category: "Tuition & Fees", defaultAmount: 1500 },
  { id: "robotics", name: "Robotics", category: "Tuition & Fees", defaultAmount: 5000 },
  { id: "developmental", name: "Developmental Fee (New Students)", category: "Tuition & Fees", defaultAmount: 10000 },
];

const peso = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  maximumFractionDigits: 0,
});

/* ==============================
   Component
   ============================== */
export default function GradeFeeBundler({ catalog }: Props) {
  const CATALOG = useMemo(() => {
    const base = catalog?.length ? catalog : DEFAULT_CATALOG;
    return base
      .filter((it) => it.id !== "reservation")
      .filter((it) => it.category === "Tuition & Fees");
  }, [catalog]);

  const [gradeKey, setGradeKey] = useState<string>("G5");
  const [bundleName, setBundleName] = useState("");
  const [openSection, setOpenSection] = useState<Record<ItemCategory, boolean>>({
    "Tuition & Fees": true,
  });

  // TailAdmin modal state for "Name this Bundle"
  const {
    isOpen: isNameOpen,
    openModal: openNameModal,
    closeModal: closeNameModal,
  } = useModal();

  // pick the tuition key for grade
  const tuitionKeyForGrade = (gKey: string): typeof TUITION_KEYS[number] => {
    if (gKey === "Pre-School") return "tuition-preschool";
    return "tuition-g1-g6";
  };

  const buildInitialBundle = useCallback(
    (gKey: string): GradeBundle => {
      const overrides = GRADE_DEFAULTS[gKey] || {};
      const items: Record<string, GradeItemConfig> = {};
      const targetTuition = tuitionKeyForGrade(gKey);

      CATALOG.forEach((it) => {
        const o = overrides[it.id] || {};
        const defaultIncluded =
          TUITION_KEYS.includes(it.id as any)
            ? it.id === targetTuition
            : CORE_INCLUDE_BY_DEFAULT.has(it.id);

        items[it.id] = {
          included: o.included ?? defaultIncluded,
          amount: o.amount ?? it.defaultAmount,
        };
      });

      TUITION_KEYS.forEach((tid) => {
        if (tid !== targetTuition && items[tid]) {
          items[tid].included = false;
        }
      });

      return { gradeKey: gKey, items };
    },
    [CATALOG],
  );

  const [bundle, setBundle] = useState<GradeBundle>(() => buildInitialBundle(gradeKey));

  useEffect(() => {
    setBundle(buildInitialBundle(gradeKey));
  }, [gradeKey, buildInitialBundle]);

  const updateItem = (id: string, patch: Partial<GradeItemConfig>) => {
    setBundle((prev) => ({
      ...prev,
      items: { ...prev.items, [id]: { ...prev.items[id], ...patch } },
    }));
  };

  const grouped = useMemo(() => {
    const groups: Record<ItemCategory, MasterItem[]> = { "Tuition & Fees": [] };
    CATALOG.forEach((it) => groups["Tuition & Fees"].push(it));
    return groups;
  }, [CATALOG]);

  // included lines & sums
  const includedCharges = useMemo(
    () =>
      Object.entries(bundle.items)
        .filter(([, cfg]) => cfg.included)
        .map(([id, cfg]) => ({ id, ...cfg })),
    [bundle.items],
  );

  const sumIncluded = useMemo(
    () => includedCharges.reduce((sum, it) => sum + it.amount, 0),
    [includedCharges],
  );

  const tuitionAmt = useMemo(
    () =>
      TUITION_KEYS.reduce((acc, key) => {
        const cfg = bundle.items[key];
        return acc + (cfg?.included ? cfg.amount : 0);
      }, 0),
    [bundle.items],
  );

  const miscAmt = bundle.items["misc"]?.included ? bundle.items["misc"].amount : 0;

  const plans = useMemo(() => {
    const yearlyTotal = Math.max(0, sumIncluded);

    const semTuition = tuitionAmt / 2;
    const semMisc = miscAmt / 2;
    const semFirstEnrollmentAddons = ["reg", "lms", "robotics", "developmental"]
      .filter((id) => bundle.items[id]?.included)
      .reduce((s, id) => s + bundle.items[id].amount, 0);
    const semFirst = semTuition + semMisc + semFirstEnrollmentAddons + INSTALLMENT_FEE;
    const semSecond = semTuition + semMisc + INSTALLMENT_FEE;

    const qTuition = tuitionAmt / 4;
    const qMisc = miscAmt / 4;
    const qFirstEnrollmentAddons = ["reg", "lms", "robotics", "developmental"]
      .filter((id) => bundle.items[id]?.included)
      .reduce((s, id) => s + bundle.items[id].amount, 0);
    const qFirst = qTuition + qMisc + qFirstEnrollmentAddons + INSTALLMENT_FEE;
    const qOther = qTuition + qMisc + INSTALLMENT_FEE;

    return {
      Yearly: {
        total: Math.round(yearlyTotal),
        installments: [{ label: "Upon Enrollment", amount: Math.round(yearlyTotal) }],
      },
      Semestral: {
        total: Math.round(semFirst + semSecond),
        installments: [
          { label: "Upon Enrollment", amount: Math.round(semFirst) },
          { label: "2nd Payment (Dec)", amount: Math.round(semSecond) },
        ],
      },
      Quarterly: {
        total: Math.round(qFirst + qOther * 3),
        installments: [
          { label: "Upon Enrollment", amount: Math.round(qFirst) },
          { label: "2nd Payment (Oct)", amount: Math.round(qOther) },
          { label: "3rd Payment (Dec)", amount: Math.round(qOther) },
          { label: "4th Payment (Feb)", amount: Math.round(qOther) },
        ],
      },
    } as Record<PlanType, { total: number; installments: { label: string; amount: number }[] }>;
  }, [bundle.items, sumIncluded, tuitionAmt, miscAmt]);

  /* ---------------------------
     Save flow (TailAdmin modal)
     ---------------------------*/
  const handleOpenSave = () => {
    const gradeLabel = GRADE_OPTIONS.find((g) => g.key === gradeKey)?.label || gradeKey;
    setBundleName(`${gradeLabel} Tuition & Fees`);
    openNameModal();
  };

  const handleConfirmSave = () => {
    // TODO: persist { name: bundleName, gradeKey, bundle }
    console.log("SAVE_BUNDLE", { name: bundleName, gradeKey, bundle });
    closeNameModal();
    alert(`Saved: “${bundleName}”`);
  };

  /* ==============================
     UI
     ============================== */
  return (
    <div className="space-y-6">
      {/* Header */}
      <ComponentCard
        title="Grade Fee Bundler"
        desc="Bundle ONLY Tuition & Fees per grade level. Parents cannot deselect items later."
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          {/* Grade selector */}
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Grade Level
            </label>
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-gray-400" />
              <select
                value={gradeKey}
                onChange={(e) => setGradeKey(e.target.value)}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-gray-300 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200"
              >
                {GRADE_OPTIONS.map((g) => (
                  <option key={g.key} value={g.key}>
                    {g.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Save */}
          <div className="flex items-center gap-3">
            <Button onClick={handleOpenSave} className="inline-flex items-center gap-2">
              <Save className="h-4 w-4" /> Save as Bundle
            </Button>
          </div>
        </div>
      </ComponentCard>

      {/* Tuition & Fees */}
      {(Object.keys(grouped) as ItemCategory[]).map((cat) => (
        <ComponentCard
          key={cat}
          title={cat}
          desc="Core charges for the school year."
          className="shadow-sm"
        >
          <button
            className="flex w-full items-center justify-between rounded-xl border border-gray-100 px-4 py-2 text-left dark:border-gray-800"
            onClick={() => setOpenSection((s) => ({ ...s, [cat]: !s[cat] }))}
          >
            <span className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Settings2 className="h-4 w-4" /> Configure {cat}
            </span>
            {openSection[cat] ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>

          {openSection[cat] && (
            <div className="mt-4 overflow-x-auto rounded-xl border border-gray-100 dark:border-gray-800">
              <table className="min-w-full text-left">
                <thead className="bg-gray-50 text-gray-600 dark:bg-gray-900 dark:text-gray-400">
                  <tr className="text-sm">
                    <th className="px-5 py-3 font-medium">Include</th>
                    <th className="px-5 py-3 font-medium">Item</th>
                    <th className="px-5 py-3 text-right font-medium">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm dark:divide-gray-800">
                  {grouped[cat].map((it) => {
                    const cfg = bundle.items[it.id];
                    if (!cfg) return null;

                    const isDevFee = it.id === "developmental";
                    const isTuition = TUITION_KEYS.includes(it.id as any);

                    return (
                      <tr key={it.id} className="text-gray-700 dark:text-gray-300">
                        <td className="px-5 py-3 align-middle">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-700"
                            checked={cfg.included}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              if (isTuition && checked) {
                                setBundle((prev) => {
                                  const next = { ...prev, items: { ...prev.items } };
                                  TUITION_KEYS.forEach((tid) => {
                                    if (tid !== it.id && next.items[tid]) {
                                      next.items[tid] = { ...next.items[tid], included: false };
                                    }
                                  });
                                  next.items[it.id] = { ...next.items[it.id], included: true };
                                  return next;
                                });
                              } else {
                                updateItem(it.id, { included: checked });
                              }
                            }}
                          />
                        </td>

                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                              <Coins className="h-4 w-4" />
                            </span>
                            <div className="min-w-0">
                              <div className="truncate font-medium text-gray-800 dark:text-white/90">
                                {it.name}
                              </div>
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                  <Tags className="h-3.5 w-3.5" />
                                  {it.id}
                                </span>
                                {isDevFee && (
                                  <Badge color="light" variant="light">
                                    Per-student (new enrollees)
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-3 text-right">
                          <span className="inline-block rounded-lg border border-gray-100 bg-gray-50 px-3 py-1.5 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200">
                            {peso.format(cfg.amount)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </ComponentCard>
      ))}

      {/* Plan Preview */}
      <ComponentCard title="Plan Preview" desc="Live totals based on your current grade bundle.">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="flex flex-col rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Yearly</h3>
              <Badge color="light" variant="light">One-time</Badge>
            </div>
            <div className="mb-4 text-3xl font-bold text-gray-900 dark:text-white/90">
              {peso.format(plans.Yearly.total)}
              <span className="ml-1 text-sm font-medium text-gray-500 dark:text-gray-400">/yr</span>
            </div>
            <div className="mt-auto space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <div className="flex items-center gap-2">
                <Calculator className="h-4 w-4" /> Discounts (reservation/early-bird/sibling) are applied per student at checkout.
              </div>
            </div>
          </div>

          <div className="flex flex-col rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Semestral</h3>
              <Badge color="info" variant="light">2 payments</Badge>
            </div>
            <div className="mb-4 text-3xl font-bold text-gray-900 dark:text-white/90">
              {peso.format(plans.Semestral.total)}
              <span className="ml-1 text-sm font-medium text-gray-500 dark:text-gray-400">/yr</span>
            </div>
            <ul className="mt-auto space-y-2 text-sm text-gray-700 dark:text-gray-300">
              {plans.Semestral.installments.map((i, idx) => (
                <li key={idx} className="flex justify-between">
                  <span>{i.label}</span>
                  <span className="font-medium">{peso.format(i.amount)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <Calculator className="h-4 w-4" />
              Includes {peso.format(INSTALLMENT_FEE)} installment fee per payment.
            </div>
          </div>

          <div className="flex flex-col rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Quarterly</h3>
              <Badge color="info" variant="light">4 payments</Badge>
            </div>
            <div className="mb-4 text-3xl font-bold text-gray-900 dark:text-white/90">
              {peso.format(plans.Quarterly.total)}
              <span className="ml-1 text-sm font-medium text-gray-500 dark:text-gray-400">/yr</span>
            </div>
            <ul className="mt-auto space-y-2 text-sm text-gray-700 dark:text-gray-300">
              {plans.Quarterly.installments.map((i, idx) => (
                <li key={idx} className="flex justify-between">
                  <span>{i.label}</span>
                  <span className="font-medium">{peso.format(i.amount)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <Calculator className="h-4 w-4" />
              Includes {peso.format(INSTALLMENT_FEE)} installment fee per payment.
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <Badge color="light" variant="light">
            {includedCharges.length} items included for{" "}
            {GRADE_OPTIONS.find((g) => g.key === gradeKey)?.label}
          </Badge>
          <Badge color="success" variant="solid">
            Base Sum: {peso.format(sumIncluded)}
          </Badge>
        </div>
      </ComponentCard>

      {/* CTA */}
      <div className="flex items-center justify-end gap-3">
        <Button onClick={handleOpenSave} className="inline-flex items-center gap-2">
          <Save className="h-4 w-4" /> Save as Bundle
        </Button>
      </div>

      {/* TailAdmin Modal: Name this Bundle */}
      <Modal isOpen={isNameOpen} onClose={closeNameModal} className="max-w-[600px] p-6 lg:p-8">
        <h4 className="mb-2 text-title-sm font-semibold text-gray-800 dark:text-white/90">
          Name this Bundle
        </h4>
        <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
          This name will appear when choosing a grade’s pricing package.
        </p>

        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Bundle Name
        </label>
        <input
          value={bundleName}
          onChange={(e) => setBundleName(e.target.value)}
          placeholder={`${GRADE_OPTIONS.find((g) => g.key === gradeKey)?.label} Tuition & Fees`}
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
        />

        <div className="mt-6 flex w-full items-center justify-end gap-3">
          <Button size="sm" variant="outline" onClick={closeNameModal}>
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={() => {
              handleConfirmSave();
            }}
            className="inline-flex items-center gap-2"
          >
            <Save className="h-4 w-4" /> Save
          </Button>
        </div>
      </Modal>
    </div>
  );
}