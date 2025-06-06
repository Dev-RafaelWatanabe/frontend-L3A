import React, { useEffect, useState } from 'react';
import { Api } from '../../../Services/Api/Api';
import { DataTable } from '../Components/DataTable';

export const Restaurantes: React.FC = () => {
  const [data, setData] = useState([]);

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'nome', label: 'Nome' },
    { key: 'endereco', label: 'Endereço' }
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
