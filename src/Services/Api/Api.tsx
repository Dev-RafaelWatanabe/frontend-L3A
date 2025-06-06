import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.1.112:8000'
});

export const Api = {
  getRestaurantes: () => api.get('/restaurantes/buscar_restaurantes'),
  getFuncionarios: () => api.get('/funcionario/buscar_funcionarios'),
  getObras: () => api.get('/obras/listar_obras'),
  getLancamentos: () => api.get('/lancamento/listar_lancamentos')
};

export default Api;