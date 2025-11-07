import styled from 'styled-components';

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;

  h2 {
    margin: 0;
    font-size: 1.5rem;
    color: rgba(8, 1, 104, 0.94);
  }
`;

export const CloseButton = styled.button`
  background: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  transition: all 0.2s;

  &:hover {
    background-color: #f0f0f0;
    color: #333;
  }
`;

export const ModalBody = styled.div`
  padding: 20px;
`;

export const Button = styled.button`
  padding: 10px 20px;
  background-color: rgba(8, 1, 104, 0.94);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: rgba(8, 1, 104, 0.8);
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

export const FormField = styled.div`
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

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
`;

export const SearchInput = styled.input`
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

export const DropdownContainer = styled.div`
  position: relative;
`;

export const DropdownList = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 10;
  margin-top: 4px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
`;

export const DropdownOption = styled.div`
  padding: 8px 12px;
  cursor: pointer;
  
  &:hover {
    background-color: #f5f5f5;
  }
`;
