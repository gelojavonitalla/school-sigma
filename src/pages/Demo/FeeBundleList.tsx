import { useEffect, useMemo, useState } from "react";
import { Plus, PencilLine } from "lucide-react";

/** ---------- Types ---------- */
type BundleItemCfg = { included?: boolean; amount?: number };
type StoredBundle = {
  id: string;
  name: string;
  // optional metadata
  gradeKey?: string;
  createdAt?: string;
  items: Record<string, BundleItemCfg>;
};

/** ---------- Helpers ---------- */
const peso = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  maximumFractionDigits: 0,
});

// Be forgiving with different shapes: include if included===true OR included is undefined
function computeAmount(b: StoredBundle) {
  return Object.values(b.items || {}).reduce((sum, it) => {
    const inc = it?.included ?? true;
    const amt = it?.amount ?? 0;
    return inc ? sum + amt : sum;
  }, 0);
}

/** ---------- Fallback data (if no localStorage yet) ---------- */
const SAMPLE_BUNDLES: StoredBundle[] = [
  {
    id: "g5-regular",
    name: "G5 Regular Student",
    items: {
      reg: { included: true, amount: 500 },
      "tuition-g1-g6": { included: true, amount: 57200 },
      misc: { included: true, amount: 19800 },
      lms: { included: true, amount: 1500 },
      robotics: { included: true, amount: 5000 },
    },
  },
  {
    id: "g3-regular",
    name: "G3 Regular Student",
    items: {
      reg: { included: true, amount: 500 },
      "tuition-g1-g6": { included: true, amount: 54200 },
      misc: { included: true, amount: 18500 },
      lms: { included: true, amount: 1500 },
      robotics: { included: true, amount: 5000 },
    },
  },
  {
    id: "preschool-new",
    name: "Preschool New Student",
    items: {
      reg: { included: true, amount: 500 },
      developmental: { included: true, amount: 10000 },
      "tuition-preschool": { included: true, amount: 57200 },
      misc: { included: true, amount: 19800 },
      lms: { included: true, amount: 1500 },
      robotics: { included: true, amount: 5000 },
    },
  },
];

/** ---------- Page ---------- */
export default function FeeBundleList() {
  const [bundles, setBundles] = useState<StoredBundle[]>([]);

  useEffect(() => {
    try {
      // Prefer your “save as bundle” payload if you later persist it
      const raw1 = localStorage.getItem("fee_bundles");
      const raw2 = localStorage.getItem("grade_fee_bundles");
      const parsed: StoredBundle[] | null =
        (raw1 && JSON.parse(raw1)) || (raw2 && JSON.parse(raw2)) || null;

      if (parsed && Array.isArray(parsed) && parsed.length > 0) {
        setBundles(parsed);
      } else {
        setBundles(SAMPLE_BUNDLES);
      }
    } catch {
      setBundles(SAMPLE_BUNDLES);
    }
  }, []);

  const rows = useMemo(
    () =>
      bundles.map((b) => ({
        id: b.id,
        name: b.name,
        amount: computeAmount(b),
      })),
    [bundles],
  );

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Fee Bundles
        </h2>

        <a
          href="/demo/accounting/bundler"
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-white/5"
        >
          <Plus className="h-4 w-4" />
          Add Bundle
        </a>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-gray-800">
        <table className="min-w-full text-left">
          <thead className="bg-gray-50 text-gray-600 dark:bg-gray-900 dark:text-gray-400">
            <tr className="text-sm">
              <th className="px-5 py-3 font-medium">Name</th>
              <th className="px-5 py-3 font-medium text-right">Amount</th>
              <th className="px-5 py-3 font-medium text-center">Edit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm dark:divide-gray-800">
            {rows.map((r) => (
              <tr key={r.id} className="text-gray-700 dark:text-gray-300">
                <td className="px-5 py-3 font-medium text-gray-800 dark:text-white/90">
                  {r.name}
                </td>
                <td className="px-5 py-3 text-right font-semibold text-gray-900 dark:text-white">
                  {peso.format(r.amount)}
                </td>
                <td className="px-5 py-3 text-center">
                  <a
                    href={`/demo/accounting/bundler?id=${encodeURIComponent(r.id)}`}
                    className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-white/5"
                  >
                    <PencilLine className="h-4 w-4" />
                    Edit
                  </a>
                </td>
              </tr>
            ))}

            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={3}
                  className="px-5 py-12 text-center text-gray-500 dark:text-gray-400"
                >
                  No bundles yet. Click <strong>Add Bundle</strong> to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}