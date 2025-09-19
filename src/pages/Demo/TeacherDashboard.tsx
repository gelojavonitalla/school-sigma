// src/pages/Teacher/TeacherDashboard.tsx
import { ReactElement, useMemo, useState } from "react";
import ComponentCard from "../../components/common/ComponentCard";
import Button from "../../components/ui/button/Button";
import Badge from "../../components/ui/badge/Badge";
import SafeLink from "../../components/links/SafeLink";
import {
  CalendarClock,
  ClipboardCheck,
  Users,
  BookOpen,
  Megaphone,
  MessageSquare,
  GraduationCap,
  FileText,
  CheckSquare,
} from "lucide-react";

/* -----------------------------
   Mock data
------------------------------ */
type ScheduleItem = {
  id: string;
  start: string; // "07:40 AM"
  end: string;   // "08:30 AM"
  subject: string;
  grade: string; // "Grade 5"
  section: string; // "Galatians"
  room: string;
  status: "pending" | "done";
};

type Task = {
  id: string;
  icon: "attendance" | "grade" | "post";
  title: string;
  note?: string;
  due?: string;
  url?: string;
};

type MessageItem = {
  id: string;
  from: string;
  snippet: string;
  when: string; // "2h ago"
};

const TODAY_SCHEDULE: ScheduleItem[] = [
  { id: "1", start: "07:40 AM", end: "08:30 AM", subject: "Math 5", grade: "Grade 5", section: "Galatians", room: "Rm 203", status: "pending" },
  { id: "2", start: "08:40 AM", end: "09:30 AM", subject: "Science 5", grade: "Grade 5", section: "Galatians", room: "Lab B", status: "pending" },
  { id: "3", start: "10:00 AM", end: "10:50 AM", subject: "Adviser Period", grade: "Grade 5", section: "Galatians", room: "Rm 203", status: "done" },
  { id: "4", start: "01:10 PM", end: "02:00 PM", subject: "Math 3", grade: "Grade 3", section: "Romans", room: "Rm 105", status: "pending" },
];

const OPEN_TASKS: Task[] = [
  { id: "t1", icon: "attendance", title: "Take attendance: Math 5 (7:40 AM)", due: "Due today • 7:40 AM", url: "/demo/teachers/attendance" },
  { id: "t2", icon: "grade", title: "Grade: Quiz 2 – Fractions (G5)", note: "14 submissions", url: "/demo/teachers/record" },
  { id: "t3", icon: "post", title: "Post announcement to parents", note: "Field trip consent form", url: "/demo/teacher/announcements" },
];

const MESSAGES: MessageItem[] = [
  { id: "m1", from: "Mr. Dela Cruz (River’s dad)", snippet: "Good morning, teacher! Will the quiz cover…", when: "2h ago" },
  { id: "m2", from: "Ms. Garcia (Lake’s mom)", snippet: "Lake was absent yesterday due to…", when: "5h ago" },
  { id: "m3", from: "Registrar", snippet: "Reminder: submit advisory attendance by 4PM.", when: "1d ago" },
];

/* -----------------------------
   Helpers
------------------------------ */
function StatCard({
  icon,
  label,
  value,
}: {
  icon: ReactElement;
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300">
        {icon}
      </div>
      <div>
        <div className="text-sm text-gray-500 dark:text-gray-400">{label}</div>
        <div className="text-xl font-semibold text-gray-900 dark:text-white/90">{value}</div>
      </div>
    </div>
  );
}

