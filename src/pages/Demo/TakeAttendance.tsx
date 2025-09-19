import { useEffect, useMemo, useState } from "react";
import ComponentCard from "../../components/common/ComponentCard";
import Button from "../../components/ui/button/Button";
import Badge from "../../components/ui/badge/Badge";
import {
    Users,
    CalendarDays,
    Clock,
    CheckCircle2,
    XCircle,
    AlertCircle,
    StickyNote,
    Download,
    Eraser,
    PencilLine
} from "lucide-react";

/* ----------------------------- Types ----------------------------- */
type AttendanceStatus = "present" | "late" | "absent" | "excused";

type Section = {
    id: string;
    name: string;
    period: string;
    room?: string;
};

type Student = {
    id: string;
    name: string;
    avatar: string;
    sectionId: string;
};

type AttendanceState = Record<
    string,
    { status: AttendanceStatus; note?: string }
>;

/* --------------------------- Mock data --------------------------- */
const SECTIONS: Section[] = [
    { id: "g5-galatians", name: "Grade 5 — Galatians", period: "8:00–9:00 AM", room: "Rm 305" },
    { id: "g3-romans", name: "Grade 3 — Romans", period: "9:20–10:20 AM", room: "Rm 204" },
];

const STUDENTS: Student[] = [
    { id: "s-river", name: "River Javonitalla", avatar: "/images/user/user-02.jpg", sectionId: "g5-galatians" },
    { id: "s-fjord", name: "Fjord Javonitalla", avatar: "/images/user/user-04.jpg", sectionId: "g5-galatians" },
    { id: "s-lia", name: "Lia Santos", avatar: "/images/user/user-05.jpg", sectionId: "g5-galatians" },
    { id: "s-ken", name: "Ken Dela Cruz", avatar: "/images/user/user-06.jpg", sectionId: "g5-galatians" },
    { id: "s-lake", name: "Lake Javonitalla", avatar: "/images/user/user-03.jpg", sectionId: "g3-romans" },
];

/* --------------------------- Utilities --------------------------- */
const todayISO = () => new Date().toISOString().slice(0, 10);
const storageKey = (sectionId: string, dateISO: string) =>
    `attendance:${sectionId}:${dateISO}`;

