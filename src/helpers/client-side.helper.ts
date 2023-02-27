import { ApiResponse } from "@/models/api-response.interface";
import { Saldo, SaldoEntry, SaldoEntryUpdate } from "@/models/saldo.model";

export async function getSaldos(): Promise<Saldo[] | undefined> {
    const response = await getRequest<Saldo[]>("/api/saldo");
    return response.data;
}

export async function getSaldo(id: string): Promise<Saldo | undefined> {
    const response = await getRequest<Saldo>(`/api/saldo/${id}`);
    return response.data;
}

export async function createSaldo(name: string): Promise<Saldo | undefined> {
    const response = await dataRequest<Saldo>(`/api/saldo`, { name });
    return response.data;
}

export async function deleteSaldo(id: string): Promise<Saldo | undefined> {
    const response = await getRequest<Saldo>(`/api/saldo/${id}`, "DELETE");
    return response.data;
}

export async function addEntryToSaldo(saldoId: string, entry: SaldoEntry): Promise<Saldo | undefined> {
    const response = await dataRequest<Saldo>(`/api/saldo/${saldoId}/entry`, { saldoEntry: entry });
    return response.data;
}

export async function getSaldoEntry(saldoId: string, entryId: string): Promise<SaldoEntry | undefined> {
    const response = await getRequest<SaldoEntry>(`/api/saldo/${saldoId}/entry/${entryId}`);
    return response.data;
}

export async function updateSaldoEntry(saldoId: string, entryId: string, entry: SaldoEntryUpdate): Promise<SaldoEntry | undefined> {
    const response = await dataRequest<SaldoEntry>(`/api/saldo/${saldoId}/entry/${entryId}`, { saldoEntry: entry }, "PUT");
    return response.data;
}

export async function deleteSaldoEntry(saldoId: string, entryId: string): Promise<SaldoEntry | undefined> {
    const response = await getRequest<SaldoEntry>(`/api/saldo/${saldoId}/entry/${entryId}`, "DELETE");
    return response.data;
}

async function dataRequest<T>(url: string, body: unknown, method: "POST" | "PUT" = "POST"): Promise<ApiResponse<T>> {
    const response = await fetch(url, {
        method,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    });
    if (!response.ok) {
        throw new Error(response.statusText);
    }
    const data = await response.json();
    return data as ApiResponse<T>;
}

async function getRequest<T>(url: string, method: "GET" | "DELETE" = "GET"): Promise<ApiResponse<T>> {
    const response = await fetch(url, { method });
    if (!response.ok) {
        throw new Error(response.statusText);
    }
    const data = await response.json();
    return data as ApiResponse<T>;
}