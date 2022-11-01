import { readFile } from "node:fs/promises";
import YAML from "yaml";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import { Config } from "schemas/config";

export async function readConfig(): Promise<Error | Config> {
  const file = await readFile("config.yaml", "utf8");
  const config = YAML.parse(file);
  const ajv = new Ajv();
  addFormats(ajv);
  const valid = ajv.validate(Config, config);
  if (!valid) return new Error(ajv.errorsText(ajv.errors));
  return config;
}
