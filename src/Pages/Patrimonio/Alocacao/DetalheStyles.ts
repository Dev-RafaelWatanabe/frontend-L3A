import styled from 'styled-components';

export const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

export const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 30px;
  
  > div:first-child {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
`;

export const Title = styled.h1`
  color: #333;
  margin: 0;
  font-size: 24px;
  font-weight: 600;
`;

export const BackButton = styled.button`
  background: #6c757d;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  
  &:hover {
    background: #5a6268;
  }
`;

export const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

export const DetailSection = styled.div`
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  
  h3 {
    margin: 0 0 20px 0;
    color: #333;
    font-size: 18px;
    font-weight: 600;
    border-bottom: 2px solid #007bff;
    padding-bottom: 10px;
  }
`;

export const DetailRow = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  
  &:last-child {
    border-bottom: none;
  }
`;

export const DetailLabel = styled.span`
  font-weight: 600;
  color: #555;
  min-width: 200px;
  flex-shrink: 0;
`;

export const DetailValue = styled.span`
  color: #333;
  flex: 1;
`;

export const StatusBadge = styled.span<{ status: string }>`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  color: white;
  
  ${({ status }) => {
    switch (status) {
      case 'vencida':
        return 'background-color: #dc3545;';
      case 'proxima':
        return 'background-color: #ffc107; color: #000;';
      case 'normal':
        return 'background-color: #28a745;';
      default:
        return 'background-color: #6c757d;';
    }
  }}
`;

export const ActionButtonsContainer = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

export const ActionButton = styled.button<{ color?: string }>`
  background: ${props => props.color || '#007bff'};
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  
  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
`;

export const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  
  span {
    color: #666;
    font-size: 16px;
  }
`;

export const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 300px;
  gap: 20px;
  
  span {
    color: #dc3545;
    font-size: 16px;
  }
`;