import { createSaldo, updateSaldo } from "@/helpers/client-side.helper";
import { Saldo } from "@/models/saldo.model";
import { Card, Text, Title, TextInput, Button, Flex } from "@tremor/react";
import { useCallback, useState } from "react";
import NumberInput from "../number-input/number-input.compontent";

export type CreateSaldoProps = {
  onSubmit: (name: string) => void;
  saldo?: Saldo;
};

export default function CreateSaldo(props: CreateSaldoProps) {
  const [updateInstead] = useState<boolean>(props.saldo ? true : false);
  const [name, setName] = useState<string>(props.saldo?.name || "");
  const [debitLimit, setDebitLimit] = useState<number>(
    props.saldo?.debitLimit || 0
  );

  function submit() {
    if (updateInstead) {
      updateSaldo(props.saldo!.id, name, debitLimit).then(() =>
        props.onSubmit(name)
      );
    } else {
      createSaldo(name, debitLimit).then(() => props.onSubmit(name));
    }
  }

  return (
    <Card
      maxWidth="max-w-none"
      hFull={false}
      shadow={true}
      decoration=""
      decorationColor="blue"
      marginTop="mt-0"
    >
      <Title>{updateInstead ? "Update saldo" : "Create new saldo"}</Title>

      <Flex>
        <TextInput
          placeholder="Name of the saldo"
          maxWidth="max-w-sm"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <NumberInput
          maxWidth="max-w-sm"
          value={debitLimit}
          onlyPositive={true}
          onChange={setDebitLimit}
        />
      </Flex>
      <Button
        text={updateInstead ? "Update" : "Create"}
        onClick={() => submit()}
        marginTop="mt-4"
      />
    </Card>
  );
}
