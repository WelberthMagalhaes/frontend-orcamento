export interface Cliente {
  id: number;
  nome: string;
  telefone: string;
  email: string;
}

export interface Orcamento {
  id: number;
  clienteId: number;
  cliente?: Cliente;
  dataEvento: string;
  localEvento: string;
  numeroPessoas: number;
  status: "rascunho" | "enviado" | "aprovado" | "rejeitado";
}

export interface VersaoOrcamento {
  id: number;
  orcamentoId: number;
  numero: number;
  status: 'rascunho' | 'enviada' | 'aprovada' | 'rejeitada';
  criadaEm: string;
  itens?: ItemVersao[];
}

export interface Item {
  id: number;
  descricao: string;
  unidade: string;
  valorPadrao: number;
  criadoEm: string;
  atualizadoEm: string;
}

export interface ItemVersao {
  id: number;
  versaoOrcamentoId: number;
  itemId?: number;
  item?: Item;
  descricao: string;
  quantidade: number;
  unidade: string;
  valorUnitario: number;
}
