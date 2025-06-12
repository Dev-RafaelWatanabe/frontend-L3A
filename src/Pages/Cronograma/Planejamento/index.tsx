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

  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
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

export const CronogramaPlanejamento: React.FC = () => {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [obras, setObras] = useState<Obra[]>([]);
  const [selectedFuncionarios, setSelectedFuncionarios] = useState<number[]>([]);
  const [selectedObra, setSelectedObra] = useState('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [planejamentosPorDia, setPlanejamentosPorDia] = useState<PlanejamentoDiario[]>([]);
  const [futureDates, setFutureDates] = useState<Date[]>([]); // Adicionar este estado

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedFuncionarios.length === 0 || !selectedObra || !selectedDate) {
      alert('Por favor, selecione pelo menos um funcionário, uma obra e uma data');
      return;
    }

    try {
      const obraSelecionada = obras.find(o => o.id.toString() === selectedObra);
      const funcionariosSelecionados = funcionarios.filter(f => 
        selectedFuncionarios.includes(f.id)
      );

      if (!obraSelecionada) return;

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

      // Limpar formulário
      setSelectedFuncionarios([]);
      setSelectedObra('');
      setSelectedDate('');
      
      alert('Planejamento registrado com sucesso!');
    } catch (error) {
      console.error('Erro ao registrar planejamento:', error);
      alert('Erro ao registrar planejamento.');
    }
  };

  return (
    <Container>
      <h1>Planejamento de Cronograma</h1>
      
      <FormContainer>
        <form onSubmit={handleSubmit}>
          <SelectGroup>
            <FormField>
              <label>Funcionários:</label>
              <MultiSelectContainer>
                {funcionarios.map(func => (
                  <CheckboxOption key={func.id}>
                    <input
                      type="checkbox"
                      checked={selectedFuncionarios.includes(func.id)}
                      onChange={() => handleFuncionarioToggle(func.id)}
                    />
                    <label>{func.nome}</label>
                  </CheckboxOption>
                ))}
              </MultiSelectContainer>
              <small>
                {selectedFuncionarios.length} funcionário(s) selecionado(s)
              </small>
            </FormField>

            <FormField>
              <label>Obra:</label>
              <select
                value={selectedObra}
                onChange={(e) => setSelectedObra(e.target.value)}
                required
              >
                <option value="">Selecione uma obra</option>
                {obras.map(obra => (
                  <option key={obra.id} value={obra.id}>
                    {obra.nome}
                  </option>
                ))}
              </select>
            </FormField>
          </SelectGroup>

          <Calendar>
            {futureDates.map((date, index) => (
              <DayCell
                key={index}
                isSelected={selectedDate === date.toISOString().split('T')[0]}
                onClick={() => setSelectedDate(date.toISOString().split('T')[0])}
              >
                {date.toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit'
                })}
              </DayCell>
            ))}
          </Calendar>

          <ButtonGroup>
            <Button type="submit">
              Registrar Planejamento ({selectedFuncionarios.length} funcionário{selectedFuncionarios.length !== 1 ? 's' : ''})
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