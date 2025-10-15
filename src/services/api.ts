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
    api.get<VersaoOrcamento[]>(`/versoes-orcamento/${orcamentoId}`),
  create: (data: Omit<VersaoOrcamento, "id" | "numero" | "criadaEm">) =>
    api.post<VersaoOrcamento>("/versoes-orcamento", data),
  getById: (id: number) => api.get<VersaoOrcamento>(`/versoes-orcamento/${id}`),
  delete: (id: number) => api.delete(`/versoes-orcamento/${id}`),
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
