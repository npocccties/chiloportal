import { Flex, Box, Container, Stack, useDisclosure, Drawer, DrawerContent, DrawerOverlay } from "@chakra-ui/react";
import React from "react";

import { Footer } from "./Footer";
import { Header } from "./Header";
import { SidebarContent } from "./Sidebar";

export interface LayoutProps {
  children: React.ReactNode;
  showHeaderContents?: boolean;
  maxW?: string;
  textAlign?: "center";
  align?: string;
}

export const Layout: React.VFC<LayoutProps> = ({ children, maxW, textAlign, align, showHeaderContents = true }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Flex minHeight={"100vh"} direction={"column"}>
      <Header onOpen={onOpen} showContents={showHeaderContents} />
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="xs"
      >
        <DrawerOverlay />
        <DrawerContent maxW={{ base: "full", sm: "xs" }}>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      <Box flex={1}>
        <Container maxW={maxW}>
          <Stack textAlign={textAlign} align={align} spacing={{ base: 8, sm: 10 }} py={{ base: 20, sm: 28 }}>
            {children}
          </Stack>
        </Container>
      </Box>
      <Footer />
    </Flex>
  );
};
