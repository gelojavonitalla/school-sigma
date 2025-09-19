// src/pages/Pricing/SchoolTuitionPlans.tsx
import { useState, useCallback } from "react";
import { useNavigate } from "react-router";
import Switch from "../../components/form/switch/Switch";
import { CheckCircle, XCircle } from "lucide-react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

export default function SchoolTuitionPlans() {
  const navigate = useNavigate();

  const [isEarlyBird, setIsEarlyBird] = useState(false);
  const [siblingDiscount, setSiblingDiscount] = useState(false);
  const [reservationPaid, setReservationPaid] = useState(false);

  // You can swap this later to whichever child is active
  const studentName = "River Javonitalla";

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

  const computeBase = () =>
    fees.reg + fees.tuition + fees.misc + fees.lms + fees.robotics;

  const computeDiscounts = () => {
    let discount = 0;
    if (reservationPaid) discount += fees.reservation;
    if (siblingDiscount) discount += fees.siblingDiscount;
    if (isEarlyBird) discount += fees.earlyBird;
    return discount;
  };

  const baseAmount = computeBase();
  const discount = computeDiscounts();
  const adjustedAnnual = baseAmount - discount;

  const firstPaymentDiscount = discount;

  // Yearly
  const yearlyPlan = {
    label: "Yearly",
    total: adjustedAnnual,
    installments: [{ label: "Upon Enrollment", amount: adjustedAnnual }],
    description: "One-time payment",
  };

  // Semestral
  const tuitionPerSem = fees.tuition / 2;
  const miscPerSem = fees.misc / 2;

  const semFirstPayment =
    tuitionPerSem +
    miscPerSem +
    fees.reg +
    fees.lms +
    fees.robotics +
    fees.installment -
    firstPaymentDiscount;

  const semSecondPayment = tuitionPerSem + miscPerSem + fees.installment;

  const semestralPlan = {
    label: "Semestral",
    total: Math.round(semFirstPayment + semSecondPayment),
    installments: [
      { label: "Upon Enrollment", amount: Math.round(semFirstPayment) },
      { label: "2nd Payment (Dec)", amount: Math.round(semSecondPayment) },
    ],
    description: "Two payments (June & Dec)",
  };

  // Quarterly
  const tuitionPerQuarter = fees.tuition / 4;
  const miscPerQuarter = fees.misc / 4;

  const qtrFirstPayment =
    tuitionPerQuarter +
    miscPerQuarter +
    fees.reg +
    fees.lms +
    fees.robotics +
    fees.installment -
    firstPaymentDiscount;

  const qtrOtherPayment = tuitionPerQuarter + miscPerQuarter + fees.installment;

  const quarterlyPlan = {
    label: "Quarterly",
    total: Math.round(qtrFirstPayment + qtrOtherPayment * 3),
    installments: [
      { label: "Upon Enrollment", amount: Math.round(qtrFirstPayment) },
      { label: "2nd Payment (Oct)", amount: Math.round(qtrOtherPayment) },
      { label: "3rd Payment (Dec)", amount: Math.round(qtrOtherPayment) },
      { label: "4th Payment (Feb)", amount: Math.round(qtrOtherPayment) },
    ],
    description: "Four payments (Jun, Oct, Dec, Feb)",
  };

  const plans = [yearlyPlan, semestralPlan, quarterlyPlan];

  const inclusions = ["Tuition & Misc Fees", "LMS", "Robotics"];
  const exclusions = ["Books & Uniform", "Alternative PE", "Speak Music"];

  // 👉 Navigate to quotation with all the info
  const goToQuote = useCallback(
    (planLabel: "Yearly" | "Semestral" | "Quarterly") => {
      navigate("/demo/tuition-quotation", {
        state: {
          plan: planLabel,
          studentName,
          switches: {
            isEarlyBird,
            siblingDiscount,
            reservationPaid,
          },
        },
      });
    },
    [navigate, studentName, isEarlyBird, siblingDiscount, reservationPaid]
  );

  return (
    <div>
      <PageBreadcrumb pageTitle="Pricing Tables" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            Tuition Payment Options for {studentName.split(" ")[0]}
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Choose the plan that best fits your family’s budget. All figures are estimates.
          </p>
        </div>

        <div className="flex justify-center gap-4 mb-10 flex-wrap">
          <Switch label="Early Bird Discount" defaultChecked={isEarlyBird} onChange={setIsEarlyBird} />
          <Switch label="Sibling Discount" defaultChecked={siblingDiscount} onChange={setSiblingDiscount} />
          <Switch label="Reservation Paid" defaultChecked={reservationPaid} onChange={setReservationPaid} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <div
              key={index}
              className="bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">
                  {plan.label}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  {plan.description}
                </p>

                <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  <span className="font-bold text-gray-800 text-3xl dark:text-white">
                    ₱{plan.total.toLocaleString()}
                  </span>
                  <span className="inline-block mb-1 text-sm text-gray-500 dark:text-gray-400">/yr</span>
                </div>

                <div className="w-full h-px my-6 bg-gray-200 dark:bg-gray-800" />

                <div className="text-sm mb-2">
                  <p className="font-semibold text-gray-700 dark:text-white mb-1">Includes:</p>
                  <ul className="space-y-1">
                    {inclusions.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                        <CheckCircle className="text-green-600 w-4 h-4" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="text-sm">
                  <p className="font-semibold text-gray-700 dark:text-white mb-1">Excludes:</p>
                  <ul className="space-y-1">
                    {exclusions.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                        <XCircle className="text-red-500 w-4 h-4" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <ul className="mt-4 text-sm text-gray-600 dark:text-gray-300">
                {plan.installments.map((i, idx) => (
                  <li key={idx} className="flex justify-between">
                    <span>{i.label}</span>
                    <span className="font-medium">₱{i.amount.toLocaleString()}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => goToQuote(plan.label as "Yearly" | "Semestral" | "Quarterly")}
                className="bg-green-600 hover:bg-green-700 text-white py-3 text-base font-semibold w-full rounded-md mt-6"
              >
                Choose {plan.label}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}