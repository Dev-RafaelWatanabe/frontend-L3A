import React, { useState, useEffect } from 'react';
import { Api } from '../../../services/api/api';
import { Button } from '../../../style/components/buttons';
import { DataTable } from '../../database/components/data-table';
import type { Funcionario, Obra, Restaurante, LancamentoPage, Lancamento } from '../../../services/api/types';
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

export const CronogramaLancamento: React.FC = () => {
  
  // Estados para histórico
  const [historico, setHistorico] = useState<Lancamento[]>([]);
  const [loadingHistorico, setLoadingHistorico] = useState(true);
  
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
      const lancamento: LancamentoPage = {
        funcionario_id: Number(selectedFuncionario),
        obra_id: Number(selectedObra),
        data_trabalho: selectedDate,
        turno: selectedTurnos
      };

      await Api.createLancamento(lancamento);

      alert('Lançamento registrado com sucesso!');
      
      // Limpar formulário
      setSelectedFuncionario('');
      setSelectedObra('');
      setSelectedDate('');
      setSelectedTurnos([]);
      setSelectedRestaurante('');
      setFuncionarioSearch('');
      setObraSearch('');
      
      // Recarregar histórico
      const response = await Api.getLancamentos();
      setHistorico(response.data);
      
    } catch (error) {
      console.error('Erro ao registrar lançamento:', error);
      alert('Erro ao registrar lançamento.');
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
    <Container>
      <h1>Lançamento de Trabalho</h1>
      
      {/* Seção de Histórico */}
      <div style={{ marginBottom: '2rem' }}>
        <h2>Histórico de Lançamentos</h2>
        {loadingHistorico ? (
          <div>Carregando histórico...</div>
        ) : historico.length > 0 ? (
          <DataTable data={historico} columns={historicoColumns} />
        ) : (
          <p>Nenhum lançamento encontrado.</p>
        )}
      </div>

      {/* Seção do Formulário */}
      <div>
        <h2>Novo Lançamento</h2>
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
            </ButtonGroup>
          </form>
        </FormContainer>
      </div>
    </Container>
  );
};