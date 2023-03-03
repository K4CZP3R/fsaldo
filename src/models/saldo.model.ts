export type Saldo = {
  id: string;
  name: string;
  createdAt: Date;
  saldoEntry: SaldoEntry[];
  debitLimit?: number;
};

export type SaldoEntry = {
  id: string;
  name: string;
  amount: number;
  createdAt: string;
};

export type SaldoEntryUpdate = {
  name?: string;
  amount?: number;
  createdAt?: Date;
};
