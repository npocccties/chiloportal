import { Box, Heading, FormControl, FormLabel, Input, Text } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { PrimaryButton } from "@/components/ui/button/PrimaryButton";
import { SecondaryButton } from "@/components/ui/button/SecondaryButton";
import { moodleUserNameSchema } from "@/lib/validation";
import { badgeListActions } from "@/share/store/badgeList/main";

type UserInfo = {
  username: string;
  password: string;
};

export const MoodleLoginForm = ({
  setIsNeedMoodleLogin,
  setSelectLmsId,
  getMyBadges,
  lmsName,
}: {
  setIsNeedMoodleLogin: Dispatch<SetStateAction<boolean>>;
  setSelectLmsId: Dispatch<SetStateAction<string>>;
  getMyBadges: (username: string, password: string) => void;
  lmsName: string;
}) => {
  const userInfoSchema = z.object({
    username: moodleUserNameSchema,
    password: z.string(),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserInfo>({
    resolver: zodResolver(userInfoSchema),
  });
  const { clearBadgeList } = badgeListActions.useClearBadgeList();

  const onSubmit = (data: UserInfo) => {
    const { username, password } = data;
    setIsNeedMoodleLogin(false);
    getMyBadges(username, password);
  };

  return (
    <Box w={{ base: "full", sm: "md" }} mt={4}>
      <Heading textAlign={"center"} fontWeight={600} fontSize={"xl"} lineHeight={"110%"}>
        {lmsName}に登録されている
        <br />
        ユーザー名とパスワードを入力してください
      </Heading>

      <FormControl as="form" onSubmit={handleSubmit(onSubmit)}>
        <Box mt={12}>
          <FormLabel htmlFor="username">ユーザー名</FormLabel>
          <Input id="username" placeholder="UserName" maxLength={256} {...register("username")} />
          <Text>{errors.username?.message}</Text>
        </Box>
        <Box mt={8}>
          <FormLabel htmlFor="password">パスワード</FormLabel>
          <Input id="password" placeholder="password" type="password" maxLength={256} {...register("password")} />
          <Text>{errors.password?.message}</Text>
        </Box>
        <Box mt={8}>
          <PrimaryButton mt={4} w={"full"} type="submit">
            バッジ一覧取得
          </PrimaryButton>
        </Box>
        <Box mt={4}>
          <SecondaryButton
            mt={4}
            w={"full"}
            onClick={() => {
              clearBadgeList();
              setSelectLmsId("");
              setIsNeedMoodleLogin(false);
            }}
          >
            戻る
          </SecondaryButton>
        </Box>
      </FormControl>
    </Box>
  );
};
