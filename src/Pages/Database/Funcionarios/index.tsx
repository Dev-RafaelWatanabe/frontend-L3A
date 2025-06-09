import React, { useEffect, useState } from 'react';
import { Api } from '../../../Services/Api/Api';
import { DataTable } from '../Components/DataTable';
import type { Funcionario } from '../../../Services/Api/Types';

export const Funcionarios: React.FC = () => {
  const [data, setData] = useState<Funcionario[]>([]);

  const columns = [
    { key: 'id', label: 'id' },
    { key: 'nome', label: 'Nome' },
    {
      key: 'tipos_empregabilidade',
      label: 'Contratação',
      render: (value: any[]) =>
        Array.isArray(value)
          ? value.map(item => item.nome).join(', ')
          : value
    },  
    { key: 'ativo', label: 'ativo' }
  ];

  useEffect(() => {
    Api.getFuncionarios()
      .then(response => setData(response.data))
      .catch(error => {
        console.error('Erro ao buscar funcionários:', {
          status: error.response?.status,
          message: error.response?.data,
          details: error.response?.data?.detail
        });
      });
  }, []);

  return (
    <div>
      <h1>Funcionários</h1>
      <DataTable data={data} columns={columns} />
    </div>
  );
};
