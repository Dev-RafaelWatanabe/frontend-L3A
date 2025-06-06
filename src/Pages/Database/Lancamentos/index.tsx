import React, { useEffect, useState } from 'react';
import { Api } from '../../../Services/Api/Api';
import { DataTable } from '../Components/DataTable';

export const Lancamentos: React.FC = () => {
  const [data, setData] = useState([]);

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'descricao', label: 'Descrição' },
    { key: 'valor', label: 'Valor' },
    { key: 'data', label: 'Data' }
  ];

  useEffect(() => {
    Api.getLancamentos()
      .then(response => setData(response.data))
      .catch(error => console.error('Erro ao buscar lançamentos:', error));
  }, []);

  return (
    <div>
      <h1>Lançamentos</h1>
      <DataTable data={data} columns={columns} />
    </div>
  );
};
