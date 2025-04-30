import {
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from "@chakra-ui/react";
import React, { MutableRefObject } from "react";

import { PrimaryButton } from "../button/PrimaryButton";
import { SecondaryButton } from "../button/SecondaryButton";

type Props = {
  title: string;
  message?: string;
  okButtonrText: string;
  closeButtontText?: string;
  okButtonColor?: "red" | "blue" | "teal" | "gray";
  isOpen: boolean;
  onClose: () => void;
  cancelRef: MutableRefObject<HTMLButtonElement>;
  handleOkClick: () => void;
};

export const BasicDialog = ({
  title,
  message,
  closeButtontText,
  okButtonrText,
  isOpen,
  onClose,
  cancelRef,
  handleOkClick,
  okButtonColor,
}: Props) => {
  return (
    <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            {title}
          </AlertDialogHeader>

          <AlertDialogBody>{message}</AlertDialogBody>

          <AlertDialogFooter>
            {closeButtontText && (
              <SecondaryButton ref={cancelRef} onClick={onClose}>
                {closeButtontText}
              </SecondaryButton>
            )}
            <PrimaryButton
              ml={3}
              colorScheme={okButtonColor}
              onClick={() => {
                handleOkClick();
              }}
            >
              {okButtonrText}
            </PrimaryButton>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};
