import axios from 'axios';
import type { PaginacaoParams } from './Types';

const api = axios.create({
  baseURL: '/api'
});

// Adicione isso antes das definições das funções
api.interceptors.request.use(request => {
  console.log('Request:', request);
  return request;
});

api.interceptors.response.use(
  response => {
    console.log('Response:', response);
    return response;
  },
  error => {
    console.log('Error:', error.response);
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
    const queryParams = new URLSearchParams();
    
    // Usar apenas o skip - sem limit
    if (params?.skip !== undefined) {
      queryParams.append('skip', params.skip.toString());
    }
    
    const queryString = queryParams.toString();
    const url = queryString ? `/ferramentas/?${queryString}` : '/ferramentas/';
    
    return api.get(url);
  },
  
  getMarcas: () => api.get('/marcas/'),
  getCategorias: () => api.get('/categorias/'),
  getSituacoes: () => api.get('/situacoes/'),


  createFerramenta: (data: FormData) => api.post('/ferramentas/', data),
  
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
  }
};

export default Api;