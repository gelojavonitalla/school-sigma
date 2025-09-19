// src/pages/Parents/Reservation.tsx
import { useMemo, useState } from "react";
import ComponentCard from "../../components/common/ComponentCard";
import Button from "../../components/ui/button/Button";
import Badge from "../../components/ui/badge/Badge";
import SafeLink from "../../components/links/SafeLink";
import {
  CalendarDays,
  CreditCard,
  UserPlus,
  Users,
  Info,
  CheckCircle2,
} from "lucide-react";

/* ==============================
   Mock Data
   ============================== */
type Student = {
  id: string;
  name: string;
  grade?: string;
  section?: string;
  adviser?: string;
  avatarUrl?: string;
};

const MY_STUDENTS: Student[] = [
  {
    id: "river",
    name: "River Javonitalla",
    grade: "Grade 5",
    section: "Galatians",
    adviser: "Mr. Cruz",
    avatarUrl: "/images/user/user-01.jpg",
  },
  {
    id: "lake",
    name: "Lake Javonitalla",
    grade: "Grade 3",
    section: "Romans",
    adviser: "Ms. Santos",
    avatarUrl: "/images/user/user-35.jpg",
  },
  {
    id: "fjord",
    name: "Fjord Javonitalla",
    grade: "Preschool",
    section: "Genesis",
    adviser: "Ms. Dizon",
    avatarUrl: "/images/user/user-37.jpg",
  },
];

const GRADE_OPTIONS = [
  "Preschool",
  "Kindergarten",
  "Grade 1",
  "Grade 2",
  "Grade 3",
  "Grade 4",
  "Grade 5",
  "Grade 6",
  "Grade 7",
  "Grade 8",
  "Grade 9",
  "Grade 10",
  "Grade 11",
  "Grade 12",
];

const SCHOOL_YEARS = ["2025–2026", "2024–2025", "2023–2024"] as const;

const RESERVATION_FEE = 5000;

const peso = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  maximumFractionDigits: 0,
});

/* ==============================
   Types
   ============================== */
type Who = "existing" | "new";
type Plan = "Yearly" | "Semestral" | "Quarterly";
type Method = "GCash" | "Bank Transfer" | "Cash (Registrar)";

