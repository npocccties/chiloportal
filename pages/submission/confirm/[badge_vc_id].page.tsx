import dynamic from "next/dynamic";

import { Layout } from "@/components/Layout";
import { Metatag } from "@/components/Metatag";
import { PageTitle } from "@/components/ui/text/PageTitle";
import { SERVICE_NAME, SERVICE_DESCRITION } from "@/configs";
import { pageName } from "@/constants";

const Confirm = dynamic(() => import("@/components/page/submission/Confirm").then((mod) => mod.Confirm), {
  ssr: false,
});

const SubmittionConfirmPage = () => {
  return (
    <Layout align="center" textAlign="center" maxW="sm">
      <Metatag title={SERVICE_NAME} description={SERVICE_DESCRITION} />
      <PageTitle title={pageName.submission} />
      <Confirm />
    </Layout>
  );
};

export default SubmittionConfirmPage;
