import styled from 'styled-components';

export const Button = styled.button`
  background-color: rgba(8, 1, 104, 0.94);
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 20px;
  font-size: 14px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: rgba(8, 1, 104, 0.80);
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }

  &.secondary {
    background-color: #6c757d;
    &:hover {
      background-color: #5a6268;
    }
  }

  &.danger {
    background-color: #dc3545;
    &:hover {
      background-color: #c82333;
    }
  }
`;