export default function Reservation() {
  /* -----------------------------
     State
  ------------------------------ */
  const [schoolYear, setSchoolYear] = useState<(typeof SCHOOL_YEARS)[number]>("2025–2026");
  const [who, setWho] = useState<Who>("existing");
  const [existingId, setExistingId] = useState<string>(MY_STUDENTS[0]?.id ?? "");

  const [newFirst, setNewFirst] = useState("");
  const [newLast, setNewLast] = useState("");
  const [newBirth, setNewBirth] = useState("");
  const [targetGrade, setTargetGrade] = useState<string>("Grade 1");

  const [plan, setPlan] = useState<Plan>("Quarterly");
  const [method, setMethod] = useState<Method>("GCash");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [refNo, setRefNo] = useState<string | null>(null);

  /* -----------------------------
     Derived
  ------------------------------ */
  const selectedStudent = useMemo(
    () => MY_STUDENTS.find((s) => s.id === existingId) ?? null,
    [existingId]
  );

  const studentLabel =
    who === "existing"
      ? selectedStudent?.name || "—"
      : [newFirst.trim(), newLast.trim()].filter(Boolean).join(" ");

  const isValid = useMemo(() => {
    if (!schoolYear) return false;
    if (!plan || !method) return false;

    if (who === "existing") {
      if (!existingId) return false;
    } else {
      if (!newFirst.trim() || !newLast.trim() || !targetGrade) return false;
    }

    // Optional to require email/mobile; for demo, at least one contact
    if (!email.trim() && !mobile.trim()) return false;

    return true;
  }, [schoolYear, plan, method, who, existingId, newFirst, newLast, targetGrade, email, mobile]);

  const handleReserve = async () => {
    if (!isValid) return;
    setSubmitting(true);

    // Mock “submit”
    setTimeout(() => {
      setRefNo(`RSV-${Math.floor(Math.random() * 900000 + 100000)}`);
      setShowConfirm(true);
      setSubmitting(false);
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white/90">
            Reserve a Slot
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Lock a slot for your child for the upcoming school year. Reservation fee is{" "}
            <span className="font-medium text-gray-700 dark:text-gray-300">
              {peso.format(RESERVATION_FEE)}
            </span>{" "}
            and is deductible from tuition.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <SafeLink
            to="/demo/dashboard/parents"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            Back to Dashboard
          </SafeLink>
        </div>
      </div>

      {/* SY + Info */}
      <ComponentCard
        title="School Year & Student"
        desc="Tell us who you are reserving for."
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* School Year */}
          <div className="col-span-1">
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              School Year
            </label>
            <div className="relative">
              <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <select
                value={schoolYear}
                onChange={(e) => setSchoolYear(e.target.value as any)}
                className="w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 py-2 text-sm text-gray-800 outline-none transition focus:border-gray-300 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200"
              >
                {SCHOOL_YEARS.map((sy) => (
                  <option key={sy} value={sy}>
                    {sy}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Who */}
          <div className="col-span-2">
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Who are you reserving for?
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setWho("existing")}
                className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ring-1 ring-inset ${
                  who === "existing"
                    ? "bg-gray-900 text-white ring-gray-900 dark:bg-white dark:text-gray-900 dark:ring-white"
                    : "bg-white text-gray-700 ring-gray-200 hover:bg-gray-50 dark:bg-gray-900 dark:text-gray-200 dark:ring-gray-800 dark:hover:bg-gray-800"
                }`}
              >
                <Users className="h-4 w-4" />
                Existing Child
              </button>
              <button
                onClick={() => setWho("new")}
                className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ring-1 ring-inset ${
                  who === "new"
                    ? "bg-gray-900 text-white ring-gray-900 dark:bg-white dark:text-gray-900 dark:ring-white"
                    : "bg-white text-gray-700 ring-gray-200 hover:bg-gray-50 dark:bg-gray-900 dark:text-gray-200 dark:ring-gray-800 dark:hover:bg-gray-800"
                }`}
              >
                <UserPlus className="h-4 w-4" />
                New Student
              </button>
            </div>
          </div>
        </div>

        {/* Existing / New forms */}
        {who === "existing" ? (
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Select Child
              </label>
              <select
                value={existingId}
                onChange={(e) => setExistingId(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-gray-300 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200"
              >
                {MY_STUDENTS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} {s.grade ? `• ${s.grade}` : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3 dark:border-gray-800 dark:bg-white/[0.03]">
              <Info className="h-5 w-5 text-gray-400" />
              <p className="text-sm text-gray-600 dark:text-gray-300">
                We’ll reserve a slot for the selected child in{" "}
                <span className="font-medium">{schoolYear}</span>. If you want to reserve for a different child, add another reservation after this.
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4">
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                First Name
              </label>
              <input
                value={newFirst}
                onChange={(e) => setNewFirst(e.target.value)}
                placeholder="e.g., Juan"
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-gray-300 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200"
              />
            </div>
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Last Name
              </label>
              <input
                value={newLast}
                onChange={(e) => setNewLast(e.target.value)}
                placeholder="e.g., Dela Cruz"
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-gray-300 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Birthdate (optional)
              </label>
              <input
                type="date"
                value={newBirth}
                onChange={(e) => setNewBirth(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-gray-300 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Target Grade Level
              </label>
              <select
                value={targetGrade}
                onChange={(e) => setTargetGrade(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-gray-300 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200"
              >
                {GRADE_OPTIONS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </ComponentCard>

      {/* Plan & Payment */}
      <ComponentCard
        title="Plan & Payment"
        desc="Choose a preferred payment plan and reservation method."
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Plan */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Preferred Plan
            </label>
            <div className="flex items-center gap-2">
              {(["Yearly", "Semestral", "Quarterly"] as Plan[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setPlan(p)}
                  className={`rounded-lg px-3 py-2 text-sm font-medium ring-1 ring-inset ${
                    plan === p
                      ? "bg-gray-900 text-white ring-gray-900 dark:bg-white dark:text-gray-900 dark:ring-white"
                      : "bg-white text-gray-700 ring-gray-200 hover:bg-gray-50 dark:bg-gray-900 dark:text-gray-200 dark:ring-gray-800 dark:hover:bg-gray-800"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              You can still change the plan during enrollment. Reservation fee is deducted from the first payment.
            </p>
          </div>

          {/* Method */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Reservation Method
            </label>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {(["GCash", "Bank Transfer", "Cash (Registrar)"] as Method[]).map((m) => (
                <label
                  key={m}
                  className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm ${
                    method === m
                      ? "border-gray-900 bg-gray-900 text-white dark:border-white dark:bg-white dark:text-gray-900"
                      : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
                  }`}
                >
                  <input
                    type="radio"
                    className="sr-only"
                    checked={method === m}
                    onChange={() => setMethod(m)}
                  />
                  <CreditCard className="h-4 w-4" />
                  {m}
                </label>
              ))}
            </div>
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              We’ll show simple instructions after you reserve.
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Parent Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-gray-300 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Mobile Number
            </label>
            <input
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="09XX-XXX-XXXX"
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-gray-300 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200"
            />
          </div>
        </div>
      </ComponentCard>

      {/* Review */}
      <ComponentCard
        title="Review & Reserve"
        desc="Confirm your details before submitting."
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="text-xs text-gray-500 dark:text-gray-400">School Year</div>
            <div className="text-base font-semibold text-gray-900 dark:text-white/90">{schoolYear}</div>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="text-xs text-gray-500 dark:text-gray-400">Student</div>
            <div className="text-base font-semibold text-gray-900 dark:text-white/90">
              {studentLabel || "—"}
            </div>
            {who === "new" && (
              <div className="text-xs text-gray-500 dark:text-gray-400">Target Grade: {targetGrade}</div>
            )}
            {who === "existing" && selectedStudent?.grade && (
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Current: {selectedStudent.grade}{selectedStudent.section ? ` • ${selectedStudent.section}` : ""}
              </div>
            )}
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="text-xs text-gray-500 dark:text-gray-400">Plan / Method</div>
            <div className="text-base font-semibold text-gray-900 dark:text-white/90">{plan}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{method}</div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-100 p-4 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <Badge color="info" variant="light">
              Reservation Fee: {peso.format(RESERVATION_FEE)}
            </Badge>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Deductible from tuition • Non-refundable
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => window.history.back()}
            >
              Cancel
            </Button>
            <Button
              onClick={handleReserve}
              disabled={!isValid || submitting}
              className="inline-flex items-center gap-2"
            >
              <CheckCircle2 className="h-4 w-4" />
              {submitting ? "Reserving…" : "Reserve Slot"}
            </Button>
          </div>
        </div>
      </ComponentCard>

      {/* Confirmation Modal (lightweight) */}
      {showConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowConfirm(false)} />
          <div className="relative z-[101] w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-3 flex items-center gap-3">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white/90">
                Reservation Created
              </h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              We’ve created a reservation for <span className="font-medium">{studentLabel}</span> ({schoolYear}).
              Your reference number is <span className="font-semibold">{refNo}</span>.
            </p>

            <div className="mt-4 rounded-xl border border-gray-100 bg-gray-50 p-4 text-sm text-gray-700 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-200">
              <div className="mb-1 font-medium">Next Steps</div>
              {method === "GCash" && (
                <ul className="list-disc pl-5">
                  <li>Open GCash and send <strong>{peso.format(RESERVATION_FEE)}</strong> to the school’s official number.</li>
                  <li>Use reference <strong>{refNo}</strong> in the notes.</li>
                  <li>Keep your receipt; the Registrar will verify within 1–2 business days.</li>
                </ul>
              )}
              {method === "Bank Transfer" && (
                <ul className="list-disc pl-5">
                  <li>Transfer <strong>{peso.format(RESERVATION_FEE)}</strong> to the school’s bank account.</li>
                  <li>Use reference <strong>{refNo}</strong> as the deposit note.</li>
                  <li>Send proof via the Registrar or reply to the email confirmation.</li>
                </ul>
              )}
              {method === "Cash (Registrar)" && (
                <ul className="list-disc pl-5">
                  <li>Visit the Registrar and pay <strong>{peso.format(RESERVATION_FEE)}</strong> over the counter.</li>
                  <li>Mention your reference <strong>{refNo}</strong> for faster processing.</li>
                </ul>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowConfirm(false)}>
                Close
              </Button>
              <Button>
                <SafeLink to="/invoices">View Payments</SafeLink>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}