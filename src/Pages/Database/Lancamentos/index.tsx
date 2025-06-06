import React, { useEffect, useState } from 'react';
import { Api } from '../../../Services/Api/Api';
import { DataTable } from '../Components/DataTable';
import type { Lancamento } from '../../../Services/Api/Types';

export const Lancamentos: React.FC = () => {
  const [data, setData] = useState<Lancamento[]>([]);

  const columns = [
    { key: 'id', label: 'id' },
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
