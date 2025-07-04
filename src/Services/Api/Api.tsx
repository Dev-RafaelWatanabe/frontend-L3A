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

  getLancamentos: () => {
    console.log('Chamando getLancamentos');
    return api.get('/lancamento/').then(response => {
      console.log('Resposta getLancamentos:', response);
      return response;
    }).catch(error => {
      console.error('Erro getLancamentos:', error);
      throw error;
    });
  },

  getFerramentas: (params?: PaginacaoParams) => {
    console.log('📡 getFerramentas chamado com params:', params);
    
    // URL completa para debug
    const url = '/ferramentas/';
    return api.get(url, { 
    // esse é a "padronização de paramentros utilizados anteriormente, porém, isso fazia com a limitação de dados padrões fossem atendidas{ ...params, _t: Date.now() }
      params: { 
      skip: params?.skip || 0,
      limit: 50000,
      _t: Date.now() 
    }  
    }).then(response => {
      console.log('📦 Resposta getFerramentas:', response);
      return response;
    }).catch(error => {
      console.error('❌ Erro getFerramentas:', error);
      throw error;
    });
  },
  
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

  createLancamento: (data: {
    funcionario_id: number;
    obra_id: number;
    data_trabalho: string;
    is_planejamento?: boolean;
  }) => {
    // Formata os dados antes de enviar
    const formattedData = {
      funcionario: data.funcionario_id,  // Mudando para 'funcionario'
      obra: data.obra_id,        // Mudando para 'obra'
      data_trabalho: data.data_trabalho,
      is_planejamento: data.is_planejamento || false
    };

    console.log('Enviando dados formatados para API:', formattedData);
    
    return api.post('/lancamento/', formattedData)
      .then(response => {
        console.log('Resposta createLancamento:', response);
        return response;
      })
      .catch(error => {
        console.error('Erro detalhado:', {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
          sentData: formattedData
        });
        throw error;
      });
  },

  createAlocacao: (data: { ferramenta_nome: string; obra_nome: string }) =>
    api.post('/api/alocacoes/', data),

  // Lista todas as alocações
  getAlocacoes: () => api.get('/api/alocacoes/'),

  deleteFerramenta: (id: number) => api.delete(`/ferramentas/${id}`),

  updateFerramenta: (id: number, data: any) =>
  api.put(`/ferramentas/${id}`, data),

  /**
   * Atualiza a obra de uma ferramenta/patrimônio já alocado.
   * Busca a ferramenta pelo nome, busca a obra pelo nome, e faz o PUT.
   */
  updateFerramentaObra: async (ferramentaNome: string, novaObraNome: string) => {
    // Busca ferramentas
    const ferramentasResp = await Api.getFerramentas();
    const ferramenta = ferramentasResp.data.find((f: any) => f.nome === ferramentaNome);
    if (!ferramenta) throw new Error('Ferramenta não encontrada.');

    // Busca obras
    const obrasResp = await Api.getObras();
    const obra = obrasResp.data.find((o: any) => o.nome === novaObraNome);
    if (!obra) throw new Error('Obra não encontrada.');

    // Atualiza apenas o campo obra
    const payload = { ...ferramenta, obra: obra.id };
    return Api.updateFerramenta(ferramenta.id, payload);
},
};

export default Api;