export type Saldo = {
    id: string;
    name: string;
    saldoEntry: SaldoEntry[] | undefined;

}

export type SaldoEntry = {
    id: string;
    name: string;
    amount: number;
    createdAt: Date;
}

export type SaldoEntryUpdate = {
    name?: string;
    amount?: number;
    createdAt?: Date;
}