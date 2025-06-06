import React, { useEffect, useState } from 'react';
import { Api } from '../../../Services/Api/Api';
import { DataTable } from '../Components/DataTable';

interface Funcionario {
  id: number;
  nome: string;
  cpf: string;
  rg: string;
  data_nascimento: string;
  endereco: string;
  telefone: string;
  email: string;
  cargo: string;
  salario: number;
  data_admissao: string;
}

export const Funcionarios: React.FC = () => {
  const [data, setData] = useState<Funcionario[]>([]);

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'nome', label: 'Nome' },
    { key: 'cpf', label: 'CPF' },
    { key: 'rg', label: 'RG' },
    { key: 'data_nascimento', label: 'Data de Nascimento' },
    { key: 'endereco', label: 'Endereço' },
    { key: 'telefone', label: 'Telefone' },
    { key: 'email', label: 'Email' },
    { key: 'cargo', label: 'Cargo' },
    { key: 'salario', label: 'Salário' },
    { key: 'data_admissao', label: 'Data de Admissão' }
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
