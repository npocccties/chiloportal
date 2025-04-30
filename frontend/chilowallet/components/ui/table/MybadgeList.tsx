import { CheckIcon } from "@chakra-ui/icons";
import { TableContainer, Table, Thead, Tr, Th, Tbody, Td, Link, Box, Text } from "@chakra-ui/react";
import { memo } from "react";

import { convertUNIXorISOstrToJST, JSTdateToDisplay } from "@/lib/date";
import { IfBadgeInfo } from "@/types/BadgeInfo";

const MyBadgesList = memo(
  ({
    badgeList,
    handleBadgeSelect,
  }: {
    badgeList: IfBadgeInfo[];
    handleBadgeSelect: (uniquehash: string, email: string) => void;
  }) => {
    return (
      <TableContainer>
        <Table sx={{ tableLayout: "fixed", borderCollapse: "separate", borderSpacing: "0 1em" }}>
          <Thead bg={"basic.black"}>
            <Tr>
              <Th p={2} w={70} textAlign={"center"} color={"basic.white"}>
                取得済
              </Th>
              <Th minW="200" p={2} color={"basic.white"}>
                バッジ名
              </Th>
              <Th minW="200" p={2} color={"basic.white"}>
                バッジ詳細
              </Th>
              <Th w={120} p={4} color={"basic.white"}>
                発行日
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {badgeList?.map((badge, index: number) => {
              const dateIssued = convertUNIXorISOstrToJST(badge.dateissued);
              return (
                <Tr key={index} textAlign="left" borderBottom={"2px solid"} borderColor={"gray.200"} mb={2}>
                  <Td p={2} textAlign={"center"}>
                    {badge.vcConverted && <CheckIcon />}
                  </Td>
                  <Td sx={{ whiteSpace: "pre-wrap" }} p={2}>
                    {badge.vcConverted ? (
                      <Text>{badge.name}</Text>
                    ) : (
                      <Link
                        color="primary.700"
                        onClick={() => {
                          handleBadgeSelect(badge.uniquehash, badge.email);
                        }}
                      >
                        {badge.name}
                      </Link>
                    )}
                  </Td>
                  <Td sx={{ whiteSpace: "pre-wrap" }} p={2}>
                    <Text fontSize={"sm"}>{badge.description}</Text>
                  </Td>
                  <Td p={4}>{JSTdateToDisplay(dateIssued)}</Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
    );
  },
);

const MyBadgesListSp = memo(
  ({
    badgeList,
    handleBadgeSelect,
  }: {
    badgeList: IfBadgeInfo[];
    handleBadgeSelect: (uniquehash: string, email: string) => void;
  }) => {
    return (
      <TableContainer>
        <Table sx={{ tableLayout: "fixed", borderCollapse: "separate", borderSpacing: "0 1em" }}>
          <Thead bg={"basic.black"}>
            <Tr>
              <Th p={2} w={50} textAlign={"center"} color={"basic.white"}>
                取得済
              </Th>
              <Th w={160} color={"basic.white"}>
                バッジ名
              </Th>
              <Th w={120} color={"basic.white"}>
                発行日
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {badgeList?.map((badge, index: number) => {
              const dateIssued = convertUNIXorISOstrToJST(badge.dateissued);
              return (
                <Tr key={index} textAlign="left">
                  <Td p={2} textAlign={"center"}>
                    {badge.vcConverted && <CheckIcon />}
                  </Td>
                  <Td sx={{ whiteSpace: "pre-wrap" }}>
                    {badge.vcConverted ? (
                      <Box>{badge.name}</Box>
                    ) : (
                      <Link
                        color="primary.700"
                        onClick={() => {
                          handleBadgeSelect(badge.uniquehash, badge.email);
                        }}
                      >
                        {badge.name}
                      </Link>
                    )}
                  </Td>
                  <Td>{JSTdateToDisplay(dateIssued)} </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
    );
  },
);

export { MyBadgesList, MyBadgesListSp };
