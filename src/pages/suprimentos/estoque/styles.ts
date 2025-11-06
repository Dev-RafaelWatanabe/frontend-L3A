import styled from 'styled-components';

export const Container = styled.div`
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 100vh;
`;

export const Title = styled.h1`
  color: rgba(8, 1, 104, 0.94);
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 20px;
`;

export const TabContainer = styled.div`
  display: flex;
  border-bottom: 2px solid #ddd;
  margin-bottom: 20px;
`;

export const Tab = styled.button<{ active?: boolean }>`
  padding: 12px 24px;
  border: none;
  background: ${props => props.active ? 'rgba(8, 1, 104, 0.94)' : 'transparent'};
  color: ${props => props.active ? 'white' : 'rgba(8, 1, 104, 0.94)'};
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  border-radius: 4px 4px 0 0;
  
  &:hover {
    background: ${props => props.active ? 'rgba(8, 1, 104, 0.94)' : 'rgba(8, 1, 104, 0.1)'};
  }
`;

export const TabContent = styled.div`
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  text-align: center;

  p {
    font-size: 18px;
    color: #666;
    margin: 0;
  }
`;