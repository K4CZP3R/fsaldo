import { SaldoEntry } from "@/models/saldo-entry.model";
import { Dayjs } from "dayjs";
import { cloneDeep } from "lodash";
import { StringHelper } from "./string.helper";

function deepCopySort(entries: SaldoEntry[]) {
  let deepCopy = cloneDeep(entries);
  deepCopy.sort((a, b) => {
    return (
      a.isAfter(b) ? 1 : -1
    );
  });
  return deepCopy;
}
function deepCopySortDays(days: SaldoDay[]) {
  let deepCopy = cloneDeep(days);

  deepCopy.sort((a, b) => {
    return (
      a.date.isAfter(b.date) ? 1 : -1
    );
  });
  return deepCopy;
}

export function getEndingSaldo(entries: SaldoEntry[]) {
  let sorted = deepCopySort(entries);

  // Get last item
  let lastItem = sorted[sorted.length - 1];

  return getSaldoTo(lastItem, entries);
}

export function getSaldoTo(item: SaldoEntry, entries: SaldoEntry[]) {
  // Calculate saldo to this item
  let saldo = 0;

  // Sort and deep copy
  let sorted = deepCopySort(entries);

  // Get index of item
  let index = sorted.findIndex((e) => e.id === item.id);

  // Get all entries before this item
  let entriesBefore = sorted.slice(0, index + 1);

  // Calculate saldo
  entriesBefore.forEach((e) => {
    saldo += e.amount;
  });
  return saldo;
}

export type SaldoDayPresentable = {
  id: string;
  Date: string;
  "Daily change": number;
  Saldo: number;
  Transactions: number;
};

type SaldoDay = {
  id: string;
  date: Dayjs;
  entries: SaldoEntry[];
};

export function toSaldoDayPresentable(days: SaldoDay[]): SaldoDayPresentable[] {
  let presentable: SaldoDayPresentable[] = [];

  let sorted = deepCopySortDays(days);

  let saldo = 0;
  for (let day of sorted) {
    let dailyChange = 0;
    day.entries.forEach((e) => {
      dailyChange += e.amount;
    });
    saldo += dailyChange;

    presentable.push({
      id: day.id,
      Date: StringHelper.date(day.date),
      "Daily change": dailyChange,
      Saldo: saldo,
      Transactions: day.entries.length,
    });
  }
  return presentable;
}

export function addEmptySaldoDays(days: SaldoDay[]): SaldoDay[] {
  if (days.length < 2) return days;
  let sorted = deepCopySortDays(days);

  // Get first and last date
  let firstDate = sorted[0].date;
  let lastDate = sorted[sorted.length - 1].date;

  // Fill in missing days
  let currentDate = firstDate;
  while (currentDate.unix() <= lastDate.unix()) {
    if (!sorted.find((e) => e.date.isSame(currentDate, "day"))) {
      sorted.push({
        id: currentDate.format("DD.MM.YYYY"),
        date: currentDate,
        entries: [],
      });
    }



    // Advance dayjs object by one day
    currentDate = currentDate.add(1, "day");
  }

  // Sort again
  sorted = deepCopySortDays(sorted);
  return sorted;
}

export function toSaldoDays(entries: SaldoEntry[]): SaldoDay[] {
  let saldoDay: SaldoDay[] = [];

  let sorted = deepCopySort(entries);

  for (let entry of sorted) {
    let saldoDayEntry = saldoDay.find((e) => e.date.isSame(entry.date, "day"));
    if (saldoDayEntry) {
      saldoDayEntry.entries.push(entry);
    } else {
      saldoDay.push({
        id: `${entry.date}${entry.id}`,
        date: entry.date,
        entries: [entry],
      });
    }
  }
  return saldoDay;
}
