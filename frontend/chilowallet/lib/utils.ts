import jsonwebtoken from "jsonwebtoken";

import { REQUEST_URI_KEY } from "../configs";
import { Manifest, VCRequest } from "../types";

const crypto = require("crypto").webcrypto;

export interface JWTHeader {
  alg: string;
  kid: string;
}

export interface VCData {
  vc: {
    type: string[];
    credentialSubject: Record<string, string>;
  };
  jti: string;
  iss: string;
  iat: number;
  exp: number;
}

export const getRequestUrlFromUrlMessage = (message: string): string => {
  const urlSearchParams = new URLSearchParams(message);
  const requestUrl = urlSearchParams.get(REQUEST_URI_KEY);
  if (!requestUrl) {
    console.error("QR code does not contains request url");
    return "";
  }
  return requestUrl;
};

export const getProtectedHeaderFromVCRequest = (jwt: string): JWTHeader => {
  const { header } = jsonwebtoken.decode(jwt, { complete: true });
  return header as JWTHeader;
};

export const getRequestFromVCRequest = (
  jwt: string,
): {
  vcRequest: VCRequest;
} => {
  const decodedRequestData = <VCRequest>jsonwebtoken.decode(jwt);
  return {
    vcRequest: decodedRequestData,
  };
};

export const decodeJWTToVCData = (jwt: string): VCData => {
  const vcData = <VCData>jsonwebtoken.decode(jwt);
  return vcData;
};

export const getManifestFromJWT = (jwt: string): Manifest => {
  return <Manifest>jsonwebtoken.decode(jwt);
};

export const calcPinhash = async (pin: string, salt?: string): Promise<string> => {
  const hashInput = salt ? salt + pin : pin;
  // PINコードをバイト配列に変換する
  const bytes = new TextEncoder().encode(hashInput);
  // SHA-256ハッシュ関数を使用してハッシュ値を計算する
  const hashBuffer = await crypto.subtle.digest("SHA-256", bytes);
  // 計算されたハッシュ値をBase64エンコードする
  const pinhash = btoa(String.fromCharCode(...Array.from(new Uint8Array(hashBuffer))));
  return pinhash;
};
