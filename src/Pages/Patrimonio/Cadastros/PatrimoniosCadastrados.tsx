import React, { useRef, useState} from 'react';
import { Api } from '../../../Services/Api/Api';
import { DataTable } from '../../Database/Components/DataTable';
import type { 
  Ferramenta, 
  PaginacaoParams, 
  PaginacaoRef,
  PaginacaoResponse 
} from '../../../Services/Api/Types';
import { 
  Container, 
  TableContainer, 
  Title,
  EmptyStateContainer,
  DataContainer,
  DeleteIconButton
} from './Styles';
import { FaTrashAlt } from 'react-icons/fa';
import { PaginacaoComponent } from './Components/Pagination';

export const PatrimonioDB: React.FC = () => {
  const [data, setData] = useState<Ferramenta[]>([]);
  const [loading, setLoading] = useState(true);
  const paginacaoRef = useRef<PaginacaoRef>(null);


  // Função para deletar patrimônio
  const handleDelete = async (id: number) => {
    const confirm = window.confirm('Tem certeza que deseja excluir este patrimônio? Esta ação não poderá ser desfeita!');
    if (!confirm) return;
    try {
      await Api.deleteFerramenta(id);
      alert('Patrimônio excluído com sucesso!');
      window.location.reload();
    } catch (error) {
      alert('Erro ao excluir patrimônio. Tente novamente.');
      console.error('Erro ao excluir patrimônio:', error);
    }
  };

  

  const columns = [
    { 
      key: 'id',
      label: 'Nº',
      render: (value: any) => typeof value === 'object' && value !== null ? value.nome : value || '-'
    },
    { 
      key: 'nome', label: 'Nome'
    },
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
    {
      key: 'actions',
      label: '',
      render: (_: any, row: Ferramenta) => (
        <DeleteIconButton
          title="Excluir patrimônio"
          onClick={() => handleDelete(row.id)}
        >
          <FaTrashAlt />
        </DeleteIconButton>
      )
    }
  ];

  // Função fetchData OTIMIZADA (sem logs excessivos)
  const fetchData = async (params: PaginacaoParams): Promise<PaginacaoResponse<Ferramenta>> => {
    try {
      const response = await Api.getFerramentas(params);
      return {
        data: response.data || [],
        total: response.data?.length || 0
      };
    } catch (error) {
      console.error('❌ API: Erro ao buscar dados:', error);
      throw error;
    }
  };

  const handleDataChange = (newData: Ferramenta[], isLoading: boolean) => {
    setData(newData);
    setLoading(isLoading);
  };

  return (
    <Container>
      <Title>Patrimônio</Title>
      <TableContainer>        
        {data.length > 0 ? (
          <DataContainer>
            <DataTable data={data} columns={columns} />
          </DataContainer>
        ) : (
          <EmptyStateContainer>
            <span>{loading ? 'Carregando dados...' : 'Nenhum patrimônio encontrado'}</span>
          </EmptyStateContainer>
        )}
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