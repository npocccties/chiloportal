/**
 * 各階層の指標項目からページ内識別子を生成する関数
 * @param name 対象の階層の名称
 * @param indexes 各階層の添字
 * @returns ページ内識別子
 * */
export function makeFieldId(name: string, ...indexes: number[]): string {
  return `${indexes.join(",")}-${name}`;
}
