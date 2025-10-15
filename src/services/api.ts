import axios from "axios";
import { Cliente, Orcamento, ItemCatalogo } from "@/types";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Clientes API
export const clientesApi = {
  list: () => api.get<Cliente[]>("/clientes"),
  create: (data: Omit<Cliente, "id" | "createdAt" | "updatedAt">) =>
    api.post<Cliente>("/clientes", data),
  getById: (id: string) => api.get<Cliente>(`/clientes/${id}`),
  update: (id: string, data: Partial<Cliente>) =>
    api.patch<Cliente>(`/clientes/${id}`, data),
  delete: (id: string) => api.delete(`/clientes/${id}`),
};

// Orçamentos API
export const orcamentosApi = {
  list: () => api.get<Orcamento[]>("/orcamentos"),
  create: (data: Omit<Orcamento, "id" | "createdAt" | "updatedAt">) =>
    api.post<Orcamento>("/orcamentos", data),
  getById: (id: string) => api.get<Orcamento>(`/orcamentos/${id}`),
  update: (id: string, data: Partial<Orcamento>) =>
    api.patch<Orcamento>(`/orcamentos/${id}`, data),
  delete: (id: string) => api.delete(`/orcamentos/${id}`),
};

// Catálogo API
export const catalogoApi = {
  list: () => api.get<ItemCatalogo[]>("/items"),
  create: (data: Omit<ItemCatalogo, "id">) =>
    api.post<ItemCatalogo>("/items", data),
  getById: (id: string) => api.get<ItemCatalogo>(`/items/${id}`),
  update: (id: string, data: Partial<ItemCatalogo>) =>
    api.patch<ItemCatalogo>(`/items/${id}`, data),
  delete: (id: string) => api.delete(`/items/${id}`),
};

export default api;
