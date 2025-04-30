import { LmsList } from "@prisma/client";
import axios, { AxiosRequestConfig } from "axios";

import { moodleRetryConfig } from "@/configs/retry";
import { errors } from "@/constants/error";
import { logStatus } from "@/constants/log";
import { loggerDebug, loggerError } from "@/lib/logger";
import { retryRequest } from "@/lib/retryRequest";
import { encodeReqestGetUrlParams } from "@/lib/url";
import { IfBadgeInfo, IfCourseInfo, IfUserInfo } from "@/types/BadgeInfo";
import { BadgeMetaData } from "@/types/badgeInfo/metaData";

const getMyToken = async (username: string, password: string, selectLms: LmsList): Promise<string> => {
  const { lmsUrl, lmsService } = selectLms;
  const tokenUrlBase = `${lmsUrl}/login/token.php`;

  const query = {
    username: username,
    password: password,
    service: lmsService,
  };
  const encodedQuery = encodeReqestGetUrlParams(query);
  const tokenURL = `${tokenUrlBase}?${encodedQuery}`;

  const options: AxiosRequestConfig = {
    method: "GET",
    url: tokenURL,
    //httpsAgent: new https.Agent({ rejectUnauthorized: false }), // SSL Error: Unable to verify the first certificateの回避 正式な証明書なら出ないはず
  };
  loggerDebug(
    "moodle requestUrl",
    `${tokenUrlBase}?username=${encodeURIComponent(username)}&password=****&service=${encodeURIComponent(lmsService)}`,
  );

  try {
    const { data } = await retryRequest(() => {
      return axios(options);
    }, moodleRetryConfig);
    if (data.error) {
      throw new Error(data.errorcode);
    }

    return data.token;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      loggerError("Error getMyTokens:(axios)", err.message);
    }
    if (err.message === errors.moodleErrorCode.invalidLogin) {
      loggerError("moodle login error");
    }
    throw err;
  }
};

const getMyTokenAdmin = async (username: string, selectLms: LmsList): Promise<string> => {
  const token = selectLms.lmsAccessToken;
  const { lmsUrl, lmsService } = selectLms;
  const tokenUrlBase = `${lmsUrl}/webservice/rest/server.php`;
  const query = {
    wstoken: token,
    wsfunction: "tool_token_get_token",
    moodlewsrestformat: "json",
    idtype: "username",
    idvalue: username,
    service: lmsService,
  };
  const encodedQuery = encodeReqestGetUrlParams(query);
  const tokenURL = `${tokenUrlBase}?${encodedQuery}`;
  const options: AxiosRequestConfig = {
    method: "GET",
    url: tokenURL,
    //httpsAgent: new https.Agent({ rejectUnauthorized: false }), // SSL Error: Unable to verify the first certificateの回避 正式な証明書なら出ないはず
  };

  loggerDebug("moodle sso requestUrl", tokenURL);

  try {
    const { data } = await retryRequest(() => {
      return axios(options);
    }, moodleRetryConfig);
    return data.token;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      loggerError("Error getMyTokens:(axios)", err.message);
    }
    throw err;
  }
};

const getMyBadges = async (token: string, selectLms: LmsList): Promise<IfBadgeInfo[]> => {
  const { lmsUrl } = selectLms;
  const myBadgesURL = `${lmsUrl}/webservice/rest/server.php?wsfunction=core_badges_get_user_badges&moodlewsrestformat=json&wstoken=${token}`;

  const options: AxiosRequestConfig = {
    method: "GET",
    url: myBadgesURL,
    //httpsAgent: new https.Agent({ rejectUnauthorized: false }), // SSL Error: Unable to verify the first certificateの回避 正式な証明書なら出ないはず
  };
  try {
    const { data } = await retryRequest(() => {
      return axios(options);
    }, moodleRetryConfig);
    loggerDebug("response getMyBadges", data.badges);

    return data.badges;
  } catch (err) {
    loggerError(`${logStatus.error}`, err.message);
    throw err;
  }
};

