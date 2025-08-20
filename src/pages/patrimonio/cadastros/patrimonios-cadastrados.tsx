import React, { /* useRef, */ useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Api } from '../../../services/api/api';
import { DataTable } from '../../database/components/data-table';
import type { 
  Ferramenta, 
/*   PaginacaoParams, 
  PaginacaoRef,
  PaginacaoResponse, */
  Obra,
  Marca,
  Situacao
} from '../../../services/api/types';
import { 
  Container, 
  TableContainer, 
  Title,
  EmptyStateContainer,
  DataContainer,
  DeleteIconButton,
  SituacaoBadge,
  FilterContainer,
  FilterRow,
  FilterGroup,
  FilterLabel,
  FilterSelect,
  FilterInput,
  ClearFiltersButton
} from './styles';
import { FaTrashAlt, FaPlus, FaFilter, FaTimes } from 'react-icons/fa';
/* import { PaginacaoComponent } from './components/pagination'; */
import { Link } from 'react-router-dom';
import { CreateButton } from '../alocacao/styles';

interface Filtros {
  nome: string;
  marca: string;
  situacao: string;
  obra: string;
}

export const PatrimonioDB: React.FC = () => {
  const [allData, setAllData] = useState<Ferramenta[]>([]); // TODOS os dados
  const [filteredData, setFilteredData] = useState<Ferramenta[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  
  // Estados para os dados dos filtros
  const [obras, setObras] = useState<Obra[]>([]);
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [situacoes, setSituacoes] = useState<Situacao[]>([]);
  
  // Estado dos filtros
  const [filtros, setFiltros] = useState<Filtros>({
    nome: '',
    marca: '',
    situacao: '',
    obra: ''
  });

  /* const paginacaoRef = useRef<PaginacaoRef>(null); */
  const location = useLocation();
  const navigate = useNavigate();

  // CARREGA TODOS OS DADOS NA INICIALIZAÇÃO
  useEffect(() => {
    const loadAllData = async () => {
      try {
        setLoading(true);
        console.log('🔄 Carregando TODOS os patrimônios...');
        
        // Busca TODOS os dados de uma vez
        const response = await Api.getFerramentas({ 
          skip: 0
        });
        
        const todosOsDados = response.data || [];
        console.log('✅ Carregados todos os patrimônios:', todosOsDados.length);
        
        setAllData(todosOsDados);
        setFilteredData(todosOsDados); // Inicialmente mostra tudo
      } catch (error) {
        console.error('❌ Erro ao carregar patrimônios:', error);
        setAllData([]);
        setFilteredData([]);
      } finally {
        setLoading(false);
      }
    };

    loadAllData();
  }, []);

  // Carregar dados para os filtros
  useEffect(() => {
    const loadFilterData = async () => {
      try {
        const [obrasRes, marcasRes, situacoesRes] = await Promise.all([
          Api.getObras(),
          Api.getMarcas(),
          Api.getSituacoes()
        ]);
        setObras(obrasRes.data || []);
        setMarcas(marcasRes.data || []);
        setSituacoes(situacoesRes.data || []);
      } catch (error) {
        console.error('Erro ao carregar dados para filtros:', error);
      }
    };

    loadFilterData();
  }, []);

  // Aplicar filtros - AGORA FUNCIONA EM TODOS OS DADOS
  useEffect(() => {
    console.log('🔍 Aplicando filtros...', { filtros, allDataLength: allData.length });
    
    if (!allData.length) {
      setFilteredData([]);
      return;
    }

    let filtered = [...allData]; // USA TODOS OS DADOS

    // Filtro por nome
    if (filtros.nome.trim()) {
      const searchTerm = filtros.nome.toLowerCase().trim();
      console.log('🔎 Buscando por nome:', searchTerm);
      
      filtered = filtered.filter(item => {
        const nome = item.nome?.toLowerCase() || '';
        const matches = nome.includes(searchTerm);
        return matches;
      });
      
      console.log(`📊 Encontradas ${filtered.length} ferramentas com "${searchTerm}"`);
    }

    // Filtro por marca
    if (filtros.marca) {
      filtered = filtered.filter(item => {
        const marcaId = typeof item.marca === 'object' ? item.marca?.id : item.marca;
        return marcaId?.toString() === filtros.marca;
      });
    }

    // Filtro por situação
    if (filtros.situacao) {
      filtered = filtered.filter(item => {
        const situacaoId = typeof item.situacao === 'object' ? item.situacao?.id : item.situacao;
        return situacaoId?.toString() === filtros.situacao;
      });
    }

    // Filtro por obra
    if (filtros.obra) {
      filtered = filtered.filter(item => {
        const obraId = typeof item.obra === 'object' ? item.obra?.id : item.obra;
        return obraId?.toString() === filtros.obra;
      });
    }

    console.log('📈 Resultado final dos filtros:', filtered.length);
    setFilteredData(filtered);
  }, [allData, filtros]); // DEPENDE DE allData, não de data

  // Função para limpar filtros
  const handleClearFilters = () => {
    console.log('🧹 Limpando filtros...');
    setFiltros({
      nome: '',
      marca: '',
      situacao: '',
      obra: ''
    });
  };

  // Função para alterar filtro
  const handleFilterChange = (key: keyof Filtros, value: string) => {
    console.log(`🔧 Alterando filtro ${key}:`, value);
    setFiltros(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Verificar se há filtros ativos
  const hasActiveFilters = Object.values(filtros).some(value => value.trim() !== '');

  // Hook para detectar mudança de rota e forçar refresh
  useEffect(() => {
    const handleRouteChange = () => {
      const previousPath = sessionStorage.getItem('patrimonio_previousPath');
      const currentPath = location.pathname;

      if (previousPath && previousPath !== currentPath) {
        const previousSection = previousPath.split('/')[2];
        const currentSection = currentPath.split('/')[2];

        if (previousSection !== currentSection && 
            ['alocacao', 'cadastros', 'cadastrar'].includes(previousSection) &&
            ['alocacao', 'cadastros', 'cadastrar'].includes(currentSection)) {
          
          console.log('🔄 Forçando refresh devido a mudança de seção:', {
            from: previousSection,
            to: currentSection
          });
          
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
      
      // Atualizar dados após exclusão
      const response = await Api.getFerramentas({ skip: 0});
      const novosdados = response.data || [];
      setAllData(novosdados);
      
      // Reaplicar filtros
      if (!hasActiveFilters) {
        setFilteredData(novosdados);
      }
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

  // REMOVER O PaginacaoComponent OU TORNÁ-LO OPCIONAL
  const handleCreateTools = () => {
    navigate('/patrimonio/cadastrar');
  };

  // Usar dados filtrados sempre
  const displayData = filteredData;

  return (
    <Container>
      <Title>Patrimônio</Title>
      
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <CreateButton onClick={handleCreateTools}>
          <FaPlus /> 
          Criar Patrimônio
        </CreateButton>
        
        <CreateButton 
          onClick={() => setShowFilters(!showFilters)}
          style={{ backgroundColor: showFilters ? '#dc3545' : '#6c757d' }}
        >
          <FaFilter /> 
          {showFilters ? 'Fechar Filtros' : 'Filtros'}
        </CreateButton>
      </div>

      {showFilters && (
        <FilterContainer>
          <FilterRow>
            <FilterGroup>
              <FilterLabel>Buscar por Nome:</FilterLabel>
              <FilterInput
                type="text"
                placeholder="Digite o nome da ferramenta..."
                value={filtros.nome}
                onChange={(e) => handleFilterChange('nome', e.target.value)}
              />
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>Marca:</FilterLabel>
              <FilterSelect
                value={filtros.marca}
                onChange={(e) => handleFilterChange('marca', e.target.value)}
              >
                <option value="">Todas as marcas</option>
                {marcas.map(marca => (
                  <option key={marca.id} value={marca.id}>
                    {marca.nome}
                  </option>
                ))}
              </FilterSelect>
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>Situação:</FilterLabel>
              <FilterSelect
                value={filtros.situacao}
                onChange={(e) => handleFilterChange('situacao', e.target.value)}
              >
                <option value="">Todas as situações</option>
                {situacoes.map(situacao => (
                  <option key={situacao.id} value={situacao.id}>
                    {situacao.nome}
                  </option>
                ))}
              </FilterSelect>
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>Obra:</FilterLabel>
              <FilterSelect
                value={filtros.obra}
                onChange={(e) => handleFilterChange('obra', e.target.value)}
              >
                <option value="">Todas as obras</option>
                {obras.map(obra => (
                  <option key={obra.id} value={obra.id}>
                    {obra.nome}
                  </option>
                ))}
              </FilterSelect>
            </FilterGroup>

            {hasActiveFilters && (
              <FilterGroup>
                <ClearFiltersButton onClick={handleClearFilters}>
                  <FaTimes /> Limpar Filtros
                </ClearFiltersButton>
              </FilterGroup>
            )}
          </FilterRow>
          
          {/* Debug info */}
          <div style={{ 
            marginTop: '1rem', 
            padding: '0.5rem', 
            backgroundColor: '#e9ecef', 
            borderRadius: '4px',
            fontSize: '0.8rem',
            color: '#495057'
          }}>
            <strong>Debug:</strong> 
            Total: {allData.length} | 
            Filtrado: {filteredData.length} | 
            Termo: "{filtros.nome}" | 
            Filtros ativos: {hasActiveFilters ? 'Sim' : 'Não'}
          </div>
        </FilterContainer>
      )}

      <TableContainer>        
        {loading ? (
          <EmptyStateContainer>
            <span>Carregando dados...</span>
          </EmptyStateContainer>
        ) : displayData.length > 0 ? (
          <DataContainer>
            <DataTable data={displayData} columns={columns} />
            <div style={{ padding: '1rem', textAlign: 'center', color: '#6c757d' }}>
              Mostrando {displayData.length} {hasActiveFilters ? `de ${allData.length}` : ''} patrimônios
            </div>
          </DataContainer>
        ) : (
          <EmptyStateContainer>
            <span>
              {hasActiveFilters 
                ? 'Nenhum patrimônio encontrado com os filtros aplicados' 
                : 'Nenhum patrimônio encontrado'
              }
            </span>
          </EmptyStateContainer>
        )}
      </TableContainer>
      
      {/* COMENTADO - pode remover se funcionar bem */}
      {/* <PaginacaoComponent
        ref={paginacaoRef}
        fetchData={fetchData}
        itemsPerPage={20}
        onDataChange={handleDataChange}
      /> */}
    </Container>
  );
};