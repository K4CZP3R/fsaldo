import Shell from "@/components/shell/shell.component";
import { getSaldo } from "@/helpers/client-side.helper";
import { Saldo } from "@/models/saldo.model";
import {
  Card,
  Text,
  List,
  ListItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Title,
  Badge,
  TextInput,
  Button,
} from "@tremor/react";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { ArrowRightIcon } from "@heroicons/react/24/solid";
import SaldoEntryRow from "@/components/saldo-entry-row/saldo-entry-row.component";

export default function SaldoId() {
  const router = useRouter();
  const { id } = router.query;

  const [saldo, setSaldo] = useState<Saldo>();

  const fetchSaldo = useCallback(() => {
    if (!id) return;
    getSaldo(id.toString()).then((saldo) => setSaldo(saldo));
  }, [id]);

  useEffect(() => {
    fetchSaldo();
  }, [fetchSaldo]);

  return (
    <Shell title="Saldo" text={saldo?.name ?? ""}>
      <Card maxWidth="max-w-full" marginTop="mt-6">
        <Title>Transactions</Title>

        <Table marginTop="mt-5">
          <TableHead>
            <TableRow>
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell>Amount</TableHeaderCell>
              <TableHeaderCell>Date</TableHeaderCell>

              <TableHeaderCell>Saldo</TableHeaderCell>
              <TableHeaderCell>Edit</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(saldo?.saldoEntry ?? []).map((item) => (
              <SaldoEntryRow
                onChange={() => fetchSaldo()}
                saldoId={saldo!.id}
                key={item.id}
                item={item}
              >
                <TableCell>
                  <Badge
                    text={item.amount.toString()}
                    color="emerald"
                    icon={ArrowRightIcon}
                  />
                </TableCell>
              </SaldoEntryRow>
            ))}
          </TableBody>
        </Table>

        <Button
          onClick={() => {
            let newEntry: SaldoEntry = {
              id: "",
              amount: 0,
              createdAt: new Date().toISOString(),
              name: "",
            };

            setEntries([...entries, newEntry]);
          }}
          text="Add new entry"
        ></Button>
      </Card>
    </Shell>
  );
}
