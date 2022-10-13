import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

export async function readPosts(): Promise<string[]> {
  // TODO: 公開日順など並びが制御可能な状態にして
  const filenames = await readdir("posts");
  return Promise.all(
    filenames.map((filename) => readFile(join("posts", filename), "utf8"))
  );
}
