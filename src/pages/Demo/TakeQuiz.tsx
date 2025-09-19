// src/pages/Students/TakeQuiz.tsx
import { useEffect, useMemo, useState } from "react";
import ComponentCard from "../../components/common/ComponentCard";
import Button from "../../components/ui/button/Button";
import Badge from "../../components/ui/badge/Badge";
import { Clock, ChevronLeft, ChevronRight, CheckCircle2, AlertTriangle } from "lucide-react";

/* ===========================
   Types
=========================== */
type QuestionType = "mcq" | "tf" | "short";

type BaseQ = {
  id: string;
  type: QuestionType;
  prompt: string;
  points: number;
};

type McqQ = BaseQ & {
  type: "mcq";
  choices: string[];
  answer: string;
};

type TfQ = BaseQ & {
  type: "tf";
  answer: "True" | "False";
};

type ShortQ = BaseQ & {
  type: "short";
  // Auto-grading is not guaranteed for short answers
  sampleAnswers?: string[]; // for demo (used only to display after submit)
};

type Question = McqQ | TfQ | ShortQ;

type Quiz = {
  id: string;
  title: string;
  subject: string;
  meta: {
    grade: string;
    section: string;
    teacher: string;
    timeLimitSec: number; // countdown
  };
  questions: Question[];
};

