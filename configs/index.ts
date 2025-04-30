export const SERVICE_NAME = process.env.NEXT_PUBLIC_SERVICE_NAME;
export const SERVICE_DESCRITION = process.env.NEXT_PUBLIC_SERVICE_DESCRIPTION;
export const CUSTOME_SCHEMA = "openid-vc://";
export const REQUEST_URI_KEY = `${CUSTOME_SCHEMA}?request_uri`;
export const DID_ION_KEY_ID = "signingKey";
export const SIOP_VALIDITY_IN_MINUTES = 30;
export const REQUEST_RETRY_COUNT = 3;
