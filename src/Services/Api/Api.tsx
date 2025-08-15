import axios from 'axios';
import type { PaginacaoParams } from './Types';

const api = axios.create({
  baseURL: 'http://192.168.1.112:8000/'
});

// Adicionar interceptors para debug
api.interceptors.request.use(request => {
  console.log('🚀 Request:', request);
  return request;
});

api.interceptors.response.use(
  response => {
    console.log('✅ Response:', response);
    return response;
  },
  error => {
    console.error('❌ Error:', error);
    return Promise.reject(error);
  }
);

export const Api = {
  getRestaurantes: () => api.get('/restaurantes/'),
  createRestaurante: (data: { nome: string; valor: number }) => 
    api.post('/restaurantes/', data),
  updateRestaurante: (id: number, data: { nome: string; valor: number }) => 
    api.put(`/restaurantes/${id}/`, data).then(response => {
      console.log('Update response:', response);
      return response;
    }),

  getFuncionarios: () => api.get('/funcionario/'),
  getObras: () => api.get('/obras/'),
  createObra: async (data: {
    atividade: string;
    ativo: boolean;
    centro_custo: number;
    codigo_obra: number;
    data_fim?: string;
    data_inicio?: string;
    nome: string;
    orcamento_previsto?: number;
    tipo_unidade: string;
  }) => {
    const response = await api.post('/obras/', data);
    return response;
  },

  getLancamentos: () => {
  return api.get('/lancamento/');
},

  createLancamento: (data: any) => {
    return api.post('/lancamento/', data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  },

  getFerramentas: (params?: PaginacaoParams) => {
    console.log('📡 getFerramentas chamado com params:', params);
    
    // URL completa para debug
    const url = '/ferramentas/';
    return api.get(url, { 
      params: { 
        skip: params?.skip || 0,
        limit: 50000,
        _t: Date.now() 
      }  
    });
  },
  
  getFerramentaById: (id: number) => api.get(`/ferramentas/${id}`),

  getMarcas: () => api.get('/marcas/'),
  getCategorias: () => api.get('/categorias/'),
  getSituacoes: () => api.get('/situacoes/'),


  createFerramenta: (data: any) => {
    return api.post('/ferramentas/', data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  },

  // CORRIGIDO: Usando axios em vez de fetch
  createAlocacao: async (data: {
    ferramenta_nome: string;
    obra_nome: string;
    funcionario_nome: string;
    previsao_desalocacao?: string | null;
    observacao?: string;
  }) => {
    try {
      const response = await api.post('/alocacao/por-nome', {
        ferramenta_nome: data.ferramenta_nome,
        obra_nome: data.obra_nome,
        funcionario_nome: data.funcionario_nome,
        previsao_desalocacao: data.previsao_desalocacao,
        observacao: data.observacao
      });

      return response.data;
    } catch (error: any) {
      // Mantém compatibilidade com o tratamento de erro existente
      const errorMessage = error.response?.data?.detail || 'Erro ao criar alocação';
      throw new Error(errorMessage);
    }
  },

  // Lista todas as alocações
  getAlocacoes: (params?: PaginacaoParams) => {
    const queryParams = params ? `?skip=${params.skip}` : '';
    return api.get(`/alocacao/${queryParams}`);
  },

  deleteFerramenta: (id: number) => api.delete(`/ferramentas/${id}`),

  deleteAlocacao: (id: number) => api.delete(`/alocacao/${id}`),


  updateFerramenta: (id: number, data: any) =>
  api.put(`/ferramentas/${id}`, data),
  updateFerramentaObra: async (
    ferramentaNome: string,
    obraId: number,
    situacaoId: number,
    valor: number
  ) => {
    const ferramentasResp = await Api.getFerramentas();
    const ferramenta = ferramentasResp.data.find((f: any) => f.nome === ferramentaNome);
    if (!ferramenta) throw new Error('Ferramenta não encontrada.');

    const payload = {
      nome: ferramenta.nome,
      obra_id: obraId,
      situacao_id: situacaoId,
      valor: valor ?? ferramenta.valor
    };

    return Api.updateFerramenta(ferramenta.id, payload);
},

  desalocarAlocacao: (alocacaoId: number) => {
    return api.post(`/alocacao/${alocacaoId}/desalocar`);
  },

  getAlocacaoHistoricoPorFerramenta: (ferramentaId: number) =>
    api.get(`/alocacao/ferramenta/${ferramentaId}/historico`),
  
  // createLancamento: (data: any) => {
  //   return api.post('/lancamento/', data, {
  //     headers: {
  //       'Content-Type': 'application/json'
  //     }
  //   });
  // },

  // Buscar alocação específica por ID
  getAlocacaoById: async (id: number) => {
    const response = await api.get(`/alocacao/${id}`);
    console.log("Resposta da API:", response);
    return response;
  },

  getManutencoes: (params?: PaginacaoParams) => {
    // Busca todas as manutenções, com paginação se precisar
    const queryParams = params ? `?skip=${params.skip}` : '';
    return api.get(`/manutencao-ferramenta/${queryParams}`);
  },

  createManutencao: (data: any) => {
    // Monta os params na URL
    const params = new URLSearchParams();
    params.append('ferramenta_nome', data.ferramenta_nome);
    params.append('motivo', data.motivo);
    if (data.descricao_servico) params.append('descricao_servico', data.descricao_servico);
    if (data.responsavel_id) params.append('responsavel_id', data.responsavel_id);
    if (data.custo) params.append('custo', data.custo);

    return api.post(`/manutencao-ferramenta/por-nome?${params.toString()}`);
  },

  updateManutencao: (id: number, data: any) => {
    // Atualiza uma manutenção existente
    return api.put(`/manutencao-ferramenta/${id}/`, data);
  },

  deleteManutencao: (id: number) => {
    // Remove uma manutenção
    return api.delete(`/manutencao-ferramenta/${id}/`);
  },
};

export default Api;