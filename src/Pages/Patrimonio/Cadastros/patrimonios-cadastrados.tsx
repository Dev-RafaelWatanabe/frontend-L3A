import React, { useRef, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
  DeleteIconButton,
  SituacaoBadge
} from './styles';
import { FaTrashAlt, FaPlus } from 'react-icons/fa';
import { PaginacaoComponent } from './Components/pagination';
import { Link } from 'react-router-dom';
import { CreateButton } from '../Alocacao/styles';

export const PatrimonioDB: React.FC = () => {
  const [data, setData] = useState<Ferramenta[]>([]);
  const [loading, setLoading] = useState(true);
  const paginacaoRef = useRef<PaginacaoRef>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Hook para detectar mudança de rota e forçar refresh
  useEffect(() => {
    const handleRouteChange = () => {
      const previousPath = sessionStorage.getItem('patrimonio_previousPath');
      const currentPath = location.pathname;

      if (previousPath && previousPath !== currentPath) {
        // Verifica se mudou de seção dentro de patrimônio
        const previousSection = previousPath.split('/')[2];
        const currentSection = currentPath.split('/')[2];

        if (previousSection !== currentSection && 
            ['alocacao', 'cadastros', 'cadastrar'].includes(previousSection) &&
            ['alocacao', 'cadastros', 'cadastrar'].includes(currentSection)) {
          
          console.log('🔄 Forçando refresh devido a mudança de seção:', {
            from: previousSection,
            to: currentSection
          });
          
          // Limpa cache e força refresh
          sessionStorage.removeItem('patrimonio_cache');
          window.location.reload();
        }
      }

      sessionStorage.setItem('patrimonio_previousPath', currentPath);
    };

    handleRouteChange();
  }, [location]);

  // Função para deletar patrimônio
  const handleDelete = async (id: number) => {
    const confirm = window.confirm('Tem certeza que deseja excluir este patrimônio? Esta ação não poderá ser desfeita!');
    if (!confirm) return;
    try {
      await Api.deleteFerramenta(id);
      alert('Patrimônio excluído com sucesso!');
      
      // Limpa cache antes de recarregar
      sessionStorage.removeItem('patrimonio_cache');
      window.location.reload();
    } catch (error) {
      alert('Erro ao excluir patrimônio. Tente novamente.');
      console.error('Erro ao excluir patrimônio:', error);
    }
  };

  function getSituacaoColor(nome: string) {
    switch (nome) {
      case 'Alocado':
        return { cor: '#dc3545', letra: '#fff' };
      case 'Em Manutenção':
        return { cor: '#ffc107', letra: '#222' }; 
      case 'Disponível':
        return { cor: '#28a745', letra: '#fff' };
      default:
        return { cor: '#6c757d', letra: '#fff' };
    }
  }

  const SituacaoCell: React.FC<{ value: any }> = ({ value }) => {
    const nome = typeof value === 'object' && value ? value.nome : value || '-';
    const { cor, letra } = getSituacaoColor(nome);
    return (
      <SituacaoBadge cor={cor} letra={letra}>
        {nome}
      </SituacaoBadge>
    );
  };

  const columns = [
    { 
      key: 'id',
      label: 'Nº',
      render: (value: any) => typeof value === 'object' && value !== null ? value.nome : value || '-'
    },
    { 
      key: 'nome',
      label: 'Nome',
      render: (_: any, row: Ferramenta) => (
        <Link to={`/patrimonio/${row.id}`} style={{ color: '#081168', textDecoration: 'none', fontWeight: 400 }}>
          {row.nome}
        </Link>
      )
    },
    { 
      key: 'marca',
      label: 'Marca',
      render: (value: any) => typeof value === 'object' && value !== null ? value.nome : value || '-'
    },
    { 
      key: 'situacao',
      label: 'Situação',
      render: (value: any) => <SituacaoCell value={value} />
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

  // Função fetchData com limpeza de cache
  const fetchData = async (params: PaginacaoParams): Promise<PaginacaoResponse<Ferramenta>> => {
    try {
      console.log('🔍 Buscando patrimônios...');
      const response = await Api.getFerramentas(params);
      
      console.log('✅ Patrimônios recebidos:', response.data);
      
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
    console.log('📊 Dados alterados:', { 
      count: newData.length, 
      loading: isLoading 
    });
    setData(newData);
    setLoading(isLoading);
  };
  
  const handleCreateTools = () => {
    navigate('/patrimonio/cadastrar');
  };

  return (
    <Container>
      <Title>Patrimônio</Title>
      <CreateButton onClick={handleCreateTools}>
        <FaPlus /> 
        Criar Patrimônio
      </CreateButton>
      <TableContainer>        
        {loading ? (
          <EmptyStateContainer>
            <span>Carregando dados...</span>
          </EmptyStateContainer>
        ) : data.length > 0 ? (
          <DataContainer>
            <DataTable data={data} columns={columns} />
          </DataContainer>
        ) : (
          <EmptyStateContainer>
            <span>Nenhum patrimônio encontrado</span>
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