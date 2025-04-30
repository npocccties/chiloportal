import { Button, ButtonProps, forwardRef } from "@chakra-ui/react";

export const SecondaryButton = forwardRef<ButtonProps, "button">((props, ref) => {
  return <Button colorScheme={"gray"} ref={ref} {...props} isDisabled={props?.disabled} />;
});
