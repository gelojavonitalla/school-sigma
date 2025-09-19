// src/pages/Teacher/MakeQuiz.tsx
import { useMemo, useState } from "react";
import ComponentCard from "../../components/common/ComponentCard";
import Button from "../../components/ui/button/Button";
import Badge from "../../components/ui/badge/Badge";
import {
  Plus,
  Trash2,
  Copy,
  Eye,
  Save,
  Clock,
  ChevronUp,
  ChevronDown,
  GripVertical,
} from "lucide-react";

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
  correctIndex: number; // 0..n-1
};

type TfQ = BaseQ & {
  type: "tf";
  answer: "True" | "False";
};

type ShortQ = BaseQ & {
  type: "short";
  sampleAnswers: string[];
};

type Question = McqQ | TfQ | ShortQ;

type QuizDraft = {
  title: string;
  subject: string;
  grade: string;
  section: string;
  teacher: string;
  timeLimitMin: number;
  questions: Question[];
};

/* ===========================
   Helpers
=========================== */
const newId = () => Math.random().toString(36).slice(2, 9);

function makeBlank(type: QuestionType): Question {
  if (type === "mcq")
    return {
      id: newId(),
      type: "mcq",
      prompt: "Type the question…",
      points: 2,
      choices: ["Choice A", "Choice B", "Choice C", "Choice D"],
      correctIndex: 0,
    };
  if (type === "tf")
    return {
      id: newId(),
      type: "tf",
      prompt: "Statement goes here…",
      points: 1,
      answer: "True",
    };
  return {
    id: newId(),
    type: "short",
    prompt: "Short answer prompt…",
    points: 3,
    sampleAnswers: ["(example answer)"],
  };
}

