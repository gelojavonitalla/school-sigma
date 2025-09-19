// src/pages/Accounting/InvoicesTable.tsx
import React, { useMemo, useState } from "react";
import { Link, useInRouterContext } from "react-router-dom";
import { Search, Filter, Download, MoreHorizontal } from "lucide-react";
import Badge from "../../components/ui/badge/Badge";

type InvoiceStatus = "paid" | "unpaid" | "draft" | "overdue";

type Invoice = {
  id: number;
  number: string;
  customer: string;
  createdAt: string;
  dueDate: string;
  total: number;
  status: InvoiceStatus;
};

const peso = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  maximumFractionDigits: 0,
});

function formatDate(input: string) {
  const d = new Date(input);
  return Number.isNaN(d.getTime())
    ? input
    : d.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

function SafeLink(
  props: React.ComponentProps<typeof Link> & { fallbackClassName?: string }
) {
  const inRouter = useInRouterContext();
  const { children, to, className, fallbackClassName, ...rest } = props;
  if (inRouter) {
    return (
      <Link to={to} className={className} {...rest}>
        {children}
      </Link>
    );
  }
  const href = typeof to === "string" ? to : "#";
  return (
    <a href={href} className={fallbackClassName ?? className}>
      {children}
    </a>
  );
}

// --- Mock data (Filipino names) ---
const MOCK: Invoice[] = [
  { id: 1, number: "#323534", customer: "Jose Miguel Santos", createdAt: "August 7, 2028", dueDate: "February 28, 2028", total: 999, status: "paid" },
  { id: 2, number: "#323535", customer: "John Mark Dela Cruz", createdAt: "July 1, 2028", dueDate: "January 1, 2029", total: 1200, status: "unpaid" },
  { id: 3, number: "#323536", customer: "Ma. Teresa Reyes", createdAt: "June 15, 2028", dueDate: "December 15, 2028", total: 850, status: "draft" },
  { id: 4, number: "#323537", customer: "Miguel Bautista", createdAt: "May 10, 2028", dueDate: "November 10, 2028", total: 1500, status: "paid" },
  { id: 5, number: "#323538", customer: "Jessa Mae Garcia", createdAt: "April 5, 2028", dueDate: "October 5, 2028", total: 700, status: "unpaid" },
  { id: 6, number: "#323539", customer: "Kristoffer Lim", createdAt: "March 1, 2028", dueDate: "September 1, 2028", total: 1100, status: "paid" },
  { id: 7, number: "#323540", customer: "Alyssa Uy", createdAt: "February 20, 2028", dueDate: "August 20, 2028", total: 950, status: "draft" },
  { id: 8, number: "#323541", customer: "Kevin Tan", createdAt: "January 15, 2028", dueDate: "July 15, 2028", total: 1300, status: "paid" },
  { id: 9, number: "#323542", customer: "Shaira Dizon", createdAt: "December 10, 2027", dueDate: "June 10, 2028", total: 800, status: "unpaid" },
  { id: 10, number: "#323543", customer: "Mark Angelo Cruz", createdAt: "November 5, 2027", dueDate: "May 5, 2028", total: 1400, status: "paid" },
  { id: 11, number: "#323544", customer: "Mikaela Ramos", createdAt: "October 1, 2027", dueDate: "April 1, 2028", total: 1200, status: "draft" },
  { id: 12, number: "#323545", customer: "Daniel Aquino", createdAt: "September 20, 2027", dueDate: "March 20, 2028", total: 1000, status: "paid" },
  { id: 13, number: "#323546", customer: "Sofia Alonzo", createdAt: "August 15, 2027", dueDate: "February 15, 2028", total: 900, status: "unpaid" },
  { id: 14, number: "#323547", customer: "James Navarro", createdAt: "July 10, 2027", dueDate: "January 10, 2028", total: 1600, status: "paid" },
  { id: 15, number: "#323548", customer: "Ava Bautista", createdAt: "June 5, 2027", dueDate: "December 5, 2027", total: 1050, status: "draft" },
  { id: 16, number: "#323549", customer: "Carlo Go", createdAt: "May 1, 2027", dueDate: "November 1, 2027", total: 1150, status: "paid" },
  { id: 17, number: "#323550", customer: "Mia Santos", createdAt: "April 20, 2027", dueDate: "October 20, 2027", total: 980, status: "unpaid" },
  { id: 18, number: "#323551", customer: "Benjie Lopez", createdAt: "March 15, 2027", dueDate: "September 15, 2027", total: 1250, status: "paid" },
  { id: 19, number: "#323552", customer: "Charlene Mercado", createdAt: "February 10, 2027", dueDate: "August 10, 2027", total: 890, status: "draft" },
  { id: 20, number: "#323553", customer: "Elijah Villanueva", createdAt: "January 5, 2027", dueDate: "July 5, 2027", total: 1350, status: "paid" },
  { id: 21, number: "#323554", customer: "Amelia Mendoza", createdAt: "December 1, 2026", dueDate: "June 1, 2027", total: 1020, status: "unpaid" },
  { id: 22, number: "#323555", customer: "Lucas De Vera", createdAt: "November 20, 2026", dueDate: "May 20, 2027", total: 1120, status: "paid" },
  { id: 23, number: "#323556", customer: "Paolo Salazar", createdAt: "October 15, 2026", dueDate: "April 15, 2027", total: 970, status: "draft" },
  { id: 24, number: "#323557", customer: "Henry Ong", createdAt: "September 10, 2026", dueDate: "March 10, 2027", total: 1280, status: "paid" },
  { id: 25, number: "#323558", customer: "Evelyn Manalo", createdAt: "August 5, 2026", dueDate: "February 5, 2027", total: 1080, status: "unpaid" },
];

function StatusBadge({ s }: { s: InvoiceStatus }) {
  // map invoice status -> TailAdmin badge props
  const map: Record<
    InvoiceStatus,
    { color: "success" | "error" | "warning" | "light" | "dark" | "info" | "primary"; label: string }
  > = {
    paid: { color: "success", label: "Paid" },
    unpaid: { color: "error", label: "Unpaid" },
    overdue: { color: "warning", label: "Overdue" },
    draft: { color: "light", label: "Draft" },
  };

  const { color, label } = map[s];
  return (
    <Badge color={color} variant="light">
      {label}
    </Badge>
  );
}

export default function InvoicesTable({ rows = MOCK }: { rows?: Invoice[] }) {
  // NOTE: three-tab filter like your old layout
  const [tab, setTab] = useState<"all" | "unpaid" | "draft">("all");
  const [q, setQ] = useState("");

  const getTabBtnClass = (key: "all" | "unpaid" | "draft") =>
    tab === key
      ? "shadow-theme-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800"
      : "text-gray-500 dark:text-gray-400";

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return rows.filter((r) => {
      const matchesTab = tab === "all" ? true : r.status === tab;
      const matchesQ =
        !query ||
        r.number.toLowerCase().includes(query) ||
        r.customer.toLowerCase().includes(query);
      return matchesTab && matchesQ;
    });
  }, [rows, tab, q]);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">Invoices</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">Your most recent invoices list</p>
      </div>

      {/* Tabs + Search + Actions */}
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {/* pill group like your sample */}
        <div className="hidden h-11 items-center gap-0.5 rounded-lg bg-gray-100 p-0.5 lg:inline-flex dark:bg-gray-900">
          <button
            onClick={() => setTab("all")}
            className={`w-full rounded-md px-3 py-2 text-theme-sm font-medium hover:text-gray-900 dark:hover:text-white ${getTabBtnClass("all")}`}
          >
            All
          </button>
          <button
            onClick={() => setTab("unpaid")}
            className={`w-full rounded-md px-3 py-2 text-theme-sm font-medium hover:text-gray-900 dark:hover:text-white ${getTabBtnClass("unpaid")}`}
          >
            Unpaid
          </button>
          <button
            onClick={() => setTab("draft")}
            className={`w-full rounded-md px-3 py-2 text-theme-sm font-medium hover:text-gray-900 dark:hover:text-white ${getTabBtnClass("draft")}`}
          >
            Draft
          </button>
        </div>

        <div className="flex items-center gap-2">
          <label className="relative w-[260px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search…"
              className="w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 py-2 text-sm text-gray-700 outline-none transition focus:border-gray-300 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200"
            />
          </label>

          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800">
            <Filter className="h-4 w-4" />
            Filter
          </button>

          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800">
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-gray-800">
        <table className="min-w-full text-left">
          <thead className="bg-gray-50 text-gray-600 dark:bg-gray-900 dark:text-gray-400">
            <tr className="text-sm">
              <th className="px-5 py-3">
                <input type="checkbox" className="h-4 w-4 rounded border-gray-300 dark:border-gray-700" />
              </th>
              <th className="px-5 py-3 font-medium">Invoice Number</th>
              <th className="px-5 py-3 font-medium">Customer</th>
              <th className="px-5 py-3 font-medium">Creation Date</th>
              <th className="px-5 py-3 font-medium">Due Date</th>
              <th className="px-5 py-3 font-medium text-right">Total</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm dark:divide-gray-800">
            {filtered.map((r) => (
              <tr key={r.id} className="text-gray-700 dark:text-gray-300">
                <td className="px-5 py-3">
                  <input type="checkbox" className="h-4 w-4 rounded border-gray-300 dark:border-gray-700" />
                </td>

                <td className="px-5 py-3">
                  <SafeLink to={`/invoices/${r.id}`} className="font-medium text-gray-800 hover:underline dark:text-white/90">
                    {r.number}
                  </SafeLink>
                </td>

                <td className="px-5 py-3">{r.customer}</td>
                <td className="px-5 py-3">{formatDate(r.createdAt)}</td>
                <td className="px-5 py-3">{formatDate(r.dueDate)}</td>

                <td className="px-5 py-3 text-right font-medium text-gray-800 dark:text-white/90">
                  {peso.format(r.total)}
                </td>

                <td className="px-5 py-3">
                  <StatusBadge s={r.status} />
                </td>

                <td className="px-5 py-3 text-right">
                  <button className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-5 py-12 text-center text-gray-500 dark:text-gray-400">
                  No invoices found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}