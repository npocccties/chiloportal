export default function parsePageQuery(p?: string): number {
  const result = Number(p);
  if (Number.isFinite(result)) return result;
  return 1;
}
