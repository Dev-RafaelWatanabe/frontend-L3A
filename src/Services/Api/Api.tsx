import axios from 'axios';
import type { PaginacaoParams } from './Types';

const api = axios.create({
  baseURL: 'http://localhost:8000/'
  // baseURL: 'http://192.168.1.112:8000/'
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

  createAlocacao: (data: { ferramenta_nome: string; obra_nome: string; funcionario_nome?: string }) => {
    // ALTERADO para novo endpoint
    return api.post('/alocacao/por-nome', data);
  },

  // Lista todas as alocações
  getAlocacoes: (params?: PaginacaoParams) => {
    // ALTERADO para novo endpoint
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
    // ALTERADO para novo endpoint
    return api.post(`/alocacao/${alocacaoId}/desalocar`);
  },

  getAlocacaoHistoricoPorFerramenta: (ferramentaId: number) =>
    api.get(`/alocacao/ferramenta/${ferramentaId}/historico`)
};

export default Api;