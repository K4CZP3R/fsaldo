import { SaldoEntry } from "@/models/saldo.model";
import { FsaldoDate } from "./fsaldo-date.helper";

function deepCopySort(entries: SaldoEntry[]) {
  let deepCopy = JSON.parse(JSON.stringify(entries)) as SaldoEntry[];
  deepCopy.sort((a, b) => {
    return (
      FsaldoDate.fromString(a.date).toInt() -
      FsaldoDate.fromString(b.date).toInt()
    );
  });
  return deepCopy;
}
function deepCopySortDays(days: SaldoDay[]) {
  let deepCopy = JSON.parse(JSON.stringify(days)) as SaldoDay[];
  deepCopy.sort((a, b) => {
    return a.date.toInt() - b.date.toInt();
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
  Date: string;
  "Daily change": number;
  Saldo: number;
  Transactions: number;
};

type SaldoDay = {
  date: FsaldoDate;
  entries: SaldoEntry[];
};

export function toSaldoDayPresentable(days: SaldoDay[]): SaldoDayPresentable[] {
  let presentable: SaldoDayPresentable[] = [];

  let sorted = deepCopySortDays(days);

  console.log("This is a test, ik heb dit in VR geschreven1 :O");

  let saldo = 0;
  for (let day of sorted) {
    let dailyChange = 0;
    day.entries.forEach((e) => {
      dailyChange += e.amount;
    });
    saldo += dailyChange;

    presentable.push({
      Date: day.date.toString(),
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
  while (currentDate.toInt() <= lastDate.toInt()) {
    if (!sorted.find((e) => e.date.toInt() === currentDate.toInt())) {
      sorted.push({
        date: currentDate,
        entries: [],
      });
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Sort again
  sorted = deepCopySortDays(sorted);
  return sorted;
}

export function toSaldoDays(entries: SaldoEntry[]): SaldoDay[] {
  let saldoDay: SaldoDay[] = [];

  let sorted = deepCopySort(entries);

  for (let entry of sorted) {
    let saldoDayEntry = saldoDay.find((e) => e.date === entry.date);
    if (saldoDayEntry) {
      saldoDayEntry.entries.push(entry);
    } else {
      saldoDay.push({
        date: entry.date,
        entries: [entry],
      });
    }
  }
  return saldoDay;
}
