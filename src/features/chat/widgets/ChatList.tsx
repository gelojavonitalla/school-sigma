import { useMemo, useState } from "react";
import { Dropdown } from "../../../components/ui/dropdown/Dropdown";
import { DropdownItem } from "../../../components/ui/dropdown/DropdownItem";
import { MoreDotIcon } from "../../../icons";

// 🔽 import seeds
import {
  SEED_THREADS,
  SEED_MESSAGES,
  SEED_USER_DIRECTORY,
} from "../../../seeds/chats";

interface ChatListProps {
  isOpen: boolean;
  onToggle: () => void;
}

const CURRENT_USER_ID = "t1";

// tiny helper
function timeAgo(iso: string) {
  const then = new Date(iso).getTime();
  const mins = Math.floor((Date.now() - then) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} mins`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} h`;
  const days = Math.floor(hrs / 24);
  return days === 1 ? "1 day" : `${days} days`;
}

export default function ChatList({ isOpen, onToggle }: ChatListProps) {
  const [isOpenTwo, setIsOpenTwo] = useState(false);

  function toggleDropdownTwo() {
    setIsOpenTwo(!isOpenTwo);
  }
  function closeDropdownTwo() {
    setIsOpenTwo(false);
  }

  // Build a list of visible threads for CURRENT_USER_ID
  const items = useMemo(() => {
    const myThreads = SEED_THREADS
      .filter((t) => t.participantIds.includes(CURRENT_USER_ID))
      .sort((a, b) => b.lastMessageAt.localeCompare(a.lastMessageAt));

    return myThreads.map((t) => {
      const lastMsg = SEED_MESSAGES
        .filter((m) => m.threadId === t.id)
        .sort((a, b) => a.sentAt.localeCompare(b.sentAt))
        .at(-1);

      if (t.kind === "dm") {
        const otherId =
          t.participantIds.find((id) => id !== CURRENT_USER_ID) ??
          t.participantIds[0];
        const u = SEED_USER_DIRECTORY[otherId];
        return {
          threadId: t.id,
          name: u?.displayName ?? "Unknown",
          subtitle: u?.subtitle ?? "",
          avatarUrl: u?.avatarUrl ?? "/images/user/user-01.jpg",
          presence: u?.presence ?? "offline",
          lastWhen: lastMsg ? timeAgo(lastMsg.sentAt) : "—",
        };
      } else {
        // group
        const firstOther =
          t.participantIds.find((id) => id !== CURRENT_USER_ID) ??
          t.participantIds[0];
        const u0 = SEED_USER_DIRECTORY[firstOther];
        return {
          threadId: t.id,
          name: t.title || "Group",
          subtitle: "Group chat",
          avatarUrl: u0?.avatarUrl ?? "/images/user/user-01.jpg",
          presence: "online",
          lastWhen: lastMsg ? timeAgo(lastMsg.sentAt) : "—",
        };
      }
    });
  }, []);

  const openThread = (threadId: string) => {
    const url = new URL(window.location.href);
    url.pathname = "/chat";
    url.searchParams.set("thread", threadId);
    window.history.pushState({}, "", url.toString());
    // notify listeners (ChatBox listens for this)
    window.dispatchEvent(new Event("locationchange"));
    if (isOpen) onToggle();
  };

  return (
    <div
      className={`flex-col overflow-auto no-scrollbar transition-all duration-300 ${
        isOpen
          ? "fixed top-0 left-0 z-999999 h-screen bg-white dark:bg-gray-900"
          : "hidden xl:flex"
      }`}
    >
      <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-800 xl:hidden">
        <div>
          <h3 className="font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl">
            Chat
          </h3>
        </div>
        <div className="flex items-center gap-1">
          <div className="relative inline-block">
            <button onClick={toggleDropdownTwo}>
              <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-6" />
            </button>
            <Dropdown
              isOpen={isOpenTwo}
              onClose={closeDropdownTwo}
              className="w-40 p-2"
            >
              <DropdownItem
                onItemClick={closeDropdownTwo}
                className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
              >
                View More
              </DropdownItem>
              <DropdownItem
                onItemClick={closeDropdownTwo}
                className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
              >
                Delete
              </DropdownItem>
            </Dropdown>
          </div>
          <button
            onClick={onToggle}
            className="flex items-center justify-center w-10 h-10 text-gray-700 transition border border-gray-300 rounded-full dark:border-gray-700 dark:text-gray-400 dark:hover:text-white/90"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.21967 7.28131C5.92678 6.98841 5.92678 6.51354 6.21967 6.22065C6.51256 5.92775 6.98744 5.92775 7.28033 6.22065L11.999 10.9393L16.7176 6.22078C17.0105 5.92789 17.4854 5.92788 17.7782 6.22078C18.0711 6.51367 18.0711 6.98855 17.7782 7.28144L13.0597 12L17.7782 16.7186C18.0711 17.0115 18.0711 17.4863 17.7782 17.7792C17.4854 18.0721 17.0105 18.0721 16.7176 17.7792L11.999 13.0607L7.28033 17.7794C6.98744 18.0722 6.51256 18.0722 6.21967 17.7794C5.92678 17.4865 5.92678 17.0116 6.21967 16.7187L10.9384 12L6.21967 7.28131Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex flex-col max-h-full px-4 overflow-auto sm:px-5">
        <div className="max-h-full space-y-1 overflow-auto custom-scrollbar">
          {items.map((c) => (
            <button
              key={c.threadId}
              onClick={() => openThread(c.threadId)}
              className="flex w-full cursor-pointer items-center gap-3 rounded-lg p-3 text-left hover:bg-gray-100 dark:hover:bg-white/[0.03]"
            >
              <div className="relative h-12 w-full max-w-[48px] rounded-full">
                <img
                  src={c.avatarUrl}
                  alt="profile"
                  className="object-cover object-center w-full h-full overflow-hidden rounded-full"
                />
                <span
                  className={`absolute bottom-0 right-0 block h-3 w-3 rounded-full border-[1.5px] border-white dark:border-gray-900 ${
                    c.presence === "online" ? "bg-success-500" : "bg-error-500"
                  }`}
                />
              </div>
              <div className="w-full">
                <div className="flex items-start justify-between">
                  <div>
                    <h5 className="text-sm font-medium text-gray-800 dark:text-white/90">
                      {c.name}
                    </h5>
                    <p className="mt-0.5 text-theme-xs text-gray-500 dark:text-gray-400">
                      {c.subtitle}
                    </p>
                  </div>
                  <span className="text-gray-400 text-theme-xs">
                    {c.lastWhen}
                  </span>
                </div>
              </div>
            </button>
          ))}
          {/* End of list */}
        </div>
      </div>
    </div>
  );
}