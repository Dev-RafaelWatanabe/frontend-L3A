import React, { useEffect, useState } from 'react';
import { Api } from '../../../Services/Api/Api';
import { DataTable } from '../../Database/Components/DataTable';
import type { Ferramenta } from '../../../Services/Api/Types';
import { Container, TableContainer, Title } from './styles';

export const PatrimonioDB: React.FC = () => {
  const [data, setData] = useState<Ferramenta[]>([]);
  const [loading, setLoading] = useState(true);

  const columns = [
    { key: 'nome', label: 'Nome' },
    { 
      key: 'marca', 
      label: 'Marca',
      render: (value: any) => typeof value === 'object' && value !== null ? value.nome : value || '-'
    },
    { 
      key: 'situacao', 
      label: 'Situação',
      render: (value: any) => typeof value === 'object' && value !== null ? value.nome : value || '-'
    },
    { 
      key: 'categoria', 
      label: 'Categoria',
      render: (value: any) => typeof value === 'object' && value !== null ? value.nome : value || '-'
    },
    { 
      key: 'obra', 
      label: 'Obra',
      render: (value: any) => typeof value === 'object' && value !== null ? value.nome : value || '-'
    },
    { 
      key: 'valor', 
      label: 'Valor (R$)',
      render: (value: number) => 
        value !== undefined
          ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
          : 'R$ 0,00'
    },
    { 
      key: 'descricao', 
      label: 'Descrição',
      render: (value: string) => value || '-'
    },
  ];

  useEffect(() => {
    setLoading(true);
    Api.getFerramentas()
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error('Erro ao buscar ferramentas:', error);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <Container><div>Carregando...</div></Container>;
  }

  return (
    <Container>
      <Title>Patrimônio</Title>
      <TableContainer>
        <DataTable data={data} columns={columns} />
      </TableContainer>
    </Container>
  );
};