import React, { useRef, useState } from 'react';
import { Api } from '../../../Services/Api/Api';
import { DataTable } from '../../Database/Components/DataTable';
import type { 
  Ferramenta, 
  PaginacaoParams, 
  PaginacaoRef,
  PaginacaoResponse 
} from '../../../Services/Api/Types';
import { Container, TableContainer, Title } from './styles';
import { PaginacaoComponent } from './Components/pagination';

export const PatrimonioDB: React.FC = () => {
  const [data, setData] = useState<Ferramenta[]>([]);
  const [loading, setLoading] = useState(false);
  
  const paginacaoRef = useRef<PaginacaoRef>(null);

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

  // Função para buscar dados (usada pelo componente de paginação)
  const fetchData = async (params: PaginacaoParams): Promise<PaginacaoResponse<Ferramenta>> => {
    try {
      console.log('Buscando ferramentas com params:', params);
      const response = await Api.getFerramentas(params);
      
      // O backend retorna todos os dados (sem limitação)
      return {
        data: response.data,
        total: response.data.length
      };
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      return { data: [], total: 0 };
    }
  };

  // Callback para receber dados do componente de paginação
  const handleDataChange = (newData: Ferramenta[], isLoading: boolean) => {
    console.log('Dados recebidos:', newData.length, 'itens');
    setData(newData);
    setLoading(isLoading);
  };

  if (loading) {
    return <Container><div>Carregando...</div></Container>;
  }

  return (
    <Container>
      <Title>Patrimônio</Title>
      <TableContainer>
        <DataTable data={data} columns={columns} />
      </TableContainer>
      <PaginacaoComponent
        ref={paginacaoRef}
        fetchData={fetchData}
        itemsPerPage={20}
        onDataChange={handleDataChange}
      />
    </Container>
  );
};