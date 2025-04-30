import { Button, ButtonProps, forwardRef } from "@chakra-ui/react";

export const DangerButton = forwardRef<ButtonProps, "button">((props, ref) => {
  return <Button colorScheme={"red"} bg={"status.danger"} ref={ref} {...props} isDisabled={props?.disabled} />;
});
