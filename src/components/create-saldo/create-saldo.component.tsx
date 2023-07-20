import { createSaldo, updateSaldo } from "@/helpers/client-side.helper";
import { Saldo } from "@/models/saldo.model";
import { Card, Text, Title, TextInput, Button, Flex } from "@tremor/react";
import { useCallback, useState } from "react";
import { mutate } from "swr";
import NumberInput from "../number-input/number-input.compontent";
import styles from "./create-saldo.module.css";

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
    props.onSubmit(name);
    if (updateInstead) {
      updateSaldo(props.saldo!.id, name, debitLimit).then(() =>
        mutate("/api/saldo")
      );
    } else {
      createSaldo(name, debitLimit).then(() => mutate("/api/saldo"));
    }
  }

  return (
    <Card
      hFull={false}
      shadow={true}
      decoration=""
      decorationColor="blue"
      marginTop="mt-0"
    >
      <Title>{updateInstead ? "Update saldo" : "Create new saldo"}</Title>

      <div className={styles.formContainer}>
        <div>
          <Text>Name:</Text>
          <TextInput
            placeholder="Name of the saldo"
            maxWidth="max-w-sm"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <Text>Debit limit:</Text>
          <NumberInput
            maxWidth="max-w-sm"
            value={debitLimit}
            onlyPositive={true}
            onChange={setDebitLimit}
          />
        </div>
      </div>
      <Button
        text={updateInstead ? "Update" : "Create"}
        onClick={() => submit()}
        marginTop="mt-4"
      />
    </Card>
  );
}
