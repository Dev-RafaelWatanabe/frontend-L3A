import React from 'react';
import styled from 'styled-components';
import { FaPlus } from 'react-icons/fa';
import { LancamentoHistorico } from './lancamento-historico';

const Container = styled.div`
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  
  h1 {
    margin: 0;
    color: #333;
  }
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #007bff;
  color: white;
  
  &:hover {
    background: #0056b3;
    transform: translateY(-1px);
  }
`;

export const CronogramaLancamento: React.FC = () => {
  return (
    <Container>
      <HeaderContainer>
        <h1>Histórico de Lançamentos</h1>
        <Button>
          <FaPlus /> Novo Lançamento
        </Button>
      </HeaderContainer>

      {/* Componente de Histórico com Filtros e Tabela */}
      <LancamentoHistorico />
    </Container>
  );
};

export default CronogramaLancamento;