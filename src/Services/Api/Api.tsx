import axios from 'axios';

export function Axios() {
  return axios.get('http://192.168.1.112:8000/obras')
    };

export default Axios;