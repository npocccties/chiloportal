import yn from "yn";

export const JWT_VERIFICATION_KEY: string =
  process.env.JWT_VERIFICATION_KEY ?? "";
export const NEXT_PUBLIC_API_BASE_URL: string =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
export const NEXT_PUBLIC_API_MOCKING: boolean = yn(
  process.env.NEXT_PUBLIC_API_MOCKING,
  {
    default: false,
  },
);
export const NEXT_PUBLIC_API_PER_PAGE: number = Number(
  process.env.NEXT_PUBLIC_API_PER_PAGE ?? 30,
);
export const NEXT_PUBLIC_BADGES_ISSUER_IMAGE_PATH =
  process.env.NEXT_PUBLIC_BADGES_ISSUER_IMAGE_PATH ?? "issuer/image.png";
export const NEXT_PUBLIC_BASE_URL: string =
  process.env.NEXT_PUBLIC_BASE_URL ?? "https://portal.example.org/";
export const NEXT_PUBLIC_CHILOWALLET_API_BASE_URL: string =
  process.env.NEXT_PUBLIC_CHILOWALLET_API_BASE_URL ??
  "https://chilowallet.example.org/api/v1/";
export const NEXT_PUBLIC_CHILOWALLET_BASE_URL: string =
  process.env.NEXT_PUBLIC_CHILOWALLET_BASE_URL ??
  "https://chilowallet.example.org/";
export const NEXT_PUBLIC_GOOGLE_TAG_ID =
  process.env.NEXT_PUBLIC_GOOGLE_TAG_ID ?? "";
export const NEXT_PUBLIC_SHIBBOLETH_SP_LOGIN_URL: string =
  process.env.NEXT_PUBLIC_SHIBBOLETH_SP_LOGIN_URL ??
  "https://shibboleth-sp.example.org/login";
export const NEXT_PUBLIC_SHIBBOLETH_SP_LOGOUT_URL: string =
  process.env.NEXT_PUBLIC_SHIBBOLETH_SP_LOGOUT_URL ??
  "https://shibboleth-sp.example.org/logout";
