import dayjs from "dayjs";
import { SaldoEntry } from "./saldo-entry.model";

export class SaldoDay {
  date: dayjs.Dayjs;

  private entries: SaldoEntry[];

  constructor(date: dayjs.Dayjs, entries?: SaldoEntry[]) {
    this.date = date;
    this.entries = entries ?? [];
  }

  addEntry(entry: SaldoEntry) {
    if (!entry.date.isSame(this.date, "day"))
      throw new Error("Entry date does not match day date");
    this.entries.push(entry);
  }

  get dailySaldo(): number {
    return this.entries
      .filter((e) => e.active)
      .reduce((acc, e) => acc + e.amount, 0);
  }

  get transactions(): number {
    return this.entries.length;
  }
}

export type SaldoDayPresentable = {
  id: string;
  Saldo: number;
  Date: string;
  "Daily change": number;
  Debit: number;
};

export class SaldoDayRange {
  start: dayjs.Dayjs;
  end: dayjs.Dayjs;
  debit: number;

  days: SaldoDay[];

  constructor(start: dayjs.Dayjs, end: dayjs.Dayjs, debit: number) {
    this.start = start;
    this.end = end;
    this.debit = debit;
    this.days = [];

    for (let i = 0; i <= this.end.diff(this.start, "day"); i++) {
      this.days.push(new SaldoDay(this.start.add(i, "day")));
    }
  }

  get presentableDays(): SaldoDayPresentable[] {
    let presentable: SaldoDayPresentable[] = [];

    let saldo = 0;
    for (let day of this.days) {
      saldo += day.dailySaldo;
      presentable.push({
        id: day.date.format("YYYY-MM-DD"),
        Saldo: saldo,
        Date: day.date.format("YYYY-MM-DD"),
        "Daily change": day.dailySaldo,
        Debit: this.debit,
      });
    }

    return presentable;
  }

  addEntry(entry: SaldoEntry): SaldoDay | undefined {
    // Find the day
    let day = this.days.find((d) => d.date.isSame(entry.date, "day"));
    if (day) {
      day.addEntry(entry);
      return day;
    }
    return undefined;
  }
}
