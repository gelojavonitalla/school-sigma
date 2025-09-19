// src/seeds/seed-demo.ts
// Simple structure you can feed to a Firestore writeBatch.
// Each item: { path, data } — where path is a full collection/doc path.

export type SeedDoc = { path: string; data: any };

export const SEED_DEMO: SeedDoc[] = [
  /* =======================
   * Tenant + Settings
   * ======================= */
  {
    path: "/tenants/demo",
    data: {
      name: "Grace Christian Fellowship Academy",
      shortName: "GCF Academy",
      address: {
        line1: "123 Sampaguita St.",
        line2: "Barangay Maligaya",
        city: "Quezon City",
        region: "NCR",
        country: "PH",
        postalCode: "1109",
      },
      phone: "+63 917 123 4567",
      email: "info@gcf-academy.edu.ph",
      logoUrl: "/images/brand/school-sigma.png",
      theme: {
        primary: "#2563EB",
        secondary: "#10B981",
      },
      // Current School Year (SY 2025–2026)
      currentSchoolYear: {
        id: "SY-2025-2026",
        startDate: "2025-06-01",
        endDate: "2026-03-31",
        display: "2025–2026",
      },
      createdAt: "2025-09-15T08:00:00Z",
    },
  },
  {
    path: "/tenants/demo/settings/main",
    data: {
      currency: "PHP",
      rounding: 0, // whole pesos
      allowedPlanTypes: ["yearly", "semestral", "quarterly", "monthly"],
      // Docs TTL (policy level; enforcement done by CFN/cron)
      ttl: {
        chatDays: 365,
        auditDays: 365, // keep 1 year
      },
      // Reservation & enrollment behavior defaults
      reservations: {
        requirePaymentToReserve: true, // Phase 1
        notifyEmailOnOpen: true,
        notifySmsOnOpen: false, // can enable later
      },
      createdAt: "2025-09-15T08:00:00Z",
    },
  },

  /* =======================
   * Grade Limits & Reservation Windows
   * ======================= */
  {
    path: "/tenants/demo/gradeLimits/G5",
    data: { gradeId: "G5", capacity: 120, reservedCount: 0, updatedAt: "2025-09-15T08:05:00Z" },
  },
  {
    path: "/tenants/demo/gradeLimits/G3",
    data: { gradeId: "G3", capacity: 120, reservedCount: 0, updatedAt: "2025-09-15T08:05:00Z" },
  },
  {
    path: "/tenants/demo/gradeLimits/PS",
    data: { gradeId: "PS", capacity: 60, reservedCount: 0, updatedAt: "2025-09-15T08:05:00Z" },
  },

  // Reservation opens at 12MN local (Asia/Manila). Store UTC here; UI can localize.
  // Example: 12MN Jan 10, 2026 Manila = 2026-01-09T16:00:00Z
  {
    path: "/tenants/demo/reservationWindows/G5",
    data: { gradeId: "G5", enabled: true, openAt: "2026-01-09T16:00:00Z", amountItemId: "reservation-g5" },
  },
  {
    path: "/tenants/demo/reservationWindows/G3",
    data: { gradeId: "G3", enabled: true, openAt: "2026-01-09T16:00:00Z", amountItemId: "reservation-elementary" },
  },
  {
    path: "/tenants/demo/reservationWindows/PS",
    data: { gradeId: "PS", enabled: true, openAt: "2026-01-09T16:00:00Z", amountItemId: "reservation-preschool" },
  },

  /* =======================
   * Users (staff & parents)
   * roles are arrays; future-proof for dynamic roles
   * ======================= */
  {
    path: "/tenants/demo/users/admin-1",
    data: {
      uid: "admin-1",
      email: "admin@gcf-academy.edu.ph",
      displayName: "System Admin",
      roles: ["admin"],
      status: "active",
      createdAt: "2025-09-15T08:10:00Z",
    },
  },
  {
    path: "/tenants/demo/users/principal-1",
    data: {
      uid: "principal-1",
      email: "principal@gcf-academy.edu.ph",
      displayName: "Ms. Principal",
      roles: ["principal"],
      status: "active",
      createdAt: "2025-09-15T08:10:00Z",
    },
  },
  {
    path: "/tenants/demo/users/finance-1",
    data: {
      uid: "finance-1",
      email: "finance@gcf-academy.edu.ph",
      displayName: "Finance Officer",
      roles: ["finance"],
      status: "active",
      createdAt: "2025-09-15T08:10:00Z",
    },
  },
  {
    path: "/tenants/demo/users/registrar-1",
    data: {
      uid: "registrar-1",
      email: "registrar@gcf-academy.edu.ph",
      displayName: "Registrar",
      roles: ["registrar"],
      status: "active",
      createdAt: "2025-09-15T08:10:00Z",
    },
  },
  {
    path: "/tenants/demo/users/t1",
    data: {
      uid: "t1",
      email: "ncruz@gcf-academy.edu.ph",
      displayName: "Mr. Noel Cruz",
      roles: ["teacher"], // could also have "parent" later if needed
      status: "active",
      createdAt: "2025-09-15T08:10:00Z",
    },
  },
  {
    path: "/tenants/demo/users/p1",
    data: {
      uid: "p1",
      email: "parent1@example.com",
      displayName: "Arvin Javonitalla",
      roles: ["parent"],
      verified: true,
      childrenIds: ["river", "lake", "fjord"],
      createdAt: "2025-09-15T08:10:00Z",
    },
  },
  {
    path: "/tenants/demo/users/p2",
    data: {
      uid: "p2",
      email: "parent2@example.com",
      displayName: "Ana Santos",
      roles: ["parent"],
      verified: false, // will show in “not verified yet”
      childrenIds: [],
      createdAt: "2025-09-15T08:10:00Z",
    },
  },

  /* =======================
   * Sections (advisory/homeroom)
   * ======================= */
  {
    path: "/tenants/demo/sections/G5-Galatians",
    data: {
      id: "G5-Galatians",
      gradeId: "G5",
      name: "Galatians",
      adviserId: "t1",
      coAdvisorIds: [],
      schoolYearId: "SY-2025-2026",
      tags: ["regular"],
    },
  },
  {
    path: "/tenants/demo/sections/G3-Romans",
    data: {
      id: "G3-Romans",
      gradeId: "G3",
      name: "Romans",
      adviserId: "t1",
      coAdvisorIds: [],
      schoolYearId: "SY-2025-2026",
      tags: ["regular"],
    },
  },
  {
    path: "/tenants/demo/sections/PS-Genesis",
    data: {
      id: "PS-Genesis",
      gradeId: "PS",
      name: "Genesis",
      adviserId: "t1",
      coAdvisorIds: [],
      schoolYearId: "SY-2025-2026",
      tags: ["regular"],
    },
  },

  /* =======================
   * Students
   * ======================= */
  {
    path: "/tenants/demo/students/river",
    data: {
      id: "river",
      firstName: "River",
      lastName: "Javonitalla",
      gender: "male",
      gradeId: "G5",
      sectionId: "G5-Galatians",
      status: "enrolled",
      guardians: [{ userId: "p1", relation: "Father", primary: true }],
      plan: "G5 Regular Student",
      avatarUrl: "/images/user/user-01.jpg",
      schoolYearId: "SY-2025-2026",
      createdAt: "2025-06-01T01:00:00Z",
    },
  },
  {
    path: "/tenants/demo/students/lake",
    data: {
      id: "lake",
      firstName: "Lake",
      lastName: "Javonitalla",
      gender: "male",
      gradeId: "G3",
      sectionId: "G3-Romans",
      status: "enrolled",
      guardians: [{ userId: "p1", relation: "Father", primary: true }],
      plan: "G3 Regular Student",
      avatarUrl: "/images/user/user-35.jpg",
      schoolYearId: "SY-2025-2026",
      createdAt: "2025-06-01T01:00:00Z",
    },
  },
  {
    path: "/tenants/demo/students/fjord",
    data: {
      id: "fjord",
      firstName: "Fjord",
      lastName: "Javonitalla",
      gender: "male",
      gradeId: "PS",
      sectionId: "PS-Genesis",
      status: "enrolled",
      guardians: [{ userId: "p1", relation: "Father", primary: true }],
      plan: "Preschool New Student",
      avatarUrl: "/images/user/user-37.jpg",
      schoolYearId: "SY-2025-2026",
      createdAt: "2025-06-01T01:00:00Z",
    },
  },

  /* =======================
   * Enrollment Items (canonical prices)
   * ======================= */
  // Reservation fee variants — referenced by PricingRules (no free-form amounts)
  {
    path: "/tenants/demo/enrollmentItems/reservation-elementary",
    data: { id: "reservation-elementary", kind: "reservation", title: "Reservation Fee (Elementary)", amount: 4000, active: true },
  },
  {
    path: "/tenants/demo/enrollmentItems/reservation-g5",
    data: { id: "reservation-g5", kind: "reservation", title: "Reservation Fee (Grade 5)", amount: 5000, active: true },
  },
  {
    path: "/tenants/demo/enrollmentItems/reservation-preschool",
    data: { id: "reservation-preschool", kind: "reservation", title: "Reservation Fee (Preschool)", amount: 3000, active: true },
  },

  // Tuition bundles (examples)
  {
    path: "/tenants/demo/enrollmentItems/tuition-bundle-g5-regular",
    data: {
      id: "tuition-bundle-g5-regular",
      kind: "bundle",
      gradeId: "G5",
      title: "G5 Regular Tuition Bundle",
      items: [
        { id: "G5-tuition", title: "Tuition", amount: 28000 },
        { id: "G5-misc", title: "Miscellaneous", amount: 6000 },
        { id: "G5-books", title: "Books", amount: 4500 },
      ],
      defaultForGrade: true,
      active: true,
    },
  },
  {
    path: "/tenants/demo/enrollmentItems/tuition-bundle-g3-regular",
    data: {
      id: "tuition-bundle-g3-regular",
      kind: "bundle",
      gradeId: "G3",
      title: "G3 Regular Tuition Bundle",
      items: [
        { id: "G3-tuition", title: "Tuition", amount: 26000 },
        { id: "G3-misc", title: "Miscellaneous", amount: 5500 },
        { id: "G3-books", title: "Books", amount: 4000 },
      ],
      defaultForGrade: true,
      active: true,
    },
  },
  {
    path: "/tenants/demo/enrollmentItems/tuition-bundle-ps-regular",
    data: {
      id: "tuition-bundle-ps-regular",
      kind: "bundle",
      gradeId: "PS",
      title: "Preschool Tuition Bundle",
      items: [
        { id: "PS-tuition", title: "Tuition", amount: 20000 },
        { id: "PS-misc", title: "Miscellaneous", amount: 5000 },
        { id: "PS-kits", title: "Learning Kit", amount: 2500 },
      ],
      defaultForGrade: true,
      active: true,
    },
  },
  {
    path: "/tenants/demo/enrollmentItems/tuition-bundle-g5-sped",
    data: {
      id: "tuition-bundle-g5-sped",
      kind: "bundle",
      gradeId: "G5",
      title: "G5 SPED Bundle",
      items: [
        { id: "G5-sped-tuition", title: "Tuition (SPED)", amount: 34000 },
        { id: "G5-misc", title: "Miscellaneous", amount: 6000 },
        { id: "G5-books", title: "Books", amount: 4500 },
      ],
      defaultForGrade: false,
      active: true,
    },
  },

  /* =======================
   * Pricing Rules (unified collection)
   * Scope order: student > section > grade > level > global
   * ======================= */
  // Global default reservation for Elementary
  {
    path: "/tenants/demo/pricingRules/pr-global-elementary-res",
    data: {
      scope: "level",
      levelId: "ELEMENTARY",
      feeType: "reservation",
      enrollmentItemId: "reservation-elementary",
      active: true,
      createdAt: "2025-09-15T08:20:00Z",
    },
  },
  // Grade override: G5 uses a different reservation item (₱5,000)
  {
    path: "/tenants/demo/pricingRules/pr-grade-g5-res",
    data: {
      scope: "grade",
      gradeId: "G5",
      feeType: "reservation",
      enrollmentItemId: "reservation-g5",
      active: true,
      createdAt: "2025-09-15T08:20:00Z",
    },
  },
  // Preschool uses its own reservation amount
  {
    path: "/tenants/demo/pricingRules/pr-grade-ps-res",
    data: {
      scope: "grade",
      gradeId: "PS",
      feeType: "reservation",
      enrollmentItemId: "reservation-preschool",
      active: true,
      createdAt: "2025-09-15T08:20:00Z",
    },
  },
  // Section override example (use SPED bundle for a SPED section)
  {
    path: "/tenants/demo/pricingRules/pr-section-g5-sped-bundle",
    data: {
      scope: "section",
      sectionId: "G5-Grapes-SPED", // (section can be added later)
      feeType: "tuitionBundle",
      tuitionBundleId: "tuition-bundle-g5-sped",
      active: true,
      createdAt: "2025-09-15T08:20:00Z",
    },
  },
  // Student-specific override example (rare; e.g., scholarship bundle)
  {
    path: "/tenants/demo/pricingRules/pr-student-fjord-bundle",
    data: {
      scope: "student",
      studentId: "fjord",
      feeType: "tuitionBundle",
      tuitionBundleId: "tuition-bundle-ps-regular",
      active: true,
      createdAt: "2025-09-15T08:20:00Z",
      note: "Explicitly pin Fjord to PS regular bundle.",
    },
  },

  /* =======================
   * Reservations (Phase 1 flow)
   * ======================= */
  {
    path: "/tenants/demo/reservations/res-lake-2025-26",
    data: {
      id: "res-lake-2025-26",
      studentId: "lake",
      schoolYearId: "SY-2025-2026",
      gradeId: "G3",
      status: "pendingPayment", // pendingPayment | underReview | reserved | rejected
      openedAt: "2026-01-09T16:00:10Z",
      amountItemId: "reservation-elementary", // came from PR (G3)
    },
  },

  /* =======================
   * Finance (Payments)
   * ======================= */
  {
    path: "/tenants/demo/finance/payments/pay-001",
    data: {
      id: "pay-001",
      studentId: "river",
      schoolYearId: "SY-2025-2026",
      description: "Tuition (Quarterly) — 2nd Payment",
      amount: 14850,
      method: "GCash",
      reference: "OR-2025-00123",
      receiptUrl: "/uploads/receipts/pay-001.jpg",
      receivedAt: "2025-06-03T02:35:00Z",
      verified: true,
      verifiedBy: "finance-1",
      verifiedAt: "2025-06-03T05:12:00Z",
    },
  },
  {
    path: "/tenants/demo/finance/payments/pay-002",
    data: {
      id: "pay-002",
      studentId: "lake",
      schoolYearId: "SY-2025-2026", // reservation counted toward target SY
      description: "Reservation deposit",
      amount: 5000,
      method: "Bank Transfer",
      reference: "OR-2025-00098",
      receiptUrl: "/uploads/receipts/pay-002.jpg",
      receivedAt: "2025-05-28T09:00:00Z",
      verified: true,
      verifiedBy: "finance-1",
      verifiedAt: "2025-05-28T10:00:00Z",
      reservationId: "res-lake-2025-26",
      notes: "Verified; seat reserved once window opened.",
    },
  },
  {
    path: "/tenants/demo/finance/payments/pay-003",
    data: {
      id: "pay-003",
      studentId: "fjord",
      schoolYearId: "SY-2024-2025",
      description: "Tuition (Yearly) — partial",
      amount: 10000,
      method: "Cash",
      reference: "OR-2024-00076",
      receiptUrl: "/uploads/receipts/pay-003.jpg",
      receivedAt: "2024-11-20T01:12:00Z",
      verified: true,
      verifiedBy: "finance-1",
      verifiedAt: "2024-11-20T02:00:00Z",
    },
  },

  /* =======================
   * Tasks (teacher)
   * ======================= */
  {
    path: "/tenants/demo/tasks/t-001",
    data: {
      id: "t-001",
      title: "Take attendance: Math 5 (7:40 AM)",
      status: "todo",
      assignees: ["t1"],
      dueAt: "2025-09-19T23:40:00Z",
      tags: ["attendance", "G5-Galatians"],
      createdBy: "principal-1",
      createdAt: "2025-09-18T09:00:00Z",
    },
  },
  {
    path: "/tenants/demo/tasks/t-002",
    data: {
      id: "t-002",
      title: "Grade: Quiz 2 – Fractions (G5)",
      status: "inProgress",
      assignees: ["t1"],
      dueAt: "2025-09-20T13:00:00Z",
      tags: ["grades", "G5-Galatians"],
      createdBy: "principal-1",
      createdAt: "2025-09-18T09:05:00Z",
    },
  },

  /* =======================
   * Quiz (sample)
   * ======================= */
  {
    path: "/tenants/demo/quizzes/qz-math5-001",
    data: {
      id: "qz-math5-001",
      courseId: "MATH5",
      sectionId: "G5-Galatians",
      title: "Quiz 2 – Fractions",
      totalPoints: 20,
      status: "published",
      questions: [
        { id: "q1", type: "mcq", prompt: "Which is greater?", choices: ["1/3", "2/5", "1/2", "3/8"], correctIndex: 2, points: 5 },
        { id: "q2", type: "tf", prompt: "3/6 simplifies to 1/2.", answer: "True", points: 5 },
        { id: "q3", type: "short", prompt: "Add 1/4 + 1/8 = ?", points: 10 },
      ],
      createdBy: "t1",
      createdAt: "2025-09-18T10:00:00Z",
    },
  },

  /* =======================
   * Attendance (sample roll)
   * ======================= */
  {
    path: "/tenants/demo/attendance/G5-Galatians/2025-09-19T23:40:00Z",
    data: {
      sectionId: "G5-Galatians",
      meetingAt: "2025-09-19T23:40:00Z",
      subject: "Math 5",
      takenBy: "t1",
      rows: [
        { studentId: "river", status: "present" },
        // (more students can be appended later)
      ],
      createdAt: "2025-09-19T23:50:00Z",
    },
  },

  /* =======================
   * Chat (parents & staff) – demo thread
   * ======================= */
  {
    path: "/tenants/demo/chats/thread-galatians",
    data: {
      id: "thread-galatians",
      title: "Grade 5 – Galatians",
      participants: ["t1", "p1"],
      lastMessageAt: "2025-09-18T03:00:00Z",
      ttlDays: 365,
    },
  },
  {
    path: "/tenants/demo/chats/thread-galatians/messages/m1",
    data: {
      id: "m1",
      senderId: "p1",
      body: "Good morning, Teacher! Will the quiz cover mixed numbers?",
      sentAt: "2025-09-18T02:58:00Z",
    },
  },
  {
    path: "/tenants/demo/chats/thread-galatians/messages/m2",
    data: {
      id: "m2",
      senderId: "t1",
      body: "Hi! Yes, just basic conversion—thanks.",
      sentAt: "2025-09-18T03:00:00Z",
    },
  },

  /* =======================
   * Audit Log (a few examples)
   * ======================= */
  {
    path: "/tenants/demo/auditLogs/al-001",
    data: {
      id: "al-001",
      at: "2025-09-15T08:20:05Z",
      actorId: "admin-1",
      action: "USER_INVITE",
      target: { kind: "user", id: "finance-1" },
      result: "success",
      meta: { email: "finance@gcf-academy.edu.ph" },
    },
  },
  {
    path: "/tenants/demo/auditLogs/al-002",
    data: {
      id: "al-002",
      at: "2025-09-15T08:25:00Z",
      actorId: "admin-1",
      action: "PRICING_RULE_CREATE",
      target: { kind: "pricingRule", id: "pr-grade-g5-res" },
      result: "success",
      meta: { gradeId: "G5", feeType: "reservation", enrollmentItemId: "reservation-g5" },
    },
  },
  {
    path: "/tenants/demo/auditLogs/al-003",
    data: {
      id: "al-003",
      at: "2025-05-28T10:00:00Z",
      actorId: "finance-1",
      action: "PAYMENT_VERIFY",
      target: { kind: "payment", id: "pay-002" },
      result: "success",
      meta: { studentId: "lake", amount: 5000 },
    },
  },
];

