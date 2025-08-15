import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Api } from '../../../Services/Api/Api';
import { Button } from '../../../style/components/buttons';
import type { Funcionario, Obra, Restaurante, LancamentoPage } from '../../../Services/Api/Types';
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
  const navigate = useNavigate();
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [obras, setObras] = useState<Obra[]>([]);
  const [restaurantes, setRestaurantes] = useState<Restaurante[]>([]);
  
  const [selectedFuncionario, setSelectedFuncionario] = useState('');
  const [selectedObra, setSelectedObra] = useState('');
  const [selectedRestaurante, setSelectedRestaurante] = useState('');
  const [selectedTurno, setSelectedTurno] = useState('');
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

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFuncionario || !selectedObra || !selectedDate || !selectedTurno) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    try {
      const lancamento: LancamentoPage = {
        funcionario_id: Number(selectedFuncionario),
        obra_id: Number(selectedObra),
        data_trabalho: selectedDate,
        turno: [selectedTurno]
      };

      await Api.createLancamento(lancamento);

      alert('Lançamento registrado com sucesso!');
      navigate('/database/lancamentos');
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

  return (
    <Container>
      <h1>Lançamento de Trabalho</h1>
      
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
            <label>Turno:</label>
            <select
              value={selectedTurno}
              onChange={(e) => setSelectedTurno(e.target.value)}
              required
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
              value={selectedRestaurante}
              onChange={(e) => setSelectedRestaurante(e.target.value)}
            >
              <option value="">Selecione o restaurante</option>
              {restaurantes.map(restaurante => (
                <option key={restaurante.id} value={restaurante.id.toString()}>
                  {restaurante.nome}
                </option>
              ))}
            </select>
          </FormField>

          <ButtonGroup>
            <Button type="submit">
              Registrar Lançamento
            </Button>
          </ButtonGroup>
        </form>
      </FormContainer>
    </Container>
  );
};