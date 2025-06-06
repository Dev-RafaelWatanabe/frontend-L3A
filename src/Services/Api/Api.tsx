import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.1.112:8000'
});

export const Api = {
  getRestaurantes: () => api.get('/restaurantes/obter-restaurante'),
  getFuncionarios: () => api.get('/funcionario/obter-funcionario'),
  getObras: () => api.get('/obras/listar-obras'),
  getLancamentos: () => api.get('/lancamento/listar-lancamentos')
};

export default Api;