import yn from "yn";

export const NEXT_PUBLIC_API_MOCKING: boolean = yn(
  process.env.NEXT_PUBLIC_API_MOCKING,
  {
    default: false,
  },
);
export const NEXT_PUBLIC_API_BASE_URL: string =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
export const NEXT_PUBLIC_API_PER_PAGE: number =
  Number(process.env.NEXT_PUBLIC_API_PER_PAGE) ?? 30;
export const NEXT_PUBLIC_BASE_URL: string =
  process.env.NEXT_PUBLIC_BASE_URL ?? "https://portal.example.org/";
export const NEXT_PUBLIC_MOODLE_DASHBOARD_URL: string =
  process.env.NEXT_PUBLIC_MOODLE_DASHBOARD_URL ?? "";
export const NEXT_PUBLIC_BADGES_ISSUER_IMAGE_PATH =
  process.env.NEXT_PUBLIC_BADGES_ISSUER_IMAGE_PATH ?? "issuer/image.png";
