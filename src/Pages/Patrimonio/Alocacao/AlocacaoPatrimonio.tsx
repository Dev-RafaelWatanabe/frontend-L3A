import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Api } from '../../../Services/Api/Api';
import { AlocacaoDataTable } from './AlocacaoDataTable';
import { CriarAlocacaoModal } from './CriarAlocacaoModal';
import { RealocarModal } from './RealocarModal';
import { MdOutlineDelete } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import type { 
  PaginacaoParams, 
  PaginacaoRef,
  PaginacaoResponse,
  Alocacao,
  Obra
} from '../../../Services/Api/Types';
import {
  Container,
  FormContainer,
  FormField,
  ButtonGroup,
  Select,
  Label,
  Input,
  TableContainer,
  Title,
  EmptyStateContainer,
  DataContainer,
  ActionButton,
  ActionButtonsContainer,
  SearchContainer,
  HeaderContainer,
  CreateButton
} from './Styles';
import { PaginacaoComponent } from '../Cadastros/Components/Pagination';

export const AlocacaoPatrimonio: React.FC = () => {
  const [alocacoes, setAlocacoes] = useState<Alocacao[]>([]);
  const [todasAlocacoes, setTodasAlocacoes] = useState<Alocacao[]>([]); // Novo estado para todas as alocações
  const [loading, setLoading] = useState(true);
  const [obras, setObras] = useState<Obra[]>([]);
  const [ferramentas, setFerramentas] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showRealocarModal, setShowRealocarModal] = useState(false);
  const [alocacaoSelecionada, setAlocacaoSelecionada] = useState<Alocacao | null>(null);
  
  // Estados para filtros
  const [filtroObra, setFiltroObra] = useState('');
  const [filtroFerramenta, setFiltroFerramenta] = useState('');
  
  const paginacaoRef = useRef<PaginacaoRef>(null);
  const location = useLocation();

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
          
          // Limpa cache e força refresh
          sessionStorage.removeItem('patrimonio_cache');
          window.location.reload();
        }
      }

      sessionStorage.setItem('patrimonio_previousPath', currentPath);
    };

    handleRouteChange();
  }, [location]);

  useEffect(() => {
    // Carregar dados para os filtros
    const loadFilterData = async () => {
      try {
        const [obrasRes, ferramentasRes] = await Promise.all([
          Api.getObras(),
          Api.getFerramentas()
        ]);
        setObras(obrasRes.data || []);
        setFerramentas(ferramentasRes.data || []);
      } catch (error) {
        console.error('Erro ao carregar dados para filtros:', error);
      }
    };

    loadFilterData();
  }, []);

  // Funções dos botões
  const handleDesalocar = async (alocacao: Alocacao) => {
    if (!window.confirm('Tem certeza que deseja desalocar esta ferramenta?')) return;
    try {
      await Api.desalocarAlocacao(alocacao.id);
      alert('Ferramenta desalocada com sucesso!');
      if (paginacaoRef.current) paginacaoRef.current.reloadData();
    } catch (error) {
      alert('Erro ao desalocar ferramenta. Tente novamente.');
      console.error('Erro ao desalocar:', error);
    }
  };

  const handleDeletar = async (alocacao: Alocacao) => {
    if (!window.confirm('Tem certeza que deseja excluir esta alocação? Esta ação não poderá ser desfeita!')) return;
    try {
      await Api.deleteAlocacao(alocacao.id); // Consome o endpoint /alocacao/{alocacao_id}
      alert('Alocação excluída com sucesso!');
      if (paginacaoRef.current) paginacaoRef.current.reloadData();
    } catch (error) {
      alert('Erro ao excluir alocação. Tente novamente.');
      console.error('Erro ao excluir alocação:', error);
    }
  };

  const handleCriarAlocacao = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleModalSuccess = () => {
    // Recarrega os dados após criar alocação
    if (paginacaoRef.current) {
      paginacaoRef.current.reloadData();
    }
  };

  const handleAbrirRealocar = (alocacao: Alocacao) => {
    setAlocacaoSelecionada(alocacao);
    setShowRealocarModal(true);
  };

  const handleFecharRealocar = () => {
    setShowRealocarModal(false);
    setAlocacaoSelecionada(null);
  };

  // Função para aplicar filtros
  const aplicarFiltros = (alocacoesOriginais: Alocacao[]) => {
    let alocacoesFiltradas = [...alocacoesOriginais];

    // Filtro por obra
    if (filtroObra) {
      alocacoesFiltradas = alocacoesFiltradas.filter(alocacao => 
        alocacao.obra_nome?.toLowerCase().includes(filtroObra.toLowerCase())
      );
    }

    // Filtro por ferramenta
    if (filtroFerramenta) {
      alocacoesFiltradas = alocacoesFiltradas.filter(alocacao => 
        alocacao.ferramenta_nome?.toLowerCase().includes(filtroFerramenta.toLowerCase())
      );
    }

    return alocacoesFiltradas;
  };

  // Função fetchData modificada para suportar filtros
  const fetchData = async (params: PaginacaoParams): Promise<PaginacaoResponse<Alocacao>> => {
    try {
      console.log('🔄 Buscando alocações...');
      const response = await Api.getAlocacoes(params);
      
      console.log('✅ Alocações recebidas:', response.data);
      
      const todasAlocacoesDados = response.data || [];
      setTodasAlocacoes(todasAlocacoesDados); // Armazena todas as alocações
      
      // Aplica filtros
      const alocacoesFiltradas = aplicarFiltros(todasAlocacoesDados);
      
      return {
        data: alocacoesFiltradas,
        total: alocacoesFiltradas.length
      };
    } catch (error) {
      console.error('❌ API: Erro ao buscar alocações:', error);
      
      return {
        data: [],
        total: 0
      };
    }
  };

  // Função para buscar alocações (acionada pelo botão Buscar)
  const handleBuscar = () => {
    console.log('🔍 Aplicando filtros:', {
      obra: filtroObra,
      ferramenta: filtroFerramenta
    });
    
    // Aplica filtros nas alocações já carregadas
    const alocacoesFiltradas = aplicarFiltros(todasAlocacoes);
    setAlocacoes(alocacoesFiltradas);
    
    // Se quiser recarregar do servidor e depois filtrar
    // if (paginacaoRef.current) {
    //   paginacaoRef.current.reloadData();
    // }
  };

  const handleLimparFiltros = () => {
    setFiltroObra('');
    setFiltroFerramenta('');
    
    // Mostra todas as alocações novamente
    setAlocacoes(todasAlocacoes);
    
    // Ou recarrega do servidor
    // if (paginacaoRef.current) {
    //   paginacaoRef.current.reloadData();
    // }
  };

  // Colunas da tabela atualizadas
  const columns = [
    { 
      key: 'id', 
      label: 'Nº' 
    },
    { 
      key: 'ferramenta_nome', 
      label: 'Ferramenta/Patrimônio' 
    },
    { 
      key: 'obra_nome', 
      label: 'Centro de Custo/Obra' 
    },
    { 
      key: 'funcionario_nome', 
      label: 'Responsável',
      render: (value: string) => value || '-'
    },
    { 
      key: 'data_alocacao', 
      label: 'Data Alocação',
      render: (value: string) => {
        if (!value) return '-';
        try {
          return new Date(value).toLocaleDateString('pt-BR');
        } catch {
          return value;
        }
      }
    },
    { 
      key: 'data_desalocacao', 
      label: 'Data Desalocação',
      render: (value: string) => {
        if (!value) return '-';
        try {
          return new Date(value).toLocaleDateString('pt-BR');
        } catch {
          return value;
        }
      }
    },
    {
      key: 'actions',
      label: 'Ações',
      render: (_: any, row: Alocacao) => (
        <ActionButtonsContainer>
          <ActionButton
            color="#6c757d"
            title="Desalocar"
            style={{ minWidth: '80px', maxWidth: '100px', padding: '8px 10px'}}
            onClick={() => handleDesalocar(row)}
          >
            Desalocar
          </ActionButton>

           <ActionButton
            color="#007bff"
            title="Realocar"
            style={{ minWidth: '80px', maxWidth: '100px', padding: '8px 10px'}}
            onClick={() => handleAbrirRealocar(row)}
          >
            Realocar
          </ActionButton>

          <ActionButton
            color="#dc3545"
            title="Deletar alocação"
            style={{ minWidth: '80px', maxWidth: '100px', padding: '8px 10px'}}
            onClick={() => handleDeletar(row)}
          >
            <MdOutlineDelete />
          </ActionButton>
        </ActionButtonsContainer>
      )
    }
  ];

  const handleDataChange = (newData: Alocacao[], isLoading: boolean) => {
    setAlocacoes(newData);
    setLoading(isLoading);
  };

  return (
    <Container>
      {/* Header com título e botão criar */}
      <HeaderContainer>
        <Title>Alocações</Title>
        <CreateButton onClick={handleCriarAlocacao}>
          <FaPlus />
          Criar Alocação
        </CreateButton>
      </HeaderContainer>
      
      {/* Formulário de Busca */}
      <SearchContainer>
        <FormContainer>
          <FormField>
            <Label>Centro de Custo/Obra:</Label>
            <Select 
              value={filtroObra} 
              onChange={(e) => setFiltroObra(e.target.value)}
            >
              <option value="">Todas as obras</option>
              {obras.map((obra) => (
                <option key={obra.id} value={obra.nome}>{obra.nome}</option>
              ))}
            </Select>
          </FormField>
          <FormField>
            <Label>Ferramenta/Patrimônio:</Label>
            <Select 
              value={filtroFerramenta} 
              onChange={(e) => setFiltroFerramenta(e.target.value)}
            >
              <option value="">Todas as ferramentas</option>
              {ferramentas.map((ferramenta) => (
                <option key={ferramenta.id} value={ferramenta.nome}>{ferramenta.nome}</option>
              ))}
            </Select>
          </FormField>
          <ActionButton
            color="#007bff"
            onClick={handleBuscar}
            style={{ height: 40, marginBottom: '16px'}}
          >
            Buscar
          </ActionButton>
          <ActionButton
            color="#6c757d"
            onClick={handleLimparFiltros}
            style={{ height: 40, marginBottom: '16px' }}
          >
            Limpar
          </ActionButton>
        </FormContainer>
      </SearchContainer>

      {/* Tabela de Alocações */}
      <TableContainer>        
        {loading ? (
          <EmptyStateContainer>
            <span>Carregando alocações...</span>
          </EmptyStateContainer>
        ) : alocacoes.length > 0 ? (
          <DataContainer>
            <AlocacaoDataTable data={alocacoes} columns={columns} />
          </DataContainer>
        ) : (
          <EmptyStateContainer>
            <span>Nenhuma alocação encontrada</span>
          </EmptyStateContainer>
        )}
      </TableContainer>

      <PaginacaoComponent
        ref={paginacaoRef}
        fetchData={fetchData}
        itemsPerPage={20}
        onDataChange={handleDataChange}
      />

      {/* Modal de Criar Alocação */}
      <CriarAlocacaoModal
        isOpen={showModal}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
      />

      {/* Modal de Realocar Ferramenta */}
      <RealocarModal
        isOpen={showRealocarModal}
        alocacao={alocacaoSelecionada}
        onClose={handleFecharRealocar}
        onSuccess={() => {
          if (paginacaoRef.current) paginacaoRef.current.reloadData();
        }}
      />
    </Container>
  );
};