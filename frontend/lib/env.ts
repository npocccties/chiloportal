import yn from "yn";

export const JWT_DEBUG_VALUE: string = process.env.JWT_DEBUG_VALUE ?? "";
export const JWT_VERIFICATION_KEY_BASE64: string =
  process.env.JWT_VERIFICATION_KEY_BASE64 ?? "";
/** ページの再生成の指示（pages/api/revalidate）に付ける秘密の値。空なら再生成の指示を受け付けない */
export const REVALIDATE_SECRET: string = process.env.REVALIDATE_SECRET ?? "";
/** 静的に生成したページを、指示がなくても作り直す間隔（秒）。指示が届かなかったときの保険 */
export const REVALIDATE_INTERVAL_SECONDS: number = Number(
  process.env.REVALIDATE_INTERVAL_SECONDS ?? 600,
);
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
export const NEXT_PUBLIC_BADGE_ANALYSIS_URL =
  process.env.NEXT_PUBLIC_BADGE_ANALYSIS_URL ??
  "https://badge-analysis.example.org/";
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
