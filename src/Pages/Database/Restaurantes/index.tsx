import React, { useEffect, useState } from 'react';
import { Api } from '../../../Services/Api/Api';
import { DataTable } from '../Components/DataTable';

interface Restaurante {
  id: number;
  nome: string;
  endereco: string;
  telefone: string;
  horario_funcionamento: string;
  capacidade: number;
  tipo_cozinha: string;
}

export const Restaurantes: React.FC = () => {
  const [data, setData] = useState<Restaurante[]>([]);

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'nome', label: 'Nome' },
    { key: 'endereco', label: 'Endereço' },
    { key: 'telefone', label: 'Telefone' },
    { key: 'horario_funcionamento', label: 'Horário de Funcionamento' },
    { key: 'capacidade', label: 'Capacidade' },
    { key: 'tipo_cozinha', label: 'Tipo de Cozinha' }
  ];

  useEffect(() => {
    Api.getRestaurantes()
      .then(response => setData(response.data))
      .catch(error => console.error('Erro ao buscar restaurantes:', error));
  }, []);

  return (
    <div>
      <h1>Restaurantes</h1>
      <DataTable data={data} columns={columns} />
    </div>
  );
};
