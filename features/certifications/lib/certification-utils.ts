export type CertificationStatus = "expired" | "no-expiry" | "valid";

export function getCertStatus(
  expiryDate: string | null | undefined,
  doesNotExpire: boolean,
): CertificationStatus {
  if (doesNotExpire || !expiryDate) {
    return "no-expiry";
  }

  return expiryDate <= new Date().toISOString().slice(0, 10)
    ? "expired"
    : "valid";
}

export function formatCertificationDate(value: string) {
  const date = new Date(`${value}T00:00:00.000Z`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    timeZone: "UTC",
    year: "numeric",
  }).format(date);
}
