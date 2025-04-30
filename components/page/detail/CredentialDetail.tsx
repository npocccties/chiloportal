import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Flex,
  useDisclosure,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useRef } from "react";

import { DangerButton } from "@/components/ui/button/DangerButton";
import { PrimaryButton } from "@/components/ui/button/PrimaryButton";
import { SecondaryButton } from "@/components/ui/button/SecondaryButton";
import { BadgeVcCard } from "@/components/ui/card/BadgeVcCard";
import { VcDetailTabPanel } from "@/components/ui/tabPanel/VcDetailTabPanel";
import { pagePath } from "@/constants";
import { isBefoerCurrentTimeJST } from "@/lib/date";
import { vcDetailActions } from "@/share/store/credentialDetail/main";
import { processingScreenActions } from "@/share/store/ui/processingScreen/man";
import { CredentialDetailData } from "@/types/api/credential/detail";

export const CredentialDetail: React.FC<CredentialDetailData> = ({
  vcDetailData,
  knowledgeBadges,
  submissionsHistories,
  badgeExportData,
}) => {
  const router = useRouter();
  const cancelRef = useRef();
  const expired = isBefoerCurrentTimeJST(vcDetailData.badgeExpires);
  const isDeleteDisabled = vcDetailData.submissions.length !== 0;
  const { showProcessingScreen } = processingScreenActions.useShowProcessingScreen();

  const { deleteCredential } = vcDetailActions.useDeleteCredential();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleClickDelete = async () => {
    showProcessingScreen(async () => {
      await deleteCredential(vcDetailData.badgeVcId);
      router.push(pagePath.credential.list);
    });
  };
  return (
    <>
      {vcDetailData && (
        <Box>
          <Box mb={12}>
            <BadgeVcCard badgeVc={vcDetailData} />
          </Box>
          <VcDetailTabPanel
            vcDetailData={vcDetailData}
            knowledgeBadges={knowledgeBadges}
            submissionsHistories={submissionsHistories}
            expired={expired}
          />
          <Box mt={8}>
            <PrimaryButton
              w="full"
              disabled={expired}
              onClick={() => router.push(`${pagePath.submission.enter}/${router.query.badge_vc_id}`)}
            >
              バッジ提出
            </PrimaryButton>
          </Box>
          <Flex justifyContent={"space-between"} mt={12}>
            <DangerButton w={160} disabled={isDeleteDisabled} onClick={onOpen}>
              削除
            </DangerButton>
            <PrimaryButton
              as="a"
              w={160}
              href={`data:image/png;base64,${badgeExportData}`}
              download={`${vcDetailData.badgeName}.png`}
            >
              エクスポート
            </PrimaryButton>
          </Flex>
          <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
            <AlertDialogOverlay>
              <AlertDialogContent>
                <AlertDialogHeader fontSize="lg" fontWeight="bold">
                  バッジ削除
                </AlertDialogHeader>

                <AlertDialogBody>
                  本当にこのバッジを削除しますか？
                  <br />
                  この操作は取り消せません。
                </AlertDialogBody>

                <AlertDialogFooter>
                  <SecondaryButton ref={cancelRef} onClick={onClose}>
                    キャンセル
                  </SecondaryButton>
                  <DangerButton
                    ml={3}
                    onClick={() => {
                      handleClickDelete();
                    }}
                  >
                    削除
                  </DangerButton>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>
        </Box>
      )}
    </>
  );
};
