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
  tipos_empregabilidade: [];
  ativo: boolean;
}

export interface Obra {
  id: number;
  codigo_obra: number;
  nome: string;
  data_inicio: Date;
  data_fim: Date;
  atividade: string;
  orcamento_previsto: number;
  ativo: boolean;
  tipo_unidade: string;
}

export interface Lancamento {
  id: number;
  
}


