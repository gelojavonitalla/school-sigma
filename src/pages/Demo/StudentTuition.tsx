// src/pages/Billing/QuotationFromPlan.tsx
import { useMemo } from "react";
import { useLocation, Link } from "react-router";
import Button from "../../components/ui/button/Button";

type PlanLabel = "Yearly" | "Semestral" | "Quarterly";

type LocationState = {
  plan?: PlanLabel;
  studentName?: string;
  switches?: {
    isEarlyBird?: boolean;
    siblingDiscount?: boolean;
    reservationPaid?: boolean;
  };
};

const peso = (n: number) =>
  `₱${Math.round(n).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

export default function QuotationFromPlan() {
  const { state } = useLocation();
  const { plan = "Yearly", studentName = "River Javonitalla", switches } =
    (state as LocationState) || {};

  const isEarlyBird = !!switches?.isEarlyBird;
  const siblingDiscount = !!switches?.siblingDiscount;
  const reservationPaid = !!switches?.reservationPaid;

  const {
    fees,
    base,
    discounts,
    adjustedAnnual,
    installmentPayments,
    installmentTotal,
    chosenPlan,
    grandTotal,
  } = useMemo(() => {
    // same numbers as your pricing page
    const fees = {
      reservation: 5000,
      installment: 575,
      siblingDiscount: 2860,
      reg: 500,
      tuition: 57200,
      misc: 19800,
      lms: 1500,
      robotics: 5000,
      earlyBird: 1144,
    };

    const base =
      fees.reg + fees.tuition + fees.misc + fees.lms + fees.robotics;

    const discounts = {
      reservationPaid: reservationPaid ? fees.reservation : 0,
      sibling: siblingDiscount ? fees.siblingDiscount : 0,
      earlyBird: isEarlyBird ? fees.earlyBird : 0,
    };
    const discountTotal =
      discounts.reservationPaid + discounts.sibling + discounts.earlyBird;

    const adjustedAnnual = base - discountTotal;

    const installmentPayments: number =
      plan === "Yearly" ? 0 : plan === "Semestral" ? 2 : 4;
    const installmentTotal = fees.installment * installmentPayments;

    // Build visible plan schedule (same math you use on pricing)
    const yearly = {
      label: "Yearly" as PlanLabel,
      total: adjustedAnnual,
      installments: [{ label: "Upon Enrollment", amount: adjustedAnnual }],
      description: "One-time payment",
    };

    const tuitionPerSem = fees.tuition / 2;
    const miscPerSem = fees.misc / 2;
    const semFirst =
      tuitionPerSem +
      miscPerSem +
      fees.reg +
      fees.lms +
      fees.robotics +
      fees.installment -
      discountTotal;
    const semSecond = tuitionPerSem + miscPerSem + fees.installment;
    const semestral = {
      label: "Semestral" as PlanLabel,
      total: Math.round(semFirst + semSecond),
      installments: [
        { label: "Upon Enrollment", amount: Math.round(semFirst) },
        { label: "2nd Payment (Dec)", amount: Math.round(semSecond) },
      ],
      description: "Two payments (June & Dec)",
    };

    const tuitionPerQ = fees.tuition / 4;
    const miscPerQ = fees.misc / 4;
    const qFirst =
      tuitionPerQ +
      miscPerQ +
      fees.reg +
      fees.lms +
      fees.robotics +
      fees.installment -
      discountTotal;
    const qOther = tuitionPerQ + miscPerQ + fees.installment;
    const quarterly = {
      label: "Quarterly" as PlanLabel,
      total: Math.round(qFirst + qOther * 3),
      installments: [
        { label: "Upon Enrollment", amount: Math.round(qFirst) },
        { label: "2nd Payment (Oct)", amount: Math.round(qOther) },
        { label: "3rd Payment (Dec)", amount: Math.round(qOther) },
        { label: "4th Payment (Feb)", amount: Math.round(qOther) },
      ],
      description: "Four payments (Jun, Oct, Dec, Feb)",
    };

    const chosenPlan =
      plan === "Yearly" ? yearly : plan === "Semestral" ? semestral : quarterly;

    const grandTotal = adjustedAnnual + installmentTotal; // no VAT

    return {
      fees,
      base,
      discounts,
      discountTotal,
      adjustedAnnual,
      installmentPayments,
      installmentTotal,
      chosenPlan,
      grandTotal,
    };
  }, [plan, isEarlyBird, siblingDiscount, reservationPaid]);

  // Dates
  const issuedOn = new Date();
  const dueOn = new Date(issuedOn);
  dueOn.setDate(issuedOn.getDate() + 7);
  const fmtDate = (d: Date) =>
    d.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] w-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
        <h3 className="font-medium text-gray-800 text-theme-xl dark:text-white/90">
          Quotation • {studentName} — {chosenPlan.label} Plan
        </h3>
        <h4 className="text-base font-medium text-gray-700 dark:text-gray-400">
          QT-{issuedOn.getFullYear().toString().slice(-2)}
          {String(issuedOn.getMonth() + 1).padStart(2, "0")}
          {String(issuedOn.getDate()).padStart(2, "0")}
        </h4>
      </div>

      <div className="p-5 xl:p-8">
        {/* Parties */}
        <div className="flex flex-col gap-6 mb-9 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <span className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-400">From</span>
            <h5 className="mb-2 text-base font-semibold text-gray-800 dark:text-white/90">
              GCF South Metro Christian School
            </h5>
            <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
              Versailles Subdivision, Daang Hari Road<br />
              Las Piñas, 1635 Metro Manila
            </p>
            <span className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Issued On:
            </span>
            <span className="block text-sm text-gray-500 dark:text-gray-400">
              {fmtDate(issuedOn)}
            </span>
          </div>

          <div className="h-px w-full bg-gray-200 dark:bg-gray-800 sm:h-[158px] sm:w-px" />

          <div className="sm:text-right">
            <span className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-400">To</span>
            <h5 className="mb-2 text-base font-semibold text-gray-800 dark:text-white/90">
              Mr. &amp; Mrs. Javonitalla
            </h5>
            <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
              Parent/Guardian of {studentName}
            </p>
            <span className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Due On:</span>
            <span className="block text-sm text-gray-500 dark:text-gray-400">{fmtDate(dueOn)}</span>
          </div>
        </div>

        {/* BREAKDOWN */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          {/* Fees */}
          <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-gray-800">
            <table className="min-w-full text-left text-gray-700 dark:text-gray-400">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <th className="px-5 py-3 text-xs font-medium text-gray-500 dark:text-gray-400">Fee Breakdown</th>
                  <th className="px-5 py-3 text-right text-sm font-medium text-gray-700 dark:text-gray-400">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                <tr><td className="px-5 py-3">Registration</td><td className="px-5 py-3 text-right">{peso(fees.reg)}</td></tr>
                <tr><td className="px-5 py-3">Tuition</td><td className="px-5 py-3 text-right">{peso(fees.tuition)}</td></tr>
                <tr><td className="px-5 py-3">Miscellaneous</td><td className="px-5 py-3 text-right">{peso(fees.misc)}</td></tr>
                <tr><td className="px-5 py-3">LMS</td><td className="px-5 py-3 text-right">{peso(fees.lms)}</td></tr>
                <tr><td className="px-5 py-3">Robotics</td><td className="px-5 py-3 text-right">{peso(fees.robotics)}</td></tr>
                <tr>
                  <td className="px-5 py-3 font-medium text-gray-800 dark:text-white/90">Subtotal (Base Fees)</td>
                  <td className="px-5 py-3 text-right font-medium text-gray-800 dark:text-white/90">{peso(base)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Discounts */}
          <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-gray-800">
            <table className="min-w-full text-left text-gray-700 dark:text-gray-400">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <th className="px-5 py-3 text-xs font-medium text-gray-500 dark:text-gray-400">Deductions Applied</th>
                  <th className="px-5 py-3 text-right text-sm font-medium text-gray-700 dark:text-gray-400">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {discounts.reservationPaid ? (
                  <tr>
                    <td className="px-5 py-3">Reservation Paid</td>
                    <td className="px-5 py-3 text-right">-{peso(discounts.reservationPaid)}</td>
                  </tr>
                ) : null}
                {discounts.sibling ? (
                  <tr>
                    <td className="px-5 py-3">Sibling Discount</td>
                    <td className="px-5 py-3 text-right">-{peso(discounts.sibling)}</td>
                  </tr>
                ) : null}
                {discounts.earlyBird ? (
                  <tr>
                    <td className="px-5 py-3">Early Bird</td>
                    <td className="px-5 py-3 text-right">-{peso(discounts.earlyBird)}</td>
                  </tr>
                ) : null}
                {!discounts.reservationPaid && !discounts.sibling && !discounts.earlyBird ? (
                  <tr>
                    <td className="px-5 py-3 text-gray-500 dark:text-gray-400">No deductions applied</td>
                    <td className="px-5 py-3 text-right text-gray-500 dark:text-gray-400">—</td>
                  </tr>
                ) : null}
                <tr>
                  <td className="px-5 py-3 font-medium text-gray-800 dark:text-white/90">Net after deductions</td>
                  <td className="px-5 py-3 text-right font-medium text-gray-800 dark:text-white/90">
                    {peso(adjustedAnnual)}
                  </td>
                </tr>
                {installmentPayments > 0 && (
                  <tr>
                    <td className="px-5 py-3">
                      Installment handling ({peso(fees.installment)} × {installmentPayments} payments)
                    </td>
                    <td className="px-5 py-3 text-right">{peso(installmentTotal)}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* SCHEDULE */}
        <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-gray-800">
          <table className="min-w-full text-left text-gray-700 dark:text-gray-400">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <th className="px-5 py-3 text-sm font-medium whitespace-nowrap text-gray-700 dark:text-gray-400">#</th>
                <th className="px-5 py-3 text-xs font-medium whitespace-nowrap text-gray-500 dark:text-gray-400">
                  Payment Schedule — {chosenPlan.label}
                </th>
                <th className="px-5 py-3 text-right text-sm font-medium whitespace-nowrap text-gray-700 dark:text-gray-400">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {chosenPlan.installments.map((i, idx) => (
                <tr key={idx}>
                  <td className="px-5 py-3 text-sm text-gray-500 dark:text-gray-400">{idx + 1}</td>
                  <td className="px-5 py-3 text-sm font-medium text-gray-800 dark:text-white/90">
                    {i.label} — {studentName}
                  </td>
                  <td className="px-5 py-3 text-right text-sm text-gray-500 dark:text-gray-400">
                    {peso(i.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* TOTALS */}
        <div className="pb-6 my-6 text-right border-b border-gray-100 dark:border-gray-800">
          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
            Sub Total (after discounts){installmentPayments > 0 ? " + installment fees" : ""}: {peso(grandTotal)}
          </p>
          <p className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Total : {peso(grandTotal)}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <Link to="/demo/tuition-pricing">
            <Button variant="outline">Back to Plans</Button>
          </Link>
          <Button>Proceed to payment</Button>
        </div>
      </div>
    </div>
  );
}