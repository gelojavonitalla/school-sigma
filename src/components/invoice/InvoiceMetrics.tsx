// src/pages/Accounting/InvoiceMetrics.tsx
import { useMemo, useState } from "react";
import { CheckCircle2, CalendarClock, Wallet2, AlertTriangle } from "lucide-react";

type YearMetrics = {
  fullyPaidCount: number;     // number of students fully paid 
  installmentCount: number;   // number on installment plans
  totalPaidAmount: number;    // pesos paid to date
  totalUnpaidAmount: number;  // pesos outstanding
};

type Props = {
  years?: string[]; // e.g. ["2024–2025", "2025–2026"]
  dataByYear?: Record<string, YearMetrics>;
};

const peso = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  maximumFractionDigits: 0,
});

export default function InvoiceMetrics({
  years,
  dataByYear,
}: Props) {
  // Mock defaults (replace with API data)
  const defaultYears = years ?? ["2024–2025", "2025–2026"];
  const defaultData: Record<string, YearMetrics> =
    dataByYear ?? {
      "2024–2025": {
        fullyPaidCount: 118,
        installmentCount: 247,
        totalPaidAmount: 18342500,
        totalUnpaidAmount: 5423000,
      },
      "2025–2026": {
        fullyPaidCount: 95,
        installmentCount: 261,
        totalPaidAmount: 7362400,
        totalUnpaidAmount: 5280000,
      },
    };

  const [year, setYear] = useState<string>(defaultYears[defaultYears.length - 1]);
  const metrics = useMemo<YearMetrics>(
    () => defaultData[year] || { fullyPaidCount: 0, installmentCount: 0, totalPaidAmount: 0, totalUnpaidAmount: 0 },
    [defaultData, year]
  );

  return (
    <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <h2 className="font-semibold text-gray-800 dark:text-white/90">Overview</h2>
          {/* School Year filter */}
          <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <span className="hidden sm:inline">School Year:</span>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-800 outline-none transition focus:border-gray-300 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200"
            >
              {defaultYears.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 rounded-xl border border-gray-200 sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-y-0 dark:divide-gray-800 dark:border-gray-800">
        {/* Fully Paid (count) */}
        <div className="border-b p-5 sm:border-r lg:border-b-0">
          <div className="mb-1.5 flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            Fully Paid (students)
          </div>
          <h3 className="text-3xl font-semibold text-gray-800 dark:text-white/90">
            {metrics.fullyPaidCount.toLocaleString()}
          </h3>
        </div>

        {/* On Installments (count) */}
        <div className="border-b p-5 sm:border-r lg:border-b-0">
          <div className="mb-1.5 flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500">
            <CalendarClock className="h-4 w-4 text-indigo-500" />
            On Installments
          </div>
          <h3 className="text-3xl font-semibold text-gray-800 dark:text-white/90">
            {metrics.installmentCount.toLocaleString()}
          </h3>
        </div>

        {/* Total Paid (amount) */}
        <div className="border-b p-5 sm:border-r lg:border-b-0">
          <div className="mb-1.5 flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500">
            <Wallet2 className="h-4 w-4 text-blue-500" />
            Total Paid
          </div>
          <h3 className="text-3xl font-semibold text-gray-800 dark:text-white/90">
            {peso.format(metrics.totalPaidAmount)}
          </h3>
        </div>

        {/* Total Unpaid (amount) */}
        <div className="p-5">
          <div className="mb-1.5 flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            Total Unpaid
          </div>
          <h3 className="text-3xl font-semibold text-gray-800 dark:text-white/90">
            {peso.format(metrics.totalUnpaidAmount)}
          </h3>
        </div>
      </div>
    </div>
  );
}