export const myBadgesList = async (username: string, password: string, selectLms: LmsList): Promise<IfBadgeInfo[]> => {
  try {
    const { ssoEnabled } = selectLms;
    let token = "";
    if (ssoEnabled) {
      token = await getMyTokenAdmin(username, selectLms);
    } else {
      token = await getMyToken(username, password, selectLms);
    }
    const badgesInfoJson: IfBadgeInfo[] = await getMyBadges(token, selectLms);

    return badgesInfoJson;
  } catch (err) {
    loggerError(`${logStatus.error} server/service/lmsAccess.service myBadgesList`);
    throw err;
  }
};

const getMyCourses = async (token: string, selectLms: LmsList, userid: number): Promise<IfCourseInfo[]> => {
  const { lmsUrl } = selectLms;
  const myCoursesURL = `${lmsUrl}/webservice/rest/server.php?wsfunction=core_enrol_get_users_courses&moodlewsrestformat=json&wstoken=${token}&userid=${userid}`;

  const options: AxiosRequestConfig = {
    method: "GET",
    url: myCoursesURL,
  };
  try {
    const { data } = await retryRequest(() => {
      return axios(options);
    }, moodleRetryConfig);
    loggerDebug(`response getMyCourses: ${JSON.stringify(data)}`);

    return data;
  } catch (err) {
    loggerError(`${logStatus.error}`, err.message);
    throw new Error("getMyCourses");
  }
};

const getUserByUsername = async (token: string, selectLms: LmsList, username: string): Promise<IfUserInfo[]> => {
  const { lmsUrl } = selectLms;
  const userURL = `${lmsUrl}/webservice/rest/server.php?wsfunction=core_user_get_users_by_field&moodlewsrestformat=json&wstoken=${token}&field=username&values[0]=${username}`;

  const options: AxiosRequestConfig = {
    method: "GET",
    url: userURL,
  };
  try {
    const { data } = await retryRequest(() => {
      return axios(options);
    }, moodleRetryConfig);
    loggerDebug("response getUser", data);

    return data;
  } catch (err) {
    loggerError(`${logStatus.error}`, err.message);
    throw new Error("getUserByUsername");
  }
};

export const myCoursesList = async (username: string, selectLms: LmsList): Promise<IfCourseInfo[]> => {
  try {
    let token = await getMyTokenAdmin(username, selectLms);
    const userInfos: IfUserInfo[] = await getUserByUsername(token, selectLms, username);
    if (userInfos.length == 0) {
      throw new Error(`Not found user. ${username}`);
    }
    const coursesInfos: IfCourseInfo[] = await getMyCourses(token, selectLms, userInfos[0].id);

    return coursesInfos;
  } catch (err) {
    loggerError(`${logStatus.error} server/service/lmsAccess.service myCoursesList`);
    throw err;
  }
};

export const myOpenBadge = async (uniquehash: string, lmsUrl: string): Promise<BadgeMetaData> => {
  const myOpenBadgeURL = `${lmsUrl}/badges/assertion.php?obversion=2&b=${uniquehash}`;
  try {
    const openBadgeMeta = await retryRequest(() => {
      return axios.get(myOpenBadgeURL).then((res) => res.data);
    }, moodleRetryConfig);

    return openBadgeMeta;
  } catch (err) {
    loggerError(`${logStatus.error} server/services/lmsAccess.service myOpenBadge`);
    throw err;
  }
};

export const getBadgeJson = async (url: string): Promise<any> => {
  try {
    const openBadgeMeta = await retryRequest(() => {
      return axios.get(url).then((res) => res.data);
    }, moodleRetryConfig);

    return openBadgeMeta;
  } catch (err) {
    loggerError(`${logStatus.error} server/services/lmsAccess.service badgeJson`);
    throw err;
  }
};
