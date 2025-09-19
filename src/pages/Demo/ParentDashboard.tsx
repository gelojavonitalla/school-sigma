// src/pages/Parents/ParentDashboard.tsx
import { useMemo, useState } from "react";
import {
  Search,
  CreditCard,
  FileText,
  ReceiptText,
  MessagesSquare,
  ExternalLink,
  CheckCircle2,
  CalendarDays,
} from "lucide-react";
import Badge from "../../components/ui/badge/Badge";
import SafeLink from "../../components/links/SafeLink";

/* -----------------------------
   Mock data
------------------------------*/
type Student = {
  id: string;
  name: string;
  grade: string;
  section: string;
  adviser: string;
  status: "onway" | "inside" | "exited";
  plan: string;
  outstanding: number;
  avatarUrl?: string;
};

type Payment = {
  id: string;
  studentId: string;
  date: string;       // ISO
  description: string;
  amount: number;
  ref?: string;
  method?: string;
  schoolYear: string; // NEW: used by the SY filter
};

const STUDENTS: Student[] = [
  {
    id: "river",
    name: "River Javonitalla",
    grade: "Grade 5",
    section: "Galatians",
    adviser: "Mr. Cruz",
    status: "onway",
    plan: "G5 Regular Student",
    outstanding: 0,
    avatarUrl: "/images/user/user-01.jpg",
  },
  {
    id: "lake",
    name: "Lake Javonitalla",
    grade: "Grade 3",
    section: "Romans",
    adviser: "Ms. Santos",
    status: "exited",
    plan: "G3 Regular Student",
    outstanding: 19850,
    avatarUrl: "/images/user/user-35.jpg",
  },
  {
    id: "fjord",
    name: "Fjord Javonitalla",
    grade: "Preschool",
    section: "Genesis",
    adviser: "Ms. Dizon",
    status: "inside",
    plan: "Preschool New Student",
    outstanding: 500,
    avatarUrl: "/images/user/user-37.jpg",
  },
];

const PAYMENTS: Payment[] = [
  {
    id: "p1",
    studentId: "river",
    date: "2025-06-03",
    description: "Tuition (Quarterly) — 2nd Payment",
    amount: 14850,
    ref: "OR-2025-00123",
    method: "GCash",
    schoolYear: "2025–2026",
  },
  {
    id: "p2",
    studentId: "lake",
    date: "2025-05-28",
    description: "Reservation deposit",
    amount: 5000,
    ref: "OR-2025-00098",
    method: "Bank Transfer",
    schoolYear: "2025–2026",
  },
  {
    id: "p3",
    studentId: "fjord",
    date: "2024-11-20",
    description: "Tuition (Yearly) — partial",
    amount: 10000,
    ref: "OR-2024-00076",
    method: "Cash",
    schoolYear: "2024–2025",
  },
];

/* ----------------------------- */
const peso = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  maximumFractionDigits: 0,
});

function StatusBadge({ s }: { s: Student["status"] }) {
  if (s === "onway") return <Badge color="info" variant="light">On the way to school</Badge>;
  if (s === "inside") return <Badge color="primary" variant="light">Inside the campus</Badge>;
  return <Badge color="dark" variant="light">Exited the campus</Badge>;
}

