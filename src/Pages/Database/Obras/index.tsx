import React, { useEffect, useState } from 'react';
import { Api } from '../../../Services/Api/Api';
import { DataTable } from '../Components/DataTable';
import type { Obra } from '../../../Services/Api/Types';

export const Obras: React.FC = () => {
  const [data, setData] = useState<Obra[]>([]);

  const columns = [
    { key: 'nome_obra', label: 'Nome da Obra' },
    { key: 'endereco', label: 'Endereço' },
    { key: 'responsavel', label: 'Responsável' },
    { key: 'prazo', label: 'Prazo' },
    { key: 'valor', label: 'Valor' },
    { key: 'status', label: 'Status' }
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
