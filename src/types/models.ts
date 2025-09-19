

// Enrollment Item (atomic fee with history)
export type EnrollmentItem = {
  id: string;
  kind: "item";
  title: string;
  category: "reservation" | "tuition" | "misc" | "books" | "kits" | "other";
  amount: number;           // whole pesos
  active: boolean;
  version: number;

  createdBy: { uid: string; at: string; name?: string };
  updatedBy: { uid: string; at: string; name?: string };
};

// Bundle references item IDs (no "required")
export type EnrollmentBundle = {
  id: string;
  title: string;
  gradeId: string;          // e.g., "G5", "PS"
  items: Array<{ itemId: string; qty: number }>;
  defaultForGrade: boolean;
  active: boolean;

  createdBy: { uid: string; at: string; name?: string };
  updatedBy: { uid: string; at: string; name?: string };
};

// Item revision (price history)
export type EnrollmentItemRevision = {
  at: string;
  amount: number;
  title: string;
  version: number;
  by: { uid: string; name?: string };
  reason?: string;
};