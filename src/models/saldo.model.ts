import { cloneDeep } from "lodash";
import { DbSaldoEntry, SaldoEntry } from "./saldo-entry.model";

export interface DbSaldo {
  id: string;
  name: string;
  saldoEntry: DbSaldoEntry[];
  debitLimit?: number;
};

export class Saldo {
  id: string;
  name: string;
  private saldoEntry: SaldoEntry[];
  debitLimit?: number | undefined;

  constructor(
    id: string,
    name: string,
    saldoEntry: SaldoEntry[],
    debitLimit?: number | undefined
  ) {
    this.id = id;
    this.name = name;
    this.saldoEntry = saldoEntry.sort(SaldoEntry.sortFunction);
    this.debitLimit = debitLimit;
  }

  public get saldoEntries(): SaldoEntry[] {
    return cloneDeep(this.saldoEntry);
  }


  static fromDb(obj: DbSaldo): Saldo {
    return new Saldo(obj.id, obj.name, obj.saldoEntry.map(e => SaldoEntry.fromDb(e)), obj.debitLimit);
  }

  get endingSaldo(): number {
    return this.saldoEntry.reduce((acc, e) => acc + e.amount, 0);
  }

  getSaldoTo(item: SaldoEntry): number {
    // Calculate saldo to this item
    let saldo = 0;

    // Sort and deep copy
    let entries = this.saldoEntries;

    // Get index of item
    let index = entries.findIndex((e) => e.id === item.id);

    // Get all entries before this item
    let entriesBefore = entries.slice(0, index + 1);

    // Calculate saldo
    entriesBefore.forEach((e) => {
      saldo += e.amount;
    });
    return saldo;
  }

  toDb(): DbSaldo {
    return {
      id: this.id,
      name: this.name,
      saldoEntry: this.saldoEntry.map(e => e.toDb()),
      debitLimit: this.debitLimit
    }
  }
}

