import React, { useEffect, useState } from 'react';
import { Api } from '../../../Services/Api/Api';
import { DataTable } from '../Components/DataTable';
import type { Funcionario } from '../../../Services/Api/Types';

export const Funcionarios: React.FC = () => {
  const [data, setData] = useState<Funcionario[]>([]);

  const columns = [
    { key: 'nome', label: 'Nome' },
    { key: 'data_nascimento', label: 'Data Nascimento' },
    { key: 'cpf', label: 'CPF' },
    { key: 'telefone', label: 'Telefone' },
    { key: 'email', label: 'E-mail' },
    { key: 'cargo', label: 'Cargo' },
    { key: 'salario', label: 'Salário' },
    { key: 'data_contratacao', label: 'Data Contratação' }
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
