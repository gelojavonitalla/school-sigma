// src/components/chats/ChatHeaderTitle.tsx
import { useState } from "react";
import { Dropdown } from "../../../components/ui/dropdown/Dropdown";
import { DropdownItem } from "../../../components/ui/dropdown/DropdownItem";
import { MoreDotIcon } from "../../../icons";
import { SEED_THREADS, SEED_USER_DIRECTORY } from "../../../seeds/chats";

type Props = {
  activeThreadId?: string | null;
};

// TODO: wire this to your auth/current user later.
// For the demo, we assume the signed-in teacher is "t1".
const CURRENT_USER_ID = "t1";

export default function ChatHeaderTitle({ activeThreadId }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleDropdown = () => setIsOpen((v) => !v);
  const closeDropdown = () => setIsOpen(false);

  // Defaults
  let title = "Chats";
  let subtitle = "";
  let avatarUrl: string | undefined;

  if (activeThreadId) {
    const thread = SEED_THREADS.find((t) => t.id === activeThreadId);

    if (thread) {
      if (thread.kind === "dm") {
        const otherId =
          thread.participantIds.find((id) => id !== CURRENT_USER_ID) ??
          thread.participantIds[0];
        const u = SEED_USER_DIRECTORY[otherId];
        title = u?.displayName ?? "Direct Message";
        subtitle = u?.subtitle ?? "";
        avatarUrl = u?.avatarUrl;
      } else {
        // group
        title = thread.title ?? "Group";
        subtitle = "Group chat";
        const firstOther =
          thread.participantIds.find((id) => id !== CURRENT_USER_ID) ??
          thread.participantIds[0];
        avatarUrl = SEED_USER_DIRECTORY[firstOther]?.avatarUrl;
      }
    }
  }

  return (
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-3">
        {/* Fallback gray circle if no avatar determined */}
        {avatarUrl ? (
          <img
            src={avatarUrl} // absolute /images/... from seeds
            alt={title}
            className="h-10 w-10 rounded-full object-cover ring-2 ring-gray-100 dark:ring-gray-900"
          />
        ) : (
          <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-800" />
        )}

        <div>
          <h3 className="font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>
          )}
        </div>
      </div>

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
  );
}