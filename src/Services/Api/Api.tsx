import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.1.112:8000'
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
  }
};

export default Api;