// src/data/seedChats.ts
import {
  ChatUser,
  ChatThread,
  ChatMessage,
  UserDirectory,
} from "../types/chat";

// --- Directory of demo users (IDs used in threads/messages) ---
export const SEED_USER_DIRECTORY: UserDirectory = {
  t1: {
    displayName: "Mr. Carlo Dizon",
    subtitle: "Adviser • Grade 5 – Galatians",
    avatarUrl: "/images/user/user-19.jpg",
    presence: "online",
    role: "teacher",
  },
  p1: {
    displayName: "Ma. Teresa Reyes",
    subtitle: "Magulang ni River (G5 – Galatians)",
    avatarUrl: "/images/user/user-18.jpg",
    presence: "online",
    role: "parent",
  },
  pr1: {
    displayName: "Sir Jose Santos",
    subtitle: "Punong-guro (Principal)",
    avatarUrl: "/images/user/user-17.jpg",
    presence: "online",
    role: "principal",
  },
  reg1: {
    displayName: "Registrar Office",
    subtitle: "Admissions & Records",
    avatarUrl: "/images/user/user-05.jpg",
    presence: "online",
    role: "registrar",
  },
  p2: {
    displayName: "Ms. Liza Dela Cruz",
    subtitle: "Magulang ni Lake (G3 – Romans)",
    avatarUrl: "/images/user/user-20.jpg",
    presence: "online",
    role: "parent",
  },
  fin1: {
    displayName: "Finance Office",
    subtitle: "Tuition & Billing",
    avatarUrl: "/images/user/user-34.jpg",
    presence: "online",
    role: "finance",
  },
  gc1: {
    displayName: "Ms. Erika Navarro",
    subtitle: "Guidance Counselor",
    avatarUrl: "/images/user/user-35.jpg",
    presence: "offline",
    role: "staff",
  },
  coach1: {
    displayName: "Coach Bautista",
    subtitle: "PE Department",
    avatarUrl: "/images/user/user-36.jpg",
    presence: "offline",
    role: "staff",
  },
  lib1: {
    displayName: "Ms. Hannah Ong",
    subtitle: "Librarian",
    avatarUrl: "/images/user/user-37.jpg",
    presence: "online",
    role: "staff",
  },
};

// Optional convenience array for UIs that prefer arrays over maps
export const SEED_USERS: ChatUser[] = Object.entries(SEED_USER_DIRECTORY).map(
  ([id, u]) => ({ id, ...u })
);

// --- Threads (DMs + a sample group) ---
export const SEED_THREADS: ChatThread[] = [
  {
    id: "dm-t1-p1",
    kind: "dm",
    participantIds: ["t1", "p1"],
    lastMessageAt: "2025-09-18T03:00:00Z",
  },
  {
    id: "dm-t1-pr1",
    kind: "dm",
    participantIds: ["t1", "pr1"],
    lastMessageAt: "2025-09-18T02:50:00Z",
  },
  {
    id: "dm-t1-p2",
    kind: "dm",
    participantIds: ["t1", "p2"],
    lastMessageAt: "2025-09-17T07:00:00Z",
  },
  {
    id: "group-g5-galatians",
    kind: "group",
    title: "G5 – Galatians",
    participantIds: ["t1", "p1", "p2", "pr1", "reg1", "fin1"],
    lastMessageAt: "2025-09-16T10:05:00Z",
  },
];

// --- Messages (sorted ascending by sentAt per thread) ---
export const SEED_MESSAGES: ChatMessage[] = [
  // dm-t1-p1 (Teacher ↔ Parent of River)
  {
    id: "m1",
    threadId: "dm-t1-p1",
    senderId: "p1",
    body:
      "Pwede po ba akong makipag-usap bukas 2:00–5:00 PM tungkol sa progress ni River?",
    sentAt: "2025-09-18T02:40:00Z",
  },
  {
    id: "m2",
    threadId: "dm-t1-p1",
    senderId: "t1",
    body: "Sige po, noted. Available ako bukas ng 3:30 PM para sa meeting.",
    sentAt: "2025-09-18T02:55:00Z",
  },
  {
    id: "m3",
    threadId: "dm-t1-p1",
    senderId: "p1",
    body: "Teacher, pakitingnan po ang consent form para sa field trip.",
    imageUrl: "/images/chat/chat.jpg",
    sentAt: "2025-09-18T03:00:00Z",
  },

  // dm-t1-pr1 (Teacher ↔ Principal)
  {
    id: "m4",
    threadId: "dm-t1-pr1",
    senderId: "pr1",
    body: "Pa-update po ng advisory attendance ngayong araw. Salamat.",
    sentAt: "2025-09-18T02:30:00Z",
  },
  {
    id: "m5",
    threadId: "dm-t1-pr1",
    senderId: "t1",
    body: "On it po. Iu-upload ko sa system bago mag-4 PM.",
    sentAt: "2025-09-18T02:40:00Z",
  },

  // dm-t1-p2 (Teacher ↔ Parent of Lake)
  {
    id: "m6",
    threadId: "dm-t1-p2",
    senderId: "p2",
    body:
      "Good morning, teacher. Absent si Lake kahapon—puwede pong makahingi ng make-up work?",
    sentAt: "2025-09-17T06:50:00Z",
  },
  {
    id: "m7",
    threadId: "dm-t1-p2",
    senderId: "t1",
    body: "Yes, ipapadala ko ngayong hapon. Salamat po sa heads-up.",
    sentAt: "2025-09-17T07:00:00Z",
  },

  // group-g5-galatians (sample group)
  {
    id: "m8",
    threadId: "group-g5-galatians",
    senderId: "reg1",
    body:
      "Reminder: Enrollment documents submission due this Friday for G5 – Galatians.",
    sentAt: "2025-09-16T10:00:00Z",
  },
  {
    id: "m9",
    threadId: "group-g5-galatians",
    senderId: "fin1",
    body:
      "For reservations, please upload your payment receipt under Finance > Reservation.",
    sentAt: "2025-09-16T10:03:00Z",
  },
  {
    id: "m10",
    threadId: "group-g5-galatians",
    senderId: "t1",
    body: "Noted! I’ll also remind the class parents.",
    sentAt: "2025-09-16T10:05:00Z",
  },
];

/* ---------- Tiny helpers (optional) ---------- */
export function getMessages(threadId: string): ChatMessage[] {
  return SEED_MESSAGES
    .filter((m) => m.threadId === threadId)
    .sort((a, b) => a.sentAt.localeCompare(b.sentAt));
}

export function getThreadListFor(userId: string) {
  return SEED_THREADS
    .filter((t) => t.participantIds.includes(userId))
    .sort((a, b) => b.lastMessageAt.localeCompare(a.lastMessageAt))
    .map((t) => {
      const others = t.participantIds.filter((id) => id !== userId);
      const msgs = getMessages(t.id);
      const last = msgs.length ? msgs[msgs.length - 1] : undefined; // <- replace .at(-1)

      const isGroup = t.kind === "group";
      const firstOther = others[0];
      const otherUser = SEED_USER_DIRECTORY[firstOther];

      return {
        threadId: t.id,
        title: isGroup ? (t.title || "Group") : otherUser?.displayName || "Unknown",
        subtitle: isGroup ? t.title : otherUser?.subtitle,
        avatarUrl: isGroup ? undefined : otherUser?.avatarUrl,
        lastSnippet: last?.body ?? (last?.imageUrl ? "📎 Image" : ""),
        lastAt: t.lastMessageAt,
      };
    });
}