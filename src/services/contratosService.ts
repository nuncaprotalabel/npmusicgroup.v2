import type { Contract, ContractResult } from "@/types/contracts";

interface ContractListResult {
  contracts?: Contract[];
  error?: string;
}

export async function getContracts(): Promise<ContractListResult> {
  try {
    const response = await fetch("/api/admin/contratos", { cache: "no-store" });
    const payload = await response.json() as ContractListResult;
    if (!response.ok) return { error: payload.error || "No se pudieron cargar los contratos." };
    return { contracts: payload.contracts ?? [] };
  } catch {
    return { error: "No se pudo conectar con el servidor. Intenta de nuevo." };
  }
}

export async function createContractFromInvitation(invitationId: string): Promise<ContractResult> {
  try {
    const response = await fetch("/api/admin/contratos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ invitationId }),
    });
    const payload = await response.json() as ContractResult;
    if (!response.ok) return { error: payload.error, contractId: payload.contractId };
    return payload;
  } catch {
    return { error: "No se pudo conectar con el servidor. Intenta de nuevo." };
  }
}

export async function updateContract(
  id: string,
  data: Pick<Contract, "title" | "version" | "content" | "sections">,
): Promise<ContractResult> {
  try {
    const response = await fetch(`/api/admin/contratos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const payload = await response.json() as ContractResult;
    if (!response.ok) return payload;
    return payload;
  } catch {
    return { error: "No se pudo conectar con el servidor. Intenta de nuevo." };
  }
}

export async function submitContract(id: string): Promise<ContractResult> {
  try {
    const response = await fetch(`/api/admin/contratos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "submit" }),
    });
    const payload = await response.json() as ContractResult;
    if (!response.ok) return payload;
    return payload;
  } catch {
    return { error: "No se pudo conectar con el servidor. Intenta de nuevo." };
  }
}