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

export const CronogramaPlanejamento: React.FC = () => {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [obras, setObras] = useState<Obra[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedFuncionario, setSelectedFuncionario] = useState('');
  const [selectedObra, setSelectedObra] = useState('');
  const [futureDates, setFutureDates] = useState<Date[]>([]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFuncionario || !selectedObra || !selectedDate) {
      alert('Por favor, preencha todos os campos');
      return;
    }

    try {
      // Usando o mesmo endpoint de lançamentos, mas com data futura
      const response = await Api.createLancamento({
        funcionario_id: Number(selectedFuncionario),
        obra_id: Number(selectedObra),
        data_trabalho: selectedDate,
        is_planejamento: true // Flag para identificar que é um planejamento
      });

      console.log('Planejamento registrado:', response);
      
      // Limpa o formulário
      setSelectedFuncionario('');
      setSelectedObra('');
      setSelectedDate('');
      
      alert('Planejamento registrado com sucesso!');
    } catch (error) {
      console.error('Erro ao registrar planejamento:', error);
      alert('Erro ao registrar planejamento');
    }
  };

  return (
    <Container>
      <h1>Planejamento de Cronograma</h1>
      
      <FormContainer>
        <form onSubmit={handleSubmit}>
          <SelectGroup>
            <FormField>
              <label>Funcionário:</label>
              <select
                value={selectedFuncionario}
                onChange={(e) => setSelectedFuncionario(e.target.value)}
                required
              >
                <option value="">Selecione um funcionário</option>
                {funcionarios.map(func => (
                  <option key={func.id} value={func.id}>
                    {func.nome}
                  </option>
                ))}
              </select>
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
              Registrar Planejamento
            </Button>
          </ButtonGroup>
        </form>
      </FormContainer>
    </Container>
  );
};