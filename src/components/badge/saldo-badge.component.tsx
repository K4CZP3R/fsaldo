import { valuta } from "@/helpers/string.helper";
import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
} from "@heroicons/react/24/solid";
import { Badge as TremorBadge } from "@tremor/react";

export type BadgeProps = {
  value: number;
};

export function getSaldoText(value: number) {
  if (value === 0) return "Neutral";
  if (value > 0) return "Positive";
  if (value < 0) return "Negative";
  return "Unknown";
}

export function getSaldoColor(value: number) {
  if (value === 0) return "gray";
  if (value > 0) return "green";
  if (value < 0) return "red";
  return "gray";
}

export function getSaldoIcon(value: number) {
  if (value === 0) return ArrowRightIcon;
  if (value > 0) return ArrowUpIcon;
  if (value < 0) return ArrowDownIcon;
}

export default function SaldoBadge(props: BadgeProps) {
  return (
    <TremorBadge
      color={getSaldoColor(props.value)}
      text={valuta(props.value)}
      icon={getSaldoIcon(props.value)}
    ></TremorBadge>
  );
}
