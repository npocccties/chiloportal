import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

export async function readPosts(): Promise<string[]> {
  const filenames = await readdir("posts");
  return Promise.all(
    filenames.map((filename) => readFile(join("posts", filename), "utf8"))
  );
}
