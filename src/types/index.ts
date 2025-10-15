export interface Orcamento {
  id: string;
  cliente: string;
  valor: number;
  status: 'pendente' | 'aprovado' | 'rejeitado';
  createdAt: string;
  updatedAt: string;
}

export interface Cliente {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
}