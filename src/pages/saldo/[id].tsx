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
import { useEffect, useState } from "react";
import { ArrowRightIcon } from "@heroicons/react/24/solid";
import SaldoEntryRow from "@/components/saldo-entry-row/saldo-entry-row.component";

export default function SaldoId() {
  const router = useRouter();
  const { id } = router.query;

  const [saldo, setSaldo] = useState<Saldo>();

  useEffect(() => {
    if (!id) return;
    getSaldo(id.toString()).then((saldo) => setSaldo(saldo));
  }, [id]);

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
              <SaldoEntryRow key={item.id} item={item} />
            ))}
          </TableBody>
        </Table>
      </Card>
    </Shell>
  );
}
