import Shell from "@/components/shell/shell.component";
import { SaldoEntry } from "@/models/saldo.model";
import {
  Text,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Title,
  Button,
  Callout,
  AccordionList,
  Accordion,
  AccordionHeader,
  AccordionBody,
  Flex,
  LineChart,
  Tracking,
  TrackingBlock,
} from "@tremor/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import SaldoEntryRow from "@/components/saldo-entry-row/saldo-entry-row.component";
import Skeleton from "react-loading-skeleton";
import {
  getSaldoTo,
  saldoFlowChart,
  saldoWithFlow,
} from "@/helpers/saldo.helper";
import { useGetSaldo } from "@/helpers/client-side.helper";
import { useMediaQuery } from "@/helpers/media-query.helper";
import SaldoBadge, {
  getSaldoColor,
} from "@/components/badge/saldo-badge.component";
import { strDate, valuta } from "@/helpers/string.helper";

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
                  <span>{strDate(item.createdAt)}</span>
                  <SaldoBadge value={getSaldoTo(item, entries ?? [])} />
                </Flex>
              </AccordionHeader>
              <AccordionBody>
                <Flex>
                  <span>{valuta(item.amount)}</span>
                </Flex>
              </AccordionBody>
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
                        <SaldoBadge value={getSaldoTo(item, entries)} />
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

      <Card maxWidth="max-w-full" marginTop="mt-6">
        <Title>Flow</Title>

        {entries && (
          <LineChart
            data={saldoFlowChart(entries)}
            categories={["Saldo", "Daily change"]}
            colors={["blue", "gray"]}
            dataKey="Date"
            valueFormatter={(value) => valuta(value)}
          />
        )}
      </Card>

      <Flex marginTop="mt-6">
        <Card maxWidth="max-w-md">
          <Title>Status</Title>
          <Text>Saldo</Text>
          <Tracking marginTop="mt-2">
            {entries &&
              saldoFlowChart(entries).map((item) => (
                <TrackingBlock
                  key={item.Date}
                  color={getSaldoColor(item.Saldo)}
                  tooltip={valuta(item.Saldo)}
                />
              ))}
          </Tracking>
        </Card>

        <Card maxWidth="max-w-md">
          <Title>Status</Title>
          <Text>Saldo</Text>
          <Tracking marginTop="mt-2">
            {entries &&
              saldoFlowChart(entries).map((item) => (
                <TrackingBlock
                  key={item.Date}
                  color={getSaldoColor(item["Daily change"])}
                  tooltip={valuta(item["Daily change"])}
                />
              ))}
          </Tracking>
        </Card>
      </Flex>
    </Shell>
  );
}
