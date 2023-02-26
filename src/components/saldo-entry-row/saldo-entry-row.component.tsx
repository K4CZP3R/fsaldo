import { SaldoEntry } from "@/models/saldo.model";
import {
  TableCell,
  TableRow,
  Text,
  Badge,
  TextInput,
  Button,
} from "@tremor/react";
import { ArrowRightIcon } from "@heroicons/react/24/solid";
import { useCallback, useEffect, useState } from "react";
import { updateSaldoEntry } from "@/helpers/client-side.helper";

export type SaldoEntryRowProps = {
  saldoId: string;
  item: SaldoEntry;
  onChange?: () => void;
  children?: React.ReactNode;
};

export default function SaldoEntryRow(props: SaldoEntryRowProps) {
  const [name, setName] = useState(props.item.name);
  const [amount, setAmount] = useState(props.item.amount);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    setName(props.item.name);
    setAmount(props.item.amount);
  }, [props.item]);

  const callb = useCallback(() => {
    updateSaldoEntry(props.saldoId, props.item.id, { name, amount })
      .then((res) => {
        props.onChange?.();
      })
      .catch((err) => {
        console.log(err);
      });
  }, [name, amount, props]);

  if (editMode) {
    return (
      <TableRow>
        <TableCell>
          <TextInput
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </TableCell>
        <TableCell>
          <TextInput
            value={amount.toString()}
            onChange={(e) => setAmount(parseFloat(e.target.value))}
          />
        </TableCell>
        <TableCell>
          <Text>{props.item.createdAt.toString()}</Text>
        </TableCell>
        {props.children}
        <TableCell>
          <Button
            onClick={() => {
              setEditMode(false);
              callb();
            }}
            variant="light"
            size="sm"
            text="Save"
          />
        </TableCell>
      </TableRow>
    );
  } else {
    return (
      <TableRow>
        <TableCell>{name}</TableCell>
        <TableCell>
          <Text>{amount}</Text>
        </TableCell>
        <TableCell>
          <Text>{props.item.createdAt.toString()}</Text>
        </TableCell>
        {props.children}
        <TableCell>
          <Button
            onClick={() => setEditMode(true)}
            variant="light"
            size="sm"
            text="Edit"
          />
        </TableCell>
      </TableRow>
    );
  }
}
