import Shell from "@/components/shell/shell.component";
import { SaldoEntry } from "@/models/saldo.model";
import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Title,
  Badge,
  Button,
  Callout,
  AccordionList,
  Accordion,
  AccordionHeader,
  AccordionBody,
  Flex,
} from "@tremor/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ArrowRightIcon } from "@heroicons/react/24/solid";
import SaldoEntryRow from "@/components/saldo-entry-row/saldo-entry-row.component";
import Skeleton from "react-loading-skeleton";
import { getSaldoTo } from "@/helpers/saldo.helper";
import { useGetSaldo } from "@/helpers/client-side.helper";
import { useMediaQuery } from "@/helpers/media-query.helper";

export default function SaldoId() {
  const router = useRouter();
  const { id } = router.query;

  const [entries, setEntries] = useState<SaldoEntry[]>();

  const { data, error, isLoading, mutate } = useGetSaldo(
    id ? id.toString() : null
  );

  useEffect(() => {
    data?.saldoEntry.sort((a, b) => {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });
    setEntries(data?.saldoEntry);
  }, [data]);

  const isSmol = useMediaQuery(600);

  if (isSmol) {
    return (
      <Shell title="Saldo" text={data?.name}>
        <AccordionList //The AccordionList is optional
          shadow={true}
          marginTop="mt-0"
        >
          {(entries ?? []).map((item) => (
            <Accordion key={item.id} expanded={false} shadow={true}>
              <AccordionHeader>
                <Flex>
                  <span>{item.name}</span>
                  <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                  <Badge
                    text={getSaldoTo(item, entries ?? []).toString()}
                    color={
                      getSaldoTo(item, entries ?? []) < 0 ? "red" : "green"
                    }
                    icon={ArrowRightIcon}
                  />
                </Flex>
              </AccordionHeader>
              <AccordionBody>{item.amount}</AccordionBody>
            </Accordion>
          ))}
        </AccordionList>
      </Shell>
    );
  }

  return (
    <Shell title="Saldo" text={data?.name}>
      <Card maxWidth="max-w-full" marginTop="mt-6">
        <Title>Transactions</Title>

        {error && <Callout title="Error" text={error.message} color="red" />}

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
                    onChange={() => mutate()}
                    saldoId={data!.id}
                    key={item.id}
                    item={item}
                  >
                    <TableCell>
                      {isLoading ? (
                        <Skeleton />
                      ) : (
                        <Badge
                          text={getSaldoTo(item, entries).toString()}
                          color={
                            getSaldoTo(item, entries) < 0 ? "red" : "green"
                          }
                          icon={ArrowRightIcon}
                        />
                      )}
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
