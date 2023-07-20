import { StringHelper } from "@/helpers/string.helper";
import dayjs from "dayjs";

export interface DbSaldoEntry {
  id: string;
  name: string;
  amount: number;
  date: number;
}

export type DbSaldoEntryUpdate = {
  name?: string;
  amount?: number;
  date?: number;
};

export class SaldoEntry {
  id: string;
  name: string;
  amount: number;
  date: dayjs.Dayjs;

  active = true;

  constructor(id: string, name: string, amount: number, date: dayjs.Dayjs) {
    this.id = id;
    this.name = name;
    this.amount = amount;
    this.date = date;
  }

  isAfter(other: SaldoEntry): boolean {
    return this.date.isSame(other.date)
      ? this.amount < other.amount
      : this.date.isAfter(other.date);
  }
  static sortFunction(a: SaldoEntry, b: SaldoEntry): number {
    return a.isAfter(b) ? 1 : -1;
  }

  get stringDate(): string {
    return StringHelper.date(this.date);
  }

  static fromDb(obj: DbSaldoEntry): SaldoEntry {
    return new SaldoEntry(obj.id, obj.name, obj.amount, dayjs(obj.date));
  }
  static newNow(name: string, amount: number): SaldoEntry {
    return new SaldoEntry("", name, amount, dayjs());
  }

  toDb(): DbSaldoEntry {
    return {
      id: this.id,
      name: this.name,
      amount: this.amount,
      date: this.date.valueOf(),
    };
  }
}
