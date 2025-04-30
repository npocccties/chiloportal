import {
  Flex,
  Box,
  FormLabel,
  Select,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogOverlay,
  useDisclosure,
  AlertDialogFooter,
} from "@chakra-ui/react";
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

import { Loading } from "@/components/Loading";
import { MoodleLoginForm } from "@/components/model/moodle/MoodleLoginform";
import { SecondaryButton } from "@/components/ui/button/SecondaryButton";
import { MyBadgesList, MyBadgesListSp } from "@/components/ui/table/MybadgeList";
import { badgeListActions, badgeListGetters } from "@/share/store/badgeList/main";
import { badgeMetaDataActions } from "@/share/store/badgeMetaData/main";
import { selectBadgeActions, selectBadgeGetters } from "@/share/store/selectBadge/main";
import { SafeLmsList } from "@/types/lms";

export const BadgeList = ({
  lmsList,
  setIsBadgeSelect,
}: {
  lmsList: SafeLmsList[];
  setIsBadgeSelect: Dispatch<SetStateAction<boolean>>;
}) => {
  const cancelRef = useRef();
  const { badgeList, loginError } = badgeListGetters.useBadgeList();
  const selectBadge = selectBadgeGetters.useSelectBadgeData();
  const { fetchBadgeList } = badgeListActions.useFetchBadgeList();
  const { clearBadgeList } = badgeListActions.useClearBadgeList();
  const { fetchBadgeMetaData } = badgeMetaDataActions.useFetchBadgeMetaData();
  const { setSelectBadge } = selectBadgeActions.useSelectBadge();

  const [selectLmsId, setSelectLmsId] = useState(selectBadge.lmsId.toString());
  const [isNeedMoodleLogin, setIsNeedMoodleLogin] = useState(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const fetchMoodleMyBadges = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      await fetchBadgeList({ username, password, lmsId: Number(selectLmsId) });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeIssuer = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectLmsId(e.target.value);
    if (e.target.value === "") {
      clearBadgeList();
      return;
    }

    setIsLoading(true);

    const selectIssuer = lmsList.filter((x) => x.lmsId.toString() === e.target.value)[0];
    const { lmsId, ssoEnabled } = selectIssuer;

    if (!ssoEnabled) {
      setIsNeedMoodleLogin(true);
      setIsLoading(false);
      return;
    }

    try {
      await fetchBadgeList({ lmsId });
    } finally {
      setIsLoading(false);
    }
  };
  const handleBadgeSelect = async (uniquehash: string, email: string) => {
    const { lmsId, lmsName, lmsUrl } = lmsList.find((x) => x.lmsId.toString() === selectLmsId);

    await fetchBadgeMetaData({ uniquehash, lmsUrl });
    setSelectBadge({ email, uniquehash, lmsId, lmsName });
    setIsBadgeSelect(true);
  };

  useEffect(() => {
    if (loginError) {
      onOpen();
      setSelectLmsId("");
    }
  }, [badgeList]);

  useEffect(() => {
    return () => {
      clearBadgeList();
    };
  }, []);

  if (isNeedMoodleLogin) {
    return (
      <MoodleLoginForm
        setIsNeedMoodleLogin={setIsNeedMoodleLogin}
        setSelectLmsId={setSelectLmsId}
        getMyBadges={fetchMoodleMyBadges}
        lmsName={lmsList.find((item) => item.lmsId.toString() === selectLmsId).lmsName}
      />
    );
  } else {
    return (
      <>
        {/** desktop */}
        <Flex
          display={{ base: "none", sm: "flex" }}
          w="full"
          justify={"space-between"}
          direction={"row"}
          alignItems={"flex-end"}
        >
          <Box mt={4}>
            <FormLabel mb={2} fontSize={"md"}>
              学習サービス名選択
            </FormLabel>
            <Select w={72} value={selectLmsId} onChange={(e) => handleChangeIssuer(e)}>
              <option value="">選択してください</option>
              {lmsList.map((item) => {
                const key = item.lmsId;
                return (
                  <option key={key} value={key}>
                    {item.lmsName}
                  </option>
                );
              })}
            </Select>
          </Box>
        </Flex>

        {/** smart phone */}
        <Flex
          display={{ base: "flex", sm: "none" }}
          w="full"
          justify={"space-between"}
          direction={"column"}
          alignItems={"center"}
        >
          <Box w={"full"} mt={8}>
            <FormLabel mb={2} fontSize={"sm"}>
              学習サービス名選択
            </FormLabel>
            <Select value={selectLmsId} onChange={(e) => handleChangeIssuer(e)}>
              <option value="">選択してください</option>
              {lmsList.map((item) => {
                const key = item.lmsId;
                return (
                  <option key={key} value={key}>
                    {item.lmsName}
                  </option>
                );
              })}
            </Select>
          </Box>
        </Flex>

        <Flex w="full" align={"center"} direction={"column"}>
          {isLoading ? (
            <Loading message="バッジリスト読込中" />
          ) : (
            <>
              <Box display={{ sm: "block", base: "none" }}>
                {<MyBadgesList badgeList={badgeList} handleBadgeSelect={handleBadgeSelect} />}
              </Box>
              <Box display={{ sm: "none", base: "block" }}>
                {<MyBadgesListSp badgeList={badgeList} handleBadgeSelect={handleBadgeSelect} />}
              </Box>
            </>
          )}
        </Flex>
        <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                ログインエラー
              </AlertDialogHeader>

              <AlertDialogBody>ユーザー名、パスワードが一致しませんでした</AlertDialogBody>

              <AlertDialogFooter>
                <SecondaryButton ref={cancelRef} onClick={onClose}>
                  閉じる
                </SecondaryButton>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </>
    );
  }
};
