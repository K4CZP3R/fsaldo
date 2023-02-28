import { SaldoEntry } from "@/models/saldo.model";

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