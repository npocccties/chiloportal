import { GetServerSideProps, GetServerSidePropsResult } from "next";
import React, { useState } from "react";

import { Layout } from "@/components/Layout";
import { Metatag } from "@/components/Metatag";
import { BadgeList } from "@/components/page/badge/List";
import { VcImport } from "@/components/page/badge/VcImport";
import { PageTitle } from "@/components/ui/text/PageTitle";
import { SERVICE_DESCRITION, SERVICE_NAME } from "@/configs";
import { pageName, pagePath } from "@/constants";
import { errors } from "@/constants/error";
import { logEndForPageSSR, logStartForPageSSR, logStatus } from "@/constants/log";
import { loggerError, loggerInfo } from "@/lib/logger";
import { getUserInfoFormJwt } from "@/lib/userInfo";
import { findAllSafeLmsList } from "@/server/repository/lmsList";
import { getWalletId } from "@/server/services/wallet.service";
import { SafeLmsList } from "@/types/lms";

type Props = {
  lmsList: SafeLmsList[];
};

const page = pagePath.badge.import;

export const getServerSideProps: GetServerSideProps = async ({ req }): Promise<GetServerSidePropsResult<Props>> => {
  loggerInfo(logStartForPageSSR(page));

  const session_cookie = req.cookies.session_cookie;
  const { eppn } = getUserInfoFormJwt(session_cookie);

  try {
    await getWalletId(eppn);
  } catch (e) {
    loggerError(`${logStatus.error} ${page}`, e.message);
    return { redirect: { destination: pagePath.credential.list, statusCode: 302 } };
  }

  try {
    const lmsList = await findAllSafeLmsList();

    loggerInfo(`${logStatus.success} ${page}`);
    loggerInfo(logEndForPageSSR(page));

    return { props: { lmsList } };
  } catch (e) {
    loggerError(`${logStatus.error} ${page}`, e.message);
    throw new Error(errors.response500.message);
  }
};

const ImportVCPage = (props: Props) => {
  const [isBadgeSelect, setIsBadgeSelect] = useState(false);
  const pageWidth = isBadgeSelect ? "md" : "2xl";
  return (
    <Layout align="center" textAlign="center" maxW={pageWidth}>
      <Metatag title={SERVICE_NAME} description={SERVICE_DESCRITION} />
      <PageTitle title={pageName.badge.import} />
      {isBadgeSelect ? (
        <VcImport setIsBadgeSelect={setIsBadgeSelect} />
      ) : (
        <BadgeList lmsList={props.lmsList} setIsBadgeSelect={setIsBadgeSelect} />
      )}
    </Layout>
  );
};

export default ImportVCPage;
