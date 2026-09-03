import type {
  Account,
  CreateAccountInput,
  CreateAccountResult,
  UpdateAccountInput,
} from "@/types/accounts";

const BASE_URL = "/api/admin/accounts";

async function readResponse<T>(response: Response): Promise<T & { error?: string }> {
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    return { ...(body as object), error: body.error ?? "La operación no pudo completarse." } as T & {
      error?: string;
    };
  }
  return body as T & { error?: string };
}

export async function getAccounts(): Promise<{ accounts?: Account[]; error?: string }> {
  try {
    return await readResponse(await fetch(BASE_URL, { cache: "no-store" }));
  } catch {
    return { error: "No se pudo conectar con el servidor." };
  }
}

export async function createAccount(
  input: CreateAccountInput,
): Promise<CreateAccountResult> {
  try {
    return await readResponse(
      await fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      }),
    );
  } catch {
    return { error: "No se pudo conectar con el servidor." };
  }
}

export async function updateAccount(
  id: string,
  input: UpdateAccountInput,
): Promise<{ account?: Account; error?: string }> {
  try {
    return await readResponse(
      await fetch(`${BASE_URL}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      }),
    );
  } catch {
    return { error: "No se pudo conectar con el servidor." };
  }
}

export async function invalidateAccountSessions(
  id: string,
): Promise<{ invalidated?: number; error?: string }> {
  try {
    return await readResponse(
      await fetch(`${BASE_URL}/${id}/sessions`, { method: "POST" }),
    );
  } catch {
    return { error: "No se pudo conectar con el servidor." };
  }
}