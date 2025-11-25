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

export interface Regime {
  id: number;
  nome: string;
}

export interface Funcionario {
  id: number;
  nome: string;
  tipos_empregabilidade: string[];
  ativo: boolean;
  gestor?: boolean;
  tipo_contrato?: 'L3A' | 'TERCEIRO';
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

export interface CriarObra {
  atividade: string;
  ativo: boolean;
  centro_custo: number;
  codigo_obra: number;
  data_fim?: string;
  data_inicio?: string;
  nome: string;
  orcamento_previsto?: number;
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
  restaurante?: {
    id: number;
    nome: string;
  };
  regime: {
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
  id: number;
  data_trabalho: string;
  horario_inicio: string;
  funcionario_id: number;
  obra_id: number;
  funcionario: {
    id: number;
    nome: string;
    tipo_contrato?: 'L3A' | 'TERCEIRO';
  };
  obra: {
    id: number;
    nome: string;
  };
  responsavel?: {
    id: number;
    nome: string;
  };
  turno?: {
    nome: string;
  };
}

export interface PlanejamentoCreate {
  data_trabalho: string;
  horario_inicio: string;
  funcionario_nome: string;
  obra_nome: string;
  responsavel_nome?: string;
}

export interface LancamentoPage {
  funcionario_id: number;
  obra_id: number;
  data_trabalho: string;
  turno: string[];
}

export interface LancamentoCreate {
  data_trabalho: string;
  funcionario_nome: string;
  obra_nome: string;
  restaurante_nome?: string;
  turno_nome: string;
  regime_id: number;
}

export interface LancamentoFilters {
  nome_obra?: string;
  nome_funcionario?: string;
  nome_restaurante?: string;
  nome_regime?: string;
  data_inicio?: string;
  data_fim?: string;
}

export interface LancamentoResponse {
  data: Lancamento[];
  total: number;
  skip: number;
  limit: number;
}

export interface PatrimonioFormData {
  nome: string;
  serie?: string;
  descricao?: string;
  marca: string;
  categoria: string;
  centro_custo: string;
  valor?: number; 
  nota_fiscal?: FileList | null; 
  situacao: string; 
}

export interface Ferramenta {
  id: number;
  nome: string;
  marca: { id: number; nome: string } | string;   
  situacao: { id: number; nome: string } | string;
  categoria: { id: number; nome: string } | string;
  obra: { id: number; nome: string } | string;    
  valor: number;
  descricao?: string;
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

export interface AlocarFormData {
  obra_nome: string;
  observacao: string;
  funcionarioId?: string;
  ferramenta_nome: string;
}

export interface Alocacao {
  id: number;
  ferramenta_id: number;
  obra_id: number;
  funcionario_id: number;
  data_alocacao: string;
  previsao_desalocacao: string;
  data_desalocacao?: string; // Opcional pois pode não existir ainda
  ferramenta_nome?: string;
  obra_nome?: string;
  funcionario_nome?: string;
}

export interface Manutencao {
  id: number;
  obra_id: number;
  funcionario_id: number;
  ferramenta_id: number;
  data_manutencao: string;
  descricao_problema: string;
  acao_tomada: string;
  funcionario: {
    id: number;
    nome: string;
  };
  obra: {
    id: number;
    nome: string;
  };
  ferramenta: {
    id: number;
    nome: string;
  };
}