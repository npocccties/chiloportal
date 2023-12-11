import {
  NEXT_PUBLIC_API_MOCKING,
  NEXT_PUBLIC_BADGES_ISSUER_IMAGE_PATH,
} from "lib/env";

/**
 * バッジ発行者の画像の URL を返す変数
 * @params url バッジ発行者の URL
 * @returns 画像の URL
 */
export function getImageUrl(url: string): string | Error {
  if (NEXT_PUBLIC_API_MOCKING) return "/images/mock-issuer.png";
  try {
    return new URL(NEXT_PUBLIC_BADGES_ISSUER_IMAGE_PATH, url).href;
  } catch (e) {
    return e instanceof Error ? e : new Error(String(e));
  }
}
