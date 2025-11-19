import React, { useState, useEffect } from 'react';
import { FaSearch, FaEdit, FaTrash, FaTimes, FaEraser } from 'react-icons/fa';
import styled from 'styled-components';
import { Api } from '../../../services/api/api';
import { Button } from '../../../style/components/buttons';
import type { 
  Funcionario, 
  Obra, 
  Restaurante, 
  Lancamento, 
  LancamentoCreate, 
  LancamentoFilters,
  // LancamentoResponse,
  Regime
} from '../../../services/api/types';

// Styled Components
const Container = styled.div`
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
`;

const FiltersContainer = styled.div`
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  border: 1px solid #e9ecef;
`;

const FiltersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 15px;
`;

const FilterField = styled.div`
  display: flex;
  flex-direction: column;

  label {
    font-weight: 600;
    margin-bottom: 5px;
    color: #495057;
  }

  input, select {
    padding: 8px 12px;
    border: 1px solid #ced4da;
    border-radius: 4px;
    font-size: 14px;
    
    &:focus {
      outline: none;
      border-color: #80bdff;
      box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25);
    }
  }
`;

const FilterButtons = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
`;

const TableContainer = styled.div`
  background: white;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.thead`
  background: #f8f9fa;
`;

const TableRow = styled.tr`
  &:hover {
    background: #f8f9fa;
  }
  
  &:nth-child(even) {
    background: #f9f9f9;
  }
`;

const TableCell = styled.td`
  padding: 12px;
  border-bottom: 1px solid #e9ecef;
  font-size: 14px;
`;

const TableHeaderCell = styled.th`
  padding: 15px 12px;
  border-bottom: 2px solid #dee2e6;
  font-weight: 600;
  text-align: left;
  color: #495057;
