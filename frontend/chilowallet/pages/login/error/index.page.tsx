import { WarningIcon } from "@chakra-ui/icons";
import { VStack, HStack, Box, Text } from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import React from "react";

import { Layout } from "@/components/Layout";
import { Metatag } from "@/components/Metatag";
import { SecondaryButton } from "@/components/ui/button/SecondaryButton";
import { SERVICE_DESCRITION, SERVICE_NAME } from "@/configs";
import { pagePath } from "@/constants";
import { errors } from "@/constants/error";
import { logStartForPageSSR, logStatus, logEndForPageSSR } from "@/constants/log";
import { loggerInfo, loggerError } from "@/lib/logger";
import { verifyOrthrosJwt } from "@/lib/verifyJwt";
import { postLogoutAction } from "@/share/api/logout/postLogout";

const page = pagePath.login.error;

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  loggerInfo(logStartForPageSSR(page));

  const session_cookie = req.cookies.session_cookie;

  try {
    const verify = await verifyOrthrosJwt(session_cookie);

    // 認証情報が正常ならこのページを表示しない
    if (verify) {
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
  const logoutUrl = process.env.NEXT_PUBLIC_LOGOUT_LINK;

  const handleLogout = async () => {
    await postLogoutAction();
    window.location.href = logoutUrl;
  };
  return (
    <Layout maxW="2xl" showHeaderContents={false}>
      <Metatag title={SERVICE_NAME} description={SERVICE_DESCRITION} />
      <VStack justifyContent={"center"} gap={16} mt={8}>
        <WarningIcon w={16} h={16} color={"status.caution"} />
        <Text fontSize={"xl"}>不正なログイン情報</Text>
        <Text fontSize={"md"}>ログイン情報が不正です。再度ログインしてください。</Text>

        <HStack>
          <Box>
            <SecondaryButton onClick={() => handleLogout()}>ログアウトする</SecondaryButton>
          </Box>
        </HStack>
      </VStack>
    </Layout>
  );
};

export default index;
