import React, { useRef, useState, useEffect } from 'react';
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
} from './Styles';
import { PaginacaoComponent } from './Components/Pagination';

export const PatrimonioDB: React.FC = () => {
  console.log('PatrimonioDB componente montado');
  
  const [data, setData] = useState<Ferramenta[]>([]);
  const [loading, setLoading] = useState(true);
  
  const paginacaoRef = useRef<PaginacaoRef>(null);
  
  // Ref para controlar se o componente já foi inicializado
  const initializedRef = useRef(false);

  const columns = [
    { 
      key: 'id',
      label: 'Númeração',
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
  ];

  // Função fetchData OTIMIZADA (sem logs excessivos)
  const fetchData = async (params: PaginacaoParams): Promise<PaginacaoResponse<Ferramenta>> => {
    try {
      console.log('🔍 API: Buscando ferramentas...');
      
      const response = await Api.getFerramentas(params);
      
      console.log(`API: ${response.data?.length || 0} ferramentas recebidas`);
      
      return {
        data: response.data || [],
        total: response.data?.length || 0
      };
    } catch (error) {
      console.error('❌ API: Erro ao buscar dados:', error);
      throw error;
    }
  };

  // Callback otimizado para receber dados
  const handleDataChange = (newData: Ferramenta[], isLoading: boolean) => {
    console.log(`UI: ${newData.length} itens, loading: ${isLoading}`);
    setData(newData);
    setLoading(isLoading);
  };

  // useEffect ÚNICO para inicialização (sem testes redundantes)
  useEffect(() => {
    if (!initializedRef.current) {
      console.log('🔍 PatrimonioDB inicializado');
      initializedRef.current = true;
    }
  }, []);

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