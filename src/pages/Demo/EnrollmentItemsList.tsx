// src/pages/Finance/EnrollmentItemsList.tsx
import React, { useMemo, useState } from "react";
import {
  Search,
  Filter,
  SortAsc,
  ChevronLeft,
  ChevronRight,
  Coins,
  Tags,
  Eye,
} from "lucide-react";

/** ---------------------------
 *  Types
 *  --------------------------*/
type ItemStatus = "active" | "hidden";
type ItemCategory = "Tuition & Fees" | "Add-ons" | "Discounts" | "Electives & PE";

export interface EnrollmentItem {
  id: string;
  name: string;
  category: ItemCategory;
  /** Positive for charges, negative for discounts */
  amount: number;
  /** true = mandatory line item */
  required: boolean;
  status: ItemStatus;
  createdAt: string; // ISO date string
}

/** ---------------------------
 *  Helpers
 *  --------------------------*/
const peso = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  maximumFractionDigits: 0,
});

const pill = (text: string, classes = "") => (
  <span
    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${classes}`}
  >
    {text}
  </span>
);

/** ---------------------------
 *  Sample data (replace with API data)
 *  --------------------------*/
const SAMPLE_ITEMS: EnrollmentItem[] = [
  {
    id: "reg",
    name: "Registration",
    category: "Tuition & Fees",
    amount: 500,
    required: true,
    status: "active",
    createdAt: "2025-05-15T08:00:00Z",
  },
  { id: "tuition-preschool", name: "Tuition Preschool", category: "Tuition & Fees", amount: 57200, required: true, status: "active", createdAt: "2025-05-15T08:00:00Z" },
  { id: "tuition-g1-g6", name: "Tuition Grade 1 - 6", category: "Tuition & Fees", amount: 57200, required: true, status: "active", createdAt: "2025-05-15T08:00:00Z" },
  { id: "tuition-g7-g10", name: "Tuition Grade 7 - 10", category: "Tuition & Fees", amount: 60000, required: true, status: "active", createdAt: "2025-05-15T08:00:00Z" },
  { id: "tuition-g11-g12", name: "Tuition Grade 11 - 12", category: "Tuition & Fees", amount: 60000, required: true, status: "active", createdAt: "2025-05-15T08:00:00Z" },
  {
    id: "misc",
    name: "Miscellaneous Fees",
    category: "Tuition & Fees",
    amount: 19800,
    required: true,
    status: "active",
    createdAt: "2025-05-15T08:00:00Z",
  },
  {
    id: "lms",
    name: "LMS",
    category: "Tuition & Fees",
    amount: 1500,
    required: true,
    status: "active",
    createdAt: "2025-05-15T08:00:00Z",
  },
  // 🔁 Robotics is now required and kept under Tuition & Fees
  {
    id: "robotics",
    name: "Robotics",
    category: "Tuition & Fees",
    amount: 5000,
    required: true,
    status: "active",
    createdAt: "2025-05-15T08:00:00Z",
  },

  // Add-ons (still optional examples)
  {
    id: "reservation",
    name: "Reservation",
    category: "Add-ons",
    amount: 5000,
    required: false,
    status: "active",
    createdAt: "2025-05-15T08:00:00Z",
  },

  // Discounts (negative amounts)
  {
    id: "earlyBird",
    name: "Early Bird Discount",
    category: "Discounts",
    amount: -1144,
    required: false,
    status: "hidden",
    createdAt: "2025-05-16T08:00:00Z",
  },
  {
    id: "sibling",
    name: "Sibling Discount",
    category: "Discounts",
    amount: -2860,
    required: false,
    status: "hidden",
    createdAt: "2025-05-16T08:00:00Z",
  },

  // 🆕 Electives & PE (ALL OPTIONAL)
  {
    id: "speak-music",
    name: "Speak Music (Alternative Music Class)",
    category: "Electives & PE",
    amount: 12400,
    required: false,
    status: "active",
    createdAt: "2025-06-01T08:00:00Z",
  },
  {
    id: "pe-futsal",
    name: "Futsal (Alternative PE)",
    category: "Electives & PE",
    amount: 20000,
    required: false,
    status: "active",
    createdAt: "2025-06-01T08:05:00Z",
  },
  {
    id: "pe-fencing",
    name: "Fencing (Alternative PE)",
    category: "Electives & PE",
    amount: 12000,
    required: false,
    status: "active",
    createdAt: "2025-06-01T08:10:00Z",
  },
  {
    id: "pe-volleyball",
    name: "Volleyball (Alternative PE)",
    category: "Electives & PE",
    amount: 20000,
    required: false,
    status: "active",
    createdAt: "2025-06-01T08:15:00Z",
  },
  {
    id: "pe-basketball",
    name: "Basketball (Alternative PE)",
    category: "Electives & PE",
    amount: 20000,
    required: false,
    status: "active",
    createdAt: "2025-06-01T08:20:00Z",
  },
  {
    id: "pe-chess",
    name: "Chess (Alternative PE)",
    category: "Electives & PE",
    amount: 20000,
    required: false,
    status: "active",
    createdAt: "2025-06-01T08:25:00Z",
  },
];

/** ---------------------------
 *  Component
 *  --------------------------*/
export default function EnrollmentItemsList({
  items = SAMPLE_ITEMS,
}: {
  items?: EnrollmentItem[];
}) {
  // UI state
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<"all" | ItemCategory>("all");
  const [status, setStatus] = useState<"all" | ItemStatus>("all");
  const [sortBy, setSortBy] = useState<
    "created_desc" | "created_asc" | "amount_desc" | "amount_asc" | "name_asc" | "name_desc"
  >("created_desc");
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const baseItems = items ?? [];

  // 1) Filter
  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    return baseItems.filter((it) => {
      const matchesSearch =
        !query ||
        it.name.toLowerCase().includes(query) ||
        it.category.toLowerCase().includes(query);

    const matchesCategory = category === "all" ? true : it.category === category;
    const matchesStatus = status === "all" ? true : it.status === status;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [baseItems, search, category, status]);

  // 2) Sort
  const sortedItems = useMemo(() => {
    const copy = [...filteredItems];
    switch (sortBy) {
      case "created_desc":
        copy.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        break;
      case "created_asc":
        copy.sort(
          (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        );
        break;
      case "amount_desc":
        copy.sort((a, b) => b.amount - a.amount);
        break;
      case "amount_asc":
        copy.sort((a, b) => a.amount - b.amount);
        break;
      case "name_desc":
        copy.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "name_asc":
        copy.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }
    return copy;
  }, [filteredItems, sortBy]);

  // 3) Pagination
  const totalPages = Math.max(1, Math.ceil(sortedItems.length / pageSize));
  const pagedItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedItems.slice(start, start + pageSize);
  }, [sortedItems, page]);

  // Reset page when filters change
  React.useEffect(() => setPage(1), [search, category, status, sortBy]);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
      {/* Header */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">Tuition & Fees</h2>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* Search */}
          <label className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search item or category…"
              className="w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 py-2 text-sm text-gray-700 outline-none transition focus:border-gray-300 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200"
            />
          </label>

          {/* Category */}
          <label className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-gray-300 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200"
            >
              <option value="all">All categories</option>
              <option value="Tuition & Fees">Tuition &amp; Fees</option>
              <option value="Add-ons">Add-ons</option>
              <option value="Electives & PE">Electives &amp; PE</option>
              <option value="Discounts">Discounts</option>
            </select>
          </label>

          {/* Status */}
          <label className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-gray-400" />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-gray-300 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200"
            >
              <option value="all">All status</option>
              <option value="active">Active</option>
              <option value="hidden">Hidden</option>
            </select>
          </label>

          {/* Sort */}
          <label className="flex items-center gap-2">
            <SortAsc className="h-4 w-4 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-gray-300 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200"
            >
              <option value="created_desc">Newest</option>
              <option value="created_asc">Oldest</option>
              <option value="amount_desc">Amount: High → Low</option>
              <option value="amount_asc">Amount: Low → High</option>
              <option value="name_asc">Name: A → Z</option>
              <option value="name_desc">Name: Z → A</option>
            </select>
          </label>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-gray-800">
        <table className="min-w-full text-left">
          <thead className="bg-gray-50 text-gray-600 dark:bg-gray-900 dark:text-gray-400">
            <tr className="text-sm">
              <th className="px-5 py-3 font-medium">Item</th>
              <th className="px-5 py-3 font-medium">Category</th>
              <th className="px-5 py-3 font-medium text-right">Amount</th>
              <th className="px-5 py-3 font-medium text-center">Status</th>
              <th className="px-5 py-3 font-medium">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm dark:divide-gray-800">
            {pagedItems.map((it) => (
              <tr key={it.id} className="text-gray-700 dark:text-gray-300">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                      <Coins className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <div className="truncate font-medium text-gray-800 dark:text-white/90">
                        {it.name}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <Tags className="h-3.5 w-3.5" />
                        {it.id}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="px-5 py-3">
                  {pill(
                    it.category,
                    it.category === "Tuition & Fees"
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300"
                      : it.category === "Add-ons"
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
                      : it.category === "Electives & PE"
                      ? "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300"
                      : "bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-300",
                  )}
                </td>

                <td className="px-5 py-3 text-right font-medium">
                  <span
                    className={
                      it.amount < 0
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-gray-800 dark:text-white/90"
                    }
                  >
                    {peso.format(it.amount)}
                  </span>
                </td>

                <td className="px-5 py-3 text-center">
                  {it.status === "active"
                    ? pill(
                        "Active",
                        "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-300",
                      )
                    : pill(
                        "Hidden",
                        "bg-gray-200 text-gray-700 dark:bg-white/10 dark:text-gray-300",
                      )}
                </td>

                <td className="px-5 py-3">
                  <span className="text-gray-500 dark:text-gray-400">
                    {new Date(it.createdAt).toLocaleDateString()}
                  </span>
                </td>
              </tr>
            ))}

            {pagedItems.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-12 text-center text-gray-500 dark:text-gray-400"
                >
                  No items found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer / Pagination */}
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Showing{" "}
          <span className="font-medium text-gray-700 dark:text-gray-200">
            {pagedItems.length}
          </span>{" "}
          of{" "}
          <span className="font-medium text-gray-700 dark:text-gray-200">
            {sortedItems.length}
          </span>{" "}
          items
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="inline-flex h-9 items-center justify-center rounded-md border border-gray-200 bg-white px-2 text-gray-700 hover:bg-gray-100 disabled:opacity-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="min-w-[4rem] text-center text-sm text-gray-700 dark:text-gray-200">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="inline-flex h-9 items-center justify-center rounded-md border border-gray-200 bg-white px-2 text-gray-700 hover:bg-gray-100 disabled:opacity-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}