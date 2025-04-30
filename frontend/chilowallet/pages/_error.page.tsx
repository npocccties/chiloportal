import { WarningIcon } from "@chakra-ui/icons";
import { Box, HStack, Text, VStack } from "@chakra-ui/react";
import { NextPageContext } from "next";
import { useRouter } from "next/router";

import { Layout } from "@/components/Layout";
import { Metatag } from "@/components/Metatag";
import { SecondaryButton } from "@/components/ui/button/SecondaryButton";
import { SERVICE_DESCRITION, SERVICE_NAME } from "@/configs";
import { pagePath } from "@/constants";
import { errors } from "@/constants/error";

function ErrorPage({ statusCode, errorMessage }) {
  const router = useRouter();
  const errorLabel = statusCode === 500 ? errors.response500.label : `${statusCode} Not Found`;

  const handleBack = () => {
    router.push(pagePath.credential.list);
  };

  return (
    <Layout maxW="2xl" showHeaderContents={false}>
      <Metatag title={SERVICE_NAME} description={SERVICE_DESCRITION} />
      <VStack justifyContent={"center"} gap={16} mt={8}>
        <WarningIcon w={16} h={16} color={"status.caution"} />
        <Text fontSize={"xl"}>{errorLabel}</Text>
        <Text fontSize={"md"}>{errorMessage}</Text>

        <HStack>
          <Box>
            <SecondaryButton onClick={handleBack}>マイウォレットに戻る</SecondaryButton>
          </Box>
        </HStack>
      </VStack>
    </Layout>
  );
}

ErrorPage.getInitialProps = ({ res, err }: NextPageContext) => {
  if (typeof window !== "undefined") {
    const nextData = JSON.parse(document.getElementById("__NEXT_DATA__")!.innerHTML);

    if (nextData.props.pageProps) {
      const { statusCode, errorMessage } = nextData.props.pageProps;
      return { statusCode, errorMessage };
    }
  }

  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  const errorMessage = err ? err.message : "お探しのページは見つかりませんでした。";

  return { statusCode, errorMessage };
};

export default ErrorPage;
