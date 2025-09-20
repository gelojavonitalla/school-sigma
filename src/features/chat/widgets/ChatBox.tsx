// src/components/chats/ChatBox.tsx
import { useEffect, useMemo, useState } from "react";
import ChatBoxHeader from "./ChatBoxHeader";
import ChatBoxSendForm from "./ChatBoxSendForm";

import {
  SEED_MESSAGES,
  SEED_THREADS,
  SEED_USER_DIRECTORY,
} from "../../../seeds/chats"; 

interface ChatItem {
  id: string | number;
  name: string;
  role: string;
  profileImage: string;
  status: "online" | "offline";
  lastActive: string;
  message: string;
  isSender: boolean;
  imagePreview?: string;
}

const CURRENT_USER_ID = "t1";

/* ------------ tiny hook to react to SPA URL changes (no Router needed) ------------ */
function useQueryParamOutsideRouter(key: string) {
  const getVal = () => new URLSearchParams(window.location.search).get(key) || undefined;
  const [val, setVal] = useState<string | undefined>(getVal);

  useEffect(() => {
    const onChange = () => setVal(getVal());

    // monkey-patch to catch pushState/replaceState
    const origPush = history.pushState;
    const origReplace = history.replaceState;
    (history.pushState as any) = function (...args: any[]) {
      const ret = origPush.apply(this, args);
      window.dispatchEvent(new Event("locationchange"));
      return ret;
    };
    (history.replaceState as any) = function (...args: any[]) {
      const ret = origReplace.apply(this, args);
      window.dispatchEvent(new Event("locationchange"));
      return ret;
    };

    window.addEventListener("popstate", onChange);
    window.addEventListener("locationchange", onChange);
    return () => {
      history.pushState = origPush;
      history.replaceState = origReplace;
      window.removeEventListener("popstate", onChange);
      window.removeEventListener("locationchange", onChange);
    };
  }, []);

  return val;
}

function defaultThreadIdFor(userId: string): string | undefined {
  const threads = SEED_THREADS
    .filter((t) => t.participantIds.includes(userId))
    .sort((a, b) => b.lastMessageAt.localeCompare(a.lastMessageAt));
  return threads.length ? threads[0].id : undefined;
}

function timeLabel(iso: string): string {
  const sent = new Date(iso).getTime();
  const diffMs = Date.now() - sent;
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} mins`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} h`;
  return new Date(iso).toLocaleDateString();
}

export default function ChatBox() {
  const threadFromUrl = useQueryParamOutsideRouter("thread");
  const activeThreadId = threadFromUrl ?? defaultThreadIdFor(CURRENT_USER_ID);

  const chatList: ChatItem[] = useMemo(() => {
    if (!activeThreadId) return [];
    const msgs = SEED_MESSAGES
      .filter((m) => m.threadId === activeThreadId)
      .sort((a, b) => a.sentAt.localeCompare(b.sentAt));

    return msgs.map((m) => {
      const sender = SEED_USER_DIRECTORY[m.senderId] || {};
      const status = sender.presence === "online" ? "online" : "offline";
      return {
        id: m.id,
        name: sender.displayName ?? "Unknown",
        role: sender.subtitle ?? "",
        profileImage: sender.avatarUrl ?? "",
        status,
        lastActive: timeLabel(m.sentAt),
        message: m.body ?? "",
        isSender: m.senderId === CURRENT_USER_ID,
        imagePreview: (m as any).imageUrl,
      };
    });
  }, [activeThreadId]);

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] xl:w-3/4">
      <ChatBoxHeader activeThreadId={activeThreadId} />

      <div className="flex-1 max-h-full p-5 space-y-6 overflow-auto custom-scrollbar xl:space-y-8 xl:p-6">
        {!activeThreadId && (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Select a conversation from the list.
          </div>
        )}

        {activeThreadId && chatList.length === 0 && (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            No messages yet. Start the conversation!
          </div>
        )}

        {chatList.map((chat) => (
          <div
            key={chat.id}
            className={`flex ${chat.isSender ? "justify-end" : "items-start gap-4"}`}
          >
            {!chat.isSender && chat.profileImage && (
              <div className="w-10 h-10 overflow-hidden rounded-full">
                <img
                  src={chat.profileImage}
                  alt={`${chat.name} profile`}
                  className="object-cover object-center w-full h-full"
                />
              </div>
            )}

            <div className={chat.isSender ? "text-right" : ""}>
              {chat.imagePreview && (
                <div className="mb-2 w-full max-w-[270px] overflow-hidden rounded-lg">
                  <img src={chat.imagePreview} alt="chat" className="object-cover" />
                </div>
              )}

              <div
                className={`px-3 py-2 rounded-lg ${
                  chat.isSender
                    ? "bg-brand-500 text-white dark:bg-brand-500"
                    : "bg-gray-100 dark:bg-white/5 text-gray-800 dark:text-white/90"
                } ${chat.isSender ? "rounded-tr-sm" : "rounded-tl-sm"}`}
              >
                <p className="text-sm">{chat.message}</p>
              </div>

              <p className="mt-2 text-gray-500 text-theme-xs dark:text-gray-400">
                {chat.isSender ? chat.lastActive : `${chat.name}, ${chat.lastActive}`}
              </p>
            </div>
          </div>
        ))}
      </div>

      <ChatBoxSendForm />
    </div>
  );
}