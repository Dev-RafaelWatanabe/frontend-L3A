// Generic API types
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface ApiError {
  message: string;
  status: number;
}

// Domain types
export type TipoLancamento = 'RECEITA' | 'DESPESA';

export interface Restaurante {
  id: number;
  nome: string;
  valor: number;
}

export interface Funcionario {
  id: number;
  nome: string;
  data_nascimento: string;
  cpf: string;
  rg: string;
  telefone: string;
  email: string;
  endereco: string;
  cargo: string;
  salario: number;
  data_contratacao: string;
}

export interface Obra {
  id: number;
  nome_obra: string;
  endereco: string;
  responsavel: string;
  prazo: string;
  valor: number;
  status: string;
}

export interface Lancamento {
  id: number;
  data: string;
  descricao: string;
  valor: number;
  tipo: TipoLancamento;
  forma_pagamento: string;
  categoria: string;
  status: string;
}


