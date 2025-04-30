import { Text } from "@chakra-ui/react";

export const PageTitle = ({ title }: { title: string }) => {
  return (
    <Text color={"basic.black"} fontSize={{ base: "xl", md: "2xl" }} fontWeight={"bold"} textAlign={"center"}>
      {title}
    </Text>
  );
};
