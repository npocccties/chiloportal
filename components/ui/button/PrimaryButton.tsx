import { Button, ButtonProps, forwardRef } from "@chakra-ui/react";

export const PrimaryButton = forwardRef<ButtonProps, "button">((props, ref) => {
  return <Button bg={"primary.700"} ref={ref} {...props} isDisabled={props?.disabled} />;
});
