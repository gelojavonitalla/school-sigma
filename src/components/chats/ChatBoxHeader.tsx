// src/components/chats/ChatBoxHeader.tsx
import { useMemo, useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "../../icons";
import { SEED_THREADS, SEED_USER_DIRECTORY } from "../../seeds/chats";

type Props = {
  activeThreadId?: string | null;
  /** For demo we default to the teacher */
  currentUserId?: string; // e.g. "t1"
};

export default function ChatBoxHeader({ activeThreadId, currentUserId = "t1" }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleDropdown = () => setIsOpen((v) => !v);
  const closeDropdown = () => setIsOpen(false);

  const meta = useMemo(() => {
    // Defaults when no thread selected yet
    let title = "Chats";
    let subtitle = "";
    let avatarUrl: string | undefined;
    let presence: "online" | "offline" | undefined;

    if (activeThreadId) {
      const thread = SEED_THREADS.find((t) => t.id === activeThreadId);
      if (thread) {
        if (thread.kind === "dm") {
          const otherId =
            thread.participantIds.find((id) => id !== currentUserId) ??
            thread.participantIds[0];
          const u = otherId ? SEED_USER_DIRECTORY[otherId] : undefined;
          title = u?.displayName ?? "Direct Message";
          subtitle = u?.subtitle ?? "";
          avatarUrl = u?.avatarUrl;
          presence = u?.presence ?? "offline";
        } else {
          // group chat
          title = thread.title ?? "Group";
          subtitle = "Group chat";
          const firstOther =
            thread.participantIds.find((id) => id !== currentUserId) ??
            thread.participantIds[0];
          avatarUrl = SEED_USER_DIRECTORY[firstOther!]?.avatarUrl;
          presence = "online"; // simple default for groups
        }
      }
    }
    return { title, subtitle, avatarUrl, presence };
  }, [activeThreadId, currentUserId]);

  const presenceDot =
    meta.presence === "online"
      ? "bg-success-500"
      : "bg-gray-400 dark:bg-gray-600";

  return (
    <div className="sticky flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-800 xl:px-6">
      <div className="flex items-center gap-3">
        <div className="relative h-12 w-12 overflow-hidden rounded-full">
          {meta.avatarUrl ? (
            <img
              src={meta.avatarUrl} // seeds use absolute /images/... paths
              alt={meta.title}
              className="object-cover object-center w-full h-full"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 dark:bg-gray-800" />
          )}
          <span className={`absolute bottom-0 right-0 block h-3 w-3 rounded-full border-[1.5px] border-white dark:border-gray-900 ${presenceDot}`}></span>
        </div>

        <div>
          <h5 className="text-sm font-medium text-gray-800 dark:text-white/90">
            {meta.title}
          </h5>
          {meta.subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {meta.subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative -mb-1.5">
          <div className="relative inline-block">
            <button onClick={toggleDropdown}>
              <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-6" />
            </button>
            <Dropdown isOpen={isOpen} onClose={closeDropdown} className="w-40 p-2">
              <DropdownItem
                onItemClick={closeDropdown}
                className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
              >
                View More
              </DropdownItem>
              <DropdownItem
                onItemClick={closeDropdown}
                className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
              >
                Delete
              </DropdownItem>
            </Dropdown>
          </div>
        </div>
      </div>
    </div>
  );
}