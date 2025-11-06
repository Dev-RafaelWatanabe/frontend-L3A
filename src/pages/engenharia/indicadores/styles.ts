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

export const Content = styled.div`
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