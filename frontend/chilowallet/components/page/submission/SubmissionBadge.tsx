import { CheckCircleIcon } from "@chakra-ui/icons";
import { Box, VStack, FormLabel, Select, Input, Flex, Text, Image, Checkbox } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { PrimaryButton } from "@/components/ui/button/PrimaryButton";
import { SecondaryButton } from "@/components/ui/button/SecondaryButton";
import { pagePath, sessionStorageKey } from "@/constants";
import { sendEmailFormSchema } from "@/lib/validation";
import { sendConfirmEmail } from "@/share/api/submission/sendConfirmEmail";
import { processingScreenActions } from "@/share/store/ui/processingScreen/man";
import { SendMail, SubmissionEntry } from "@/types/api/submission";

type InputForm = {
  consumerId: number | string;
  email: string;
  sameIdForEmail: boolean;
  externalLinkageId: string;
  confirmLinkageId: string;
};

export const SubmissionBadge = ({ badgeConsumers, vcImage, badgeVcId, badgeName, badgeIssuedon }: SubmissionEntry) => {
  const router = useRouter();
  const pathParam = router.query.badge_vc_id;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showProcessingScreen } = processingScreenActions.useShowProcessingScreen();

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    reset,
    formState: { errors },
  } = useForm<InputForm>({
    defaultValues: {
      consumerId: "",
    },
    resolver: zodResolver(sendEmailFormSchema),
  });

  const sameIdForEmail = watch("sameIdForEmail");

  const onSubmit = async (input: InputForm) => {
    if (input.externalLinkageId !== input.confirmLinkageId) {
      alert("指定されたIDが確認フォームの内容と一致しません。");
      return;
    }

    const consumerId = typeof input.consumerId === "string" ? Number(input.consumerId) : input.consumerId;

    const data = await showProcessingScreen<SendMail>(() => sendConfirmEmail({ email: input.email, consumerId }));

    const selectConsumer = {
      consumerId: consumerId,
      consumerName: badgeConsumers.find((x) => x.consumerId === Number(input.consumerId)).consumerName,
    };
    const badgeVcData = {
      badgeVcId: badgeVcId,
      badgeName: badgeName,
      badgeIssuedon: badgeIssuedon,
      vcImage: vcImage,
    };
    const { confirmCode, submissionEmail, externalLinkageId, consumer, badgeVc } = sessionStorageKey;
    sessionStorage.setItem(confirmCode, data.hashConfirmCode);
    sessionStorage.setItem(submissionEmail, input.email);
    sessionStorage.setItem(externalLinkageId, input.externalLinkageId);
    sessionStorage.setItem(consumer, JSON.stringify(selectConsumer));
    sessionStorage.setItem(badgeVc, JSON.stringify(badgeVcData));

    reset();
    setIsSubmitting(true);
  };

  useEffect(() => {
    if (sameIdForEmail) {
      const email = getValues("email");
      setValue("externalLinkageId", email);
      setValue("confirmLinkageId", email);
    } else {
      setValue("externalLinkageId", "");
      setValue("confirmLinkageId", "");
    }
  }, [sameIdForEmail, getValues, setValue]);

  if (isSubmitting) {
    return (
      <VStack justifyContent={"center"} gap={16} mt={8}>
        <Box>
          <Box mb={4}>
            <CheckCircleIcon w={8} h={8} color="status.success" />
          </Box>
          <Text>送信完了</Text>
        </Box>
        <Box>
          <Text fontSize={"lg"}>入力されたemailアドレス宛に</Text>
          <Text fontSize={"lg"}>確認コードを記載したメールが送信されました。</Text>
          <Text fontSize={"lg"}>メールのご確認をお願いします。</Text>
        </Box>
        <Box>
          <PrimaryButton onClick={() => router.push(`${pagePath.submission.confirm}/${pathParam}`)}>
            確認コード入力
          </PrimaryButton>
        </Box>
      </VStack>
    );
  } else {
    return (
      <>
        <Box mt={4}>
          <Image w={48} h={48} fit={"cover"} src={"data:image/png;base64," + vcImage} alt={"OpenBadgeImage"} />
        </Box>
        <Box textAlign={"left"}>
          <Text fontSize={"md"} mt={1}>
            入力されたemailアドレス宛に確認コードを
          </Text>
          <Text fontSize={"md"} mt={1}>
            記載したメールが送信されます。
          </Text>
        </Box>
        <form style={{ width: "100%" }} onSubmit={handleSubmit(onSubmit)}>
          <VStack w={"full"} alignItems={"flex-start"} gap={6}>
            <Box w={"full"}>
              <FormLabel mb={2}>バッジ提出先選択</FormLabel>
              <Select {...register("consumerId", { required: true })}>
                <option value="">選択してください</option>
                {badgeConsumers.map((item) => {
                  return (
                    <option key={item.consumerId} value={item.consumerId}>
                      {item.consumerName}
                    </option>
                  );
                })}
              </Select>
              <Text size="xs" mt={2}>
                {errors.consumerId?.message}
              </Text>
            </Box>
            <Box w={"full"}>
              <FormLabel mb={2}>emailアドレス</FormLabel>
              <Input placeholder="email@example.com" type={"email"} maxLength={256} {...register("email")} />
              <Text size="xs" mt={2}>
                {errors.email?.message}
              </Text>
            </Box>
            <Box as="section" w={"full"} border={"1px solid #ddd"} borderRadius={"md"} padding={6}>
              <Box mb={4}>
                <Box>
                  <FormLabel mb={0}>指定されたID</FormLabel>
                </Box>
                <Box textAlign={"right"}>
                  <Checkbox size={"md"} colorScheme={"primary"} {...register("sameIdForEmail")}>
                    emailアドレスと同じ場合
                  </Checkbox>
                </Box>
              </Box>
              <Box w={"full"} mb={4}>
                <Input type={"externalLinkageId"} maxLength={256} {...register("externalLinkageId")} />
                <Text size="xs" mt={2}>
                  {errors.externalLinkageId?.message}
                </Text>
              </Box>
              <Box w={"full"}>
                <FormLabel mb={2}>確認のため再度入力してください。</FormLabel>
                <Input type={"confirmLinkageId"} maxLength={256} {...register("confirmLinkageId")} />
                <Text size="xs" mt={2}>
                  {errors.confirmLinkageId?.message}
                </Text>
              </Box>
            </Box>
            <Box w={"full"}>
              <Flex justifyContent={"space-between"}>
                <SecondaryButton w={120} onClick={() => router.push(`${pagePath.credential.detail}/${pathParam}`)}>
                  戻る
                </SecondaryButton>
                <PrimaryButton type="submit" w={120}>
                  送信
                </PrimaryButton>
              </Flex>
            </Box>
          </VStack>
        </form>
      </>
    );
  }
};
