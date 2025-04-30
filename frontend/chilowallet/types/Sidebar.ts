import { FlexProps } from "@chakra-ui/react";

export interface NavItemProps extends FlexProps {
  name: string;
  link?: string;
  external?: boolean;
  newWindow?: boolean;
  targetTabName?: string;
}
