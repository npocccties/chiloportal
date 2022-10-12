import yn from "yn";

export const NEXT_PUBLIC_API_MOCKING: boolean = yn(
  process.env.NEXT_PUBLIC_API_MOCKING,
  {
    default: false,
  }
);
export const NEXT_PUBLIC_API_BASE_URL: string =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
export const NEXT_PUBLIC_MOODLE_DASHBOARD_URL: string =
  process.env.NEXT_PUBLIC_MOODLE_DASHBOARD_URL ?? "";