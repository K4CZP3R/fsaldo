import { SaldoEntry } from "@/models/saldo.model";
import { TableCell, TableRow, Text, TextInput, Button } from "@tremor/react";
import { ArrowRightIcon } from "@heroicons/react/24/solid";
import { useCallback, useEffect, useState } from "react";
import {
  addEntryToSaldo,
  deleteSaldoEntry,
  updateSaldoEntry,
} from "@/helpers/client-side.helper";
import Skeleton from "react-loading-skeleton";

export type SaldoEntryRowProps = {
  saldoId: string;
  item: SaldoEntry;
  onChange?: () => void;
  children?: React.ReactNode;
};

export default function SaldoEntryRow(props: SaldoEntryRowProps) {
  const [name, setName] = useState(props.item.name);
  const [amount, setAmount] = useState(props.item.amount);
  const [date, setDate] = useState(new Date(props.item.createdAt));
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setName(props.item.name);
    setAmount(props.item.amount);

    if (props.item.id === "") {
      setEditMode(true);
    }
  }, [props.item]);

  const rmCallb = useCallback(async () => {
    setLoading(true);

    await deleteSaldoEntry(props.saldoId, props.item.id);

    props.onChange?.();

    setLoading(false);
  }, [props]);

  const callb = useCallback(() => {
    setLoading(true);
    if (props.item.id !== "") {
      updateSaldoEntry(props.saldoId, props.item.id, {
        name,
        amount,
        createdAt: date,
      })
        .then((res) => {
          props.onChange?.();
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      addEntryToSaldo(props.saldoId, { name, amount, createdAt: date })
        .then((res) => {
          props.onChange?.();
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [name, amount, date, props]);

  if (loading) {
    return (
      <TableRow>
        <TableCell>
          <Skeleton />
        </TableCell>
        <TableCell>
          <Skeleton />
        </TableCell>
        <TableCell>
          <Skeleton />
        </TableCell>
        <TableCell>
          <Skeleton />
        </TableCell>
        <TableCell>
          <Skeleton />
        </TableCell>
      </TableRow>
    );
  }

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
          <input
            defaultValue={date.toISOString().split("T")[0]}
            onChange={(e) => {
              setDate(e.target.valueAsDate!);
            }}
            type="date"
          ></input>
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
          <Button
            onClick={() => {
              rmCallb();
            }}
            variant="light"
            size="sm"
            text="Delete"
            color="red"
          />
        </TableCell>
      </TableRow>
    );
  }
}
