export const certificationQueryKeys = {
  certification: (id: string) => ["certification", id] as const,
  certifications: ["certifications"] as const,
};
