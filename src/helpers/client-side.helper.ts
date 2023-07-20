import { ApiResponse } from "@/models/api-response.interface";
import { DbSaldoEntry, DbSaldoEntryUpdate, SaldoEntry } from "@/models/saldo-entry.model";
import { DbSaldo, Saldo } from "@/models/saldo.model";
import useSWR from "swr";

function useSwrWrap<T, V>(apiPath: string | null, map: (data: T) => V) {
  return useSWR(apiPath, async (url: string) => {
    const resp = (await getRequest<T>(url)).data;
    if (!resp) throw new Error("No data");
    return map(resp);
  });
}
export function useGetSaldo(id: string | null) {
  return useSwrWrap<DbSaldo, Saldo>(id ? `/api/saldo/${id}` : null, Saldo.fromDb)
}

export function useGetSaldos() {
  return useSwrWrap<DbSaldo[], Saldo[]>("/api/saldo", (saldos) => saldos.map(Saldo.fromDb));
}

export async function deleteSaldo(id: string): Promise<Saldo | undefined> {
  const response = await getRequest<DbSaldo>(`/api/saldo/${id}`, "DELETE");
  return response.data ? Saldo.fromDb(response.data) : undefined;
}

export async function updateSaldo(
  id: string,
  name: string,
  debitLimit: number
): Promise<Saldo | undefined> {
  const response = await dataRequest<DbSaldo>(
    `/api/saldo/${id}`,
    {
      saldo: {
        name,
        debitLimit,
      },
    },
    "PUT"
  );
  return response.data ? Saldo.fromDb(response.data) : undefined;
}

export async function createSaldo(
  name: string,
  debitLimit: number
): Promise<Saldo | undefined> {
  const response = await dataRequest<DbSaldo>(`/api/saldo`, { name, debitLimit });
  return response.data ? Saldo.fromDb(response.data) : undefined;
}

export async function addEntryToSaldo(
  saldoId: string,
  entry: DbSaldoEntryUpdate
): Promise<SaldoEntry | undefined> {
  const response = await dataRequest<DbSaldoEntry>(`/api/saldo/${saldoId}/entry`, {
    saldoEntry: entry,
  });
  return response.data ? SaldoEntry.fromDb(response.data) : undefined;
}

export async function getSaldoEntry(
  saldoId: string,
  entryId: string
): Promise<SaldoEntry | undefined> {
  const response = await getRequest<DbSaldoEntry>(
    `/api/saldo/${saldoId}/entry/${entryId}`
  );
  return response.data ? SaldoEntry.fromDb(response.data) : undefined;
}

export async function updateSaldoEntry(
  saldoId: string,
  entryId: string,
  entry: DbSaldoEntryUpdate
): Promise<SaldoEntry | undefined> {
  const response = await dataRequest<DbSaldoEntry>(
    `/api/saldo/${saldoId}/entry/${entryId}`,
    { saldoEntry: entry },
    "PUT"
  );
  return response.data ? SaldoEntry.fromDb(response.data) : undefined;
}

export async function deleteSaldoEntry(
  saldoId: string,
  entryId: string
): Promise<SaldoEntry | undefined> {
  const response = await getRequest<DbSaldoEntry>(
    `/api/saldo/${saldoId}/entry/${entryId}`,
    "DELETE"
  );
  return response.data ? SaldoEntry.fromDb(response.data) : undefined;
}

async function dataRequest<T>(
  url: string,
  body: unknown,
  method: "POST" | "PUT" = "POST"
): Promise<ApiResponse<T>> {
  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  const data = await response.json();
  return data as ApiResponse<T>;
}

async function getRequest<T>(
  url: string,
  method: "GET" | "DELETE" = "GET"
): Promise<ApiResponse<T>> {
  const response = await fetch(url, { method });
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  const data = await response.json();
  return data as ApiResponse<T>;
}

export const SiteName = "fsaldo"


export function getSiteName(extra: string) {
  // return `${PageName} ${extra ? `| ${extra}` : ""}`;
  return `${extra ? `${extra} | ` : ""} ${SiteName}`;
}