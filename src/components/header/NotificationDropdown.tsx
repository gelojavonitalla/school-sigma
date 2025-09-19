import { ReactElement, useEffect, useMemo, useRef, useState } from "react";
import {
  Bell,
  Pencil,
  Dumbbell,
  ClipboardList,
  ShieldCheck,
  Church,
  Volleyball,
} from "lucide-react";
import Badge from "../../components/ui/badge/Badge";

type Kid = "River" | "Lake";

type FeedItem = {
  kid: Kid;
  icon: ReactElement;
  text: string; // sentence without the "River's"/"Lake's" prefix
  date: Date;
};

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const toggleDropdown = () => setIsOpen((s) => !s);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  // ----- Mixed feed data (across both kids) -----
  const notifications: FeedItem[] = [
    {
      kid: "River",
      icon: <Pencil size={18} />,
      text: "Math teacher reported incomplete homework today.",
      date: new Date("2025-10-01T08:20:00"),
    },
    {
      kid: "River",
      icon: <ClipboardList size={18} />,
      text: "Homeroom adviser requested a signed field trip form.",
      date: new Date("2025-09-30T16:20:00"),
    },
    {
      kid: "Lake",
      icon: <Pencil size={18} />,
      text: "Science quiz was turned in late.",
      date: new Date("2025-09-30T11:40:00"),
    },
    {
      kid: "Lake",
      icon: <Dumbbell size={18} />,
      text: "PE uniform was not brought today.",
      date: new Date("2025-09-30T07:55:00"),
    },
  ];

  const reminders: FeedItem[] = [
    {
      kid: "River",
      icon: <Church size={18} />,
      text: "Chapel Day today — bring Chapel uniform.",
      date: new Date("2025-10-01T06:30:00"),
    },
    {
      kid: "River",
      icon: <ShieldCheck size={18} />,
      text: "Fencing today — don’t forget the gear.",
      date: new Date("2025-10-01T06:35:00"),
    },
    {
      kid: "Lake",
      icon: <Church size={18} />,
      text: "Chapel Day today — bring Chapel uniform.",
      date: new Date("2025-10-01T06:30:00"),
    },
    {
      kid: "Lake",
      icon: <Volleyball size={18} />,
      text: "Futsal today — bring futsal shoes.",
      date: new Date("2025-10-01T06:40:00"),
    },
  ];

  const sortByDateDesc = (a: FeedItem, b: FeedItem) => b.date.getTime() - a.date.getTime();

  const notificationsSorted = useMemo(
    () => [...notifications].sort(sortByDateDesc),
    [notifications]
  );
  const remindersSorted = useMemo(
    () => [...reminders].sort(sortByDateDesc),
    [reminders]
  );

  // Bell ping if anything <24h
  const hasNew = useMemo(() => {
    const now = Date.now();
    const isRecent = (d: Date) => now - d.getTime() < 24 * 60 * 60 * 1000;
    return [...notifications, ...reminders].some((i) => isRecent(i.date));
  }, []);

  // Relative time for the chip on row 3
  const rel = (d: Date) => {
    const now = Date.now();
    const diffMs = now - d.getTime();
    const s = Math.floor(diffMs / 1000);
    const m = Math.floor(s / 60);
    const h = Math.floor(m / 60);
    const days = Math.floor(h / 24);

    if (s < 60) return "Just now";
    if (m < 60) return `${m}m ago`;
    if (h < 24) return `${h}h ago`;

    const isYesterday = days === 1;
    if (isYesterday) return "Yesterday";

    // Fallback short date
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger */}
      <button
        onClick={toggleDropdown}
        className="relative flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
        aria-label="Open notifications"
      >
        {hasNew && (
          <span className="absolute right-0 top-0.5 z-10 h-2 w-2 rounded-full bg-orange-400">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75" />
          </span>
        )}
        <Bell className="h-5 w-5" />
      </button>

      {/* Popover */}
      {isOpen && (
        <div className="absolute right-0 z-50 mt-[14px] w-[360px] rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-900">
          {/* Header */}
          <div className="mb-3 flex items-center justify-between">
            <h5 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Notifications
            </h5>
            <button
              onClick={toggleDropdown}
              className="rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-200"
              aria-label="Close"
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Section: Notifications */}
          <div className="mb-1 border-b border-gray-100 pb-1 text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:border-gray-800 dark:text-gray-400">
            Notifications
          </div>
          <ul className="mb-3 space-y-2">
            {notificationsSorted.map((n, idx) => (
              <li key={`n-${idx}`} className="rounded-lg px-2 py-2 hover:bg-gray-50 dark:hover:bg-white/5">
                <div className="flex gap-3">
                  {/* Icon */}
                  <span className="mt-0.5 text-gray-600 dark:text-gray-300">{n.icon}</span>

                  {/* Content block */}
                  <div className="flex-1">
                    {/* Row 1–2: main text */}
                    <p className="text-sm leading-5 text-gray-800 dark:text-gray-100">
                      <span className="font-medium">{n.kid}’s</span> {n.text}
                    </p>

                    {/* Row 3: time chip (left-aligned) */}
                    <div className="mt-1">
                      <Badge color="info" size="sm">{rel(n.date)}</Badge>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {/* Section: Reminders */}
          <div className="mb-1 border-b border-gray-100 pb-1 text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:border-gray-800 dark:text-gray-400">
            Reminders
          </div>
          <ul className="space-y-2">
            {remindersSorted.map((r, idx) => (
              <li key={`r-${idx}`} className="rounded-lg px-2 py-2 hover:bg-gray-50 dark:hover:bg:white/5 dark:hover:bg-white/5">
                <div className="flex gap-3">
                  {/* Icon */}
                  <span className="mt-0.5 text-gray-600 dark:text-gray-300">{r.icon}</span>

                  {/* Content block */}
                  <div className="flex-1">
                    {/* Row 1–2: main text */}
                    <p className="text-sm leading-5 text-gray-800 dark:text-gray-100">
                      <span className="font-medium">{r.kid}’s</span> {r.text}
                    </p>

                    {/* Row 3: time chip */}
                    <div className="mt-1">
                      <Badge color="info" size="sm">{rel(r.date)}</Badge>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {/* Footer */}
          <div className="mt-3">
            <a
              href="#"
              className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              View All
            </a>
          </div>
        </div>
      )}
    </div>
  );
}