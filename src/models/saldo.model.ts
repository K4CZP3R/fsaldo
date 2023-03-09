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
  saldoEntry: SaldoEntry[];
  debitLimit?: number | undefined;

  constructor(
    id: string,
    name: string,
    saldoEntry: SaldoEntry[],
    debitLimit?: number | undefined
  ) {
    this.id = id;
    this.name = name;
    this.saldoEntry = saldoEntry;
    this.debitLimit = debitLimit;
  }

  get sortedSaldoEntry(): SaldoEntry[] {
    return this.saldoEntry.sort(SaldoEntry.sortFunction);
  }

  static fromDb(obj: DbSaldo): Saldo {
    return new Saldo(obj.id, obj.name, obj.saldoEntry.map(e => SaldoEntry.fromDb(e)), obj.debitLimit);
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

