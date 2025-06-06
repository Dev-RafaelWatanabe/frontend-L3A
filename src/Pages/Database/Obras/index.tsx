import React, { useEffect, useState } from 'react';
import { Api } from '../../../Services/Api/Api';
import { DataTable } from '../Components/DataTable';

interface Obra {
  id: number;
  nome: string;
  endereco: string;
  data_inicio: string;
  data_fim: string;
  valor_total: number;
  status: string;
  descricao: string;
}

export const Obras: React.FC = () => {
  const [data, setData] = useState<Obra[]>([]);

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'nome', label: 'Nome' },
    { key: 'endereco', label: 'Endereço' },
    { key: 'data_inicio', label: 'Data de Início' },
    { key: 'data_fim', label: 'Data de Término' },
    { key: 'valor_total', label: 'Valor Total' },
    { key: 'status', label: 'Status' },
    { key: 'descricao', label: 'Descrição' }
  ];

  useEffect(() => {
    Api.getObras()
      .then(response => setData(response.data))
      .catch(error => console.error('Erro ao buscar obras:', error));
  }, []);

  return (
    <div>
      <h1>Obras</h1>
      <DataTable data={data} columns={columns} />
    </div>
  );
};
