import Shell from "@/components/shell/shell.component";
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
import { useGetSaldo } from "@/helpers/client-side.helper";
import { useMediaQuery } from "@/helpers/media-query.helper";
import SaldoBadge, {
  getSaldoColor,
} from "@/components/badge/saldo-badge.component";
import { SaldoEntry } from "@/models/saldo-entry.model";
import { StringHelper } from "@/helpers/string.helper";
import Seo from "@/components/seo/seo.component";
import { SaldoDayRange } from "@/models/saldo-day.model";

export default function SaldoId() {
  const router = useRouter();
  const { id } = router.query;

  const [entries, setEntries] = useState<SaldoEntry[]>();
  const [saldoDayRange, setSaldoDayRange] = useState<SaldoDayRange>();

  const { data, error, isLoading, mutate } = useGetSaldo(
    id ? id.toString() : null
  );

  useEffect(() => {
    setEntries(data?.saldoEntries);
  }, [data]);

  useEffect(() => {
    if (!entries) return;

    const minDate = entries[0].date;
    const maxDate = entries[entries.length - 1].date;

    let dayRange = new SaldoDayRange(
      minDate,
      maxDate,
      (data?.debitLimit ?? 0) * -1
    );
    entries.forEach((entry) => {
      dayRange.addEntry(entry);
    });

    setSaldoDayRange(dayRange);
  }, [entries, data?.debitLimit]);

  const isSmol = useMediaQuery(600);

  if (isSmol) {
    return (
      <Shell title="Saldo" text={data?.name}>
        <Seo title={`Saldo: ${data?.name ?? "Loading..."}`} />
        <AccordionList //The AccordionList is optional
          shadow={true}
          marginTop="mt-0"
        >
          {(entries ?? []).map((item) => (
            <Accordion key={item.id} expanded={false} shadow={true}>
              <AccordionHeader>
                <Flex>
                  <span>{item.name}</span>
                  <span>{item.stringDate}</span>
                  <SaldoBadge
                    debitLimit={data?.debitLimit}
                    value={data?.getSaldoTo(item) ?? 0}
                  />
                </Flex>
              </AccordionHeader>
              <AccordionBody>
                <Flex>
                  <span>{StringHelper.valuta(item.amount)}</span>
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
      <Seo title={`Saldo: ${data?.name ?? "Loading..."}`} />
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
                    onActiveToggle={() => {
                      item.active = !item.active;
                      setEntries([...entries]);
                    }}
                    saldoId={data!.id}
                    key={item.id}
                    item={item}
                  >
                    <TableCell>
                      {isLoading ? (
                        <Skeleton />
                      ) : item.active ? (
                        <SaldoBadge
                          debitLimit={data?.debitLimit}
                          value={data?.getSaldoTo(item) ?? 0}
                        />
                      ) : (
                        <></>
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
              setEntries([...(entries ?? []), SaldoEntry.newNow("", 0)]);
            }}
            text="Add new entry"
          ></Button>
        )}
      </Card>

      <Card maxWidth="max-w-full" marginTop="mt-6">
        <Title>Flow</Title>
        <LineChart
          data={saldoDayRange?.presentableDays ?? []}
          categories={["Saldo", "Daily change", "Debit"]}
          colors={["blue", "gray", "red"]}
          dataKey="Date"
          valueFormatter={(value) => StringHelper.valuta(value)}
        />
      </Card>

      <Flex marginTop="mt-6">
        <Card maxWidth="max-w-md">
          <Title>Status</Title>
          <Text>Saldo</Text>
          <Tracking marginTop="mt-2">
            {(saldoDayRange?.presentableDays ?? []).map((item) => (
              <TrackingBlock
                key={item.id}
                color={getSaldoColor(item.Saldo, data?.debitLimit)}
                tooltip={`${item.Date}: ${StringHelper.valuta(item.Saldo)}`}
              />
            ))}
          </Tracking>
        </Card>

        <Card maxWidth="max-w-md">
          <Title>Status</Title>
          <Text>Daily change</Text>
          <Tracking marginTop="mt-2">
            {(saldoDayRange?.presentableDays ?? []).map((item) => (
              <TrackingBlock
                key={item.id}
                color={getSaldoColor(item["Daily change"])}
                tooltip={`${item.Date}: ${StringHelper.valuta(
                  item["Daily change"]
                )}`}
              />
            ))}
          </Tracking>
        </Card>
      </Flex>
    </Shell>
  );
}
