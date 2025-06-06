import React, { useEffect, useState } from 'react';
import { Api } from '../../../Services/Api/Api';
import { DataTable } from '../Components/DataTable';

interface Lancamento {
  id: number;
  data: string;
  tipo: string;
  valor: number;
  descricao: string;
  categoria: string;
  forma_pagamento: string;
  status: string;
}

export const Lancamentos: React.FC = () => {
  const [data, setData] = useState<Lancamento[]>([]);

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'data', label: 'Data' },
    { key: 'tipo', label: 'Tipo' },
    { key: 'valor', label: 'Valor' },
    { key: 'descricao', label: 'Descrição' },
    { key: 'categoria', label: 'Categoria' },
    { key: 'forma_pagamento', label: 'Forma de Pagamento' },
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
