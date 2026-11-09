/** The only account allowed into the private workspace. */
export const OWNER_EMAIL = "contact@sashagusain.com";

export function isOwnerEmail(email: string | null | undefined): boolean {
  return (email ?? "").trim().toLowerCase() === OWNER_EMAIL;
}
