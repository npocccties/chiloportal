import { Box, Center, Grid, GridItem, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

import { getCookieValue } from "@/lib/cookie";
import { getUserInfoFormJwt } from "@/lib/userInfo";
import { credentialListGetters } from "@/share/store/credentialList/main";

export const DisplayBadgeCount = () => {
  const [name, setName] = useState("");
  const { totalBadgeCount, submissionsAll } = credentialListGetters.useCredentialList();

  useEffect(() => {
    const session_cookie = getCookieValue("session_cookie");

    const { displayName } = getUserInfoFormJwt(session_cookie);
    setName(displayName);
  }, []);
  return (
    <Box border={"main"} borderRadius={"2xl"} px={{ base: 2, sm: 8 }} py={{ base: 4, sm: 8 }}>
      <Text>{name} さんのマイウォレット</Text>
      <Grid templateColumns={"repeat(2, 1fr)"}>
        <GridItem>
          <DisplauCountData prefixText="バッジ" text="保管数" count={totalBadgeCount} />
        </GridItem>
        <GridItem>
          <DisplauCountData prefixText="うち" text="提出済" count={submissionsAll.totalSubmissionBadges} />
        </GridItem>
        <GridItem></GridItem>
      </Grid>
    </Box>
  );
};

const DisplauCountData = ({
  color,
  prefixText,
  text,
  count,
}: {
  color?: string;
  prefixText: string;
  text: string;
  count: number;
}) => {
  return (
    <Center>
      <Box as="span" textAlign={"left"} fontSize={{ base: "12px", sm: "16px" }}>
        {prefixText}
      </Box>
      <Box as="span" fontSize={{ base: "16px", sm: "24px" }} color={color}>
        {text}
      </Box>
      <Box as="span" ml={4} fontSize={"32px"} fontWeight={"bold"}>
        {count}
      </Box>
    </Center>
  );
};
