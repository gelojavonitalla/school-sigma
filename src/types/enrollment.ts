// src/types/enrollment.ts

/** ---------- Enrollment Items (versioned & immutable amounts) ---------- */
export type ItemStatus = "active" | "archived";
export type ItemCategory =
  | "Tuition & Fees"
  | "Add-ons"
  | "Discounts"
  | "Electives & PE";

/** Optional tags to drive automation (reservation fee, sped, etc.) */
export type ItemTag =
  | "reservation-fee"
  | "tuition"
  | "misc"
  | "books"
  | "uniform"
  | "new-student"
  | "sped"
  | (string & {});

/**
 * A single price point. Amount is immutable; to change price, publish a new version.
 * Collection (kebab-case): tenants/{tenantId}/enrollment-items
 * Doc id suggestion: same as EnrollmentItem.id (e.g., "tuition-g1-g6@v2")
 */
export interface EnrollmentItem {
  /** Stable code across versions (e.g., "tuition-g1-g6") */
  code: string;
  /** Unique id for this price version (e.g., "tuition-g1-g6@v2") */
  id: string;
  name: string;
  category: ItemCategory;
  amount: number;           // 🔒 immutable (whole pesos)
  status: ItemStatus;       // "active" or "archived"
  version: number;          // 1,2,3...
  createdAt: string;        // ISO (kept from your original)

  /** --- Added (optional) audit/metadata, non-breaking --- */
  createdBy?: { uid: string; name: string; at: string }; // when published
  updatedBy?: { uid: string; name: string; at: string }; // e.g., status toggled
  archivedAt?: string;                                   // if status = archived
  tags?: ItemTag[];                                      // automation hints
}

/**
 * Optional per-item revision record for human-readable history.
 * Put in a subcollection with TTL (e.g., "revisions") if you want auto-expiry.
 * Collection: tenants/{t}/enrollment-items/{code}/revisions/{isoOrId}
 */
export interface ItemRevision {
  at: string; // ISO time of change
  amount: number;
  name: string;
  version: number;
  reason?: string;
  changedBy: { uid: string; name: string; at: string };

  /**
   * If you enable Firestore TTL, point it here so old revision docs auto-delete
   * after (say) 12 months.
   */
  expiresAt?: string; // ISO timestamp used by TTL policy
}

/** ---------- Bundles (compose items; control optionality) ---------- */

/**
 * Lines inside a bundle reference item *code* (not version) so the system can
 * resolve the currently active version for a given school year.
 */
export interface BundleLine {
  /** EnrollmentItem.code */
  itemCode: string;
  qty: number;
  /**
   * Required lines are always included in a student’s quote/invoice.
   * Optional lines can be toggled by staff/parents in UI.
   * Defaults to true if omitted (safe for older data).
   */
  required?: boolean;

  /** Optional label change in UI (amount still comes from the item). */
  labelOverride?: string;
  /**
   * Strongly recommended: keep pricing centralized; avoid free-form overrides.
   * If you ever need a different price, publish another EnrollmentItem version
   * or a separate item code and reference that instead.
   */
  // overrideAmount?: number; // intentionally omitted to keep pricing canonical
}

/**
 * Bundle of items per grade/track (e.g., "G5 Regular", "G5 SPED").
 * Collection: tenants/{t}/enrollment-bundles
 */
export interface EnrollmentBundle {
  id: string;             // e.g., "tuition-bundle-g5-regular"
  name: string;           // "G5 Regular Bundle"
  gradeId?: string;       // e.g., "G5"
  defaultForGrade?: boolean;
  status: ItemStatus;     // "active"|"archived"
  items: BundleLine[];

  createdAt: string;      // ISO
  createdBy?: { uid: string; name: string; at: string };
  updatedBy?: { uid: string; name: string; at: string };
}

/** ---------- Resolution (snapshots for invoices) ---------- */

/**
 * What you snapshot when generating a student’s quote/invoice from a bundle.
 * This prevents totals from changing after payments start.
 */
export interface ResolvedLine {
  /** Versioned item id at the time (e.g., "tuition-g1-g6@v3") */
  itemId: string;
  /** Stable code (for human/debug) */
  code: string;
  name: string;
  qty: number;
  amount: number;   // whole pesos (copied from the resolved item)
  required: boolean;
  category: ItemCategory;
}

/**
 * Helper signature (implement in your data layer):
 * Resolves an item code to the *current* active version for a given date/SY.
 */
export type ResolveItemByCode = (
  itemCode: string,
  onOrAfterIso?: string
) => EnrollmentItem | null;