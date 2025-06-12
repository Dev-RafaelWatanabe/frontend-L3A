import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Api } from '../../../Services/Api/Api';
import { Button } from '../../../Style/Components/Buttons';
import type { Funcionario, Obra } from '../../../Services/Api/Types';

const Container = styled.div`
  padding: 20px;
`;

const FormContainer = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 20px;
`;

const SelectGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
`;

const FormField = styled.div`
  margin-bottom: 15px;
  
  label {
    display: block;
    margin-bottom: 5px;
    font-weight: 500;
  }

  select, input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;

    &:focus {
      outline: none;
      border-color: rgba(8, 1, 104, 0.94);
    }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const Calendar = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 10px;
  margin-top: 20px;
`;

const CalendarContainer = styled.div`
  margin-bottom: 30px; // Add space between calendar and button
`;

const DayCell = styled.div<{ isSelected?: boolean }>`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  background-color: ${props => props.isSelected ? 'rgba(8, 1, 104, 0.1)' : 'white'};
  text-align: center;

  &:hover {
    background-color: rgba(8, 1, 104, 0.05);
  }
`;

const MultiSelectContainer = styled.div`
  border: 1px solid #ddd;
  border-radius: 4px;
  max-height: 200px;
  overflow-y: auto;
`;

const CheckboxOption = styled.div`
  padding: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    background-color: rgba(8, 1, 104, 0.05);
  }

  input[type="checkbox"] {
    width: auto;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 8px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: rgba(8, 1, 104, 0.94);
  }
`;

const SelectWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

interface PlanejamentoDiario {
  id: number;
  data: string;
  planejamentos: Array<{
    obra: Obra;
    funcionarios: Funcionario[];
  }>;
}

const PlanningCardContainer = styled.div`
  margin-top: 30px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); // Creates responsive grid
  gap: 20px;
  padding: 0 20px;
  width: 100%;
`;

