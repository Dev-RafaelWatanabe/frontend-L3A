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
  tipos_empregabilidade: string[];
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
  data_trabalho: string;
  funcionario: {
    id: number;
    nome: string;
  };
  obra: {
    id: number;
    nome: string;
  };
  turno: {
    nome: string;
  };
  restaurante: {
    id: number;
    nome: string;
  };
}

export interface Turno {
  id: number;
  nome: string;
}

export interface PlanejamentoDiario {
  id: number;
  data: string;
  planejamentos: Array<{
    obra: Obra;
    funcionarios: Funcionario[];
    turnos: string[];
  }>;
}

export interface Planejamento {
  obra: Obra;
  funcionarios: Funcionario[];
}

export interface LancamentoPage {
  funcionario_id: number;
  obra_id: number;
  data_trabalho: string;
  turno: string[];
}

export interface PatrimonioFormData {
  nome: string;
  serie?: string; // Opcional e como string
  descricao: string;
  marca: string; // ID da marca
  categoria: string; // ID da categoria
  centro_custo: string; // ID da obra
  valor: number;
  nota_fiscal: FileList | null;
  situacao: string; // ID da situação
}

export interface Ferramenta {
  id: number;
  nome: string;
  marca: string;
  situacao: string;
  categoria: string;
  obra: string;
  valor: number;
}

export interface Marca {
  id: number;
  nome: string;
}
export interface Categoria {
  id: number;
  nome: string;
}
export interface Situacao {
  id: number;
  nome: string;
}

// Interfaces de Paginação - ATUALIZADA
export interface PaginacaoParams {
  skip: number;
  // Removido o limit - não vamos limitar a quantidade
}

export interface PaginacaoResponse<T> {
  data: T[];
  total: number;
}

export interface PaginacaoComponentProps<T> {
  fetchData: (params: PaginacaoParams) => Promise<PaginacaoResponse<T>>;
  itemsPerPage?: number;
  onDataChange: (data: T[], loading: boolean) => void;
}

export interface PaginacaoRef {
  reloadData: () => void;
  resetToFirstPage: () => void;
  currentPage: number;
  totalPages: number;
  totalItems: number;
}