/* ----------------------------- */
export default function ParentDashboard() {
  // School year filter applies to FINANCE ONLY (payments + totals)
  const [schoolYear, setSchoolYear] = useState("2025–2026");

  const [q, setQ] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(STUDENTS[0]?.id ?? null);

  // Cards: daily-use; NOT affected by School Year
  const visibleStudents = useMemo(() => {
    const query = q.trim().toLowerCase();
    return STUDENTS.filter(
      (s) =>
        !query ||
        s.name.toLowerCase().includes(query) ||
        s.section.toLowerCase().includes(query) ||
        s.grade.toLowerCase().includes(query),
    );
  }, [q]);

  const selectedStudent = useMemo(
    () => visibleStudents.find((s) => s.id === selectedId) ?? null,
    [visibleStudents, selectedId],
  );

  // Finance (SY-scoped)
  const financePayments = useMemo(() => {
    const allowedIds = new Set(visibleStudents.map((s) => s.id));
    return PAYMENTS
      .filter((p) => p.schoolYear === schoolYear && allowedIds.has(p.studentId))
      .sort((a, b) => +new Date(b.date) - +new Date(a.date));
  }, [visibleStudents, schoolYear]);

  const financeTotals = useMemo(() => {
    const totalPaid = financePayments.reduce((s, p) => s + p.amount, 0);
    const outstandingTotal = visibleStudents.reduce((s, stu) => s + (stu.outstanding || 0), 0);
    return { totalPaid, outstandingTotal };
  }, [financePayments, visibleStudents]);

  // Actions (wire later)
  const onPay = (s: Student) => alert(`Pay Tuition for ${s.name}`);
  const onStatement = (s: Student) => alert(`Open Statement for ${s.name}`);
  const onHistory = (s: Student) => alert(`Open Payment History for ${s.name}`);
  const onQuote = (s: Student) => alert(`Open Quotation for ${s.name}`);
  const onViewDetails = (s: Student) => alert(`View details for ${s.name}`);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gray-800 dark:text-white/90">Parents Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Daily status and communications; finance tools when you need them.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* School Year — affects FINANCE ONLY */}
          <label className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-300">School Year (Finance)</span>
            <select
              value={schoolYear}
              onChange={(e) => setSchoolYear(e.target.value)}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-gray-300 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200"
            >
              <option>2025–2026</option>
              <option>2024–2025</option>
              <option>2023–2024</option>
            </select>
          </label>

          <label className="relative w-full sm:w-[280px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search student…"
              className="w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 py-2 text-sm text-gray-700 outline-none transition focus:border-gray-300 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200"
            />
          </label>
        </div>
      </div>

      {/* ACTIONS BAR */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
        {selectedStudent ? (
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-500 dark:text-gray-400">Selected child</span>
              </div>
              <div className="mt-1 text-base font-semibold text-gray-800 dark:text-white/90">
                {selectedStudent.name}
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-sm">
                <span className="text-gray-600 dark:text-gray-300">
                  {selectedStudent.grade} — {selectedStudent.section}
                </span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-600 dark:text-gray-300">Plan: {selectedStudent.plan}</span>
                {selectedStudent.outstanding > 0 ? (
                  <Badge color="warning">Outstanding: {peso.format(selectedStudent.outstanding)}</Badge>
                ) : (
                  <Badge color="success">Fully paid</Badge>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {/* NEW: Reserve Slot button */}
              <SafeLink
                to="/demo/parents/reserve"
                className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
                title="Reserve a slot for next school year"
              >
                <CalendarDays className="h-4 w-4" />
                Reserve Slot
              </SafeLink>

              <button onClick={() => onPay(selectedStudent)} className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-3 py-2 text-sm font-medium text-white hover:bg-brand-600">
                <CreditCard className="h-4 w-4" />
                Pay Tuition
              </button>
              <button onClick={() => onStatement(selectedStudent)} className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800">
                <FileText className="h-4 w-4" />
                Statement
              </button>
              <button onClick={() => onQuote(selectedStudent)} className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800">
                <FileText className="h-4 w-4" />
                Quotation
              </button>
              <button onClick={() => onHistory(selectedStudent)} className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800">
                <ReceiptText className="h-4 w-4" />
                Payment History
              </button>
            </div>
          </div>
        ) : (
          <div className="text-sm text-gray-500 dark:text-gray-400">Select a child card to take actions.</div>
        )}
      </div>

      {/* Student cards */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        {visibleStudents.map((s) => {
          const paid = s.outstanding <= 0;
          const isSelected = selectedId === s.id;
          return (
            <button
              key={s.id}
              onClick={() => setSelectedId(s.id)}
              className={`text-left rounded-2xl border p-5 transition ${isSelected ? "border-brand-400/60 ring-2 ring-brand-200 dark:ring-brand-500/30" : "border-gray-200 hover:border-gray-300 dark:border-gray-800 dark:hover:border-gray-700"
                } bg-white dark:bg-white/[0.03]`}
            >
              <div className="mb-4 flex items-start justify-between">
                <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">{s.name}</h3>
                <span
                  onClick={(e) => { e.stopPropagation(); onViewDetails(s); }}
                  className="inline-flex cursor-pointer items-center gap-1 text-sm text-brand-600 hover:underline"
                >
                  View details <ExternalLink className="h-3.5 w-3.5" />
                </span>
              </div>

              <div className="flex items-start gap-4">
                <img src={s.avatarUrl} alt={s.name} className="h-24 w-24 rounded-full object-cover ring-4 ring-gray-100 dark:ring-gray-900" />
                <div className="flex-1">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <StatusBadge s={s.status} />
                    {paid ? <Badge color="success">Fully paid</Badge> : <Badge color="warning">Outstanding: {peso.format(s.outstanding)}</Badge>}
                  </div>
                  <div className="text-sm">
                    <div className="font-medium text-gray-800 dark:text-white/90">{s.grade} — {s.section}</div>
                    <div className="mt-1 flex items-center gap-2 text-gray-600 dark:text-gray-300">
                      Adviser: {s.adviser}
                      {/* Link to /chat; stop propagation so it doesn’t select the card */}
                      <SafeLink
                        to={`/chat?student=${s.id}`}
                        onClick={(e) => e.stopPropagation()}
                        title="Open chat"
                        className="ml-1 inline-flex items-center rounded-md border border-gray-200 bg-white p-1 text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
                      >
                        <MessagesSquare className="h-4 w-4" />
                      </SafeLink>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">Plan: {s.plan}</div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Finance (SY-scoped) */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">
              Finance <span className="text-gray-400">(SY {schoolYear})</span>
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Payments and balances reflect the selected school year only.
            </p>
          </div>
          <div className="hidden sm:flex gap-6">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Total Paid</p>
              <p className="text-lg font-semibold text-gray-800 dark:text-white/90">{peso.format(financeTotals.totalPaid)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Outstanding (current plans)</p>
              <p className="text-lg font-semibold text-gray-800 dark:text-white/90">{peso.format(financeTotals.outstandingTotal)}</p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-gray-800">
          <table className="min-w-full text-left">
            <thead className="bg-gray-50 text-gray-600 dark:bg-gray-900 dark:text-gray-400">
              <tr className="text-sm">
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Student</th>
                <th className="px-5 py-3 font-medium">Description</th>
                <th className="px-5 py-3 font-medium">Reference</th>
                <th className="px-5 py-3 font-medium">Method</th>
                <th className="px-5 py-3 text-right font-medium">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm dark:divide-gray-800">
              {financePayments.map((p) => {
                const s = STUDENTS.find((x) => x.id === p.studentId)!;
                return (
                  <tr key={p.id} className="text-gray-700 dark:text-gray-300">
                    <td className="px-5 py-3">
                      {new Date(p.date).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
                    </td>
                    <td className="px-5 py-3 font-medium text-gray-800 dark:text-white/90">{s?.name ?? "—"}</td>
                    <td className="px-5 py-3">{p.description}</td>
                    <td className="px-5 py-3">{p.ref ?? "—"}</td>
                    <td className="px-5 py-3">{p.method ?? "—"}</td>
                    <td className="px-5 py-3 text-right font-semibold text-gray-900 dark:text-white">
                      {peso.format(p.amount)}
                    </td>
                  </tr>
                );
              })}

              {financePayments.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-gray-500 dark:text-gray-400">
                    No payments for SY {schoolYear}.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}