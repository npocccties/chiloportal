import { GetServerSideProps } from "next";
import dynamic from "next/dynamic";
import React from "react";

import { Layout } from "@/components/Layout";
import { Metatag } from "@/components/Metatag";
import { PageTitle } from "@/components/ui/text/PageTitle";
import { SERVICE_DESCRITION, SERVICE_NAME } from "@/configs";
import { pageName, pagePath } from "@/constants";
import { errors } from "@/constants/error";
import { logStartForPageSSR, logStatus, logEndForPageSSR } from "@/constants/log";
import { loggerInfo, loggerError } from "@/lib/logger";
import { getUserInfoFormJwt } from "@/lib/userInfo";
import { findWallet } from "@/server/repository/wallet";

const EntryWallet = dynamic(() => import("@/components/page/wallet/Entry").then((mod) => mod.EntryWallet), {
  ssr: false,
});

const page = pagePath.entry;

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  loggerInfo(logStartForPageSSR(page));

  const session_cookie = req.cookies.session_cookie;
  const { eppn } = getUserInfoFormJwt(session_cookie);

  try {
    const createdWallet = await findWallet(eppn);

    // Walletを登録済みならこのページを表示しない
    if (createdWallet) {
      return { notFound: true };
    }

    loggerInfo(`${logStatus.success} ${page}`);
    loggerInfo(logEndForPageSSR(page));

    return { props: {} };
  } catch (e) {
    loggerError(`${logStatus.error} ${page}`, e.message);
    throw new Error(errors.response500.message);
  }
};

const index = () => {
  return (
    <Layout maxW="xl" showHeaderContents={false}>
      <Metatag title={SERVICE_NAME} description={SERVICE_DESCRITION} />
      <PageTitle title={pageName.entry} />
      <EntryWallet />
    </Layout>
  );
};

export default index;
