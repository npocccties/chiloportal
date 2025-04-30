import { Box, Spinner, Text } from "@chakra-ui/react";
import React from "react";
export const Loading: React.FC<{ message?: string }> = ({ message }) => {
  return (
    <Box>
      <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="primary.500" size="xl" />
      <Text mt="4">{message ? message : "Loading..."}</Text>
    </Box>
  );
};
