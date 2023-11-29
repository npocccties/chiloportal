import { readFile } from "node:fs/promises";
import { join } from "node:path";
import YAML from "yaml";
import fg from "fast-glob";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import { Config } from "schemas/config";

export async function readConfig(): Promise<Error | Config> {
  const dirname = "contents";
  const filename = "config.yaml";
  const contents = await fg.async(join(dirname, "**", "*.(yml|yaml)"));
  const path = contents.length > 0 ? contents[0] : join("examples", filename);
  const file = await readFile(path, "utf8").catch(
    () => "recommendedWisdomBadgesIds: []\nlearningContents: []\n",
  );
  const config = YAML.parse(file);
  const ajv = new Ajv();
  addFormats(ajv);
  const valid = ajv.validate(Config, config);
  if (!valid) return new Error(ajv.errorsText(ajv.errors));
  return config;
}
