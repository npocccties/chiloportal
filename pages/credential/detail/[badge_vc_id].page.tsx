import { GetServerSidePropsResult } from "next";
import { ErrorProps } from "next/error";
import React, { useEffect } from "react";
import { z } from "zod";

import { Layout } from "@/components/Layout";
import { CredentialDetail } from "@/components/page/detail/CredentialDetail";
import { pagePath } from "@/constants";
import { errors } from "@/constants/error";
import { logEndForPageSSR, logStartForPageSSR, logStatus } from "@/constants/log";
import { convertUTCtoJSTstr } from "@/lib/date";
import { loggerError, loggerInfo } from "@/lib/logger";
import { getUserInfoFormJwt } from "@/lib/userInfo";
import {
  createVcDetailData,
  getCredentialDetail,
  getKnowledgeBadges,
} from "@/server/services/credentialDetail.service";
import { extractOpenBadgeMetadataFromImage } from "@/server/services/openBadge.service";
import { vcDetailActions } from "@/share/store/credentialDetail/main";
import { BadgeVcSubmission } from "@/types/api/credential";
import { CredentialDetailData, VcDetailData } from "@/types/api/credential/detail";
import { WisdomBadgeInfo } from "@/types/BadgeInfo";

export type Context = {
  params: { badge_vc_id: string };
};

const querySchema = z.object({
  badge_vc_id: z
    .string()
    .refine((v) => {
      return !isNaN(Number(v));
    })
    .transform((v) => Number(v)),
});

const page = pagePath.credential.detail;

export const getServerSideProps = async function (
  context,
): Promise<GetServerSidePropsResult<ErrorProps | CredentialDetailData>> {
  loggerInfo(logStartForPageSSR(page));

  const result = querySchema.safeParse(context.params);

  if (!result.success) {
    loggerError(`${logStatus.error} bad request!`, context.params);

    return { notFound: true };
  }
  const id = result.data.badge_vc_id;
  const session_cookie = context.req.cookies.session_cookie;
  const { eppn } = getUserInfoFormJwt(session_cookie);

  try {
    const { badgeVc, submissions } = await getCredentialDetail({ badgeVcId: id, eppn });

    if (!badgeVc) {
      loggerError(`${logStatus.error} badgeVc not found!`, context.params);
      return { notFound: true };
    }

    const vcPayload = JSON.parse(badgeVc.vcDataPayload);
    const badgeExportData = vcPayload.vc.credentialSubject.photo;
    const extractBadgeData = await extractOpenBadgeMetadataFromImage(badgeExportData);
    const badgeMetaData: WisdomBadgeInfo = extractBadgeData.badge;
    const { courseInfo, knowledgeBadges } = await getKnowledgeBadges(badgeMetaData);

    const submissionsHistories = submissions.map((sub): BadgeVcSubmission => {
      return {
        consumerName: sub.consumerName,
        submitedAt: convertUTCtoJSTstr(sub.submitedAt),
      };
    });

    const vcDetailData: VcDetailData = createVcDetailData(badgeVc, submissionsHistories, courseInfo);

    loggerInfo(`${logStatus.success} ${page}`);
    loggerInfo(logEndForPageSSR(page));

    return { props: { vcDetailData, knowledgeBadges, submissionsHistories, badgeExportData } };
  } catch (e) {
    loggerError(`${logStatus.error} ${page}`, e.message);
    throw new Error(errors.response500.message);
  }
};

const CredentialDetailPage = (props: CredentialDetailData) => {
  const { vcDetailData, knowledgeBadges, submissionsHistories, badgeExportData } = props;

  const { setVcDetail } = vcDetailActions.useSetVcDetail();
  useEffect(() => {
    setVcDetail(vcDetailData);
  }, []);

  return (
    <Layout maxW="xl">
      <CredentialDetail
        vcDetailData={vcDetailData}
        knowledgeBadges={knowledgeBadges}
        submissionsHistories={submissionsHistories}
        badgeExportData={badgeExportData}
      />
    </Layout>
  );
};

export default CredentialDetailPage;
