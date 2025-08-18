import React, { useEffect, useState } from 'react';
import { Api } from '../../../services/api/api';
import { DataTable } from '../components/data-table';
import type { Funcionario } from '../../../services/api/types';

export const Funcionarios: React.FC = () => {
  const [data, setData] = useState<Funcionario[]>([]);
  const [loading, setLoading] = useState(true);

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'nome', label: 'Nome' },
    {
      key: 'tipos_empregabilidade',
      label: 'Contratação',
      render: (value: any[]) =>
        Array.isArray(value)
          ? value.map(item => item.nome).join(', ')
          : value
    },
    { 
      key: 'ativo', 
      label: 'Ativo',
      render: (value: boolean) => value ? 'Sim' : 'Não'
    }
  ];

  useEffect(() => {
    setLoading(true);
    Api.getFuncionarios()
      .then(response => {
        console.log('Dados recebidos:', response.data);
        setData(response.data);
      })
      .catch(error => {
        console.error('Erro ao buscar funcionários:', {
          status: error.response?.status,
          message: error.response?.data,
          details: error.response?.data?.detail
        });
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div>
      <h1>Funcionários</h1>
      {data.length > 0 ? (
        <DataTable data={data} columns={columns} />
      ) : (
        <p>Nenhum funcionário encontrado.</p>
      )}
    </div>
  );
};
