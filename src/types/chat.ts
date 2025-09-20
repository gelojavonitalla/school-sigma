export type UserId = string;
export type ThreadId = string;
export type MessageId = string;

export type Presence = "online" | "offline";
export type Role =
  | "admin"
  | "principal"
  | "finance"
  | "registrar"
  | "teacher"
  | "parent"
  | "staff"
  | "device";

export interface ChatUser {
  /** Stable ID used in threads/messages (e.g., "t1", "p1") */
  id: UserId;
  displayName: string;
  /** For list UI (e.g., “Adviser • Grade 5 – Galatians”) */
  subtitle?: string;
  avatarUrl?: string;
  presence?: Presence;
  role?: Role;
}

export type ThreadKind = "dm" | "group";

export interface ChatThread {
  id: ThreadId;
  kind: ThreadKind;
  /** 2 users for DM, many for group */
  participantIds: UserId[];
  /** ISO8601; last activity for sorting */
  lastMessageAt: string;
  /** Optional human title for groups */
  title?: string;
}

export interface ChatMessage {
  id: MessageId;
  threadId: ThreadId;
  senderId: UserId;
  body?: string;
  imageUrl?: string;
  sentAt: string;        // ISO8601
  editedAt?: string | null;
  deleted?: boolean;
}

/** Handy aliases for seed maps */
export type UserDirectory = Record<UserId, Omit<ChatUser, "id">>;