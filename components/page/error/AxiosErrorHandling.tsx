import {
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  Text,
  useDisclosure,
  AlertDialogFooter,
} from "@chakra-ui/react";
import { AxiosError, AxiosResponse } from "axios";
import { Dispatch, ReactNode, SetStateAction, useEffect, useRef, useState } from "react";

import { SecondaryButton } from "@/components/ui/button/SecondaryButton";
import { errors } from "@/constants/error";
import { axiosClient } from "@/lib/axios";

type Props = {
  children: ReactNode;
};

export const AxiosErrorHandling = (props: Props) => {
  const { children } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [unexpectedError, setUnexpectedError] = useState(false);
  const [serverError, setServerError] = useState(false);
  const [clientReqestError, setClientReqestError] = useState(false);
  const [UnAuthrized, setUnAuthrized] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const responseInterceptor = axiosClient.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error: AxiosError) => {
        // @ts-ignore
        console.error(error.response?.data?.error?.detail);
        let detailmessage = "";
        // @ts-ignore
        if (error.response?.data?.error?.detail?.message) {
          // @ts-ignore
          detailmessage = error.response?.data?.error?.detail?.message;
        } else {
          // @ts-ignore
          detailmessage = error.response?.data?.error?.errorMessage;
        }

        setIsOpen(true);

        switch (error.response?.status) {
          case 401:
            setUnAuthrized(true);
            setErrorMessage(detailmessage);
            return Promise.reject(error.response?.data);
          case 400:
            setClientReqestError(true);
            setErrorMessage(detailmessage);
            return Promise.reject(error.response?.data);
          case 500:
            setServerError(true);
            setErrorMessage(detailmessage);
            return Promise.reject(error.response?.data);
          default:
            setUnexpectedError(true);
            setErrorMessage(detailmessage);
            return Promise.reject(error.response?.data);
        }
      },
    );

    return () => {
      axiosClient.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  return (
    <>
      {children}

      {isOpen && (
        <>
          {UnAuthrized && (
            <ErrorDialog
              title={errors.unAuthrizedError.label}
              message={errors.unAuthrizedError.message}
              detail={errorMessage}
              isOpen={isOpen}
              setIsOpen={setIsOpen}
            />
          )}
          {unexpectedError && (
            <ErrorDialog
              title={errors.unexpectedError.label}
              message={errors.unexpectedError.message}
              detail={errorMessage}
              isOpen={isOpen}
              setIsOpen={setIsOpen}
            />
          )}
          {serverError && (
            <ErrorDialog
              title={errors.response500.label}
              message={errors.response500.message}
              detail={errorMessage}
              isOpen={isOpen}
              setIsOpen={setIsOpen}
            />
          )}
          {clientReqestError && (
            <ErrorDialog
              title={errors.response400.label}
              message={errors.response400.message}
              detail={errorMessage}
              isOpen={isOpen}
              setIsOpen={setIsOpen}
            />
          )}
        </>
      )}
    </>
  );
};

const ErrorDialog = ({
  title,
  message,
  detail,
  isOpen,
  setIsOpen,
}: {
  title: string;
  message: string;
  detail: any;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const cancelRef = useRef();
  const { onClose } = useDisclosure();

  return (
    <AlertDialog isOpen={isOpen} onClose={onClose} leastDestructiveRef={cancelRef}>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="xl" fontWeight="bold">
            {title}
          </AlertDialogHeader>

          <AlertDialogBody>
            <Text fontSize={"lg"} mb={4}>
              {message}
            </Text>
            <Text fontSize={"md"}>詳細: {detail}</Text>
          </AlertDialogBody>

          <AlertDialogFooter>
            <SecondaryButton
              ml={3}
              onClick={() => {
                setIsOpen(false);
              }}
            >
              閉じる
            </SecondaryButton>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};
