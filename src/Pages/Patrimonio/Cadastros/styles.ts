import styled from 'styled-components';

export const Container = styled.div`
  padding: 20px;
`;

export const Title = styled.h1`
  margin-bottom: 24px;
  color: rgba(0, 0, 0, 0.94);
  font-size: 2rem;
`;

export const TableContainer = styled.div`
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.08);
  margin-bottom: 20px;
`;

// Novos estilos para debug e estados
export const DebugInfo = styled.div`
  margin-bottom: 10px;
  font-size: 12px;
  color: #666;
  padding: 8px;
  background: #f8f9fa;
  border-radius: 4px;
  border-left: 3px solid #007bff;
`;

export const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: #666;
  font-size: 16px;
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

export const FirstItemDebug = styled.div`
  margin-top: 10px;
  font-size: 12px;
  color: #666;
  background: #f8f9fa;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #e9ecef;
  max-height: 200px;
  overflow: auto;
  
  pre {
    margin: 0;
    white-space: pre-wrap;
    word-break: break-word;
  }
`;

// Estilos para paginação (mantendo os existentes)
export const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.08);
  margin-top: 20px;
  min-height: 60px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 15px;
    padding: 15px;
  }
`;

export const PaginationInfo = styled.div`
  font-size: 14px;
  color: #666;
  font-weight: 500;
  
  @media (max-width: 768px) {
    text-align: center;
  }
`;

export const PaginationButton = styled.button<{ isActive?: boolean }>`
  padding: 10px 14px;
  border: 1px solid #ddd;
  background: #fff;
  color: #333;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  min-width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);

  &:hover:not(:disabled) {
    background: rgba(8, 1, 104, 0.05);
    color: rgba(8, 1, 104, 0.94);
    border-color: rgba(8, 1, 104, 0.3);
    transform: translateY(-1px);
    box-shadow: 0 2px 6px rgba(0,0,0,0.15);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }

  &:disabled {
    background: #f8f9fa;
    color: #ccc;
    cursor: not-allowed;
    border-color: #eee;
    box-shadow: none;
    transform: none;
  }

  svg {
    transition: transform 0.2s ease;
  }

  &:hover:not(:disabled) svg {
    transform: scale(1.1);
  }

  &:focus {
    outline: 2px solid rgba(8, 1, 104, 0.2);
    outline-offset: 2px;
  }
`;

export const PaginationControls = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: center;
  
  @media (max-width: 768px) {
    gap: 8px;
  }
`;

export const PageInfo = styled.span`
  padding: 0 16px;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  min-width: 120px;
  text-align: center;
  
  @media (max-width: 768px) {
    min-width: 100px;
    font-size: 13px;
  }
`;

export const LoadingSpinner = styled.div`
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid rgba(8, 1, 104, 0.94);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 8px;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export const DeleteIconButton = styled.button`
  background: none;
  border: none;
  color: #dc3545;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-left: auto;
  padding: 4px;

  &:hover {
    color: #a71d2a;
    background: rgba(220, 53, 69, 0.08);
    border-radius: 4px;
  }

  &:focus {
    outline: 2px solid #dc3545;
    outline-offset: 2px;
  }
`;