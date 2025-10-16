import axios from "axios";
import { Cliente, Orcamento, VersaoOrcamento, Item, ItemVersao } from "@/types";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Clientes API
export const clientesApi = {
  list: () => api.get<Cliente[]>("/clientes"),
  create: (data: Omit<Cliente, "id">) => api.post<Cliente>("/clientes", data),
  getById: (id: number) => api.get<Cliente>(`/clientes/${id}`),
  update: (id: number, data: Partial<Cliente>) =>
    api.patch<Cliente>(`/clientes/${id}`, data),
  delete: (id: number) => api.delete(`/clientes/${id}`),
};

// Orçamentos API
export const orcamentosApi = {
  list: () => api.get<Orcamento[]>("/orcamentos"),
  create: (data: Omit<Orcamento, "id">) =>
    api.post<Orcamento>("/orcamentos", data),
  getById: (id: number) => api.get<Orcamento>(`/orcamentos/${id}`),
  update: (id: number, data: Partial<Orcamento>) =>
    api.patch<Orcamento>(`/orcamentos/${id}`, data),
  delete: (id: number) => api.delete(`/orcamentos/${id}`),
};

// Versões API
export const versoesApi = {
  list: (orcamentoId: number) =>
    api.get<VersaoOrcamento[]>(`/orcamentos/${orcamentoId}/versoes`),
  create: (orcamentoId: number, data?: Record<string, unknown>) =>
    api.post<VersaoOrcamento>(`/orcamentos/${orcamentoId}/versoes`, data || {}),
  getById: (orcamentoId: number, versaoId: number) =>
    api.get<VersaoOrcamento>(`/orcamentos/${orcamentoId}/versoes/${versaoId}`),
  enviar: (orcamentoId: number, versaoId: number) =>
    api.post<VersaoOrcamento>(`/orcamentos/${orcamentoId}/versoes/${versaoId}/enviar`, {}),
  aprovar: (orcamentoId: number, versaoId: number, usuarioId?: number) =>
    api.post<VersaoOrcamento>(`/orcamentos/${orcamentoId}/versoes/${versaoId}/aprovar`, { usuarioId }),
  rejeitar: (orcamentoId: number, versaoId: number, usuarioId?: number) =>
    api.post<VersaoOrcamento>(`/orcamentos/${orcamentoId}/versoes/${versaoId}/rejeitar`, { usuarioId }),
  reabrir: (orcamentoId: number, versaoId: number, motivo?: string) =>
    api.post<VersaoOrcamento>(`/orcamentos/${orcamentoId}/versoes/${versaoId}/reabrir`, { motivo }),
  getHistorico: (orcamentoId: number, versaoId: number) =>
    api.get(`/orcamentos/${orcamentoId}/versoes/${versaoId}/historico`),
  delete: (orcamentoId: number, versaoId: number) =>
    api.delete(`/orcamentos/${orcamentoId}/versoes/${versaoId}`),
};

// Items Catálogo API
export const itemsApi = {
  list: () => api.get<Item[]>("/items"),
  create: (data: Omit<Item, "id" | "criadoEm" | "atualizadoEm">) =>
    api.post<Item>("/items", data),
  getById: (id: number) => api.get<Item>(`/items/${id}`),
  update: (id: number, data: Partial<Item>) =>
    api.patch<Item>(`/items/${id}`, data),
  delete: (id: number) => api.delete(`/items/${id}`),
};

export default api;
