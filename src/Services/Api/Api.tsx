import React, { useEffect } from 'react';
import axios from 'axios';

export function App() {
  useEffect(() => {
    const testConnection = async () => {
      try {
        const response = await axios.get('http://localhost:8000/ping'); // ajuste a URL e rota do seu backend
        console.log('Resposta do backend:', response.data);
      } catch (error) {
        console.error('Erro ao conectar com backend:', error);
      }
    };

    testConnection();
  }, []);

  return (
    <div>
      <h1>Teste de conexão Frontend - Backend</h1>
      <p>Veja o console para o resultado da requisição.</p>
    </div>
  );
}

export default App;