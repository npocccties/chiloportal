import { JSONSchema } from "json-schema-to-ts";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import YAML from "yaml";
import fg from "fast-glob";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import { Config } from "schemas/config";

/**
 * ディレクトリ内のYAMLファイルの内容を取得する関数
 * @params options.issuerId 発行機関の識別子（未指定ならば大学連合とみなす）
 * @params options.allIssuer 大学連合を含むすべての発行機関のファイルを得るか否か
 * @returns Config の配列
 */
export async function readConfigs(
  {
    issuerId,
    allIssuer = false,
  }: {
    issuerId?: number;
    allIssuer?: boolean;
  } = { allIssuer: false },
): Promise<Error | Config[]> {
  const dirname = "contents";
  const contents = await fg.async(join(dirname, "**", "*.(yml|yaml)"));
  const dirPath = contents.length > 0 ? dirname : "examples";
  const filePaths = await fg.async(join(dirPath, "**", "*.(yml|yaml)"));
  if (filePaths.length === 0) return [];
  const configs = await Promise.all(
    filePaths.map((filePath) =>
      readFile(filePath, "utf8").then((file) => YAML.parse(file) as Config),
    ),
  );
  const ajv = new Ajv();
  addFormats(ajv);
  const valid = ajv.validate(
    { type: "array", items: Config } satisfies JSONSchema,
    configs,
  );
  if (!valid) return new Error(ajv.errorsText(ajv.errors));
  if (allIssuer) return configs;
  return issuerId
    ? configs.filter((config) => config.issuerId === issuerId)
    : configs.filter((config) => config.issuerId === undefined);
}
