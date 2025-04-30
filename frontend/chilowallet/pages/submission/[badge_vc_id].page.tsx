import { GetServerSidePropsResult } from "next";
import React from "react";
import { z } from "zod";

import { Layout } from "@/components/Layout";
import { Metatag } from "@/components/Metatag";
import { SubmissionBadge } from "@/components/page/submission/SubmissionBadge";
import { PageTitle } from "@/components/ui/text/PageTitle";
import { SERVICE_NAME, SERVICE_DESCRITION } from "@/configs";
import { pageName, pagePath } from "@/constants";
import { errors } from "@/constants/error";
import { logEndForPageSSR, logStartForPageSSR, logStatus } from "@/constants/log";
import { convertUTCtoJSTstr } from "@/lib/date";
import { loggerError, loggerInfo } from "@/lib/logger";
import { submissionBadge } from "@/server/repository/submissionBadge";
import { SubmissionEntry } from "@/types/api/submission";

const querySchema = z.object({
  badge_vc_id: z
    .string()
    .refine((v) => {
      return !isNaN(Number(v));
    })
    .transform((v) => Number(v)),
});

const page = pagePath.submission.enter;

export async function getServerSideProps(context): Promise<GetServerSidePropsResult<SubmissionEntry>> {
  loggerInfo(logStartForPageSSR(page));
  loggerInfo("request query", context.params);

  const result = querySchema.safeParse(context.params);

  if (!result.success) {
    loggerError(`${logStatus.error} bad request! ${page}`);
    return { notFound: true };
  }
  const id = result.data.badge_vc_id;

  try {
    const { badgeVc, badgeConsumers } = await submissionBadge({ badgeVcId: id });

    if (!badgeVc) {
      loggerError(`${logStatus.error} badgeVc not found! ${page}`);
      return { notFound: true };
    }

    const { vcDataPayload, badgeVcId, badgeName, badgeIssuedon } = badgeVc;
    const vcPayload = vcDataPayload && JSON.parse(vcDataPayload);
    const vcImage = vcPayload.vc.credentialSubject.photo;
    const jstBadgeIssuedon = convertUTCtoJSTstr(badgeIssuedon);

    loggerInfo(`${logStatus.success} ${page}`);
    loggerInfo(logEndForPageSSR(page));

    return { props: { badgeConsumers, vcImage, badgeVcId, badgeName, badgeIssuedon: jstBadgeIssuedon } };
  } catch (e) {
    loggerError(`${logStatus.error} ${page}`, e.message);

    throw new Error(errors.response500.message);
  }
}

const SubmissionEnterPage = (props: SubmissionEntry) => {
  const { badgeConsumers, vcImage, badgeVcId, badgeName, badgeIssuedon } = props;
  return (
    <Layout align="center" textAlign="center" maxW="md">
      <Metatag title={SERVICE_NAME} description={SERVICE_DESCRITION} />
      <PageTitle title={pageName.submission} />
      <SubmissionBadge
        badgeConsumers={badgeConsumers}
        vcImage={vcImage}
        badgeVcId={badgeVcId}
        badgeName={badgeName}
        badgeIssuedon={badgeIssuedon}
      />
    </Layout>
  );
};

export default SubmissionEnterPage;
