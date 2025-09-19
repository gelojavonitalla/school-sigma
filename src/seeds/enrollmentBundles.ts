export const SEED_BUNDLES = [
  {
    path: "/tenants/demo/enrollmentBundles/tuition-bundle-g5-regular",
    data: {
      id: "tuition-bundle-g5-regular",
      title: "G5 Regular Tuition Bundle",
      gradeId: "G5",
      items: [
        { itemId: "G5-tuition", qty: 1 },
        { itemId: "G5-misc", qty: 1 },
        { itemId: "G5-books", qty: 1 },
      ],
      defaultForGrade: true,
      active: true,
      createdBy: { uid: "admin-1", at: "2025-09-15T08:30:00Z", name: "Admin One" },
      updatedBy: { uid: "admin-1", at: "2025-09-15T08:30:00Z", name: "Admin One" },
    },
  },
  {
    path: "/tenants/demo/enrollmentBundles/tuition-bundle-g5-sped",
    data: {
      id: "tuition-bundle-g5-sped",
      title: "G5 SPED Bundle",
      gradeId: "G5",
      items: [
        { itemId: "G5-sped-tuition", qty: 1 },
        { itemId: "G5-misc", qty: 1 },
        { itemId: "G5-books", qty: 1 },
      ],
      defaultForGrade: false,
      active: true,
      createdBy: { uid: "admin-1", at: "2025-09-15T08:30:00Z" },
      updatedBy: { uid: "admin-1", at: "2025-09-15T08:30:00Z" },
    },
  },
];