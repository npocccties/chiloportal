/** ページタイトルを生成する関数 */
export default function title(...fragments: string[]): string {
  if (fragments.length === 0) return "OZONE-EDU";
  return `${fragments.join(" - ")} - OZONE-EDU`;
}
