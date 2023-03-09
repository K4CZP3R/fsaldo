import { deleteSaldo } from "@/helpers/client-side.helper";
// import { getEndingSaldo } from "@/helpers/saldo.helper";
import { StringHelper } from "@/helpers/string.helper";
import { Saldo } from "@/models/saldo.model";
import { Button, Card, Flex, Footer, Metric, Text } from "@tremor/react";
import router from "next/router";
import Skeleton from "react-loading-skeleton";
import { mutate } from "swr";

export type SaldoOverviewCardProps = {
  saldo?: Saldo;
  onEdit?: (saldo: Saldo) => void;
  onDelete?: (saldo: Saldo) => void;
  skeleton?: boolean;
};

export default function SaldoOverviewCard(props: SaldoOverviewCardProps) {
  if (props.skeleton) {
    return (
      <Card>
        <Text>
          <Skeleton />
        </Text>
        <Metric>
          <Skeleton />
        </Metric>
        <Text>
          <Skeleton />
        </Text>

        <Footer>
          <Flex>
            <Button disabled={true} variant="light" size="sm" text="View" />
            <Button disabled={true} variant="light" size="sm" text="Edit" />
            <Button
              disabled={true}
              variant="light"
              size="sm"
              color="red"
              text="Delete"
            />
          </Flex>
        </Footer>
      </Card>
    );
  }
  if (!props.saldo) return <></>;
  return (
    <Card key={props.saldo.id}>
      <Text>{props.saldo.name}</Text>
      <Metric>{StringHelper.valuta(props.saldo.endingSaldo)}</Metric>
      <Text>
        {props.saldo.debitLimit
          ? `Debit limit of ${StringHelper.valuta(props.saldo.debitLimit)}`
          : "No debit limit"}
      </Text>
      <Footer>
        <Flex>
          <Button
            onClick={() => router.push(`/saldo/${props.saldo?.id}`)}
            variant="light"
            size="sm"
            text="View"
          />
          <Button
            onClick={() => {
              props.saldo && props.onEdit?.(props.saldo);
            }}
            variant="light"
            size="sm"
            text="Edit"
          />
          <Button
            onClick={() => {
              if (!props.saldo) return;
              deleteSaldo(props.saldo.id).then(() => mutate("/api/saldo"));
              props.onDelete?.(props.saldo);
            }}
            variant="light"
            size="sm"
            color="red"
            text="Delete"
          />
        </Flex>
      </Footer>
    </Card>
  );
}