/* ===========================
   Helpers
=========================== */
function shuffle<T>(arr: T[], seed = 1): T[] {
  // simple seeded shuffle for demo (consistent across reloads)
  const a = [...arr];
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const r = s / 233280;
    const j = Math.floor(r * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function formatTime(totalSec: number) {
  const m = Math.floor(totalSec / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(totalSec % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

/* ===========================
   Mock “generated” quiz
=========================== */
function generateQuiz(seed = 5): Quiz {
  // A small bank to “generate” from (demo)
  const mcqBank: Omit<McqQ, "id" | "points">[] = [
    {
      type: "mcq",
      prompt: "Which part of a plant makes food through photosynthesis?",
      choices: ["Roots", "Stem", "Leaves", "Flowers"],
      answer: "Leaves",
    },
    {
      type: "mcq",
      prompt: "What is the value of 7 × 8?",
      choices: ["48", "54", "56", "64"],
      answer: "56",
    },
    {
      type: "mcq",
      prompt: "Which figure has 4 equal sides and 4 right angles?",
      choices: ["Rectangle", "Square", "Triangle", "Pentagon"],
      answer: "Square",
    },
    {
      type: "mcq",
      prompt: "Which is a renewable energy source?",
      choices: ["Coal", "Oil", "Solar", "Natural Gas"],
      answer: "Solar",
    },
    {
      type: "mcq",
      prompt: "The Philippines is part of which region in Asia?",
      choices: ["South Asia", "Southeast Asia", "East Asia", "Central Asia"],
      answer: "Southeast Asia",
    },
  ];

  const tfBank: Omit<TfQ, "id" | "points">[] = [
    { type: "tf", prompt: "Water boils at 100°C at sea level.", answer: "True" },
    { type: "tf", prompt: "Mt. Mayon is in Luzon.", answer: "True" },
    { type: "tf", prompt: "A hexagon has 5 sides.", answer: "False" },
  ];

  const shortBank: Omit<ShortQ, "id" | "points">[] = [
    {
      type: "short",
      prompt: "What is the capital of the Philippines?",
      sampleAnswers: ["Manila"],
    },
  ];

  const mcq = shuffle(mcqBank, seed).slice(0, 4);
  const tf = shuffle(tfBank, seed + 1).slice(0, 2);
  const short = shuffle(shortBank, seed + 2).slice(0, 1);

  // Assign ids/points and shuffle MCQ choices for variation
  let idx = 1;
  const questions: Question[] = [
    ...mcq.map((q) => ({
      ...q,
      id: `q${idx++}`,
      points: 2,
      choices: shuffle(q.choices, seed + idx),
    })),
    ...tf.map((q) => ({ ...q, id: `q${idx++}`, points: 1 })),
    ...short.map((q) => ({ ...q, id: `q${idx++}`, points: 3 })),
  ];

  return {
    id: "quiz-sci-math-g5",
    title: "Quarter 1 Checkpoint",
    subject: "Science & Math 5",
    meta: {
      grade: "Grade 5",
      section: "Galatians",
      teacher: "Mr. Cruz",
      timeLimitSec: 10 * 60, // 10 minutes
    },
    questions,
  };
}

/* ===========================
   Screen
=========================== */
export default function TakeQuiz() {
  const quiz = useMemo(() => generateQuiz(13), []);
  const [timeLeft, setTimeLeft] = useState<number>(quiz.meta.timeLimitSec);

  // answers: question.id -> value
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [current, setCurrent] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const questions = quiz.questions;
  const currentQ = questions[current];

  // Timer (auto-submit on 0)
  useEffect(() => {
    if (submitted) return;
    if (timeLeft <= 0) {
      doSubmit(true);
      return;
    }
    const t = setInterval(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [timeLeft, submitted]);

  const progressPct = Math.round(
    (Object.keys(answers).length / questions.length) * 100
  );

  const onChoose = (qid: string, val: string) =>
    setAnswers((prev) => ({ ...prev, [qid]: val }));

  function doSubmit(auto = false) {
    // simple confirm when not auto
    if (!auto) {
      const ok = window.confirm(
        "Submit your answers now? You won’t be able to change them after submitting."
      );
      if (!ok) return;
    }
    setSubmitted(true);
  }

  // Scoring (auto-gradable for mcq/tf)
  const result = useMemo(() => {
    if (!submitted) return null;

    let earned = 0;
    let total = 0;
    const details = questions.map((q) => {
      total += q.points;
      let correct = false;
      if (q.type === "mcq" || q.type === "tf") {
        correct = answers[q.id]?.trim() === (q as McqQ | TfQ).answer;
        if (correct) earned += q.points;
      }
      return { id: q.id, correct, points: q.points, type: q.type, answer: answers[q.id] ?? "" };
    });

    const pendingManual = questions
      .filter((q) => q.type === "short")
      .map((q) => q.id);

    return { earned, total, details, pendingManual };
  }, [submitted, answers, questions]);

  const unanswered = questions.filter((q) => !answers[q.id]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white/90">
            {quiz.title}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {quiz.subject} • {quiz.meta.grade} — {quiz.meta.section} • Teacher:{" "}
            {quiz.meta.teacher}
          </p>
        </div>

        {!submitted ? (
          <div className="flex items-center gap-2">
            <Badge color={timeLeft < 60 ? "warning" : "info"} variant="light">
              <span className="inline-flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {formatTime(timeLeft)}
              </span>
            </Badge>
          </div>
        ) : (
          <Badge color="success" variant="light">
            Submitted
          </Badge>
        )}
      </div>

      {/* Progress */}
      {!submitted && (
        <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-300">
              Progress: {Object.keys(answers).length}/{questions.length} answered
            </span>
            {unanswered.length > 0 ? (
              <span className="text-gray-500 dark:text-gray-400">
                {unanswered.length} unanswered
              </span>
            ) : (
              <span className="text-emerald-600 dark:text-emerald-400">
                All answered
              </span>
            )}
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-900">
            <div
              className="h-full rounded-full bg-brand-500 transition-all"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      )}

      {/* Question panel */}
      <ComponentCard
        title={`Question ${current + 1} of ${questions.length}`}
        desc={!submitted ? "Answer the question, then use Next to proceed." : "Review your responses."}
      >
        {/* Prompt */}
        <div className="mb-4 text-base font-medium text-gray-900 dark:text-white/90">
          {currentQ.prompt}
        </div>

        {/* Input */}
        <div className="space-y-3">
          {currentQ.type === "mcq" && (
            <ul className="space-y-2">
              {currentQ.choices.map((c) => {
                const checked = answers[currentQ.id] === c;
                const isCorrect =
                  submitted && (currentQ as McqQ).answer === c;
                const isWrong = submitted && checked && !isCorrect;
                return (
                  <li key={c}>
                    <label
                      className={`flex cursor-pointer items-start gap-3 rounded-lg border px-3 py-2 transition
                      ${
                        checked && !submitted
                          ? "border-brand-400 bg-brand-50/50 dark:border-brand-700/60 dark:bg-brand-500/10"
                          : "border-gray-200 hover:border-gray-300 dark:border-gray-800 dark:hover:border-gray-700"
                      }
                      ${submitted && isCorrect ? "border-emerald-400 bg-emerald-50/50 dark:border-emerald-700/60 dark:bg-emerald-500/10" : ""}
                      ${submitted && isWrong ? "border-rose-400 bg-rose-50/50 dark:border-rose-700/60 dark:bg-rose-500/10" : ""}
                      `}
                    >
                      <input
                        type="radio"
                        name={currentQ.id}
                        className="mt-1 h-4 w-4"
                        checked={checked}
                        disabled={submitted}
                        onChange={() => onChoose(currentQ.id, c)}
                      />
                      <span className="text-sm text-gray-800 dark:text-gray-200">{c}</span>
                    </label>
                  </li>
                );
              })}
            </ul>
          )}

          {currentQ.type === "tf" && (
            <div className="flex gap-3">
              {(["True", "False"] as const).map((v) => {
                const checked = answers[currentQ.id] === v;
                const isCorrect =
                  submitted && (currentQ as TfQ).answer === v;
                const isWrong = submitted && checked && !isCorrect;
                return (
                  <label
                    key={v}
                    className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 transition
                    ${
                      checked && !submitted
                        ? "border-brand-400 bg-brand-50/50 dark:border-brand-700/60 dark:bg-brand-500/10"
                        : "border-gray-200 hover:border-gray-300 dark:border-gray-800 dark:hover:border-gray-700"
                    }
                    ${submitted && isCorrect ? "border-emerald-400 bg-emerald-50/50 dark:border-emerald-700/60 dark:bg-emerald-500/10" : ""}
                    ${submitted && isWrong ? "border-rose-400 bg-rose-50/50 dark:border-rose-700/60 dark:bg-rose-500/10" : ""}
                    `}
                  >
                    <input
                      type="radio"
                      name={currentQ.id}
                      className="h-4 w-4"
                      checked={checked}
                      disabled={submitted}
                      onChange={() => onChoose(currentQ.id, v)}
                    />
                    <span className="text-sm">{v}</span>
                  </label>
                );
              })}
            </div>
          )}

          {currentQ.type === "short" && (
            <div>
              <textarea
                rows={3}
                value={answers[currentQ.id] ?? ""}
                disabled={submitted}
                onChange={(e) => onChoose(currentQ.id, e.target.value)}
                placeholder="Type your answer here…"
                className="w-full rounded-lg border border-gray-200 bg-white p-3 text-sm text-gray-800 outline-none transition focus:border-gray-300 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200"
              />
              {submitted && (
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  <AlertTriangle className="mr-1 inline h-4 w-4 align-text-bottom" />
                  This item will be reviewed by the teacher. Sample answer:
                  <span className="ml-1 font-medium text-gray-700 dark:text-gray-300">
                    {(currentQ.sampleAnswers ?? ["(teacher-provided)"]).join(", ")}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Review tags after submit */}
        {submitted && (currentQ.type === "mcq" || currentQ.type === "tf") && (
          <div className="mt-4">
            {(result?.details.find((d) => d.id === currentQ.id)?.correct ?? false) ? (
              <Badge color="success">
                <CheckCircle2 className="mr-1 h-4 w-4" /> Correct
              </Badge>
            ) : (
              <Badge color="warning">
                <AlertTriangle className="mr-1 h-4 w-4" /> Incorrect
              </Badge>
            )}
          </div>
        )}

        {/* Footer nav */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {questions.map((q, i) => {
              const answered = !!answers[q.id];
              const active = i === current;
              return (
                <button
                  key={q.id}
                  onClick={() => setCurrent(i)}
                  className={`h-9 w-9 rounded-md text-sm font-medium transition
                    ${active ? "ring-2 ring-brand-300 dark:ring-brand-600" : ""}
                    ${
                      answered
                        ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                        : "bg-white text-gray-700 ring-1 ring-inset ring-gray-200 hover:bg-gray-50 dark:bg-gray-900 dark:text-gray-200 dark:ring-gray-800"
                    }`}
                  title={answered ? "Answered" : "Unanswered"}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>

          {!submitted ? (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrent((i) => Math.max(0, i - 1))}
                disabled={current === 0}
                className="inline-flex items-center gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  setCurrent((i) => Math.min(questions.length - 1, i + 1))
                }
                disabled={current === questions.length - 1}
                className="inline-flex items-center gap-2"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button onClick={() => doSubmit(false)}>Submit Quiz</Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  // Retake: reset
                  setAnswers({});
                  setSubmitted(false);
                  setCurrent(0);
                  setTimeLeft(quiz.meta.timeLimitSec);
                }}
              >
                Retake (Demo)
              </Button>
            </div>
          )}
        </div>
      </ComponentCard>

      {/* Results */}
      {submitted && result && (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white/90">
              Results
            </h2>
            <Badge color="info" variant="light">
              Auto-graded items only
            </Badge>
          </div>
          <div className="mb-4 text-lg font-semibold text-gray-900 dark:text-white/90">
            Score: {result.earned} / {result.total} pts
          </div>
          {result.pendingManual.length > 0 && (
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {result.pendingManual.length} response
              {result.pendingManual.length > 1 ? "s" : ""} pending manual
              checking by the teacher.
            </p>
          )}
        </div>
      )}
    </div>
  );
}