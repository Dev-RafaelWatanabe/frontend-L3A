import styled from 'styled-components';

export const Container = styled.div`
  padding: 20px;
`;

export const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

export const Title = styled.h1`
  margin: 0;
  color: rgba(0, 0, 0, 0.94);
  font-size: 2rem;
`;

export const CreateButton = styled.button`
  padding: 12px 20px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #218838;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  svg {
    font-size: 16px;
  }
`;

export const SearchContainer = styled.div`
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.08);
  margin-bottom: 20px;
`;

export const TableContainer = styled.div`
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.08);
  margin-bottom: 20px;
`;

export const FormContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 20px;
  align-items: end;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 15px;
  }
`;

export const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Label = styled.label`
  font-weight: 600;
  color: #333;
  font-size: 14px;
`;

export const Select = styled.select`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  background: white;
  
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }
`;

export const Input = styled.input`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  
  @media (max-width: 768px) {
    justify-content: stretch;
    
    button {
      flex: 1;
    }
  }
`;

export const ActionButton = styled.button<{ color?: string }>`
  padding: 10px 16px;
  border: none;
  border-radius: 4px;
  background: ${props => props.color || '#007bff'};
  color: white;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-width: 100px; /* Largura mínima para igualar os botões */
  height: 40px; /* Altura fixa para uniformidade */
  
  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  svg {
    font-size: 18px;
  }
`;

export const ActionButtonsContainer = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;
  align-items: center;
`;

export const EmptyStateContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: #666;
  font-size: 16px;
  flex-direction: column;
  gap: 10px;
`;

export const DataContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

// Botões antigos mantidos para compatibilidade (se necessário)
export const AlocarButton = styled(ActionButton)`
  background: rgba(8, 1, 104, 0.94);
  width: 100%;

  &:hover {
    background: rgba(8, 1, 104, 0.8);
  }
`;

export const LimparButton = styled(ActionButton)`
  background: #dc3545;
  width: 100%;

  &:hover {
    background: #c82333;
  }
`;