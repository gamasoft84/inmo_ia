const DEFAULT_AGENCY_ID = process.env.NEXT_PUBLIC_DEFAULT_AGENCY_ID?.trim() || "";

export function getClientAgencyId() {
  if (typeof window === "undefined") {
    return DEFAULT_AGENCY_ID || null;
  }

  const queryAgencyId = new URLSearchParams(window.location.search).get("agencyId")?.trim();
  const storageAgencyId = window.localStorage.getItem("agencyId")?.trim();
  const resolvedAgencyId = queryAgencyId || storageAgencyId || DEFAULT_AGENCY_ID;

  if (queryAgencyId && queryAgencyId !== storageAgencyId) {
    window.localStorage.setItem("agencyId", queryAgencyId);
  }

  return resolvedAgencyId || null;
}
