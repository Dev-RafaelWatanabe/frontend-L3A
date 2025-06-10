import React, { useEffect, useState } from 'react';
import { Api } from '../../../Services/Api/Api';
import { DataTable } from '../Components/DataTable';
import type { Restaurante } from '../../../Services/Api/Types';

export const Restaurantes: React.FC = () => {
  const [data, setData] = useState<Restaurante[]>([]);

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'nome', label: 'Nome' },
    { 
      key: 'valor', 
      label: 'Valor',
      render: (value: any) => {
        // Verifica se o valor é válido e converte para número se necessário
        const numValue = Number(value);
        if (isNaN(numValue)) {
          return 'R$ 0,00';
        }
        // Formata o número usando Intl.NumberFormat para garantir formato brasileiro
        return new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(numValue);
      }
    }
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