const PlanningCard = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  min-width: 300px;
  max-width: 350px; // Limits maximum width
  height: fit-content;

  h3 {
    color: rgba(8, 1, 104, 0.94);
    margin-bottom: 15px;
    font-size: 16px; // Slightly smaller font
    border-bottom: 2px solid rgba(8, 1, 104, 0.1);
    padding-bottom: 10px;
  }

  .planejamento-grupo {
    margin-bottom: 15px;
    padding: 12px;
    background-color: #f8f9fa;
    border-radius: 6px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .obra {
    font-weight: 500;
    margin-bottom: 8px;
    color: rgba(8, 1, 104, 0.94);
    font-size: 14px;
  }

  .funcionarios {
    list-style: none;
    padding-left: 15px;
    
    li {
      padding: 3px 0;
      font-size: 14px;
    }
  }
`;

const ComboboxContainer = styled.div`
  position: relative;
`;

const ComboboxInput = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: rgba(8, 1, 104, 0.94);
  }
`;

const ComboboxOptions = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-top: 4px;
  max-height: 161px;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const ComboboxOption = styled.div`
  padding: 8px;
  cursor: pointer;

  &:hover {
    background-color: rgba(8, 1, 104, 0.05);
  }

  &:not(:last-child) {
    border-bottom: 1px solid #eee;
  }
`;

// Add new styled components for the funcionarios selection
const FuncionariosCombobox = styled(ComboboxContainer)`
  .checkbox-container {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin-top: 4px;
    max-height: 200px;
    overflow-y: auto;
    z-index: 1000;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
`;

const SelectedFuncionariosDisplay = styled.div`
  font-size: 14px;
  color: #666;
  margin-top: 5px;
`;

export const CronogramaPlanejamento: React.FC = () => {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [obras, setObras] = useState<Obra[]>([]);
  const [selectedFuncionarios, setSelectedFuncionarios] = useState<number[]>([]);
  const [selectedObra, setSelectedObra] = useState('');
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [planejamentosPorDia, setPlanejamentosPorDia] = useState<PlanejamentoDiario[]>([]);
  const [futureDates, setFutureDates] = useState<Date[]>([]); // Adicionar este estado
  const [funcionarioSearch, setFuncionarioSearch] = useState('');
  const [obraSearch, setObraSearch] = useState('');
  const [showObraOptions, setShowObraOptions] = useState(false);
  const [showFuncionariosOptions, setShowFuncionariosOptions] = useState(false); // Novo estado para controle de exibição

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [funcionariosRes, obrasRes] = await Promise.all([
          Api.getFuncionarios(),
          Api.getObras()
        ]);
        setFuncionarios(funcionariosRes.data);
        setObras(obrasRes.data);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };

    fetchData();
    generateFutureDates();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.combobox-container')) {
        setShowObraOptions(false);
      }
      if (!target.closest('.checkbox-container') && !target.closest('input')) {
        setShowFuncionariosOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const generateFutureDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 1; i <= 14; i++) {
      const futureDate = new Date();
      futureDate.setDate(today.getDate() + i);
      dates.push(futureDate);
    }
    
    setFutureDates(dates);
  };

  const handleFuncionarioToggle = (funcionarioId: number) => {
    setSelectedFuncionarios(prev => {
      if (prev.includes(funcionarioId)) {
        return prev.filter(id => id !== funcionarioId);
      }
      return [...prev, funcionarioId];
    });
  };

  const formatarData = (dataString: string) => {
    // Parse the date string in ISO format (YYYY-MM-DD)
    const [year, month, day] = dataString.split('-').map(Number);
    const data = new Date(year, month - 1, day); // month is 0-based in JavaScript

    const diasSemana = [
      'Domingo', 
      'Segunda-feira', 
      'Terça-feira', 
      'Quarta-feira', 
      'Quinta-feira', 
      'Sexta-feira', 
      'Sábado'
    ];
    
    const dia = day.toString().padStart(2, '0');
    const mes = month.toString().padStart(2, '0');
    
    return `${diasSemana[data.getDay()]}, ${dia}/${mes}`;
  };

  const handleDateToggle = (date: string) => {
    setSelectedDates(prev => {
      if (prev.includes(date)) {
        return prev.filter(d => d !== date);
      }
      return [...prev, date];
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedFuncionarios.length === 0 || !selectedObra || selectedDates.length === 0) {
      alert('Por favor, selecione pelo menos um funcionário, uma obra e uma ou mais datas');
      return;
    }

    try {
      const obraSelecionada = obras.find(o => o.id.toString() === selectedObra);
      const funcionariosSelecionados = funcionarios.filter(f => 
        selectedFuncionarios.includes(f.id)
      );

      if (!obraSelecionada) return;

      // Process each selected date
      selectedDates.forEach(selectedDate => {
        setPlanejamentosPorDia(prev => {
          const diaExistente = prev.find(p => p.data === selectedDate);
          
          if (diaExistente) {
            // Verifica se já existe planejamento para esta obra neste dia
            return prev.map(dia => {
              if (dia.data === selectedDate) {
                const planejamentoObraExistente = dia.planejamentos.find(
                  p => p.obra.id === obraSelecionada.id
                );

                if (planejamentoObraExistente) {
                  // Se a obra já existe, apenas adiciona os novos funcionários
                  return {
                    ...dia,
                    planejamentos: dia.planejamentos.map(p => {
                      if (p.obra.id === obraSelecionada.id) {
                        // Combina os funcionários existentes com os novos, removendo duplicatas
                        const funcionariosCombinados = [...p.funcionarios];
                        funcionariosSelecionados.forEach(novoFunc => {
                          if (!funcionariosCombinados.some(f => f.id === novoFunc.id)) {
                            funcionariosCombinados.push(novoFunc);
                          }
                        });
                        return {
                          ...p,
                          funcionarios: funcionariosCombinados
                        };
                      }
                      return p;
                    })
                  };
                } else {
                  // Se a obra não existe neste dia, adiciona novo planejamento
                  return {
                    ...dia,
                    planejamentos: [...dia.planejamentos, {
                      obra: obraSelecionada,
                      funcionarios: funcionariosSelecionados
                    }]
                  };
                }
              }
              return dia;
            });
          } else {
            // Cria um novo dia com o planejamento
            return [...prev, {
              id: Date.now(),
              data: selectedDate,
              planejamentos: [{
                obra: obraSelecionada,
                funcionarios: funcionariosSelecionados
              }]
            }].sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());
          }
        });
      });

      // Limpar formulário
      setSelectedFuncionarios([]);
      setSelectedObra('');
      setSelectedDates([]);
      
      alert('Planejamentos registrados com sucesso!');
    } catch (error) {
      console.error('Erro ao registrar planejamentos:', error);
      alert('Erro ao registrar planejamentos.');
    }
  };

  // Add filter functions
  const filteredFuncionarios = funcionarios.filter(func =>
    func.nome.toLowerCase().includes(funcionarioSearch.toLowerCase())
  );

  const filteredObras = obras.filter(obra => {
    const searchLower = obraSearch.toLowerCase();
    const codigoString = obra.codigo_obra?.toString() || '';
    return obra.nome.toLowerCase().includes(searchLower) ||
           codigoString.includes(searchLower);
  });

  // Update the handleObraSelect function
  const handleObraSelect = (obra: Obra) => {
    setSelectedObra(obra.id.toString());
    setObraSearch(`${obra.codigo_obra || ''} - ${obra.nome}`);
    setShowObraOptions(false);
  };

  return (
    <Container>
      <h1>Planejamento de Cronograma</h1>
      
      <FormContainer>
        <form onSubmit={handleSubmit}>
          <SelectGroup>
            <FormField>
              <label>Funcionários:</label>
              <FuncionariosCombobox className="combobox-container">
                <ComboboxInput
                  type="text"
                  placeholder="Buscar funcionário..."
                  value={funcionarioSearch}
                  onChange={(e) => setFuncionarioSearch(e.target.value)}
                  onFocus={() => setShowFuncionariosOptions(true)}
                />
                {showFuncionariosOptions && (
                  <div className="checkbox-container">
                    {filteredFuncionarios.length > 0 ? (
                      filteredFuncionarios.map(func => (
                        <CheckboxOption 
                          key={func.id}
                          onClick={(e) => {
                            // Prevent checkbox click from closing the dropdown
                            e.stopPropagation();
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={selectedFuncionarios.includes(func.id)}
                            onChange={(e) => {
                              e.stopPropagation();
                              handleFuncionarioToggle(func.id);
                            }}
                            id={`func-${func.id}`}
                          />
                          <label htmlFor={`func-${func.id}`}>{func.nome}</label>
                        </CheckboxOption>
                      ))
                    ) : (
                      <div style={{ padding: '8px', color: '#666' }}>
                        Nenhum funcionário encontrado
                      </div>
                    )}
                  </div>
                )}
                <SelectedFuncionariosDisplay onClick={(e) => e.stopPropagation()}>
                  {selectedFuncionarios.length > 0 ? (
                    <>
                      {selectedFuncionarios.length} funcionário(s) selecionado(s):
                      <div style={{ marginTop: '5px', fontSize: '12px' }}>
                        {funcionarios
                          .filter(f => selectedFuncionarios.includes(f.id))
                          .map(f => f.nome)
                          .join(', ')}
                      </div>
                    </>
                  ) : (
                    'Nenhum funcionário selecionado'
                  )}
                </SelectedFuncionariosDisplay>
              </FuncionariosCombobox>
            </FormField>

            <FormField>
              <label>Obra:</label>
              <ComboboxContainer className="combobox-container">
                <ComboboxInput
                  type="text"
                  placeholder="Buscar obra por nome ou código..."
                  value={obraSearch}
                  onChange={(e) => {
                    setObraSearch(e.target.value);
                    setSelectedObra(''); // Clear selection when typing
                    setShowObraOptions(true);
                  }}
                  onFocus={() => setShowObraOptions(true)}
                />
                {showObraOptions && (
                  <ComboboxOptions>
                    {filteredObras.length > 0 ? (
                      filteredObras.map(obra => (
                        <ComboboxOption
                          key={obra.id}
                          onClick={() => handleObraSelect(obra)}
                        >
                          {obra.codigo_obra ? `${obra.codigo_obra} - ` : ''}{obra.nome}
                        </ComboboxOption>
                      ))
                    ) : (
                      <div style={{ padding: '8px', color: '#666' }}>
                        Nenhuma obra encontrada
                      </div>
                    )}
                  </ComboboxOptions>
                )}
              </ComboboxContainer>
            </FormField>
          </SelectGroup>

          <CalendarContainer>
            <Calendar>
              {futureDates.map((date, index) => {
                const dateStr = date.toISOString().split('T')[0];
                return (
                  <DayCell
                    key={index}
                    isSelected={selectedDates.includes(dateStr)}
                    onClick={() => handleDateToggle(dateStr)}
                  >
                    {date.toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit'
                    })}
                  </DayCell>
                );
              })}
            </Calendar>
          </CalendarContainer>

          <ButtonGroup>
            <Button type="submit">
              Registrar Planejamento ({selectedFuncionarios.length} funcionário{selectedFuncionarios.length !== 1 ? 's ' : ''} 
              em {selectedDates.length} dia{selectedDates.length !== 1 ? 's' : ''})
            </Button>
          </ButtonGroup>
        </form>
      </FormContainer>

      <PlanningCardContainer>
        {planejamentosPorDia.map((dia) => (
          <PlanningCard key={dia.id}>
            <h3>Planejamento diário - {formatarData(dia.data)}</h3>
            {dia.planejamentos.map((planejamento, index) => (
              <div key={index} className="planejamento-grupo">
                <div className="obra">
                  {planejamento.obra.codigo_obra && `${planejamento.obra.codigo_obra} - `}
                  {planejamento.obra.nome}
                  {planejamento.obra.atividade && ` - ${planejamento.obra.atividade}`}
                </div>
                <ul className="funcionarios">
                  {planejamento.funcionarios.map(func => (
                    <li key={func.id}>- {func.nome}</li>
                  ))}
                </ul>
              </div>
            ))}
          </PlanningCard>
        ))}
      </PlanningCardContainer>
    </Container>
  );
};