/* -------------------------- Main screen -------------------------- */
export default function TakeAttendance() {
    const [sectionId, setSectionId] = useState<string>(SECTIONS[0].id);
    const [dateISO, setDateISO] = useState<string>(todayISO());
    const [q, setQ] = useState("");
    const [state, setState] = useState<AttendanceState>({});
    const [savedAt, setSavedAt] = useState<string | null>(null);

    const section = useMemo(
        () => SECTIONS.find((s) => s.id === sectionId)!,
        [sectionId]
    );

    const roster = useMemo(
        () =>
            STUDENTS.filter((s) => s.sectionId === sectionId).sort((a, b) =>
                a.name.localeCompare(b.name)
            ),
        [sectionId]
    );

    // load draft from localStorage
    useEffect(() => {
        const raw = localStorage.getItem(storageKey(sectionId, dateISO));
        if (raw) {
            try {
                const parsed = JSON.parse(raw) as { state: AttendanceState; savedAt: string };
                setState(parsed.state);
                setSavedAt(parsed.savedAt);
                return;
            } catch { }
        }
        // else clear for new date/section
        setState({});
        setSavedAt(null);
    }, [sectionId, dateISO]);

    // derived
    const filteredRoster = useMemo(() => {
        const query = q.trim().toLowerCase();
        return roster.filter((s) => !query || s.name.toLowerCase().includes(query));
    }, [roster, q]);

    const counts = useMemo(() => {
        const init = { present: 0, late: 0, absent: 0, excused: 0 };
        roster.forEach((s) => {
            const st = state[s.id]?.status;
            if (st) (init as any)[st] += 1;
        });
        return init;
    }, [roster, state]);

    /* ----------------------------- Actions ----------------------------- */
    const setStatus = (sid: string, status: AttendanceStatus) =>
        setState((prev) => ({ ...prev, [sid]: { ...prev[sid], status } }));

    const setNote = (sid: string, note: string) =>
        setState((prev) => ({ ...prev, [sid]: { ...prev[sid], note } }));

    const markAll = (status: AttendanceStatus) => {
        const next: AttendanceState = {};
        roster.forEach((s) => (next[s.id] = { ...(state[s.id] || {}), status }));
        setState(next);
    };

    const clearAll = () => setState({});

    const saveDraft = () => {
        const when = new Date().toLocaleString();
        localStorage.setItem(
            storageKey(sectionId, dateISO),
            JSON.stringify({ state, savedAt: when })
        );
        setSavedAt(when);
    };

    const submitAttendance = () => {
        // In real app: POST to API here
        saveDraft();
        alert(
            `Attendance submitted for ${section.name} (${dateISO})\nPresent: ${counts.present} • Late: ${counts.late} • Absent: ${counts.absent} • Excused: ${counts.excused}`
        );
    };

    const exportCSV = () => {
        const headers = ["Student", "Status", "Note"].join(",");
        const rows = roster.map((s) => {
            const st = state[s.id]?.status ?? "";
            const note = (state[s.id]?.note ?? "").replace(/,/g, " ");
            return [s.name, st, note].join(",");
        });
        const blob = new Blob([headers + "\n" + rows.join("\n")], {
            type: "text/csv;charset=utf-8;",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `attendance_${sectionId}_${dateISO}.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    };

    /* ------------------------------ UI ------------------------------ */
    return (
        <div className="space-y-6">
            {/* Header / filters */}
            <ComponentCard title="Take Attendance" desc="Mark attendance quickly and save or submit.">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {/* Section */}
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Class Section
                        </label>
                        <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-gray-400" />
                            <select
                                value={sectionId}
                                onChange={(e) => setSectionId(e.target.value)}
                                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-gray-300 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200"
                            >
                                {SECTIONS.map((s) => (
                                    <option key={s.id} value={s.id}>
                                        {s.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
                            <Clock className="h-3.5 w-3.5" />
                            {section.period} • {section.room}
                        </p>
                    </div>

                    {/* Date */}
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Date
                        </label>
                        <div className="flex items-center gap-2">
                            <CalendarDays className="h-4 w-4 text-gray-400" />
                            <input
                                type="date"
                                value={dateISO}
                                onChange={(e) => setDateISO(e.target.value)}
                                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-gray-300 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200"
                            />
                        </div>
                    </div>

                    {/* Search */}
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Search student
                        </label>
                        <input
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            placeholder="Type a name…"
                            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-gray-300 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200"
                        />
                    </div>
                </div>

                {/* Quick actions */}
                <div className="mt-4 flex flex-wrap items-center gap-2">
                    <Button size="sm" onClick={() => markAll("present")} className="inline-flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4" /> Mark all Present
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => markAll("late")} className="inline-flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" /> Mark all Late
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => markAll("absent")} className="inline-flex items-center gap-2">
                        <XCircle className="h-4 w-4" /> Mark all Absent
                    </Button>
                    <Button size="sm" variant="outline" onClick={clearAll} className="inline-flex items-center gap-2">
                        <Eraser className="h-4 w-4" /> Clear
                    </Button>

                    <div className="ml-auto flex items-center gap-2">
                        {savedAt && (
                            <Badge color="light" variant="light">Last saved: {savedAt}</Badge>
                        )}
                        <Button size="sm" variant="outline" onClick={exportCSV} className="inline-flex items-center gap-2">
                            <Download className="h-4 w-4" /> Export CSV
                        </Button>
                        <Button size="sm" variant="outline" onClick={saveDraft}>
                            Save Draft
                        </Button>
                        <Button size="sm" onClick={submitAttendance}>
                            Submit Attendance
                        </Button>
                    </div>
                </div>
            </ComponentCard>

            {/* Summary chips */}
            <div className="flex flex-wrap items-center gap-2">
                <Badge color="success" variant="light">Present: {counts.present}</Badge>
                <Badge color="warning" variant="light">Late: {counts.late}</Badge>
                <Badge color="error" variant="light">Absent: {counts.absent}</Badge>
                <Badge color="info" variant="light">Excused: {counts.excused}</Badge>
                <Badge color="light" variant="light">Total: {roster.length}</Badge>
            </div>

            {/* Roster table */}
            <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
                <table className="min-w-full text-left">
                    <thead className="bg-gray-50 text-gray-600 dark:bg-gray-900 dark:text-gray-400">
                        <tr className="text-sm">
                            <th className="px-5 py-3 font-medium">Student</th>
                            <th className="px-5 py-3 font-medium">Status</th>
                            <th className="px-5 py-3 font-medium">Note (optional)</th>
                            <th className="px-5 py-3 font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm dark:divide-gray-800">
                        {filteredRoster.map((s) => {
                            const current = state[s.id]?.status;
                            return (
                                <tr key={s.id} className="text-gray-700 dark:text-gray-300">
                                    <td className="px-5 py-3">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={s.avatar}
                                                alt={s.name}
                                                className="h-10 w-10 rounded-full object-cover"
                                            />
                                            <div className="min-w-0">
                                                <div className="font-medium text-gray-800 dark:text-white/90">{s.name}</div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">{section.name}</div>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Segmented control */}
                                    <td className="px-5 py-3">
                                        <div className="inline-flex items-center gap-0.5 rounded-lg bg-gray-100 p-0.5 dark:bg-gray-900">
                                            {(["present", "late", "absent", "excused"] as AttendanceStatus[]).map((st) => (
                                                <button
                                                    key={st}
                                                    onClick={() => setStatus(s.id, st)}
                                                    className={`px-3 py-1.5 rounded-md text-sm font-medium ${current === st
                                                            ? "shadow-theme-xs bg-white text-gray-900 dark:bg-gray-800 dark:text-white"
                                                            : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                                                        }`}
                                                >
                                                    {st[0].toUpperCase() + st.slice(1)}
                                                </button>
                                            ))}
                                        </div>
                                    </td>

                                    {/* Note */}
                                    <td className="px-5 py-3">
                                        <div className="flex items-center gap-2">
                                            <StickyNote className="h-4 w-4 text-gray-400" />
                                            <input
                                                value={state[s.id]?.note ?? ""}
                                                onChange={(e) => setNote(s.id, e.target.value)}
                                                placeholder={
                                                    current && current !== "present" ? "Reason / note…" : "Optional note…"
                                                }
                                                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-gray-300 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200"
                                            />
                                        </div>
                                    </td>

                                    {/* Quick buttons */}
                                    <td className="px-5 py-3">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => setStatus(s.id, "present")}
                                                className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-sm hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200"
                                                title="Mark Present"
                                            >
                                                <CheckCircle2 className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => setStatus(s.id, "late")}
                                                className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-sm hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200"
                                                title="Mark Late"
                                            >
                                                <AlertCircle className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => setStatus(s.id, "absent")}
                                                className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-sm hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200"
                                                title="Mark Absent"
                                            >
                                                <XCircle className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => setStatus(s.id, "excused")}
                                                className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-sm hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200"
                                                title="Mark Excused"
                                            >
                                                <PencilLine className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}

                        {filteredRoster.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-5 py-10 text-center text-gray-500 dark:text-gray-400">
                                    No students match your search.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}