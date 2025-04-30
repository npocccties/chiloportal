import { Box } from "@chakra-ui/react";
import React, { ReactNode } from "react";

import { Loading } from "@/components/Loading";
import { processingScreenGetters } from "@/share/store/ui/processingScreen/man";

export const ProcessingScreen: React.FC<ReactNode> = ({ children }) => {
  const showContents = processingScreenGetters.useProcessingScreen();
  if (showContents) {
    return (
      <>
        {children}
        <Box
          backgroundColor={"rgba(229, 231, 231, 0.3)"}
          textAlign={"center"}
          position={"fixed"}
          left="0"
          top="0"
          width="100%"
          height="100%"
          zIndex={1000}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <Loading message="処理中です。しばらくお待ちください。" />
          </Box>
        </Box>
      </>
    );
  } else {
    return <>{children}</>;
  }
};
