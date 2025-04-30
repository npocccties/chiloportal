import { CheckCircleIcon } from "@chakra-ui/icons";
import { Box, Flex, Text, Image, VStack, Divider, Stack } from "@chakra-ui/react";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";

import { PrimaryButton } from "@/components/ui/button/PrimaryButton";
import { SecondaryButton } from "@/components/ui/button/SecondaryButton";
import { ResponseState } from "@/components/ui/response/ResponseState";
import { JSTdateToDisplay } from "@/lib/date";
import { importBadgeConvertToVc } from "@/share/api/badgeImport/importBadgeConvertVc";
import { badgeMetadataGetters } from "@/share/store/badgeMetaData/main";
import { selectBadgeActions, selectBadgeGetters } from "@/share/store/selectBadge/main";
import { processingScreenActions } from "@/share/store/ui/processingScreen/man";

type ResponseStatus = "success" | "failed" | undefined;
type Props = {
  setIsBadgeSelect: Dispatch<SetStateAction<boolean>>;
};

export const VcImport = ({ setIsBadgeSelect }: Props) => {
  const [isVcImport, setIsVcImport] = useState(false);
  const [responseState, setRequestState] = useState<ResponseStatus>(undefined);
  const badgeMetaData = badgeMetadataGetters.useBadgeMetaData();
  const { email, uniquehash, lmsId, lmsName } = selectBadgeGetters.useSelectBadgeData();
  const { clearSelectBadge } = selectBadgeActions.useSelectBadge();
  const { showProcessingScreen } = processingScreenActions.useShowProcessingScreen();

  const handleClickImport = async () => {
    await showProcessingScreen(() => importBadgeConvertToVc({ uniquehash, email, badgeMetaData, lmsId, lmsName }));
    setRequestState("success");
    setIsVcImport(true);
    clearSelectBadge();
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!isVcImport) {
    return (
      <Box w={"100%"} mt={6} gap={16}>
        <Box textAlign={"left"}>
          <Text fontSize={{ base: "sm", sm: "md" }} textAlign={"center"}>
            このバッジをマイウォレットにインポートしますか？
          </Text>
        </Box>
        {badgeMetaData && (
          <>
            <Box mt={8} display={"flex"} justifyContent={"center"}>
              <Image w={48} h={48} fit={"cover"} src={badgeMetaData.badge.image} alt={"test"} />
            </Box>
            <Stack w={"full"} mt={8} alignItems={"stretch"}>
              <BadgeDataItem name="バッジ名" data={badgeMetaData.badge.name} />
              <BadgeDataItem name="email" data={email} />
              <BadgeDataItem name="発行者" data={badgeMetaData.badge.issuer.name} />
              <BadgeDataItem name="有効期限" data={JSTdateToDisplay(badgeMetaData.expires?.toString()) ?? "------"} />
            </Stack>
            <Box w={"full"} mt={8}>
              <Flex justifyContent={"space-between"}>
                <SecondaryButton
                  w={160}
                  onClick={() => {
                    setIsBadgeSelect(false);
                    clearSelectBadge();
                  }}
                >
                  キャンセル
                </SecondaryButton>
                <PrimaryButton w={160} onClick={() => handleClickImport()}>
                  インポート
                </PrimaryButton>
              </Flex>
            </Box>
          </>
        )}
      </Box>
    );
  } else {
    return (
      <VStack justifyContent={"center"} gap={16} mt={8}>
        {responseState === "success" && (
          <ResponseState
            icon={<CheckCircleIcon w={8} h={8} color="status.success" />}
            status="success!"
            message="バッジのインポートが完了しました！"
          />
        )}
      </VStack>
    );
  }
};

interface BadgeDataItemProps {
  name: string;
  data: string | Date;
}

const BadgeDataItem: React.FC<BadgeDataItemProps> = ({ name, data }) => {
  return (
    <Box>
      <Text color="gray" mb={4} textAlign={"left"}>
        {name}
      </Text>
      <Text fontSize="lg" my={8} textAlign={"left"}>
        {data}
      </Text>
      <Divider mb={8} />
    </Box>
  );
};
