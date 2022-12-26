import "vfile";

declare module "vfile" {
  interface DataMap {
    matter: {
      title: string;
      slug: string;
      datePublished?: string;
    };
  }
}
