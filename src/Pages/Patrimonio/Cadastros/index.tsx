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
  DebugInfo,
  LoadingContainer,
  EmptyStateContainer,
  DataContainer,
  FirstItemDebug
} from './styles';
import { PaginacaoComponent } from './Components/pagination';

export const PatrimonioDB: React.FC = () => {
  console.log('🏗️ PatrimonioDB componente montado');
  
  const [data, setData] = useState<Ferramenta[]>([]);
  const [loading, setLoading] = useState(true);
  
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
      console.log('🔍 Buscando ferramentas do backend...');
      console.log('URL da requisição:', '/ferramentas/');
      
      const response = await Api.getFerramentas(params);
      console.log('Resposta completa:', response);
      
      return {
        data: response.data,
        total: response.data.length
      };
    } catch (error) {
      console.error('❌ Erro ao buscar dados:', error);
      throw error;
    }
  };

  // Callback para receber dados do componente de paginação
  const handleDataChange = (newData: Ferramenta[], isLoading: boolean) => {
    console.log(`📊 Dados da página: ${newData.length} itens, carregando: ${isLoading}`);
    setData(newData);
    setLoading(isLoading);
  };

  // Debug: verificar se o componente foi montado
  useEffect(() => {
    console.log('🔍 PatrimonioDB useEffect executado');
  }, []);

  // Teste direto da API
  useEffect(() => {
    console.log('🧪 Teste direto da API:');
    Api.getFerramentas({ skip: 0 })
      .then(res => console.log('✅ Teste API sucesso:', res))
      .catch(err => console.log('❌ Teste API erro:', err));
  }, []);

  

  return (
    <Container>
      <Title>Patrimônio</Title>
      <TableContainer>
        <DebugInfo>
          Debug: {data.length} itens carregados, loading: {loading.toString()}
        </DebugInfo>
        
        {data.length > 0 ? (
          <DataContainer>
            <DataTable data={data} columns={columns} />
            <FirstItemDebug>
              <strong>Primeiro item:</strong>
              <pre>{JSON.stringify(data[0], null, 2)}</pre>
            </FirstItemDebug>
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