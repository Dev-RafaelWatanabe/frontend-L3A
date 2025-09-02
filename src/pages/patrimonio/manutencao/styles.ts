import styled from 'styled-components';

export const Container = styled.div`
  padding: 32px;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

export const Title = styled.h2`
  color: rgba(0, 0, 0, 0.94);
`;

export const Button = styled.button<{ disabled?: boolean }>`
padding: 8px 16px;
background-color: #28a745;
color: white;
border: none;
border-radius: 4px;
cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
opacity: ${props => props.disabled ? 0.6 : 1};
display: flex;
align-items: center;
gap: 8px;
transition: background-color 0.2s ease;

&:hover:not(:disabled) {
  background-color: #218838;
}

svg {
  font-size: 16px;
}
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  box-shadow: 0 2px 12px rgba(0,0,0,0.10);

  th, td {
    padding: 12px;
    border-bottom: 1px solid #eee;
    text-align: left;
  }

  tbody tr {
    cursor: pointer;
    transition: background 0.15s ease-in-out;
  }

  tbody tr:hover {
    background: #f5f7ff;
  }
`;