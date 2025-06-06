import React, { useEffect, useState } from 'react';
import { Api } from '../../../Services/Api/Api';
import { DataTable } from '../Components/DataTable';

export const Obras: React.FC = () => {
  const [data, setData] = useState([]);

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'nome', label: 'Nome' },
    { key: 'status', label: 'Status' },
    { key: 'data_inicio', label: 'Data Início' }
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
