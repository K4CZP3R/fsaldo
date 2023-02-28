import Shell from "@/components/shell/shell.component";
import { getSaldo } from "@/helpers/client-side.helper";
import { Saldo, SaldoEntry } from "@/models/saldo.model";
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
import Skeleton from "react-loading-skeleton";

export default function SaldoId() {
  const router = useRouter();
  const { id } = router.query;

  const [saldo, setSaldo] = useState<Saldo>();

  const [entries, setEntries] = useState<SaldoEntry[]>();

  const fetchSaldo = useCallback(() => {
    if (!id) return;
    getSaldo(id.toString()).then((saldo) => {
      setSaldo(saldo);

      if (saldo?.saldoEntry) {
        saldo.saldoEntry.sort((a, b) => {
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        });
        setEntries(saldo.saldoEntry);
      }
    });
  }, [id]);

  useEffect(() => {
    fetchSaldo();
  }, [fetchSaldo]);

  return (
    <Shell title="Saldo" text={saldo?.name}>
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
            {entries ? (
              <>
                {entries.map((item) => (
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
              </>
            ) : (
              <>
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
              </>
            )}
          </TableBody>
        </Table>

        {entries && (
          <Button
            onClick={() => {
              let newEntry: SaldoEntry = {
                id: "",
                amount: 0,
                createdAt: new Date().toISOString(),
                name: "",
              };

              setEntries([...(entries ?? []), newEntry]);
            }}
            text="Add new entry"
          ></Button>
        )}
      </Card>
    </Shell>
  );
}
