import type { NextApiRequest, NextApiResponse } from "next";

import { errors } from "@/constants/error";
import { logEndForApi, logStartForApi, logStatus } from "@/constants/log";
import { convertUNIXorISOstrToJST, convertUTCtoJSTstr } from "@/lib/date";
import { loggerDebug, loggerError, loggerInfo, loggerWarn } from "@/lib/logger";
import { getUserInfoFormJwt } from "@/lib/userInfo";
import { credentialDetail } from "@/server/repository/credentialDetail";
import { findAllLmsList } from "@/server/repository/lmsList";
import { getVcBadge, getVcBadges } from "@/server/services/badgeList.service";
import { getCourseListFromMoodle } from "@/server/services/courseList.service";
import { getBadgeJson, myBadgesList, myOpenBadge } from "@/server/services/lmsAccess.service";
import { getWalletId } from "@/server/services/wallet.service";
import { api } from "@/share/api";
import { BadgeStatusListResponse } from "@/types/api/badge";
import { ErrorResponse } from "@/types/api/error";
import { IfBadgeInfo, IfCourseInfo, IfUserBadgeStatus } from "@/types/BadgeInfo";
import { BadgeMetaData } from "@/types/badgeInfo/metaData";

const apiPath = api.v1.badge.status_list;

async function handler(req: NextApiRequest, res: NextApiResponse<BadgeStatusListResponse | ErrorResponse>) {
  loggerInfo(logStartForApi(apiPath));

  const session_cookie = req.cookies.session_cookie;
  const { eppn } = getUserInfoFormJwt(session_cookie);
  loggerDebug(`eppn: ${eppn}`);

  if (!eppn) {
    return res.status(401).json({ error: { errorMessage: errors.unAuthrizedError.detail.noSession } });
  }

  try {
    var walletId = 0;
    const host = req.headers.host;
    const protocol = req.headers["x-forwarded-proto"] || "http"; // HTTP or HTTPS
    const fqdn = `${protocol}://${host}`;
    let response: BadgeStatusListResponse = { user_badgestatuslist: { lms_badge_count: 0, lms_badge_list: [], badge_detail_base_url: `${fqdn}/credential/detail`, error_code: ""}};
    try {
      walletId = await getWalletId(eppn);
    } catch (e) {
      loggerError(`${errors.E20001}: Not found wallet. eppn: ${eppn}`);
      response.user_badgestatuslist.error_code = errors.E20001;
      return res.status(200).json(response);
    }
    loggerDebug(`walletId: ${walletId}`);
    const lmsList = await findAllLmsList();
    if (lmsList.length == 0) {
      loggerError(`${errors.E20000}: Not found lms list.`);
      response.user_badgestatuslist.error_code = errors.E20000;
      return res.status(200).json(response);
    }
    loggerDebug(`lmsList: ${JSON.stringify(lmsList)}`);

    let errorCodes: string[] = [];
    let lms_badge_list: IfUserBadgeStatus[] = [];
    let badgeClassIds = new Set<string>();
    let vadgeVcIds = new Set<number>();
    for (const lms of lmsList) {
      let courseIds = new Set<number>();
      let courseList: IfCourseInfo[] = [];
      const lmsId = lms.lmsId;
      const vcBadges = await getVcBadges(walletId, lmsId);
      loggerDebug(`[lmsId: ${lmsId}] 0 ... vcBadges: ${JSON.stringify(vcBadges)}`);
      if (!lms.ssoEnabled) {
        for (const vcBadge of vcBadges) {
          if (!vadgeVcIds.has(vcBadge.badgeVcId)) {
            loggerDebug(`0 ... Not found vcBadge[badgeVcId: ${vcBadge.badgeVcId} badgeClassId: ${vcBadge.badgeClassId}].`);
            await collectBadgesByVcBadge(walletId, lms.lmsId, lms.lmsName, lms.lmsUrl, errorCodes, courseList,
              lms_badge_list, badgeClassIds, vadgeVcIds, courseIds, vcBadge);
            }
        }
        continue;
      }
      const lmsUrl = lms.lmsUrl;
      loggerDebug(`lms: ${JSON.stringify(lms)}`);
      try {
        courseList = await getCourseListFromMoodle({ walletId, username: eppn, lmsId });
      } catch (e) {
        if (e.message.indexOf("getUserByUsername") != -1) {
          errorCodes.push(errors.E10000);
        } else if (e.message.indexOf("getMyCourses") != -1) {
          errorCodes.push(errors.E10001);
        } else {
          errorCodes.push(errors.E29999);
        }
        loggerWarn(`${errorCodes[errorCodes.length - 1]}: $Failed to getCourseListFromMoodle. eppn: ${eppn} lmsUrl: ${lmsUrl}`);
        continue;
      }
      let badgeList: IfBadgeInfo[];
      try {
        badgeList = await myBadgesList(eppn, "", lms);
      } catch (e) {
        loggerWarn(`${errors.E10002}: Failed to retrieve the badge list from the LMS. eppn: ${eppn} lmsUrl: ${lmsUrl}`);
        errorCodes.push(errors.E10002);
        continue;
      }
      // ユーザに紐づいたバッジをもとに情報の収集
      loggerDebug(`[lmsId: ${lmsId}] 1 ... Collecting information based on the badges associated with the user. lms_badge_list: ${JSON.stringify(lms_badge_list)}`);
      for (const badge of badgeList) {
        const uniquehash = badge.uniquehash;
        await collectBadgesBy(walletId, uniquehash, lms.lmsId, lms.lmsName, lms.lmsUrl, errorCodes, courseList,
           lms_badge_list, badgeClassIds, vadgeVcIds, courseIds, undefined, undefined, undefined, undefined, undefined, undefined, badge.dateissued, false);
      }
      // ウォレットにしか取り込んでないバッジがないかチェック
      loggerDebug(`[lmsId: ${lmsId}] 2 ... Collecting badges that exist only in the wallet. lms_badge_list: ${JSON.stringify(lms_badge_list)}`);
      loggerDebug(`[lmsId: ${lmsId}] 2 ... badgeClassIds: ${JSON.stringify([...badgeClassIds])} vadgeVcIds: ${JSON.stringify([...vadgeVcIds])} courseIds: ${JSON.stringify([...courseIds])}`);
      for (const vcBadge of vcBadges) {
        if (!vadgeVcIds.has(vcBadge.badgeVcId)) {
          loggerDebug(`2-1 ... Not found vcBadge[badgeVcId: ${vcBadge.badgeVcId} badgeClassId: ${vcBadge.badgeClassId}].`);
          await collectBadgesByVcBadge(walletId, lms.lmsId, lms.lmsName, lms.lmsUrl, errorCodes, courseList,
            lms_badge_list, badgeClassIds, vadgeVcIds, courseIds, vcBadge);
        }
      }
      // バッジと紐づかないコースがないかコースリストをもとにチェック
      loggerDebug(`[lmsId: ${lmsId}] 3 ... Collecting courses that are not associated with any badges. lms_badge_list: ${JSON.stringify(lms_badge_list)}`);
      loggerDebug(`[lmsId: ${lmsId}] 3 ... badgeClassIds: ${JSON.stringify([...badgeClassIds])} vadgeVcIds: ${JSON.stringify([...vadgeVcIds])} courseIds: ${JSON.stringify([...courseIds])}`);
      for (const course of courseList) {
        if (!courseIds.has(course.id)) {
          loggerDebug(`3-1 ... Not found course[${course.fullname} ${course.id}].`);
          lms_badge_list.push({
            enrolled: true,//コース主体なのでtrue
            issued: false,//バッジと紐づいてないのでfalse
            imported: false,
            submitted: false,
            accessed_at: convertUNIXorISOstrToJST(course?.lastaccess),
            course_start_date: convertUNIXorISOstrToJST(course?.startdate),
            course_end_date: convertUNIXorISOstrToJST(course?.enddate),
            issued_at: null,//issuedにひきずられる
            imported_at: null,
            badge_expired_at: null,
            badge_vc_id: null,
            lms_id: lmsId,
            lms_name: lms.lmsName,
            lms_url: lms.lmsUrl,
            course_id: course?.id,
            course_name: course?.fullname,
            course_description: course?.summary,
            badge_class_id: null,
            badge_json: null,
            badge_name: null,
            badge_issuer_name: null,
          });
          courseIds.add(course.id);
        }
      }
      loggerDebug(`[lmsId: ${lmsId}] 4 ... badgeClassIds: ${JSON.stringify([...badgeClassIds])} vadgeVcIds: ${JSON.stringify([...vadgeVcIds])} courseIds: ${JSON.stringify([...courseIds])}`);
    }
    if (errorCodes.length != 0) {
      response.user_badgestatuslist.error_code = errorCodes.at(0);
    }
    response.user_badgestatuslist.lms_badge_count = lms_badge_list.length;
    response.user_badgestatuslist.lms_badge_list = lms_badge_list;
    loggerDebug(`response: ${JSON.stringify(response)}`);
    loggerInfo(`${logStatus.success} ${apiPath}`);

    return res.status(200).json(response);
  } catch (e) {
    loggerError(`${logStatus.error} ${apiPath}`, e.message);

    return res.status(500).json({ error: { errorMessage: e.message, detail: e } });
  } finally {
    loggerInfo(logEndForApi(apiPath));
  }
}

