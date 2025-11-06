import React, { useState, useEffect } from 'react';
import { FaPlus, FaTimes } from 'react-icons/fa';
import styled from 'styled-components';
import { Api } from '../../../services/api/api';
import { Button } from '../../../style/components/buttons';
import { DataTable } from '../../database/components/data-table';
import type { Funcionario, Obra, Restaurante, Lancamento, LancamentoCreate } from '../../../services/api/types';
import {
  Container,
  FormContainer,
  FormField,
  ButtonGroup,
  ComboboxContainer,
  ComboboxInput,
  ComboboxOptions,
  ComboboxOption,
} from './styles';

// Componentes do Modal
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

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #6c757d;
  
  &:hover {
    color: #333;
  }
`;

export const CronogramaLancamento: React.FC = () => {
  
  // Estados para histórico
  const [historico, setHistorico] = useState<Lancamento[]>([]);
  const [loadingHistorico, setLoadingHistorico] = useState(true);
  
  // Estado para controlar visibilidade do formulário
  const [showForm, setShowForm] = useState(false);
  
  // Estados para formulário
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [obras, setObras] = useState<Obra[]>([]);
  const [restaurantes, setRestaurantes] = useState<Restaurante[]>([]);
  
  const [selectedFuncionario, setSelectedFuncionario] = useState('');
  const [selectedObra, setSelectedObra] = useState('');
  const [selectedRestaurante, setSelectedRestaurante] = useState('');
  const [selectedTurnos, setSelectedTurnos] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState('');

  const [funcionarioSearch, setFuncionarioSearch] = useState('');
  const [obraSearch, setObraSearch] = useState('');
  const [showObraOptions, setShowObraOptions] = useState(false);
  const [showFuncionarioOptions, setShowFuncionarioOptions] = useState(false);

  const turnos = [
    { id: 1, nome: 'Manhã' },
    { id: 2, nome: 'Tarde' },
    { id: 3, nome: 'Noite' }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [funcionariosRes, obrasRes, restaurantesRes] = await Promise.all([
          Api.getFuncionarios(),
          Api.getObras(),
          Api.getRestaurantes()
        ]);
        setFuncionarios(funcionariosRes.data);
        setObras(obrasRes.data);
        setRestaurantes(restaurantesRes.data);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };

    const fetchHistorico = async () => {
      try {
        setLoadingHistorico(true);
        const response = await Api.getLancamentos();
        console.log('Histórico de lançamentos:', response.data);
        setHistorico(response.data);
      } catch (error) {
        console.error('Erro ao carregar histórico:', error);
      } finally {
        setLoadingHistorico(false);
      }
    };

    fetchData();
    fetchHistorico();
  }, []);

  const handleTurnoChange = (turnoNome: string, checked: boolean) => {
    if (checked) {
      setSelectedTurnos(prev => [...prev, turnoNome]);
    } else {
      setSelectedTurnos(prev => prev.filter(t => t !== turnoNome));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFuncionario || !selectedObra || !selectedDate || selectedTurnos.length === 0) {
      alert('Por favor, preencha todos os campos obrigatórios (Funcionário, Obra, Data e pelo menos um Turno)');
      return;
    }

    // Validar restaurante para turno manhã
    if (selectedTurnos.includes('Manhã') && !selectedRestaurante) {
      alert('Restaurante é obrigatório quando o turno "Manhã" está selecionado');
      return;
    }

    try {
      // Buscar nomes dos objetos selecionados
      const funcionarioSelecionado = funcionarios.find(f => f.id.toString() === selectedFuncionario);
      const obraSelecionada = obras.find(o => o.id.toString() === selectedObra);
      const restauranteSelecionado = selectedRestaurante ? restaurantes.find(r => r.id.toString() === selectedRestaurante) : null;

      if (!funcionarioSelecionado || !obraSelecionada) {
        alert('Erro: Funcionário ou obra não encontrado');
        return;
      }

      // Criar um lançamento para cada turno selecionado
      const promessasLancamentos = selectedTurnos.map(async (turno) => {
        const lancamentoData: LancamentoCreate = {
          data_trabalho: selectedDate,
          funcionario_nome: funcionarioSelecionado.nome,
          obra_nome: obraSelecionada.nome,
          turno_nome: turno.toUpperCase() // Converter para maiúscula como no exemplo
        };

        // Adicionar restaurante apenas se for turno da manhã e estiver selecionado
        if (turno === 'Manhã' && restauranteSelecionado) {
          lancamentoData.restaurante_nome = restauranteSelecionado.nome;
        }

        return Api.createLancamento(lancamentoData);
      });

      // Aguardar todos os lançamentos serem criados
      await Promise.all(promessasLancamentos);

      alert(`${selectedTurnos.length} lançamento(s) registrado(s) com sucesso!`);
      
      // Limpar formulário
      setSelectedFuncionario('');
      setSelectedObra('');
      setSelectedDate('');
      setSelectedTurnos([]);
      setSelectedRestaurante('');
      setFuncionarioSearch('');
      setObraSearch('');
      
      // Fechar formulário
      setShowForm(false);
      
      // Recarregar histórico
      const response = await Api.getLancamentos();
      setHistorico(response.data);
      
    } catch (error: any) {
      console.error('Erro ao registrar lançamento:', error);
      
      // Mensagem de erro mais específica
      let errorMessage = 'Erro ao registrar lançamento.';
      
      if (error.code === 'ERR_NETWORK') {
        errorMessage = 'Erro de conexão: Verifique se o servidor está rodando na porta 8000.';
      } else if (error.response) {
        errorMessage = `Erro do servidor: ${error.response.data?.message || error.response.status}`;
      } else if (error.message) {
        errorMessage = `Erro: ${error.message}`;
      }
      
      alert(errorMessage);
    }
  };

  const filteredFuncionarios = funcionarios.filter(func =>
    func.nome.toLowerCase().includes(funcionarioSearch.toLowerCase())
  );

  const filteredObras = obras.filter(obra => {
    const searchLower = obraSearch.toLowerCase();
    const codigoString = obra.codigo_obra?.toString() || '';
    return obra.nome.toLowerCase().includes(searchLower) ||
           codigoString.includes(searchLower);
  });

  // Definir colunas para a tabela de histórico
  const historicoColumns = [
    { 
      key: 'data_trabalho', 
      label: 'Data',
      render: (value: string) => value ? new Date(value).toLocaleDateString('pt-BR') : 'N/A'
    },
    { 
      key: 'funcionario', 
      label: 'Funcionário',
      render: (value: { nome: string } | null) => value?.nome || 'N/A'
    },
    { 
      key: 'obra', 
      label: 'Obra',
      render: (value: { nome: string } | null) => value?.nome || 'N/A'
    },
    { 
      key: 'restaurante', 
      label: 'Restaurante',
      render: (value: { nome: string } | null) => value?.nome || 'N/A'
    },
    { 
      key: 'turno', 
      label: 'Turno',
      render: (value: { nome: string } | null) => value?.nome || 'N/A'
    }
  ];

  return (
    <>
      <Container>
        {/* Header apenas com botão à direita */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          alignItems: 'center', 
          marginBottom: '2rem'
        }}>
          <button
            onClick={() => setShowForm(true)}
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#0056b3';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#007bff';
              e.currentTarget.style.transform = 'translateY(0px)';
            }}
          >
            <FaPlus style={{ fontSize: '16px' }} />
            Criar Lançamento
          </button>
        </div>

        {/* Seção de Histórico */}
        <div>
          <h2>Histórico de Lançamentos</h2>
          {loadingHistorico ? (
            <div>Carregando histórico...</div>
          ) : historico.length > 0 ? (
            <DataTable data={historico} columns={historicoColumns} />
          ) : (
            <p>Nenhum lançamento encontrado.</p>
          )}
        </div>
      </Container>

      {/* Modal do Formulário */}
      {showForm && (
        <ModalOverlay onClick={() => setShowForm(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>Novo Lançamento</ModalTitle>
              <CloseButton onClick={() => setShowForm(false)}>
                <FaTimes />
              </CloseButton>
            </ModalHeader>
            
            <FormContainer>
              <form onSubmit={handleSubmit}>
                <FormField>
                  <label>Funcionário:</label>
                  <ComboboxContainer>
                    <ComboboxInput
                      type="text"
                      placeholder="Buscar funcionário..."
                      value={funcionarioSearch}
                      onChange={(e) => {
                        setFuncionarioSearch(e.target.value);
                        setShowFuncionarioOptions(true);
                      }}
                      onFocus={() => setShowFuncionarioOptions(true)}
                    />
                    {showFuncionarioOptions && (
                      <ComboboxOptions>
                        {filteredFuncionarios.map(func => (
                          <ComboboxOption
                            key={func.id}
                            onClick={() => {
                              setSelectedFuncionario(func.id.toString());
                              setFuncionarioSearch(func.nome);
                              setShowFuncionarioOptions(false);
                            }}
                          >
                            {func.nome}
                          </ComboboxOption>
                        ))}
                      </ComboboxOptions>
                    )}
                  </ComboboxContainer>
                </FormField>

                <FormField>
                  <label>Obra:</label>
                  <ComboboxContainer>
                    <ComboboxInput
                      type="text"
                      placeholder="Buscar obra..."
                      value={obraSearch}
                      onChange={(e) => {
                        setObraSearch(e.target.value);
                        setShowObraOptions(true);
                      }}
                      onFocus={() => setShowObraOptions(true)}
                    />
                    {showObraOptions && (
                      <ComboboxOptions>
                        {filteredObras.map(obra => (
                          <ComboboxOption
                            key={obra.id}
                            onClick={() => {
                              setSelectedObra(obra.id.toString());
                              setObraSearch(`${obra.codigo_obra || ''} - ${obra.nome}`);
                              setShowObraOptions(false);
                            }}
                          >
                            {obra.codigo_obra ? `${obra.codigo_obra} - ` : ''}{obra.nome}
                          </ComboboxOption>
                        ))}
                      </ComboboxOptions>
                    )}
                  </ComboboxContainer>
                </FormField>

                <FormField>
                  <label>Data:</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    required
                  />
                </FormField>

                <FormField>
                  <label>Turnos:</label>
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    {turnos.map(turno => (
                      <label key={turno.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input
                          type="checkbox"
                          checked={selectedTurnos.includes(turno.nome)}
                          onChange={(e) => handleTurnoChange(turno.nome, e.target.checked)}
                        />
                        {turno.nome}
                      </label>
                    ))}
                  </div>
                </FormField>

                {selectedTurnos.includes('Manhã') && (
                  <FormField>
                    <label>Restaurante: *</label>
                    <select
                      value={selectedRestaurante}
                      onChange={(e) => setSelectedRestaurante(e.target.value)}
                      required
                    >
                      <option value="">Selecione o restaurante</option>
                      {restaurantes.map(restaurante => (
                        <option key={restaurante.id} value={restaurante.id.toString()}>
                          {restaurante.nome}
                        </option>
                      ))}
                    </select>
                    <small style={{ color: '#666', marginTop: '0.25rem', display: 'block' }}>
                      * Obrigatório para turno da manhã
                    </small>
                  </FormField>
                )}

                <ButtonGroup>
                  <Button type="submit">
                    Registrar Lançamento
                  </Button>
                  <Button 
                    type="button" 
                    onClick={() => setShowForm(false)}
                    style={{ backgroundColor: '#6c757d', marginLeft: '10px' }}
                  >
                    Cancelar
                  </Button>
                </ButtonGroup>
              </form>
            </FormContainer>
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
};