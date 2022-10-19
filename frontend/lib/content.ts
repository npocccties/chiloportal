import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

export async function readContents(): Promise<string[]> {
  const filenames = await readdir("contents");
  return Promise.all(
    filenames.map((filename) => readFile(join("contents", filename), "utf8"))
  );
}
