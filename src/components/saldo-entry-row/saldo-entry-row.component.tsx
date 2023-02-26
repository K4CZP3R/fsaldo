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

export type SaldoEntryRowProps = {
  item: SaldoEntry;
};

export default function SaldoEntryRow(props: SaldoEntryRowProps) {
  const [name, setName] = useState(props.item.name);
  const [amount, setAmount] = useState(props.item.amount);
  const [editMode, setEditMode] = useState(false);

  const callb = useCallback(() => {
    console.log("Test!", name, amount);

    props.item.name = name;
    props.item.amount = amount;
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
        <TableCell>
          <Badge
            text={props.item.amount.toString()}
            color="emerald"
            icon={ArrowRightIcon}
          />
        </TableCell>
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
        <TableCell>{props.item.name}</TableCell>
        <TableCell>
          <Text>{props.item.amount}</Text>
        </TableCell>
        <TableCell>
          <Text>{props.item.createdAt.toString()}</Text>
        </TableCell>
        <TableCell>
          <Badge
            text={props.item.amount.toString()}
            color="emerald"
            icon={ArrowRightIcon}
          />
        </TableCell>
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
