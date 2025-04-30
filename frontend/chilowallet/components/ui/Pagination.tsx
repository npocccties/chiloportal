import { ArrowLeftIcon, ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { Button, Flex, IconButton } from "@chakra-ui/react";
import React from "react";


type Props = {
  totalPages: number;
  currentPage: number;
  handlePrev: () => void;
  handleNext: () => void;
  handleMove: (page: number) => void;
};

export const Pagination = ({ totalPages, currentPage, handlePrev, handleNext, handleMove }: Props) => {
  console.log("pagi", totalPages, currentPage);
  const maxPageNumber = currentPage + 3;
  const minPageNumber = currentPage - 3;
  return (
    <Flex justifyContent={"space-between"} m={"4"} alignItems={"center"}>
      <Flex>
        <IconButton aria-label="previosPage" onClick={() => handlePrev()} icon={<ArrowLeftIcon h={3} w={3} />} />
      </Flex>
      <Flex gap={2}>
        {[...Array(totalPages).keys()].map((page) => {
          page++;
          if (page > maxPageNumber || page < minPageNumber) {
            return;
          } else if (page === maxPageNumber) {
            return (
              <IconButton
                key={page}
                aria-label="next-page"
                colorScheme={"gray"}
                onClick={() => handleMove(page)}
                icon={<ChevronRightIcon h={6} w={6} />}
              />
            );
          } else if (page === minPageNumber) {
            return (
              <IconButton
                key={page}
                aria-label="prev-page"
                colorScheme={"gray"}
                onClick={() => handleMove(page)}
                icon={<ChevronLeftIcon h={6} w={6} />}
              />
            );
          } else {
            return page === currentPage ? (
              <Button key={page} colorScheme={"blue"}>
                {page}
              </Button>
            ) : (
              <Button key={page} colorScheme={"gray"} onClick={() => handleMove(page)}>
                {page}
              </Button>
            );
          }
        })}
      </Flex>
      <Flex>
        <IconButton aria-label="nextPage" onClick={() => handleNext()} icon={<ArrowRightIcon h={3} w={3} />} />
      </Flex>
    </Flex>
  );
};
