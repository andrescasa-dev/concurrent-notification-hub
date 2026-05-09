export function getCorsOrigin(raw: string): boolean | string[] {
  const trimmed = raw.trim();
  if (!trimmed) {
    return true;
  }
  return trimmed
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);
}
