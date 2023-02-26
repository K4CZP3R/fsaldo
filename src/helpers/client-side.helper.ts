import { ApiResponse } from "@/models/api-response.interface";
import { Saldo } from "@/models/saldo.model";

export async function getSaldos(): Promise<Saldo[] | undefined> {
    const response = await getRequest<Saldo[]>("/api/saldo");
    return response.data;
}

export async function getSaldo(id: string): Promise<Saldo | undefined> {
    const response = await getRequest<Saldo>(`/api/saldo/${id}`);
    return response.data;
}


async function getRequest<T>(url: string): Promise<ApiResponse<T>> {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(response.statusText);
    }
    const data = await response.json();
    return data as ApiResponse<T>;
}