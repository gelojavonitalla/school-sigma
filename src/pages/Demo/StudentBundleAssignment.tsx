import { useMemo, useState } from "react";
import {
  Users,
  Eye,
  ChevronDown,
  X,
  Receipt,
  Coins,
  Tag,
  Percent,
  Search,
} from "lucide-react";
import Badge from "../../components/ui/badge/Badge";
import DiscountCellTA from "./DiscountCellTA";

/* -------------------------------------------
   Mock data (bundles + discounts + students)
   ------------------------------------------- */

type BundleId = "g5-regular" | "g3-regular" | "preschool-new";

type BundleItem = { id: string; name: string; amount: number };
type Bundle = {
  id: BundleId;
  label: string;
  desc?: string;
  items: BundleItem[];
};

const BUNDLES: Record<BundleId, Bundle> = {
  "g5-regular": {
    id: "g5-regular",
    label: "G5 Regular Student",
    desc: "Typical Grade 5 returning student.",
    items: [
      { id: "reg", name: "Registration", amount: 500 },
      { id: "tuition-g1-g6", name: "Tuition Grade 1 – 6", amount: 57200 },
      { id: "misc", name: "Miscellaneous Fees", amount: 19800 },
      { id: "lms", name: "LMS", amount: 1500 },
      { id: "robotics", name: "Robotics", amount: 5000 },
    ],
  },
  "g3-regular": {
    id: "g3-regular",
    label: "G3 Regular Student",
    desc: "Typical Grade 3 returning student.",
    items: [
      { id: "reg", name: "Registration", amount: 500 },
      { id: "tuition-g1-g6", name: "Tuition Grade 1 – 6", amount: 54200 },
      { id: "misc", name: "Miscellaneous Fees", amount: 18500 },
      { id: "lms", name: "LMS", amount: 1500 },
      { id: "robotics", name: "Robotics", amount: 5000 },
    ],
  },
  "preschool-new": {
    id: "preschool-new",
    label: "Preschool New Student",
    desc: "Preschooler + developmental fee for new students.",
    items: [
      { id: "reg", name: "Registration", amount: 500 },
      { id: "developmental", name: "Developmental Fee (New Students)", amount: 10000 },
      { id: "tuition-preschool", name: "Tuition Preschool", amount: 57200 },
      { id: "misc", name: "Miscellaneous Fees", amount: 19800 },
      { id: "lms", name: "LMS", amount: 1500 },
      { id: "robotics", name: "Robotics", amount: 5000 },
    ],
  },
};

type DiscountId = "earlyBird" | "sibling";
type DiscountLabel = "Early Bird" | "Sibling";

const DISCOUNTS: Record<
  DiscountId,
  { id: DiscountId; label: DiscountLabel; amount: number }
> = {
  earlyBird: { id: "earlyBird", label: "Early Bird", amount: 1144 },
  sibling: { id: "sibling", label: "Sibling", amount: 2860 },
};

// 👇 label ↔ id mapping used by the Add menu callback
const LABEL_TO_ID: Record<DiscountLabel, DiscountId> = {
  "Early Bird": "earlyBird",
  "Sibling": "sibling",
};

type StudentRow = {
  id: string;
  name: string;
  grade: string;
  section: string;
  bundle: BundleId;
  reservationPaid: boolean;
  discounts: DiscountId[];
};

const STUDENTS_INITIAL: StudentRow[] = [
  {
    id: "s1",
    name: "River Javonitalla",
    grade: "Grade 5",
    section: "Galatians",
    bundle: "g5-regular",
    reservationPaid: true,
    discounts: [],
  },
  {
    id: "s2",
    name: "Lake Javonitalla",
    grade: "Grade 3",
    section: "Romans",
    bundle: "g3-regular",
    reservationPaid: false,
    discounts: ["sibling"],
  },
  {
    id: "s3",
    name: "Fjord Javonitalla",
    grade: "Preschool",
    section: "Genesis",
    bundle: "preschool-new",
    reservationPaid: true,
    discounts: ["earlyBird"],
  },
];

/* -------------------------
   Helpers
   ------------------------- */
const peso = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  maximumFractionDigits: 0,
});

function bundleSum(b: Bundle) {
  return b.items.reduce((s, i) => s + i.amount, 0);
}

function discountsSum(ids: DiscountId[]) {
  return ids.reduce((s, id) => s + DISCOUNTS[id].amount, 0);
}

/* -------------------------
   Component
   ------------------------- */
