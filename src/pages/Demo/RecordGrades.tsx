import { useMemo, useState } from "react";
import ComponentCard from "../../components/common/ComponentCard";
import Button from "../../components/ui/button/Button";
import Badge from "../../components/ui/badge/Badge";
import {
  BookOpen,
  Save,
  Upload,
  Download,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Calculator,
} from "lucide-react";

/* =========================================================
   Types
========================================================= */
type Klass = {
  id: string;
  grade: string;
  section: string;
  subject: string;
};

type Student = {
  id: string;
  name: string;
};

type Category = "Quiz" | "Seatwork" | "Project" | "Exam";

type Assessment = {
  id: string;
  title: string;
  date: string; // ISO
  category: Category;
  maxPoints: number;
  classId: string;
};

type GradeEntry = {
  studentId: string;
  score: number | null;
  remark?: string;
};

/* =========================================================
   Mock data (Filipino names; keep images out—table-only here)
========================================================= */
const CLASSES: Klass[] = [
  { id: "g5-gal", grade: "Grade 5", section: "Galatians", subject: "Math 5" },
  { id: "g3-rom", grade: "Grade 3", section: "Romans", subject: "Math 3" },
];

const ROSTERS: Record<string, Student[]> = {
  "g5-gal": [
    { id: "s1", name: "River Javonitalla" },
    { id: "s2", name: "Andre Dela Cruz" },
    { id: "s3", name: "Juan Miguel Santos" },
    { id: "s4", name: "Rafael Garcia" },
    { id: "s5", name: "Marco Reyes" },
    { id: "s6", name: "Paolo Mendoza" },
    { id: "s7", name: "Kenji Tan" },
    { id: "s8", name: "Luis Manalo" },
    { id: "s9", name: "Carlo Villanueva" },
    { id: "s10", name: "Mico Dominguez" },
  ],
  "g3-rom": [
    { id: "t1", name: "Lake Javonitalla" },
    { id: "t2", name: "Lia Bautista" },
    { id: "t3", name: "Kaye Dizon" },
    { id: "t4", name: "Mika Ramos" },
    { id: "t5", name: "Jomar Aquino" },
    { id: "t6", name: "Noah De Vera" },
    { id: "t7", name: "Ethan Uy" },
    { id: "t8", name: "Gab Mercado" },
  ],
};

const INITIAL_ASSESSMENTS: Assessment[] = [
  {
    id: "a1",
    title: "Quiz 2 — Fractions",
    date: "2025-06-05",
    category: "Quiz",
    maxPoints: 20,
    classId: "g5-gal",
  },
  {
    id: "a2",
    title: "Seatwork — Word Problems",
    date: "2025-06-03",
    category: "Seatwork",
    maxPoints: 10,
    classId: "g5-gal",
  },
  {
    id: "a3",
    title: "Quiz 1 — Multiplication",
    date: "2025-06-04",
    category: "Quiz",
    maxPoints: 15,
    classId: "g3-rom",
  },
];

/* =========================================================
   Helpers
========================================================= */
const pct = (score: number, max: number) =>
  max > 0 ? Math.round((score / max) * 100) : 0;

