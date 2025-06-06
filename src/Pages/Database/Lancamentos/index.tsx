import React, { useEffect, useState } from 'react';
import { Api } from '../../../Services/Api/Api';
import { DataTable } from '../Components/DataTable';
import type { Lancamento } from '../../../Services/Api/Types';

export const Lancamentos: React.FC = () => {
  const [data, setData] = useState<Lancamento[]>([]);

  const columns = [
    { key: 'data', label: 'Data' },
    { key: 'descricao', label: 'Descrição' },
    { key: 'valor', label: 'Valor' },
    { key: 'tipo', label: 'Tipo' },
    { key: 'forma_pagamento', label: 'Forma de Pagamento' },
    { key: 'categoria', label: 'Categoria' },
    { key: 'status', label: 'Status' }
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
