import { createSaldo } from "@/helpers/client-side.helper";
import { Card, Text, Title, TextInput, Button } from "@tremor/react";
import { useCallback, useState } from "react";

export type CreateSaldoProps = {
  onSubmit: (name: string) => void;
};

export default function CreateSaldo(props: CreateSaldoProps) {
  const [name, setName] = useState<string>("");

  function submit() {
    createSaldo(name).then(() => props.onSubmit(name));
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
      <Title>Create a new saldo</Title>

      <TextInput
        marginTop="mt-4"
        placeholder="Name of the saldo"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <Button text="Create" onClick={() => submit()} marginTop="mt-4" />
    </Card>
  );
}