/* -----------------------------
   Screen
------------------------------ */
export default function TeacherDashboard() {
  const [tab, setTab] = useState<"today" | "week">("today");

  const kpis = useMemo(
    () => ({
      advisoryCount: 27,            // Students in advisory
      classesToday: TODAY_SCHEDULE.length,
      attendancePending: TODAY_SCHEDULE.filter((c) => c.status === "pending").length,
      toGrade: 14,
    }),
    []
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white/90">Teacher Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Hello, Teacher! Here’s your day at a glance.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2">
          <SafeLink to="/demo/teachers/attendance">
            <Button className="inline-flex items-center gap-2">
              <ClipboardCheck className="h-4 w-4" /> Take Attendance
            </Button>
          </SafeLink>

          <SafeLink to="/demo/teachers/record">
            <Button variant="outline" className="inline-flex items-center gap-2">
              <BookOpen className="h-4 w-4" /> Record Grades
            </Button>
          </SafeLink>

          <SafeLink to="/demo/teacher/announcements">
            <Button variant="outline" className="inline-flex items-center gap-2">
              <Megaphone className="h-4 w-4" /> Post Announcement
            </Button>
          </SafeLink>

          <SafeLink to="/demo/chat">
            <Button variant="outline" className="inline-flex items-center gap-2">
              <MessageSquare className="h-4 w-4" /> Messages
            </Button>
          </SafeLink>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={<Users className="h-5 w-5" />} label="Advisory Students" value={kpis.advisoryCount} />
        <StatCard icon={<CalendarClock className="h-5 w-5" />} label="Classes Today" value={kpis.classesToday} />
        <StatCard icon={<ClipboardCheck className="h-5 w-5" />} label="Attendance Pending" value={kpis.attendancePending} />
        <StatCard icon={<FileText className="h-5 w-5" />} label="To Grade" value={kpis.toGrade} />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left: Schedule + Tasks */}
        <div className="lg:col-span-2 space-y-6">
          <ComponentCard
            title="Schedule"
            desc="Your schedule for today. Tap a class to jump to attendance."
            action={
              <div className="flex items-center gap-1 rounded-lg bg-gray-100 p-0.5 dark:bg-gray-900">
                <button
                  onClick={() => setTab("today")}
                  className={`rounded-md px-3 py-1.5 text-sm font-medium ${tab === "today"
                    ? "bg-white text-gray-900 shadow-theme-xs dark:bg-gray-800 dark:text-white"
                    : "text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                    }`}
                >
                  Today
                </button>
                <button
                  onClick={() => setTab("week")}
                  className={`rounded-md px-3 py-1.5 text-sm font-medium ${tab === "week"
                    ? "bg-white text-gray-900 shadow-theme-xs dark:bg-gray-800 dark:text-white"
                    : "text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                    }`}
                >
                  This Week
                </button>
              </div>
            }
          >
            <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-gray-800">
              <table className="min-w-full text-left">
                <thead className="bg-gray-50 text-gray-600 dark:bg-gray-900 dark:text-gray-400">
                  <tr className="text-sm">
                    <th className="px-5 py-3 font-medium">Time</th>
                    <th className="px-5 py-3 font-medium">Subject</th>
                    <th className="px-5 py-3 font-medium">Grade / Section</th>
                    <th className="px-5 py-3 font-medium">Room</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 text-right font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm dark:divide-gray-800">
                  {TODAY_SCHEDULE.map((row) => (
                    <tr key={row.id} className="text-gray-700 dark:text-gray-300">
                      <td className="px-5 py-3">{row.start} — {row.end}</td>
                      <td className="px-5 py-3 font-medium text-gray-900 dark:text-white/90">{row.subject}</td>
                      <td className="px-5 py-3">
                        {row.grade} — {row.section}
                      </td>
                      <td className="px-5 py-3">{row.room}</td>
                      <td className="px-5 py-3">
                        {row.status === "done" ? (
                          <Badge color="success">Done</Badge>
                        ) : (
                          <Badge color="warning">Pending</Badge>
                        )}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <SafeLink to={`/demo/teachers/attendance?class=${row.id}`}>
                          <Button size="sm" variant="outline" className="inline-flex items-center">
                            <ClipboardCheck className="mr-2 h-4 w-4" />
                            {row.status === "pending" ? "Take Attendance" : "View"}
                          </Button>
                        </SafeLink>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ComponentCard>

          <ComponentCard title="Your Tasks" desc="What needs your attention next.">
            <ul className="divide-y divide-gray-100 dark:divide-gray-800">
              {OPEN_TASKS.map((t) => (
                <li key={t.id} className="flex items-start justify-between gap-3 px-2 py-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300">
                      {t.icon === "attendance" && <ClipboardCheck className="h-4 w-4" />}
                      {t.icon === "grade" && <CheckSquare className="h-4 w-4" />}
                      {t.icon === "post" && <Megaphone className="h-4 w-4" />}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white/90">{t.title}</div>
                      {t.note && <div className="text-sm text-gray-500 dark:text-gray-400">{t.note}</div>}
                      {t.due && <div className="text-xs text-gray-400 dark:text-gray-500">{t.due}</div>}
                    </div>
                  </div>
                  <div className="shrink-0">
                    <Button size="sm" variant="outline">
                      <SafeLink to={t.url || "#"}>Open</SafeLink>
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </ComponentCard>
        </div>

        {/* Right: Adviser panel + Messages */}
        <div className="space-y-6">
          <ComponentCard
            title="Adviser — Grade 5 • Galatians"
            desc="Your advisory class quick view."
            action={
              <SafeLink to="/demo/chat">
                <Button size="sm" variant="outline" className="inline-flex items-center">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Message Class
                </Button>
              </SafeLink>
            }
          >
            <div className="flex items-center gap-4 rounded-xl border border-gray-100 p-4 dark:border-gray-800">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-500 dark:text-gray-400">Adviser</div>
                <div className="text-base font-semibold text-gray-900 dark:text-white/90">You</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500 dark:text-gray-400">Students</div>
                <div className="text-base font-semibold text-gray-900 dark:text-white/90">27</div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <SafeLink to="/demo/teachers/attendance?advisory=true">
                <Button variant="outline" className="w-full inline-flex items-center justify-center">
                  <ClipboardCheck className="mr-2 h-4 w-4" /> Attendance
                </Button>
              </SafeLink>

              <SafeLink to="/demo/teachers/record?class=galatians">
                <Button variant="outline" className="w-full inline-flex items-center justify-center">
                  <BookOpen className="mr-2 h-4 w-4" /> Grades
                </Button>
              </SafeLink>
            </div>

          </ComponentCard>

          <ComponentCard title="Recent Messages" desc="Parents & staff">
            <ul className="divide-y divide-gray-100 dark:divide-gray-800">
              {MESSAGES.map((m) => (
                <li key={m.id} className="flex items-start justify-between gap-3 px-2 py-3">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white/90">{m.from}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{m.snippet}</div>
                  </div>
                  <div className="shrink-0 text-xs text-gray-400 dark:text-gray-500">{m.when}</div>
                </li>
              ))}
            </ul>
            <div className="shrink-0">
              <SafeLink to='/demo/chat'>
                <Button size="sm" variant="outline">Open</Button>
              </SafeLink>
            </div>
          </ComponentCard>
        </div>
      </div>
    </div>
  );
}