async function collectBadgesByVcBadge(
  walletId: number, lmsId: number, lmsName: string, lmsUrl: string, errorCodes: string[], courseList: IfCourseInfo[],
  lms_badge_list: IfUserBadgeStatus[], badgeClassIds: Set<string>, vadgeVcIds: Set<number>, courseIds: Set<number>,
  vcBadge: {
    badgeUniquehash: string;
    badgeIssuedon: Date;
    badgeVcId: number;
    badgeName: string;
    badgeClassId: string;
    badgeIssuerName: string;
    badgeExpires: Date;
    createdAt: Date;
  },
)
{
  const uniquehash = vcBadge.badgeUniquehash;
  const dateissued = vcBadge.badgeIssuedon ? vcBadge.badgeIssuedon.getTime() / 1000 : undefined;
  let submitted = false;
  const submittedBadge = await credentialDetail({ badgeVcId: vcBadge.badgeVcId, walletId: walletId });
  loggerDebug(`submittedBadge: ${JSON.stringify(submittedBadge)}`);
  if (submittedBadge) {
    submitted = submittedBadge.submissions.length != 0;
  }
  await collectBadgesBy(walletId, uniquehash, lmsId, lmsName, lmsUrl, errorCodes, courseList,
     lms_badge_list, badgeClassIds, vadgeVcIds, courseIds, vcBadge.badgeVcId, vcBadge.createdAt, vcBadge.badgeClassId,
     vcBadge.badgeName, vcBadge.badgeIssuerName, vcBadge.badgeExpires, dateissued, submitted);
}

