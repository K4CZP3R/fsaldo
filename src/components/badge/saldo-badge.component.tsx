import { StringHelper } from "@/helpers/string.helper";
import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { Badge as TremorBadge } from "@tremor/react";

export type BadgeProps = {
  value: number;
  debitLimit?: number;
};

export function getSaldoColor(value: number, debit: number = 0) {
  if (value <= debit * -1) return "red";
  if (value === 0) return "zinc";
  if (value > 0) return "green";
  if (value < 0) return "amber";

  return "zinc";
}

export function getSaldoIcon(value: number, debit: number = 0) {
  if (value <= debit * -1) return ExclamationCircleIcon;
  if (value === 0) return ArrowRightIcon;
  if (value > 0) return ArrowUpIcon;
  if (value < 0) return ArrowDownIcon;
}

export default function SaldoBadge(props: BadgeProps) {
  return (
    <TremorBadge
      color={getSaldoColor(props.value, props.debitLimit)}
      text={StringHelper.valuta(props.value)}
      icon={getSaldoIcon(props.value, props.debitLimit)}
    ></TremorBadge>
  );
}