/* ===========================
   Question Editor
=========================== */
function QuestionEditor({
  q,
  idx,
  onChange,
  onDelete,
  onDuplicate,
  onMoveUp,
  onMoveDown,
}: {
  q: Question;
  idx: number;
  onChange: (next: Question) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GripVertical className="h-4 w-4 text-gray-400" />
          <Badge variant="light" color="info">
            Item {idx + 1}
          </Badge>
        </div>
        <div className="flex items-center gap-1">
          <Button size="sm" variant="outline" onClick={onMoveUp}>
            <ChevronUp className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={onMoveDown}>
            <ChevronDown className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={onDuplicate}>
            <Copy className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Type + points */}
      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-300">Type</span>
          <select
            value={q.type}
            onChange={(e) => onChange({ ...makeBlank(e.target.value as QuestionType), id: q.id })}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200"
          >
            <option value="mcq">Multiple Choice</option>
            <option value="tf">True/False</option>
            <option value="short">Short Answer</option>
          </select>
        </label>

        <label className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-300">Points</span>
          <input
            type="number"
            min={0}
            value={q.points}
            onChange={(e) => onChange({ ...q, points: Math.max(0, parseInt(e.target.value || "0", 10)) })}
            className="w-24 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200"
          />
        </label>
      </div>

      {/* Prompt */}
      <div className="mb-3">
        <textarea
          rows={2}
          value={q.prompt}
          onChange={(e) => onChange({ ...q, prompt: e.target.value })}
          placeholder="Enter the question prompt…"
          className="w-full rounded-lg border border-gray-200 bg-white p-3 text-sm text-gray-800 outline-none focus:border-gray-300 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200"
        />
      </div>

      {/* Type-specific editors */}
      {q.type === "mcq" && (
        <div className="space-y-2">
          {(q as McqQ).choices.map((choice, cidx) => (
            <div key={cidx} className="flex items-center gap-2">
              <input
                type="radio"
                name={`correct-${q.id}`}
                checked={(q as McqQ).correctIndex === cidx}
                onChange={() => onChange({ ...(q as McqQ), correctIndex: cidx })}
              />
              <input
                value={choice}
                onChange={(e) => {
                  const next = [...(q as McqQ).choices];
                  next[cidx] = e.target.value;
                  onChange({ ...(q as McqQ), choices: next });
                }}
                className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200"
              />
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  const next = (q as McqQ).choices.filter((_, i) => i !== cidx);
                  const nextCorrect = Math.min((q as McqQ).correctIndex, Math.max(0, next.length - 1));
                  onChange({ ...(q as McqQ), choices: next, correctIndex: nextCorrect });
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onChange({ ...(q as McqQ), choices: [...(q as McqQ).choices, "New choice"] })}
            >
              <Plus className="mr-1 h-4 w-4" /> Add Choice
            </Button>
          </div>
        </div>
      )}

      {q.type === "tf" && (
        <div className="flex gap-4">
          {(["True", "False"] as const).map((v) => (
            <label key={v} className="inline-flex items-center gap-2 text-sm">
              <input
                type="radio"
                name={`tf-${q.id}`}
                checked={(q as TfQ).answer === v}
                onChange={() => onChange({ ...(q as TfQ), answer: v })}
              />
              {v}
            </label>
          ))}
        </div>
      )}

      {q.type === "short" && (
        <div className="space-y-2">
          <p className="text-sm text-gray-600 dark:text-gray-400">Sample answers (optional, used for guidance after checking):</p>
          {(q as ShortQ).sampleAnswers.map((ans, aidx) => (
            <div key={aidx} className="flex items-center gap-2">
              <input
                value={ans}
                onChange={(e) => {
                  const next = [...(q as ShortQ).sampleAnswers];
                  next[aidx] = e.target.value;
                  onChange({ ...(q as ShortQ), sampleAnswers: next });
                }}
                className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200"
              />
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  onChange({
                    ...(q as ShortQ),
                    sampleAnswers: (q as ShortQ).sampleAnswers.filter((_, i) => i !== aidx),
                  })
                }
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              onChange({ ...(q as ShortQ), sampleAnswers: [...(q as ShortQ).sampleAnswers, "New sample"] })
            }
          >
            <Plus className="mr-1 h-4 w-4" /> Add Sample
          </Button>
        </div>
      )}
    </div>
  );
}

/* ===========================
   Screen
=========================== */
export default function MakeQuiz() {
  const [preview, setPreview] = useState(false);
  const [draft, setDraft] = useState<QuizDraft>({
    title: "Quarter 1 Checkpoint",
    subject: "Science & Math",
    grade: "Grade 5",
    section: "Galatians",
    teacher: "Mr. Cruz",
    timeLimitMin: 10,
    questions: [
      makeBlank("mcq"),
      { ...makeBlank("tf"), prompt: "Water boils at 100°C at sea level." },
     { ...makeBlank("short"), prompt: "What is the capital of the Philippines?"},
    ],
  });

  const totalPoints = useMemo(
    () => draft.questions.reduce((sum, q) => sum + (q.points || 0), 0),
    [draft.questions]
  );

  const addQuestion = (type: QuestionType) =>
    setDraft((d) => ({ ...d, questions: [...d.questions, makeBlank(type)] }));

  const updateQ = (i: number, next: Question) =>
    setDraft((d) => {
      const qs = [...d.questions];
      qs[i] = next;
      return { ...d, questions: qs };
    });

  const delQ = (i: number) =>
    setDraft((d) => ({ ...d, questions: d.questions.filter((_, idx) => idx !== i) }));

  const dupQ = (i: number) =>
    setDraft((d) => {
      const qs = [...d.questions];
      const copy = JSON.parse(JSON.stringify(qs[i])) as Question;
      copy.id = newId();
      qs.splice(i + 1, 0, copy);
      return { ...d, questions: qs };
    });

  const moveQ = (i: number, dir: -1 | 1) =>
    setDraft((d) => {
      const j = i + dir;
      if (j < 0 || j >= d.questions.length) return d;
      const qs = [...d.questions];
      const [item] = qs.splice(i, 1);
      qs.splice(j, 0, item);
      return { ...d, questions: qs };
    });

  const onSave = () => {
    // TODO: replace with API call
    const payload = {
      ...draft,
      timeLimitSec: draft.timeLimitMin * 60,
    };
    console.log("SAVE QUIZ PAYLOAD", payload);
    alert("Quiz saved (demo). Check console for payload.");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white/90">Create Quiz</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Set quiz details and add items. Use Preview to check before saving.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setPreview((v) => !v)}>
            <Eye className="mr-2 h-4 w-4" />
            {preview ? "Close Preview" : "Preview"}
          </Button>
          <Button onClick={onSave}>
            <Save className="mr-2 h-4 w-4" />
            Save Quiz
          </Button>
        </div>
      </div>

      {/* Meta */}
      <ComponentCard title="Quiz Details" desc="Basic information visible to students.">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1">
            <span className="text-sm text-gray-600 dark:text-gray-300">Title</span>
            <input
              value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm text-gray-600 dark:text-gray-300">Subject</span>
            <input
              value={draft.subject}
              onChange={(e) => setDraft({ ...draft, subject: e.target.value })}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm text-gray-600 dark:text-gray-300">Grade</span>
            <input
              value={draft.grade}
              onChange={(e) => setDraft({ ...draft, grade: e.target.value })}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm text-gray-600 dark:text-gray-300">Section</span>
            <input
              value={draft.section}
              onChange={(e) => setDraft({ ...draft, section: e.target.value })}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm text-gray-600 dark:text-gray-300">Teacher</span>
            <input
              value={draft.teacher}
              onChange={(e) => setDraft({ ...draft, teacher: e.target.value })}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm text-gray-600 dark:text-gray-300">Time Limit</span>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-400" />
              <input
                type="number"
                min={0}
                value={draft.timeLimitMin}
                onChange={(e) =>
                  setDraft({ ...draft, timeLimitMin: Math.max(0, parseInt(e.target.value || "0", 10)) })
                }
                className="w-24 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200"
              />
              <span className="text-sm text-gray-600 dark:text-gray-300">minutes</span>
            </div>
          </label>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Badge variant="light" color="primary">Items: {draft.questions.length}</Badge>
          <Badge variant="light" color="success">Total Points: {totalPoints}</Badge>
        </div>
      </ComponentCard>

      {/* Items */}
      <ComponentCard
        title="Questions"
        desc="Create items and set the correct answers where applicable."
        action={
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => addQuestion("mcq")}>
              <Plus className="mr-1 h-4 w-4" /> MCQ
            </Button>
            <Button variant="outline" onClick={() => addQuestion("tf")}>
              <Plus className="mr-1 h-4 w-4" /> True/False
            </Button>
            <Button variant="outline" onClick={() => addQuestion("short")}>
              <Plus className="mr-1 h-4 w-4" /> Short Answer
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          {draft.questions.map((q, i) => (
            <QuestionEditor
              key={q.id}
              q={q}
              idx={i}
              onChange={(next) => updateQ(i, next)}
              onDelete={() => delQ(i)}
              onDuplicate={() => dupQ(i)}
              onMoveUp={() => moveQ(i, -1)}
              onMoveDown={() => moveQ(i, 1)}
            />
          ))}

          {draft.questions.length === 0 && (
            <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
              No items yet. Use the buttons above to add your first question.
            </div>
          )}
        </div>
      </ComponentCard>

      {/* Preview */}
      {preview && (
        <ComponentCard title="Preview (Student View)" desc="What learners will see.">
          <div className="space-y-5">
            <div>
              <div className="text-base font-semibold text-gray-900 dark:text-white/90">{draft.title}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {draft.subject} • {draft.grade} — {draft.section} • Teacher: {draft.teacher} •{" "}
                {draft.timeLimitMin} min
              </div>
            </div>

            <ol className="space-y-4">
              {draft.questions.map((q, i) => (
                <li key={q.id} className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
                  <div className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    Item {i + 1} • {q.points} pt{q.points === 1 ? "" : "s"} •{" "}
                    {q.type === "mcq" ? "Multiple Choice" : q.type === "tf" ? "True/False" : "Short Answer"}
                  </div>
                  <div className="mb-3 font-medium text-gray-900 dark:text-white/90">{q.prompt}</div>
                  {q.type === "mcq" && (
                    <ul className="list-disc pl-6 text-sm text-gray-700 dark:text-gray-300">
                      {(q as McqQ).choices.map((c, cidx) => (
                        <li key={cidx}>{c}</li>
                      ))}
                    </ul>
                  )}
                  {q.type === "tf" && (
                    <div className="text-sm text-gray-700 dark:text-gray-300">True or False</div>
                  )}
                  {q.type === "short" && (
                    <div className="text-sm text-gray-700 dark:text-gray-300">Short response</div>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </ComponentCard>
      )}
    </div>
  );
}