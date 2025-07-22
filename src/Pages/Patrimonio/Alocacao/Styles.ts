import styled from 'styled-components';

export const Container = styled.div`
  padding: 10px;
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
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.08);
  margin-bottom: 20px;
`;

export const TableContainer = styled.div`
  background: #fff;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.08);
  margin-bottom: 20px;
`;

export const FormContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 120px 120px;
  gap: 10px;
  align-items: end;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const FormField = styled.div`
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 4px;
  font-weight: 600;
  color: #333;
  font-size: 14px;
`;

export const Select = styled.select`
  width: 100%;
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

export const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  resize: vertical;
  min-height: 80px;
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 20px;
`;

export const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  ${props => props.variant === 'primary' ? `
    background: #007bff;
    color: white;
    &:hover {
      background: #0056b3;
    }
  ` : `
    background: #6c757d;
    color: white;
    &:hover {
      background: #545b62;
    }
  `}
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const ErrorMessage = styled.div`
  color: #dc3545;
  font-size: 14px;
  margin-top: 4px;
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
  min-width: 80px;
  height: 40px;
  
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

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const ModalContent = styled.div`
  background: white;
  border-radius: 8px;
  padding: 24px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #eee;
`;

export const ModalTitle = styled.h2`
  margin: 0;
  color: #333;
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  padding: 0;
  &:hover {
    color: #333;
  }
`;