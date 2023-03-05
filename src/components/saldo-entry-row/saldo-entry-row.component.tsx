import { SaldoEntry } from "@/models/saldo.model";
import { TableCell, TableRow, Text, TextInput, Button } from "@tremor/react";
import { useCallback, useEffect, useState } from "react";
import {
  addEntryToSaldo,
  deleteSaldoEntry,
  updateSaldoEntry,
} from "@/helpers/client-side.helper";
import Skeleton from "react-loading-skeleton";
import { strDate, valuta } from "@/helpers/string.helper";
import NumberInput from "../number-input/number-input.compontent";
import { FsaldoDate } from "@/helpers/fsaldo-date.helper";

export type SaldoEntryRowProps = {
  saldoId: string;
  item: SaldoEntry;
  onChange?: () => void;
  children?: React.ReactNode;
};

export default function SaldoEntryRow(props: SaldoEntryRowProps) {
  const [name, setName] = useState(props.item.name);
  const [amount, setAmount] = useState(props.item.amount);
  const [date, setDate] = useState(
    FsaldoDate.fromString(props.item.date).toDate()
  );
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
  }, [props]);

  const callb = useCallback(() => {
    setLoading(true);
    if (props.item.id !== "") {
      updateSaldoEntry(props.saldoId, props.item.id, {
        name,
        amount,
        date: FsaldoDate.fromDate(date).toString(),
      })
        .then((res) => {
          props.onChange?.();
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      addEntryToSaldo(props.saldoId, {
        name,
        amount,
        date: FsaldoDate.fromDate(date).toString(),
      })
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
          <NumberInput value={amount} onChange={setAmount} />
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
          <Text>{valuta(amount)}</Text>
        </TableCell>
        <TableCell>
          <Text>{strDate(props.item.date)}</Text>
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
