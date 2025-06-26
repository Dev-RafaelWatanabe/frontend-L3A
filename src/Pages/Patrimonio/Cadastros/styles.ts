import styled from 'styled-components';

export const Container = styled.div`
  padding: 20px;
`;

export const Title = styled.h1`
  margin-bottom: 24px;
  color: rgba(0, 0, 0, 0.94);
  font-size: 2rem;
`;

export const ActionButtonsContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  
  button {
    padding: 8px 16px;
    border: 1px solid #ddd;
    background: rgba(8, 1, 104, 0.94);
    color: white;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s;

    &:hover:not(:disabled) {
      background: rgba(8, 1, 104, 0.8);
    }

    &:disabled {
      background: #ccc;
      cursor: not-allowed;
    }
  }
`;

export const TableContainer = styled.div`
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.08);
  margin-bottom: 20px;
`;

export const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.08);

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 10px;
  }
`;

export const PaginationInfo = styled.div`
  font-size: 14px;
  color: #666;
`;

export const PaginationButton = styled.button<{ isActive?: boolean }>`
  padding: 8px 16px;
  border: 1px solid #ddd;
  background: #fff;
  color: #333;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  min-width: 40px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: #f8f9fa;
    color: rgba(8, 1, 104, 0.94);
  }

  &:disabled {
    background: #f5f5f5;
    color: #ccc;
    cursor: not-allowed;
    border-color: #eee;
  }

  svg {
    transition: transform 0.2s;
  }

  &:hover:not(:disabled) svg {
    transform: scale(1.1);
  }
`;