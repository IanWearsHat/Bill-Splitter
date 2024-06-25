import { Input, InputAdornment, InputProps } from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";

interface PriceInputProps extends Omit<InputProps, "onChange" | "value"> {
  inputValue?: number;
  updateReceiptPrice?: (value: number) => void;
  alignRight?: boolean;
}

export function PriceInput({
  inputValue,
  updateReceiptPrice,
  alignRight,
  ...props
}: PriceInputProps) {
  const [value, setValue] = useState<string>("");

  useEffect(() => {
    setValue(inputValue ? String(inputValue) : "");
  }, [inputValue]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const cleaned = event.target.value.replace(/[^\d.]/g, "");
    const parts = cleaned.split(".");
    if (parts[1] && parts[1].length > 2) parts[1] = parts[1].slice(0, 2);
    const modifiedValue = parts.slice(0, 2).join(".");

    setValue(modifiedValue);
    if (updateReceiptPrice) updateReceiptPrice(Number(modifiedValue));
  };

  return (
    <Input
      startAdornment={<InputAdornment position="start">$</InputAdornment>}
      sx={alignRight ? { "& input": { textAlign: "right" } } : {}}
      value={value}
      onChange={handleChange}
      {...props}
    />
  );
}