function csvEscape(s: string) {
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

/* =========================================================
   Component
========================================================= */
export default function RecordGrades() {
  const [selectedClassId, setSelectedClassId] = useState<string>(CLASSES[0].id);
  const [assessments, setAssessments] = useState<Assessment[]>(
    INITIAL_ASSESSMENTS
  );
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<string>(() => {
    const first = INITIAL_ASSESSMENTS.find((a) => a.classId === CLASSES[0].id);
    return first ? first.id : "";
  });

  // gradebook[assessmentId][studentId] = GradeEntry
  const [gradebook, setGradebook] = useState<Record<string, Record<string, GradeEntry>>>(
    {}
  );

  const currentClass = useMemo(
    () => CLASSES.find((c) => c.id === selectedClassId)!,
    [selectedClassId]
  );

  const classAssessments = useMemo(
    () => assessments.filter((a) => a.classId === selectedClassId),
    [assessments, selectedClassId]
  );

  const assessment = useMemo(
    () => classAssessments.find((a) => a.id === selectedAssessmentId) || null,
    [classAssessments, selectedAssessmentId]
  );

  const roster = useMemo(() => ROSTERS[selectedClassId] || [], [selectedClassId]);

  // Ensure entries for the current assessment exist
  const entries = useMemo(() => {
    if (!assessment) return [];
    const book = gradebook[assessment.id] || {};
    return roster.map<GradeEntry>((stu) => {
      const found = book[stu.id];
      return found || { studentId: stu.id, score: null, remark: "" };
    });
  }, [assessment, gradebook, roster]);

  const stats = useMemo(() => {
    if (!assessment) return { missing: 0, avg: 0, highest: 0, lowest: 0 };
    let sum = 0;
    let count = 0;
    let hi = -Infinity;
    let lo = Infinity;

    entries.forEach((e) => {
      if (typeof e.score === "number") {
        sum += e.score;
        count += 1;
        hi = Math.max(hi, e.score);
        lo = Math.min(lo, e.score);
      }
    });

    return {
      missing: roster.length - count,
      avg: count ? Math.round((sum / count) * 10) / 10 : 0,
      highest: count ? hi : 0,
      lowest: count ? lo : 0,
    };
  }, [entries, roster.length, assessment]);

  function updateScore(studentId: string, value: string) {
    if (!assessment) return;
    const parsed =
      value.trim() === "" ? null : Math.max(0, Math.min(+value, assessment.maxPoints));
    setGradebook((prev) => {
      const byAssess = { ...(prev[assessment.id] || {}) };
      const existing = byAssess[studentId] || { studentId, score: null, remark: "" };
      byAssess[studentId] = { ...existing, score: parsed };
      return { ...prev, [assessment.id]: byAssess };
    });
  }

  function updateRemark(studentId: string, value: string) {
    if (!assessment) return;
    setGradebook((prev) => {
      const byAssess = { ...(prev[assessment.id] || {}) };
      const existing = byAssess[studentId] || { studentId, score: null, remark: "" };
      byAssess[studentId] = { ...existing, remark: value };
      return { ...prev, [assessment.id]: byAssess };
    });
  }

  function saveDraft() {
    if (!assessment) return;
    // Wire to API later
    console.log("SAVE_DRAFT", { assessment, entries });
    alert("Draft saved.");
  }

  function submitGrades() {
    if (!assessment) return;
    const hasMissing = entries.some((e) => e.score === null);
    if (hasMissing && !confirm("Some students have no scores. Submit anyway?")) {
      return;
    }
    // Wire to API later
    console.log("SUBMIT_GRADES", { assessment, entries });
    alert("Submitted to registrar.");
  }

  function exportCSV() {
    if (!assessment) return;
    const rows = [
      ["Student", "Score", `Out of (${assessment.maxPoints})`, "Percent", "Remark"],
      ...roster.map((stu) => {
        const e = entries.find((x) => x.studentId === stu.id);
        const score = e?.score ?? "";
        const percent =
          typeof e?.score === "number" ? pct(e.score, assessment.maxPoints) + "%" : "";
        return [
          csvEscape(stu.name),
          String(score),
          String(assessment.maxPoints),
          String(percent),
          csvEscape(e?.remark || ""),
        ];
      }),
    ]
      .map((cols) => cols.join(","))
      .join("\n");

    const blob = new Blob([rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${currentClass.grade}-${currentClass.section}-${assessment.title}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function createAssessment() {
    const title = prompt("Assessment title (e.g., Quiz 3 — Decimals):");
    if (!title) return;
    const maxStr = prompt("Max points:", "20") || "20";
    const maxPoints = Math.max(1, Math.round(+maxStr) || 20);
    const id = "a" + Math.random().toString(36).slice(2, 7);
    const a: Assessment = {
      id,
      title,
      date: new Date().toISOString().slice(0, 10),
      category: "Quiz",
      maxPoints,
      classId: selectedClassId,
    };
    setAssessments((prev) => [a, ...prev]);
    setSelectedAssessmentId(id);
  }

  // Keep selected assessment valid when switching classes
  function onClassChange(id: string) {
    setSelectedClassId(id);
    const first = assessments.find((a) => a.classId === id);
    setSelectedAssessmentId(first ? first.id : "");
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white/90">
            Record Grades
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Enter scores per assessment. Stats update as you type.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={saveDraft} className="inline-flex items-center gap-2">
            <Save className="h-4 w-4" /> Save Draft
          </Button>
          <Button variant="outline" onClick={submitGrades} className="inline-flex items-center gap-2">
            <Upload className="h-4 w-4" /> Submit Grades
          </Button>
          <Button variant="outline" onClick={exportCSV} className="inline-flex items-center gap-2">
            <Download className="h-4 w-4" /> Export CSV
          </Button>
        </div>
      </div>

      {/* Class & Assessment pickers */}
      <ComponentCard
        title="Class & Assessment"
        desc="Choose a class and the assessment you want to grade."
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <label className="flex flex-col gap-1">
            <span className="text-sm text-gray-600 dark:text-gray-300">Class</span>
            <select
              value={selectedClassId}
              onChange={(e) => onClassChange(e.target.value)}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-gray-300 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200"
            >
              {CLASSES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.grade} — {c.section} ({c.subject})
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1 sm:col-span-2">
            <span className="text-sm text-gray-600 dark:text-gray-300">Assessment</span>
            <div className="flex gap-2">
              <select
                value={selectedAssessmentId}
                onChange={(e) => setSelectedAssessmentId(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-gray-300 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200"
              >
                {classAssessments.length === 0 && <option value="">No assessments</option>}
                {classAssessments.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.title} — {new Date(a.date).toLocaleDateString()}
                  </option>
                ))}
              </select>
              <Button variant="outline" onClick={createAssessment} className="inline-flex items-center gap-2">
                <Plus className="h-4 w-4" /> New
              </Button>
            </div>
            {assessment && (
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                <Badge color="light" variant="light">
                  <BookOpen className="mr-1 h-3.5 w-3.5" />
                  {assessment.category}
                </Badge>
                <Badge color="info" variant="light">Max: {assessment.maxPoints} pts</Badge>
                <Badge color="light" variant="light">
                  {currentClass.grade} — {currentClass.section}
                </Badge>
              </div>
            )}
          </label>
        </div>
      </ComponentCard>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300">
            <Calculator className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Average</div>
            <div className="text-xl font-semibold text-gray-900 dark:text-white/90">{stats.avg}</div>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Highest</div>
            <div className="text-xl font-semibold text-gray-900 dark:text-white/90">{stats.highest}</div>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Lowest</div>
            <div className="text-xl font-semibold text-gray-900 dark:text-white/90">{stats.lowest}</div>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Missing</div>
            <div className="text-xl font-semibold text-gray-900 dark:text-white/90">{stats.missing}</div>
          </div>
        </div>
      </div>

      {/* Grade table */}
      <ComponentCard
        title="Grade Sheet"
        desc={assessment ? `${assessment.title} • ${currentClass.grade} — ${currentClass.section}` : "Create or select an assessment to begin."}
      >
        {!assessment ? (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            No assessment selected.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-gray-800">
            <table className="min-w-full text-left">
              <thead className="bg-gray-50 text-gray-600 dark:bg-gray-900 dark:text-gray-400">
                <tr className="text-sm">
                  <th className="px-5 py-3 font-medium">Student</th>
                  <th className="px-5 py-3 font-medium">Score</th>
                  <th className="px-5 py-3 font-medium">Out of</th>
                  <th className="px-5 py-3 font-medium">Percent</th>
                  <th className="px-5 py-3 font-medium">Remark</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm dark:divide-gray-800">
                {roster.map((stu, idx) => {
                  const e = entries[idx];
                  const sc = e?.score;
                  const percent =
                    typeof sc === "number"
                      ? `${pct(sc, assessment.maxPoints)}%`
                      : "—";
                  const missing = sc === null;
                  return (
                    <tr key={stu.id} className="text-gray-700 dark:text-gray-300">
                      <td className="px-5 py-3 font-medium text-gray-900 dark:text-white/90">
                        {stu.name}
                      </td>
                      <td className="px-5 py-3">
                        <input
                          inputMode="numeric"
                          type="number"
                          min={0}
                          max={assessment.maxPoints}
                          value={sc ?? ""}
                          onChange={(e) => updateScore(stu.id, e.target.value)}
                          onKeyDown={(e) => {
                            // Enter goes to next row score field
                            if (e.key === "Enter") {
                              const inputs = Array.from(
                                document.querySelectorAll<HTMLInputElement>(
                                  'input[data-kind="score"]'
                                )
                              );
                              const pos = inputs.findIndex((x) => x === e.currentTarget);
                              const next = inputs[pos + 1];
                              if (next) next.focus();
                            }
                          }}
                          data-kind="score"
                          className="w-28 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-800 outline-none transition focus:border-gray-300 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200"
                        />
                        {missing && (
                          <span className="ml-2 align-middle">
                            <Badge color="warning">Missing</Badge>
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3">{assessment.maxPoints}</td>
                      <td className="px-5 py-3">{percent}</td>
                      <td className="px-5 py-3">
                        <input
                          type="text"
                          value={e?.remark ?? ""}
                          onChange={(ev) => updateRemark(stu.id, ev.target.value)}
                          placeholder="optional"
                          className="w-full max-w-[260px] rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-800 outline-none transition focus:border-gray-300 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </ComponentCard>
    </div>
  );
}