/** Only jobs that accept handwriting offer drawing as a starting point. */
export function canDrawSignature(page: string): boolean {
  return ["/logo-cleaner", "/transparent-signature", "/email-signature"].includes(page);
}