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
  color: #081168;
`;

export const Button = styled.button`
  background: #081168;
  color: #fff;
  border: none;
  padding: 8px 24px;
  border-radius: 6px;
  cursor: pointer;
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