import { MaxWidth, TextInput } from "@tremor/react";
import { useState } from "react";

export type NumberInputProps = {
  value: number;
  onChange: (value: number) => void;
  maxWidth?: MaxWidth;
  onlyPositive?: boolean;
};

function invalidInput(value: string, onlyPositive: boolean): [boolean, string] {
  if (!/^-?\d*\.?\d*$/.test(value)) {
    return [false, "only numbers, - and . allowed"];
  }

  const parsed = parseFloat(value);
  if (isNaN(parsed)) {
    return [false, "invalid number"];
  }

  if (onlyPositive && parsed < 0) {
    return [false, "only positive numbers allowed"];
  }

  return [true, ""];
}

export default function NumberInput(props: NumberInputProps) {
  const [amount, setAmount] = useState(props.value.toString());
  const [validAmount, setValidAmount] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  return (
    <TextInput
      maxWidth={props.maxWidth}
      value={amount}
      error={!validAmount}
      errorMessage={errorMessage}
      onChange={(e) => {
        const [valid, message] = invalidInput(
          e.target.value,
          props.onlyPositive ?? false
        );
        setValidAmount(valid);
        setErrorMessage(message);
        setAmount(e.target.value);

        if (validAmount) {
          props.onChange(parseFloat(e.target.value));
        }
      }}
    />
  );
}
