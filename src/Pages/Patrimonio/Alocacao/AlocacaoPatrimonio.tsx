import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Api } from '../../../Services/Api/Api';
import { AlocacaoDataTable } from './AlocacaoDataTable';
import { CriarAlocacaoModal } from './CriarAlocacaoModal';
import { IoIosAddCircleOutline, IoIosRemoveCircleOutline } from "react-icons/io";
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
  const [loading, setLoading] = useState(true);
  const [obras, setObras] = useState<Obra[]>([]);
  const [ferramentas, setFerramentas] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  
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
  const handleDesalocar = (alocacao: Alocacao) => {
    console.log('ferramenta foi desalocada', alocacao);
  };

  const handleDeletar = (alocacao: Alocacao) => {
    console.log('alocação deletada', alocacao);
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

  // Função para buscar alocações
  const handleBuscar = () => {
    console.log('Buscando alocações com filtros:', {
      obra: filtroObra,
      ferramenta: filtroFerramenta
    });
    
    // Recarregar dados com filtros
    if (paginacaoRef.current) {
      paginacaoRef.current.reloadData();
    }
  };

  const handleLimparFiltros = () => {
    setFiltroObra('');
    setFiltroFerramenta('');
    
    // Recarregar dados sem filtros
    if (paginacaoRef.current) {
      paginacaoRef.current.reloadData();
    }
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
      label: 'Funcionário',
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
            color="#ffc107"
            title="Desalocar ferramenta"
            onClick={() => handleDesalocar(row)}
          >
            Desalocar Ferramenta
          </ActionButton>
          <ActionButton
            color="#dc3545"
            title="Deletar alocação"
            onClick={() => handleDeletar(row)}
          >
            <MdOutlineDelete />
          </ActionButton>
        </ActionButtonsContainer>
      )
    }
  ];

  // Função fetchData para a paginação
  const fetchData = async (params: PaginacaoParams): Promise<PaginacaoResponse<Alocacao>> => {
    try {
      console.log('🔄 Buscando alocações...');
      const response = await Api.getAlocacoes(params);
      
      console.log('✅ Alocações recebidas:', response.data);
      
      return {
        data: response.data || [],
        total: response.data?.length || 0
      };
    } catch (error) {
      console.error('❌ API: Erro ao buscar alocações:', error);
      
      // Retorna dados vazios em caso de erro para não quebrar a interface
      return {
        data: [],
        total: 0
      };
    }
  };

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
            <Input
              type="text"
              placeholder="Nome da ferramenta..."
              value={filtroFerramenta}
              onChange={(e) => setFiltroFerramenta(e.target.value)}
            />
          </FormField>

          <ButtonGroup>
            <ActionButton
              color="#007bff"
              onClick={handleBuscar}
            >
              Buscar
            </ActionButton>
            <ActionButton
              color="#6c757d"
              onClick={handleLimparFiltros}
            >
              Limpar
            </ActionButton>
          </ButtonGroup>
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
    </Container>
  );
};