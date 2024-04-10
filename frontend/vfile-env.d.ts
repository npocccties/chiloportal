import "vfile";
import type { Frontmatter } from "schemas";

declare module "vfile" {
  interface DataMap {
    matter: Frontmatter;
  }
}
