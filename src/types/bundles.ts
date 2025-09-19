// src/types/bundles.ts
export type BundleStatus = "draft" | "published" | "archived";

export interface GradeBundle {
  id: string;
  name: string;            // e.g., "G5 Regular Student"
  gradeKey: string;        // e.g., "G5"
  status: BundleStatus;    // draft/published/archived
  catalogVersion: number;  // which price catalog this bundle used
  schoolYear?: string;     // OPTIONAL (omit in UI if you prefer)
  items: Array<{ itemId: string }>; // points to specific item price version
  createdAt: string;
  updatedAt: string;
  archivedAt?: string;
  archiveNote?: string;    // your comment when archiving
}