export default function StudentPlanAssignment() {
  const [rows, setRows] = useState<StudentRow[]>(STUDENTS_INITIAL);

  // Filters
  const [q, setQ] = useState("");
  const [gradeFilter, setGradeFilter] = useState<string>("all");
  const [sectionFilter, setSectionFilter] = useState<string>("all");

  const grades = useMemo(
    () => Array.from(new Set(rows.map((r) => r.grade))),
    [rows],
  );
  const sections = useMemo(
    () => Array.from(new Set(rows.map((r) => r.section))),
    [rows],
  );

  // Modal state
  const [openId, setOpenId] = useState<string | null>(null);
  const openStudent = useMemo(
    () => rows.find((r) => r.id === openId) || null,
    [rows, openId],
  );
  const openBundle = openStudent ? BUNDLES[openStudent.bundle] : null;

  // Totals per row
  const totals = useMemo(() => {
    return rows.map((r) => {
      const b = BUNDLES[r.bundle];
      const totalFees = bundleSum(b);
      const lessDiscounts = discountsSum(r.discounts);
      const reservationCredit = r.reservationPaid ? 5000 : 0;
      const balance = Math.max(0, totalFees - lessDiscounts - reservationCredit);
      return { id: r.id, totalFees, lessDiscounts, reservationCredit, balance };
    });
  }, [rows]);

  const lookupTotals = (id: string) => totals.find((t) => t.id === id)!;

  const changeBundle = (id: string, val: BundleId) =>
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, bundle: val } : r)));

  const addDiscount = (id: string, d: DiscountId) =>
    setRows((rs) =>
      rs.map((r) =>
        r.id === id && !r.discounts.includes(d)
          ? { ...r, discounts: [...r.discounts, d] }
          : r,
      ),
    );

  const removeDiscount = (id: string, d: DiscountId) =>
    setRows((rs) =>
      rs.map((r) =>
        r.id === id
          ? { ...r, discounts: r.discounts.filter((x) => x !== d) }
          : r,
      ),
    );

  // Apply filters
  const visibleRows = useMemo(() => {
    const query = q.trim().toLowerCase();
    return rows.filter((r) => {
      const matchesQ = !query || r.name.toLowerCase().includes(query);
      const matchesGrade = gradeFilter === "all" || r.grade === gradeFilter;
      const matchesSection = sectionFilter === "all" || r.section === sectionFilter;
      return matchesQ && matchesGrade && matchesSection;
    });
  }, [rows, q, gradeFilter, sectionFilter]);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
      {/* Header + Filters */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-800 dark:text-white/90">
          <Users className="h-5 w-5" />
          Assign Tuition Bundles
        </h2>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* Search */}
          <label className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search student…"
              className="w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 py-2 text-sm text-gray-700 outline-none transition focus:border-gray-300 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200"
            />
          </label>

          {/* Grade */}
          <select
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-gray-300 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200"
          >
            <option value="all">All grades</option>
            {grades.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>

          {/* Section */}
          <select
            value={sectionFilter}
            onChange={(e) => setSectionFilter(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-gray-300 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200"
          >
            <option value="all">All sections</option>
            {sections.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-gray-800">
        <table className="min-w-full text-left">
          <thead className="bg-gray-50 text-gray-600 dark:bg-gray-900 dark:text-gray-400">
            <tr className="text-sm">
              <th className="px-5 py-3 font-medium">Student</th>
              <th className="px-5 py-3 font-medium">Grade / Section</th>
              <th className="px-5 py-3 font-medium">Tuition Bundle</th>
              <th className="px-5 py-3 text-center font-medium">Reservation</th>
              <th className="px-5 py-3 font-medium">Discounts</th>
              <th className="px-5 py-3 text-right font-medium">Total Fees</th>
              <th className="px-5 py-3 text-right font-medium">Balance</th>
              <th className="px-5 py-3 text-center font-medium">Details</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 text-sm dark:divide-gray-800">
            {visibleRows.map((r) => {
              const t = lookupTotals(r.id);
              const allDiscountsApplied =
                r.discounts.length >= Object.keys(DISCOUNTS).length;

              return (
                <tr key={r.id} className="text-gray-700 dark:text-gray-300">
                  <td className="px-5 py-3 font-medium text-gray-800 dark:text-white/90">
                    {r.name}
                  </td>

                  <td className="px-5 py-3">
                    <div className="text-gray-800 dark:text-white/90">{r.grade}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{r.section}</div>
                  </td>

                  {/* Bundle dropdown */}
                  <td className="px-5 py-3">
                    <div className="relative">
                      <select
                        value={r.bundle}
                        onChange={(e) => changeBundle(r.id, e.target.value as BundleId)}
                        className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-3 py-2 pr-8 text-sm text-gray-700 outline-none transition focus:border-gray-300 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200"
                      >
                        {Object.values(BUNDLES).map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    </div>
                  </td>

                  {/* Reservation */}
                  <td className="px-5 py-3 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <Badge color={r.reservationPaid ? "success" : "warning"}>
                        {r.reservationPaid ? "Paid" : "Unpaid"}
                      </Badge>
                    </div>
                  </td>

                  {/* Discounts chips + Add */}
                  <td className="px-5 py-3">
                    <div className="flex flex-wrap items-center gap-2">
                      {r.discounts.map((d) => (
                        <span
                          key={d}
                          className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-300"
                        >
                          <Percent className="h-3.5 w-3.5" />
                          {DISCOUNTS[d].label}
                          <button
                            onClick={() => removeDiscount(r.id, d)}
                            className="ml-1 rounded p-0.5 hover:bg-black/5 dark:hover:bg-white/10"
                            aria-label="Remove discount"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}

                      <DiscountCellTA
                        disabled={allDiscountsApplied}
                        onAdd={(label) => addDiscount(r.id, LABEL_TO_ID[label])}
                      />
                    </div>
                  </td>

                  {/* Totals */}
                  <td className="px-5 py-3 text-right font-medium text-gray-800 dark:text-white/90">
                    {peso.format(t.totalFees)}
                  </td>
                  <td className="px-5 py-3 text-right font-semibold text-gray-900 dark:text-white">
                    {peso.format(t.balance)}
                  </td>

                  {/* Details (modal trigger) */}
                  <td className="px-5 py-3 text-center">
                    <button
                      onClick={() => setOpenId(r.id)}
                      className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-white/5"
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ------------- Modal ------------- */}
      {openStudent && openBundle && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpenId(null)}
          />
          <div className="relative z-[101] w-[560px] max-w-[92vw] rounded-2xl border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                  {openStudent.name} — {openBundle.label}
                </h3>
                {openBundle.desc && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {openBundle.desc}
                  </p>
                )}
              </div>
              <button
                onClick={() => setOpenId(null)}
                className="rounded-md p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Fee lines */}
            <div className="space-y-2">
              <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Fees
              </div>
              {openBundle.items.map((it) => (
                <div
                  key={it.id}
                  className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-3 py-2 text-sm dark:border-gray-800 dark:bg-gray-900"
                >
                  <div className="flex items-center gap-2">
                    <Coins className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-gray-800 dark:text-white/90">{it.name}</span>
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {peso.format(it.amount)}
                  </span>
                </div>
              ))}
            </div>

            {/* Discounts & Reservation */}
            <div className="mt-4 space-y-2">
              {openStudent.discounts.length > 0 && (
                <>
                  <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Discounts
                  </div>
                  {openStudent.discounts.map((d) => (
                    <div
                      key={d}
                      className="flex items-center justify-between rounded-xl border border-gray-100 bg-emerald-500/5 px-3 py-2 text-sm dark:border-gray-800"
                    >
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-emerald-700 dark:text-emerald-300">
                          {DISCOUNTS[d].label}
                        </span>
                      </div>
                      <span className="font-medium text-emerald-700 dark:text-emerald-300">
                        −{peso.format(DISCOUNTS[d].amount)}
                      </span>
                    </div>
                  ))}
                </>
              )}

              {openStudent.reservationPaid && (
                <>
                  <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Credits
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-blue-500/5 px-3 py-2 text-sm dark:border-gray-800">
                    <div className="flex items-center gap-2">
                      <Receipt className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-blue-700 dark:text-blue-300">
                        Reservation deposit (Deducts {peso.format(5000)})
                      </span>
                    </div>
                    <span className="font-medium text-blue-700 dark:text-blue-300">
                      −{peso.format(5000)}
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Summary */}
            <div className="mt-5 space-y-1 text-sm">
              <div className="flex items-center justify-between text-gray-700 dark:text-gray-300">
                <span>Subtotal</span>
                <span>{peso.format(bundleSum(openBundle))}</span>
              </div>
              {discountsSum(openStudent.discounts) > 0 && (
                <div className="flex items-center justify-between text-gray-700 dark:text-gray-300">
                  <span>Less discounts</span>
                  <span>−{peso.format(discountsSum(openStudent.discounts))}</span>
                </div>
              )}
              {openStudent.reservationPaid && (
                <div className="flex items-center justify-between text-gray-700 dark:text-gray-300">
                  <span>Less reservation</span>
                  <span>−{peso.format(5000)}</span>
                </div>
              )}
              <div className="mt-2 flex items-center justify-between text-base font-semibold text-gray-900 dark:text-white">
                <span>Balance</span>
                <span>
                  {peso.format(
                    Math.max(
                      0,
                      bundleSum(openBundle) -
                        discountsSum(openStudent.discounts) -
                        (openStudent.reservationPaid ? 5000 : 0),
                    ),
                  )}
                </span>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setOpenId(null)}
                className="rounded-md border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-white/5"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}