`;

const ActionsCell = styled(TableCell)`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const ActionButton = styled.button<{ variant?: 'edit' | 'delete' }>`
  padding: 6px 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s;
  
  ${props => props.variant === 'edit' ? `
    background: #007bff;
    color: white;
    &:hover { background: #0056b3; }
  ` : `
    background: #dc3545;
    color: white;
    &:hover { background: #c82333; }
  `}
`;

// Modal Components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 30px;
  border-radius: 12px;
  width: 90%;
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 2px solid #e9ecef;
`;

const ModalTitle = styled.h2`
  margin: 0;
  color: #333;
  font-size: 24px;
  font-weight: 600;
`;

const FormField = styled.div`
  margin-bottom: 20px;

  label {
    display: block;
    font-weight: 600;
    margin-bottom: 8px;
    color: #495057;
  }

  input, select {
    width: 100%;
    padding: 12px;
    border: 1px solid #ced4da;
    border-radius: 6px;
    font-size: 16px;
    
    &:focus {
      outline: none;
      border-color: #80bdff;
      box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25);
    }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 30px;
`;

interface Props {
  lancamentos: Lancamento[];
  loading?: boolean;
  onRefresh?: () => Promise<void> | void;
}

export const LancamentoHistorico: React.FC<Props> = ({ lancamentos, loading, onRefresh }) => {
  const [historico, setHistorico] = useState<Lancamento[]>([]);
  const [localLoading] = useState(false);
  
  // Estados para filtros
  const [filters, setFilters] = useState<LancamentoFilters>({});
  
  // Estados para edição
  const [editingLancamento, setEditingLancamento] = useState<Lancamento | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  
  // Estados para formulário
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [obras, setObras] = useState<Obra[]>([]);
  const [restaurantes, setRestaurantes] = useState<Restaurante[]>([]);
  const [regimes, setRegimes] = useState<Regime[]>([]);
  const [turnos] = useState([
    { id: 1, nome: 'MANHA' },
    { id: 2, nome: 'TARDE' },
    { id: 3, nome: 'NOITE' }
  ]);

  // Estados do formulário de edição
  const [formData, setFormData] = useState<LancamentoCreate>({
    data_trabalho: '',
    funcionario_nome: '',
    obra_nome: '',
    restaurante_nome: '',
    turno_nome: '',
    regime_id: 1
  });

  // Carregar dados iniciais
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [funcionariosRes, obrasRes, restaurantesRes, regimesRes] = await Promise.all([
          Api.getFuncionarios(),
          Api.getObras(),
          Api.getRestaurantes(),
          Api.getRegimes()
        ]);
        
        setFuncionarios(funcionariosRes.data);
        setObras(obrasRes.data);
        setRestaurantes(restaurantesRes.data);
        setRegimes(regimesRes.data);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };

    fetchInitialData();
  }, []);

  // Usar lancamentos do pai
  useEffect(() => {
    console.log('📊 Lançamentos recebidos do pai:', lancamentos);
    setHistorico(lancamentos || []);
  }, [lancamentos]);

  // Aplicar filtros
  const handleSearch = () => {
    if (onRefresh) {
      onRefresh();
    }
  };

  // Limpar filtros
  const handleClearFilters = () => {
    setFilters({});
    if (onRefresh) {
      onRefresh();
    }
  };

  // Abrir modal de edição
  const handleEdit = (lancamento: Lancamento) => {
    setEditingLancamento(lancamento);
    setFormData({
      data_trabalho: lancamento.data_trabalho,
      funcionario_nome: lancamento.funcionario.nome,
      obra_nome: lancamento.obra.nome,
      restaurante_nome: lancamento.restaurante?.nome || '',
      turno_nome: lancamento.turno.nome,
      regime_id: lancamento.regime.id
    });
    setShowEditModal(true);
  };

  // Salvar edição
  const handleSaveEdit = async () => {
    if (!editingLancamento) return;

    try {
      await Api.updateLancamento(editingLancamento.id, formData);
      setShowEditModal(false);
      setEditingLancamento(null);
      // await fetchHistorico();
      if (onRefresh) await onRefresh();
      alert('Lançamento atualizado com sucesso!');
    } catch (error: any) {
      console.error('Erro ao atualizar lançamento:', error);
      const errorMessage = error.response?.data?.detail || 'Erro ao atualizar lançamento';
      alert(`Erro: ${errorMessage}`);
    }
  };

  // Deletar lançamento
  const handleDelete = async (lancamento: Lancamento) => {
    if (!confirm(`Tem certeza que deseja deletar o lançamento de ${lancamento.funcionario.nome} em ${new Date(lancamento.data_trabalho).toLocaleDateString('pt-BR')}?`)) {
      return;
    }

    try {
      await Api.deleteLancamento(lancamento.id);
      // await fetchHistorico();
      if (onRefresh) await onRefresh();
      alert('Lançamento deletado com sucesso!');
    } catch (error: any) {
      console.error('Erro ao deletar lançamento:', error);
      const errorMessage = error.response?.data?.detail || 'Erro ao deletar lançamento';
      alert(`Erro: ${errorMessage}`);
    }
  };

  return (
    <>
      <Container>

        {/* Filtros */}
        <FiltersContainer>
          <h3>Filtros</h3>
          <FiltersGrid>
            <FilterField>
              <label>Funcionário:</label>
              <select
                value={filters.nome_funcionario || ''}
                onChange={(e) => setFilters(prev => ({...prev, nome_funcionario: e.target.value}))}
              >
                <option value="">Todos os funcionários</option>
                {funcionarios.map(funcionario => (
                  <option key={funcionario.id} value={funcionario.nome}>
                    {funcionario.nome}
                  </option>
                ))}
              </select>
            </FilterField>

            <FilterField>
              <label>Obra:</label>
              <select
                value={filters.nome_obra || ''}
                onChange={(e) => setFilters(prev => ({...prev, nome_obra: e.target.value}))}
              >
                <option value="">Todas as obras</option>
                {obras.map(obra => (
                  <option key={obra.id} value={obra.nome}>
                    {obra.nome}
                  </option>
                ))}
              </select>
            </FilterField>

            <FilterField>
              <label>Restaurante:</label>
              <select
                value={filters.nome_restaurante || ''}
                onChange={(e) => setFilters(prev => ({...prev, nome_restaurante: e.target.value}))}
              >
                <option value="">Todos os restaurantes</option>
                {restaurantes.map(restaurante => (
                  <option key={restaurante.id} value={restaurante.nome}>
                    {restaurante.nome}
                  </option>
                ))}
              </select>
            </FilterField>

            <FilterField>
              <label>Regime:</label>
              <select
                value={filters.nome_regime || ''}
                onChange={(e) => setFilters(prev => ({...prev, nome_regime: e.target.value}))}
              >
                <option value="">Todos os regimes</option>
                {regimes.map(regime => (
                  <option key={regime.id} value={regime.nome}>
                    {regime.nome}
                  </option>
                ))}
              </select>
            </FilterField>

            <FilterField>
              <label>Data Início:</label>
              <input
                type="date"
                value={filters.data_inicio || ''}
                onChange={(e) => setFilters(prev => ({...prev, data_inicio: e.target.value}))}
              />
            </FilterField>

            <FilterField>
              <label>Data Fim:</label>
              <input
                type="date"
                value={filters.data_fim || ''}
                onChange={(e) => setFilters(prev => ({...prev, data_fim: e.target.value}))}
              />
            </FilterField>
          </FiltersGrid>

          <FilterButtons>
            <Button 
              onClick={handleClearFilters}
              style={{ backgroundColor: '#6c757d' }}
            >
              <FaEraser style={{ marginRight: '8px' }} />
              Limpar Filtros
            </Button>
            <Button onClick={handleSearch}>
              <FaSearch style={{ marginRight: '8px' }} />
              Buscar
            </Button>
          </FilterButtons>
        </FiltersContainer>

        {/* Tabela */}
        <TableContainer>
          {(localLoading || loading) ? (
            <div style={{ padding: '40px', textAlign: 'center' }}>
              Carregando histórico...
            </div>
          ) : historico.length > 0 ? (
            <>
              <Table>
                <TableHeader>
                  <tr>
                    <TableHeaderCell>Data</TableHeaderCell>
                    <TableHeaderCell>Funcionário</TableHeaderCell>
                    <TableHeaderCell>Obra</TableHeaderCell>
                    <TableHeaderCell>Turno</TableHeaderCell>
                    <TableHeaderCell>Restaurante</TableHeaderCell>
                    <TableHeaderCell>Regime</TableHeaderCell>
                    <TableHeaderCell>Ações</TableHeaderCell>
                  </tr>
                </TableHeader>
                <tbody>
                  {historico.map((lancamento) => (
                    <TableRow key={lancamento.id}>
                      <TableCell>
                        {new Date(lancamento.data_trabalho).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>{lancamento.funcionario?.nome || 'N/A'}</TableCell>
                      <TableCell>{lancamento.obra?.nome || 'N/A'}</TableCell>
                      <TableCell>{lancamento.turno?.nome || 'N/A'}</TableCell>
                      <TableCell>{lancamento.restaurante?.nome || 'N/A'}</TableCell>
                      <TableCell>{lancamento.regime?.nome || 'N/A'}</TableCell>
                      <ActionsCell>
                        <ActionButton 
                          variant="edit" 
                          onClick={() => handleEdit(lancamento)}
                        >
                          <FaEdit />
                        </ActionButton>
                        <ActionButton 
                          variant="delete" 
                          onClick={() => handleDelete(lancamento)}
                        >
                          <FaTrash />
                        </ActionButton>
                      </ActionsCell>
                    </TableRow>
                  ))}
                </tbody>
              </Table>
            </>
          ) : (
            <div style={{ padding: '40px', textAlign: 'center' }}>
              Nenhum lançamento encontrado com os filtros aplicados.
            </div>
          )}
        </TableContainer>
      </Container>

      {/* Modal de Edição */}
      {showEditModal && editingLancamento && (
        <ModalOverlay onClick={() => setShowEditModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>Editar Lançamento</ModalTitle>
              <button onClick={() => setShowEditModal(false)}>
                <FaTimes />
              </button>
            </ModalHeader>

            <FormField>
              <label>Data:</label>
              <input
                type="date"
                value={formData.data_trabalho}
                onChange={(e) => setFormData(prev => ({...prev, data_trabalho: e.target.value}))}
              />
            </FormField>

            <FormField>
              <label>Funcionário:</label>
              <select
                value={formData.funcionario_nome}
                onChange={(e) => setFormData(prev => ({...prev, funcionario_nome: e.target.value}))}
              >
                <option value="">Selecione o funcionário</option>
                {funcionarios.map(funcionario => (
                  <option key={funcionario.id} value={funcionario.nome}>
                    {funcionario.nome}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField>
              <label>Obra:</label>
              <select
                value={formData.obra_nome}
                onChange={(e) => setFormData(prev => ({...prev, obra_nome: e.target.value}))}
              >
                <option value="">Selecione a obra</option>
                {obras.map(obra => (
                  <option key={obra.id} value={obra.nome}>
                    {obra.codigo_obra ? `${obra.codigo_obra} - ` : ''}{obra.nome}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField>
              <label>Turno:</label>
              <select
                value={formData.turno_nome}
                onChange={(e) => setFormData(prev => ({...prev, turno_nome: e.target.value}))}
              >
                <option value="">Selecione o turno</option>
                {turnos.map(turno => (
                  <option key={turno.id} value={turno.nome}>
                    {turno.nome}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField>
              <label>Restaurante:</label>
              <select
                value={formData.restaurante_nome}
                onChange={(e) => setFormData(prev => ({...prev, restaurante_nome: e.target.value}))}
              >
                <option value="">Nenhum restaurante</option>
                {restaurantes.map(restaurante => (
                  <option key={restaurante.id} value={restaurante.nome}>
                    {restaurante.nome}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField>
              <label>Regime:</label>
              <select
                value={formData.regime_id}
                onChange={(e) => setFormData(prev => ({...prev, regime_id: Number(e.target.value)}))}
              >
                {regimes.map(regime => (
                  <option key={regime.id} value={regime.id}>
                    {regime.nome}
                  </option>
                ))}
              </select>
            </FormField>

            <ButtonGroup>
              <Button onClick={handleSaveEdit}>
                Salvar
              </Button>
              <Button 
                onClick={() => setShowEditModal(false)}
                style={{ backgroundColor: '#6c757d' }}
              >
                Cancelar
              </Button>
            </ButtonGroup>
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
};