import { PropsWithChildren } from "react";
import { Button, ButtonProps, CircularProgress } from "@mui/material";

interface OneClickButtonProps {
  buttonIsDisabled: boolean;
}

export default function OneClickButton({
  buttonIsDisabled,
  children,
  ...props
}: PropsWithChildren<OneClickButtonProps> & Omit<ButtonProps, keyof OneClickButtonProps>) {
  return (
    <Button disabled={buttonIsDisabled} {...props}>
      {buttonIsDisabled && (
        <CircularProgress
          size={24}
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            marginTop: "-12px",
            marginLeft: "-12px",
          }}
        />
      )}
      {children}
    </Button>
  );
}