async function collectBadgesBy(
  walletId: number, uniquehash: string, lmsId: number, lmsName: string, lmsUrl: string, errorCodes: string[], courseList: IfCourseInfo[],
  lms_badge_list: IfUserBadgeStatus[], badgeClassIds: Set<string>, vadgeVcIds: Set<number>, courseIds: Set<number>, badgeVcId?: number,
  badgeVcCreated?: Date, badgeClassId?: string, badgeName?: string, badgeIssureName?: string, badgeExpires?: Date, dateissued?: number,
  submitted?: boolean,
)
{
  let badgeMetaData: BadgeMetaData = undefined;
  let badgeJson: any = undefined;
  try {
    badgeMetaData = await myOpenBadge(uniquehash, lmsUrl);
    loggerDebug(`badgeMetaData.id: ${badgeMetaData.id} badgeMetaData.badge.id: ${badgeMetaData.badge.id}, badgeMetaData: ${JSON.stringify(badgeMetaData)}`);
    badgeClassId = badgeMetaData.badge.id;
    badgeName = badgeMetaData.badge.name;
    badgeExpires = badgeMetaData.expires;
  } catch (e) {
    loggerWarn(`${errors.E10003}: Failed to retrieve badge metadata from the LMS. uniquehash: ${uniquehash} lmsUrl: ${lmsUrl}`);
    errorCodes.push(errors.E10003);
  }
  // if (badgeClassId && badgeClassIds.has(badgeClassId)) {
  //   loggerWarn(`Duplicate badge class id. badgeClassId: ${badgeClassId} lmsUrl: ${lmsUrl}`);
  //   return;
  // }
  try {
    badgeJson = await getBadgeJson(badgeClassId);
    loggerDebug(`badgeJson: ${JSON.stringify(badgeJson)}`);
  } catch (e) {
    loggerWarn(`${errors.E10004}: Failed to retrieve badge json from the LMS. badgeClassId: ${badgeClassId} lmsUrl: ${lmsUrl}`);
    errorCodes.push(errors.E10004);
  }
  let courseName = "";
  let courseId: number = 0;
  let alignmentsTargeturl = "";
  try {
    for (const alignment of badgeJson.alignments) {
      if (alignment.targetUrl.indexOf('course/view.php') != -1) {
        alignmentsTargeturl = alignment.targetUrl;
        const alignments_targeturl = new URL(alignmentsTargeturl);
        courseName = badgeJson.name;
        courseId = Number(alignments_targeturl.searchParams.get("id"));
        loggerDebug(`courseName: ${courseName} alignments_targeturl: ${alignmentsTargeturl} courseId: ${courseId}`);
        break;
      }
    }
  } catch (e) {
    loggerWarn(`${errors.E10005}: Invalid url. alignments_targeturl: ${alignmentsTargeturl} lmsUrl: ${lmsUrl}`);
    errorCodes.push(errors.E10005);
  }
  const course = courseList.find(o => o.id == courseId);
  if (!course) {
    loggerWarn(`${errors.E10006}: Not found course. alignments_targeturl: ${alignmentsTargeturl} courseId: ${courseId}`);
    errorCodes.push(errors.E10006);
  }
  if (courseId != 0) {
    courseIds.add(courseId);
  }
  loggerDebug(`badgeClassId: ${badgeClassId}`);
  if (badgeVcId == undefined) {
    const vcBadge = await getVcBadge(badgeClassId, walletId, lmsId);
    loggerDebug(`badgeClassId: ${badgeClassId} vcBadge: ${JSON.stringify(vcBadge)} lmsUrl: ${lmsUrl}`);
    if (vcBadge) {
      badgeVcId = vcBadge.badgeVcId;
      badgeVcCreated = vcBadge.createdAt;
      badgeIssureName = vcBadge.badgeIssuerName;
      badgeExpires = vcBadge.badgeExpires;
      badgeName = vcBadge.badgeName;
      const submittedBadge = await credentialDetail({ badgeVcId: vcBadge.badgeVcId, walletId: walletId });
      loggerDebug(`submittedBadge: ${JSON.stringify(submittedBadge)}`);
      if (submittedBadge) {
        submitted = submittedBadge.submissions.length != 0;
      }
    }
  }
  const issued = badgeJson && badgeJson.error == undefined;
  let issued_at = undefined;
  if (issued) {
    issued_at = convertUNIXorISOstrToJST(dateissued)
  }
  loggerDebug(`badgeExpires type: ${typeof badgeExpires}, value: ${badgeExpires}`);
  lms_badge_list.push({
    enrolled: course != undefined,//コース有無
    issued: issued,//バッジ有無
    imported: badgeVcId != undefined,
    submitted: submitted,
    accessed_at: convertUNIXorISOstrToJST(course?.lastaccess),
    course_start_date: convertUNIXorISOstrToJST(course?.startdate),
    course_end_date: convertUNIXorISOstrToJST(course?.enddate),
    issued_at: issued_at,//issuedにひきずられる
    imported_at: convertUTCtoJSTstr(badgeVcCreated),
    badge_expired_at: convertUNIXorISOstrToJST(badgeExpires),
    badge_vc_id: badgeVcId,
    lms_id: lmsId,
    lms_name: lmsName,
    lms_url: lmsUrl,
    course_id: course?.id,
    course_name: course?.fullname,
    course_description: course?.summary,
    badge_class_id: badgeClassId,
    badge_json: JSON.stringify(badgeJson),
    badge_name: badgeName,
    badge_issuer_name: badgeIssureName,
  });
  if (badgeClassId) {
    badgeClassIds.add(badgeClassId);
  }
  if (badgeVcId) {
    vadgeVcIds.add(badgeVcId);
  }
} 

export default handler;
