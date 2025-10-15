export interface Cliente {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Orcamento {
  id: string;
  clienteId: string;
  cliente?: Cliente;
  status: 'pendente' | 'aprovado' | 'rejeitado';
  valorTotal: number;
  createdAt: string;
  updatedAt: string;
}

export interface ItemCatalogo {
  id: string;
  nome: string;
  descricao?: string;
  preco: number;
  categoria?: string;
}

export interface ItemOrcamento {
  id: string;
  nome: string;
  descricao?: string;
  preco: number;
  quantidade: number;
  total: number;
}