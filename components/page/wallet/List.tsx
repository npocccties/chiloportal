import { Flex } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

import { SearchForm } from "@/components/model/credential/CredentialSearchForm";
import { PrimaryButton } from "@/components/ui/button/PrimaryButton";
import { DisplayBadgeCount } from "@/components/ui/card/DisplayBadgeCount";
import { VcList } from "@/components/ui/VcList";
import { pagePath } from "@/constants";
import { credentialListActions } from "@/share/store/credentialList/main";

export const WaletVCList = () => {
  const router = useRouter();
  const { fetchCredentialList } = credentialListActions.useFetchCredentialList();
  useEffect(() => {
    fetchCredentialList();
  }, []);

  return (
    <>
      <DisplayBadgeCount />
      <Flex mt={4}>
        <PrimaryButton w={"100%"} onClick={() => router.push(pagePath.badge.import)}>
          バッジインポート
        </PrimaryButton>
      </Flex>
      <SearchForm />
      <VcList />
    </>
  );
};
