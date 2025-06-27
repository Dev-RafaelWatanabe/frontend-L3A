import React, { useEffect, useState } from 'react';
import { Api } from '../../../Services/Api/Api';
import { DataTable } from '../Components/DataTable';
import type { Lancamento } from '../../../Services/Api/Types';

export const Lancamentos: React.FC = () => {
  const [data, setData] = useState<Lancamento[]>([]);
  const [loading, setLoading] = useState(true);

  const columns = [
    { 
      key: 'data_trabalho', 
      label: 'Data',
      render: (value: string) => value ? new Date(value).toLocaleDateString('pt-BR') : 'N/A'
    },
    { 
      key: 'funcionario', 
      label: 'Funcionário',
      render: (value: { nome: string } | null) => value?.nome || 'N/A'
    },
    { 
      key: 'obra', 
      label: 'Obra',
      render: (value: { nome: string } | null) => value?.nome || 'N/A'
    },
    { 
      key: 'restaurante', 
      label: 'Restaurante',
      render: (value: { nome: string } | null) => value?.nome || 'N/A'
    },
    { 
      key: 'turno', 
      label: 'Turno',
      render: (value: { nome: string } | null) => value?.nome || 'N/A'
    }
  ];

  useEffect(() => {
    setLoading(true);
    Api.getLancamentos()
      .then(response => {
        console.log('Dados recebidos:', response.data);
        setData(response.data);
      })
      .catch(error => {
        console.error('Erro ao buscar lançamentos:', error);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div>
      <h1>Lançamentos</h1>
      {data.length > 0 ? (
        <DataTable data={data} columns={columns} />
      ) : (
        <p>Nenhum lançamento encontrado.</p>
      )}
    </div>
  );
};
