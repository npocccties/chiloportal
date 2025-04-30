import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Text, Tabs, TabList, Tab, TabPanels, TabPanel, Box, Divider, Flex, Link, Image } from "@chakra-ui/react";
import React from "react";

import { KnowledgeBadgeImageForbase64 } from "@/configs/image";
import { JSTdatetimeToDisplay, JSTdateToDisplay } from "@/lib/date";
import { VcDetailData, KnowledgeBadges, SubmissionsHistories } from "@/types/api/credential/detail";

type Props = {
  vcDetailData: VcDetailData;
  knowledgeBadges: KnowledgeBadges;
  submissionsHistories: SubmissionsHistories;
  expired: boolean;
};

export const VcDetailTabPanel = ({ vcDetailData, knowledgeBadges, submissionsHistories, expired }: Props) => {
  const { badgeEarnerEmail, badgeIssuerName, badgeExpires, courseUrl } = vcDetailData;
  return (
    <Tabs size="md" variant="enclosed">
      <TabList mb={6}>
        <Tab>詳細</Tab>
        <Tab>知識バッジ</Tab>
        <Tab>提出履歴</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <CredentialSubjectItem name="email" data={badgeEarnerEmail} />
          <CredentialSubjectItem name="発行者" data={badgeIssuerName} />
          <CredentialSubjectItem name="有効期限" data={JSTdateToDisplay(badgeExpires)} isDanger={expired} />
          <CredentialSubjectItem name="コース情報" data={courseUrl} />
        </TabPanel>
        <TabPanel>
          {knowledgeBadges.map((item, idx) => {
            return <KnowledgeBadgeItem key={idx} name={item.badgeName} />;
          })}
        </TabPanel>
        <TabPanel>
          {submissionsHistories.map((sub, idx) => {
            return <SubmittionHistoryItem key={idx} name={sub.consumerName} date={sub.submitedAt} />;
          })}
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

interface CredentialSubjectItemProps {
  name: string;
  data: string | Date;
  isDanger?: boolean;
}

const CredentialSubjectItem: React.FC<CredentialSubjectItemProps> = ({ name, data }) => {
  return (
    <Box>
      <Text color="gray" mb={1}>
        {name}
      </Text>
      {"コース情報" === name ? (
        <Text fontSize="md" mb={1}>
          <Link href={data as string} color={"primary.700"} isExternal>
            OKUTEPのコース情報を見る <ExternalLinkIcon />
          </Link>
        </Text>
      ) : data ? (
        <Text fontSize="md" mb={1}>
          {data}
        </Text>
      ) : (
        <Text fontSize="md" mb={1}>
          ------
        </Text>
      )}
      <Divider mb={8} />
    </Box>
  );
};

interface KnowledgeBadgeItemProps {
  name: string;
}

const KnowledgeBadgeItem: React.FC<KnowledgeBadgeItemProps> = ({ name }) => {
  const image = KnowledgeBadgeImageForbase64;
  return (
    <>
      <Flex direction={"row"} alignItems={"center"}>
        <Box minW={"128px"}>
          <Image
            h={{ base: 24, sm: 28 }}
            w={{ base: 24, sm: 28 }}
            fit={"cover"}
            src={`data:image/png;base64,${image}`}
            alt={"test"}
          />
        </Box>
        <Box ml={{ base: 2, sm: 4 }}>
          <Text fontSize={"md"}>{name}</Text>
        </Box>
      </Flex>
      <Divider my={4} />
    </>
  );
};

interface SubmittionHistoryItemProps {
  name: string;
  date: string;
}

const SubmittionHistoryItem: React.FC<SubmittionHistoryItemProps> = ({ name, date }) => {
  return (
    <Box>
      <Text color="gray">提出日時</Text>
      <Text fontSize="md" mt={2} mb={2}>
        {JSTdatetimeToDisplay(date)}
      </Text>
      <Text color="gray" mt={2}>
        提出先
      </Text>
      <Text fontSize="md" mt={2} mb={1}>
        {name}
      </Text>
      <Divider mb={8} />
    </Box>
  );
};
