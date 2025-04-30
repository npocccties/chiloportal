import { CheckCircleIcon, WarningIcon } from "@chakra-ui/icons";
import { Box, VStack, FormLabel, Input, Flex, Text, Image, Divider, useDisclosure } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useRef, useState } from "react";

import { PrimaryButton } from "@/components/ui/button/PrimaryButton";
import { SecondaryButton } from "@/components/ui/button/SecondaryButton";
import { MessageListDialog } from "@/components/ui/dialog/MessageListDialog";
import { ResponseState } from "@/components/ui/response/ResponseState";
import { pagePath, sessionStorageKey } from "@/constants";
import { JSTdateToDisplay } from "@/lib/date";
import { postSubmissionVc } from "@/share/api/submission/postSubmissionVc";
import { processingScreenActions } from "@/share/store/ui/processingScreen/man";
import { SubmissionResponseStatus } from "@/types/status";

type ConsumerData = {
  consumerId: number;
  consumerName: string;
};
type BadgeVcData = {
  badgeVcId: number;
  badgeName: string;
  badgeIssuedon: string;
  vcImage: string;
};

export const Confirm = () => {
  const router = useRouter();
  const cancelRef = useRef();
  const [isSubmission, setIsSubmission] = useState(false);
  const [responseState, setResponseState] = useState<SubmissionResponseStatus>(undefined);
  const { showProcessingScreen } = processingScreenActions.useShowProcessingScreen();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const submissionEmail = sessionStorage.getItem(sessionStorageKey.submissionEmail);
  const externalLinkageId = sessionStorage.getItem(sessionStorageKey.externalLinkageId);
  const consumerJson = sessionStorage.getItem(sessionStorageKey.consumer);
  const badgeVcJson = sessionStorage.getItem(sessionStorageKey.badgeVc);
  const consumer = JSON.parse(consumerJson) as ConsumerData;
  const badgeVc = JSON.parse(badgeVcJson) as BadgeVcData;
  const badgeVcId = router.query.badge_vc_id;

  const message = [
    `修了した研修名： ${badgeVc.badgeName}`,
    `研修修了日： ${JSTdateToDisplay(badgeVc.badgeIssuedon)} `,
    `提出時に入力したメールアドレス： ${submissionEmail}`,
  ];

  const handleSubmission = async () => {
    onClose();
    const { consumerId } = consumer;
    const { badgeVcId } = badgeVc;

    await showProcessingScreen(async () => {
      const data = await postSubmissionVc({ consumerId, email: submissionEmail, badgeVcId, externalLinkageId });

      setIsSubmission(true);
      setResponseState(data.result);
      if (data.result === "success") {
        sessionStorage.removeItem(sessionStorageKey.confirmCode);
      }
    });
  };

  const handleOpenModal = async (confirmCode: string) => {
    const hashConfirmCode = sessionStorage.getItem(sessionStorageKey.confirmCode);
    const hashInput = await generateHash(confirmCode);

    if (hashConfirmCode !== hashInput) {
      alert("確認コードが一致しません");
      return;
    }

    onOpen();
  };

  async function generateHash(confirmCode: string) {
    const encoder = new TextEncoder();
    const encodedCode = encoder.encode(confirmCode.toString());
    const hashBuffer = await crypto.subtle.digest("SHA-256", encodedCode);

    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("");

    return hashHex;
  }

  if (badgeVcId) {
    if (badgeVc.badgeVcId.toString() !== badgeVcId) {
      router.push("/404");
      return null;
    }
  }

  if (!submissionEmail || !consumer || !badgeVc) {
    const returnPath = `${pagePath.submission.enter}/${router.query.badge_vc_id}`;

    return (
      <>
        <Box>
          <Box mb={4}>
            <WarningIcon w={8} h={8} color="status.caution" />
          </Box>
          <Text>error!</Text>
        </Box>
        <Box>
          <Text fontSize={"lg"}>セッション情報がありません</Text>
        </Box>
        <Box>
          <SecondaryButton onClick={() => router.push(returnPath)}>確認コードを再発行する</SecondaryButton>
        </Box>
      </>
    );
  }

  if (!isSubmission) {
    return (
      <>
        <Box textAlign={"left"}>
          <Text fontSize={"md"}>提出するバッジ</Text>
        </Box>
        <Box mt={4}>
          <Image w={48} h={48} fit={"cover"} src={"data:image/png;base64," + badgeVc.vcImage} alt={"test"} />
        </Box>

        <VStack w={"full"} alignItems={"flex-start"} gap={12}>
          <Box w={"full"} textAlign={"left"}>
            <Text color="gray" mb={4}>
              提出先名
            </Text>
            <Text fontSize="lg" my={6}>
              {consumer.consumerName}
            </Text>
            <Divider mb={2} />
          </Box>

          <Box w={"full"} textAlign={"left"}>
            <Text color="gray" mb={4}>
              提出者Emailアドレス
            </Text>
            <Text fontSize="lg" my={6}>
              {submissionEmail}
            </Text>
            <Divider mb={2} />
          </Box>

          <Box w={"full"} textAlign={"left"}>
            <Text color="gray" mb={4}>
              指定されたID
            </Text>
            <Text fontSize="lg" my={6}>
              {externalLinkageId}
            </Text>
            <Divider mb={2} />
          </Box>

          <SubmissionCode handleOpenModal={handleOpenModal} />
        </VStack>
        <MessageListDialog
          title={`研修修了書として、以下の情報が${consumer.consumerName}に提出されます。よろしいでしょうか？`}
          messages={message}
          okButtonrText="OK"
          closeButtontText="キャンセル"
          isOpen={isOpen}
          onClose={onClose}
          cancelRef={cancelRef}
          handleOkClick={handleSubmission}
        />
      </>
    );
  } else {
    return (
      <VStack justifyContent={"center"} gap={16} mt={8}>
        {responseState === "success" && (
          <ResponseState
            icon={<CheckCircleIcon w={8} h={8} color="status.success" />}
            status="success!"
            message="バッジの提出が完了しました！"
          />
        )}
        {responseState === "invalid userId" && (
          <ResponseState
            icon={<WarningIcon w={8} h={8} color="status.caution" />}
            status="invalid userId!"
            message="登録されていないIDです"
            pageBack={{ action: () => router.push(`${pagePath.submission.enter}/${badgeVcId}`), text: "再入力する" }}
          />
        )}
        {responseState === "verification failure" && (
          <ResponseState
            icon={<WarningIcon w={8} h={8} color="status.caution" />}
            status="verification failure!"
            message="バッジの検証に失敗しました"
            pageBack={{
              action: () => router.reload(),
              text: "提出画面に戻る",
            }}
          />
        )}
        {responseState === "other errors" && (
          <ResponseState
            icon={<WarningIcon w={8} h={8} color="status.caution" />}
            status="other errors!"
            message="予期せぬエラーが発生しました"
          />
        )}
      </VStack>
    );
  }
};

const SubmissionCode = ({ handleOpenModal }: { handleOpenModal: (confirmCode: string) => void }) => {
  const router = useRouter();
  const { badge_vc_id } = router.query;
  const [codeInput, setCodeInput] = useState("");
  return (
    <>
      <Box w={"full"}>
        <FormLabel mb={2}>確認コードを入力</FormLabel>
        <Input type={"text"} maxLength={10} onChange={(e) => setCodeInput(e.target.value)} />
      </Box>
      <Box w={"full"}>
        <Flex justifyContent={"space-between"}>
          <SecondaryButton w={140} onClick={() => router.push(`${pagePath.credential.detail}/${badge_vc_id}`)}>
            キャンセル
          </SecondaryButton>
          <PrimaryButton w={140} onClick={() => handleOpenModal(codeInput)}>
            バッジを提出
          </PrimaryButton>
        </Flex>
      </Box>
    </>
  );
};
