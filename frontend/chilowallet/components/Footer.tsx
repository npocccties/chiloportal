import { Flex, Link } from "@chakra-ui/react";
import React, { memo } from "react";

const copyrightLink = process.env.NEXT_PUBLIC_COPYRIGHT_LINK as string;
const copyright = process.env.NEXT_PUBLIC_COPYRIGHT as string;

export const Footer: React.VFC = memo(() => {
  return (
    <Flex
      minH={"64px"}
      alignItems={"center"}
      justifyContent={"center"}
      p={{ base: 4 }}
      gap={"16px"}
      backgroundColor={"basic.black"}
    >
      <Link href={copyrightLink} fontSize={"sm"} fontWeight={"medium"} color={"basic.white"}>
        {copyright}
      </Link>
    </Flex>
  );
});
