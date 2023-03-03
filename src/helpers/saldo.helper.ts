import { SaldoEntry } from "@/models/saldo.model";
import { date, strDate } from "./string.helper";

function deepCopySort(entries: SaldoEntry[]) {
  let deepCopy = JSON.parse(JSON.stringify(entries)) as SaldoEntry[];

  deepCopy.sort((a, b) => {
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
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

type SaldoFlowChartItem = {
  Date: string;
  "Daily change": number;
  Saldo: number;
};

export function saldoFlowChart(entries: SaldoEntry[]) {
  let rawData = saldoWithFlow(entries);

  let data: SaldoFlowChartItem[] = [];

  // Get first and last date
  let firstDate = new Date(rawData[0].createdAt);
  let lastDate = new Date(rawData[rawData.length - 1].createdAt);

  // Get first and last date as strings
  let firstDateString = date(firstDate);
  let lastDateString = date(lastDate);

  // Fill in missing dates, using the data from the previous day
  let saldo = 0;
  let dailyChange = 0;
  let currentDate = firstDate;
  while (currentDate <= lastDate) {
    let currentDateString = date(currentDate);
    let currentEntry = rawData.find(
      (e) => new Date(e.createdAt).getTime() === currentDate.getTime()
    );
    if (currentEntry) {
      saldo = currentEntry.saldo;
      dailyChange = currentEntry.amount;
    } else {
      dailyChange = 0;
    }
    data.push({
      Date: currentDateString,
      "Daily change": dailyChange,
      Saldo: saldo,
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return data;
}

export function saldoWithFlow(
  entries: SaldoEntry[]
): (SaldoEntry & { saldo: number })[] {
  // For every entry, calculate the saldo up to that entry
  let sorted = deepCopySort(entries);

  let saldo = 0;
  let saldoWithFlow = sorted.map((e) => {
    saldo += e.amount;
    return {
      ...e,
      saldo: saldo,
    };
  });

  return saldoWithFlow;
}
