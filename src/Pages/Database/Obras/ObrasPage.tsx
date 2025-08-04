import React, { useEffect, useState } from 'react';
import { Api } from '../../../Services/Api/Api';
import { DataTable } from '../Components/DataTable';
import type { Obra } from '../../../Services/Api/Types';

export const Obras: React.FC = () => {
  const [data, setData] = useState<Obra[]>([]);

  const columns = [
    { key: 'id', label: 'id' },
    { key: 'codigo_obra', label: 'Código da obra' },
    { key: 'nome', label: 'Nome da Obra' },
    { key: 'data_inicio', label: 'Data Iníco' },
    { key: 'data_fim', label: 'Data Final' },
    { key: 'atividade', label: 'Atividade' },
    { 
      key: 'orcamento_previsto', 
      label: 'Orça. Previsto',
      render: (value: number) => {
        // Verifica se o valor é válido
        if (value === null || value === undefined || isNaN(value)) {
          return 'R$ 0,00';
        }
        
        // Formata como moeda brasileira
        try {
          return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          }).format(value);
        } catch {
          return 'R$ 0,00';
        }
      }
    },
    { key: 'ativo', label: 'Status' },
    { key: 'tipo_unidade', label: 'Unidade' }
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
