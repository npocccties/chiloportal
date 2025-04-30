import { HamburgerIcon } from "@chakra-ui/icons";
import { Box, Flex, Link, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React, { memo } from "react";
import { BsWallet2 } from "react-icons/bs";
import { MdLogout, MdHelp } from "react-icons/md";
import { TbDeviceDesktopAnalytics } from "react-icons/tb";

import { pagePath } from "@/constants";
import { sidebarItems } from "@/constants/sidebar";

type Props = {
  onOpen: () => void;
  showContents: boolean;
};

const logoutLink = process.env.NEXT_PUBLIC_LOGOUT_LINK as string;
const portfolioLink = process.env.NEXT_PUBLIC_E_PORTFOLIO_LINK as string;
const helpLink = process.env.NEXT_PUBLIC_HELP_LINK as string;

export const Header: React.FC<Props> = memo(({ onOpen, showContents = true }) => {
  const router = useRouter();
  const portfolioItem = sidebarItems.find((x) => x.link === portfolioLink);
  const helpItem = sidebarItems.find((x) => x.link === helpLink);

  return (
    <Box as="header" position={"fixed"} w={"100%"} zIndex={1000}>
      <Flex
        h={"64px"}
        alignItems={"center"}
        justifyContent={"space-between"}
        backgroundColor={"basic.black"}
        p={{ base: 8 }}
      >
        {showContents ? (
          <>
            <Box display={{ base: "block", md: "none" }}>
              <HamburgerIcon color={"basic.white"} w={6} h={6} cursor={"pointer"} onClick={() => onOpen()} />
            </Box>
            <Box display={{ base: "none", md: "block" }}>
              <Flex gap={"8px"} alignItems={"center"} color={"basic.white"} display={{ base: "none", md: "flex" }}>
                <NextLink href="/" color={"basic.white"} style={{ textDecoration: "none" }}>
                  <Box display={"flex"} flexDirection={"row"} alignItems={"center"} gap={1}>
                    <BsWallet2 size="24" />
                    <Text fontSize={"xl"} mr={2}>
                      マイウォレット
                    </Text>
                  </Box>
                </NextLink>
                <Link fontSize={"xl"} href={portfolioLink} style={{ textDecoration: "none" }}>
                  <Box display={"flex"} flexDirection={"row"} alignItems={"center"} gap={1}>
                    <TbDeviceDesktopAnalytics />
                    <Text mr={2}>{portfolioItem.name}</Text>
                  </Box>
                </Link>
                <Link
                  fontSize={"xl"}
                  href={helpLink}
                  style={{ textDecoration: "none" }}
                  isExternal={helpItem.newWindow}
                  target={helpItem.targetTabName}
                >
                  <Box display={"flex"} flexDirection={"row"} alignItems={"center"} gap={1}>
                    <MdHelp size="24" />
                    <Text fontSize={"xl"} mr={2}>
                      {helpItem.name}
                    </Text>
                  </Box>
                </Link>
              </Flex>
            </Box>
          </>
        ) : (
          <Box></Box>
        )}
        <Box
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        ></Box>
        <Box>
          <Flex gap={"8px"} alignItems={"center"} color={"basic.white"}>
            {pagePath.login.error !== router.asPath && (
              <>
                <Link fontSize={"xl"} href={logoutLink} style={{ textDecoration: "none" }}>
                  <Box display={"flex"} flexDirection={"row"} alignItems={"center"} gap={1}>
                    <MdLogout size="24" />
                    <Text>ログアウト</Text>
                  </Box>
                </Link>
              </>
            )}
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
});
