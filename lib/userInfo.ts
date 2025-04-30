import jsonwebtoken from "jsonwebtoken";

type UserInfo = {
  eppn: string;
  displayName: string;
};

export const getUserInfoFormJwt = (session_cookie: string): UserInfo => {
  try {
    const decodeJwt = <UserInfo>jsonwebtoken.decode(session_cookie);

    if (!decodeJwt) {
      return { eppn: null, displayName: null };
    }

    return decodeJwt;
  } catch {
    return { eppn: null, displayName: null };
  }
};
