import React, { useEffect, useState } from 'react';
import { Api } from '../../../Services/Api/Api';
import { DataTable } from '../Components/DataTable';

export const Funcionarios: React.FC = () => {
  const [data, setData] = useState([]);

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'nome', label: 'Nome' },
    { key: 'cargo', label: 'Cargo' }
  ];

  useEffect(() => {
    Api.getFuncionarios()
      .then(response => setData(response.data))
      .catch(error => console.error('Erro ao buscar funcionários:', error));
  }, []);

  return (
    <div>
      <h1>Funcionários</h1>
      <DataTable data={data} columns={columns} />
    </div>
  );
};
