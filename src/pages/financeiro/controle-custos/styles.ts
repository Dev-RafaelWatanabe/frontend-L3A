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

export const DashboardContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 24px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);

  h2 {
    margin-top: 0;
    margin-bottom: 16px;
    font-weight: 400;
    color: #333;
  }
`;

export const FilterContainer = styled.div`
  margin-bottom: 16px;
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;

  label {
    font-weight: 500;
    color: rgba(8, 1, 104, 0.94);
  }

  input {
    padding: 6px 12px;
    border-radius: 6px;
    border: 1px solid #ccc;
    font-size: 14px;
    margin-left: 8px;

    &:focus {
      outline: none;
      border-color: rgba(8, 1, 104, 0.94);
    }
  }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 16px;
  font-size: 15px;
`;

export const TableHeader = styled.tr`
  th {
    background: rgba(8, 1, 104, 0.94);
    color: #fff;
    padding: 10px 8px;
    text-align: left;
    font-weight: 600;
  }
`;

export const TableRow = styled.tr<{ isGroupRow?: boolean; isSubGroupRow?: boolean }>`
  background: ${props => 
    props.isGroupRow ? '#e3f2fd' : 
    props.isSubGroupRow ? '#f5f5f5' : 
    'transparent'
  };
  cursor: ${props => (props.isGroupRow || props.isSubGroupRow) ? 'pointer' : 'default'};
  font-weight: ${props => (props.isGroupRow || props.isSubGroupRow) ? 500 : 'normal'};
  transition: background 0.2s;

  &:hover {
    background: ${props => 
      props.isGroupRow ? '#d1e7ff' : 
      props.isSubGroupRow ? '#eeeeee' : 
      '#f9f9f9'
    };
  }
`;

export const TableCell = styled.td`
  padding: 8px;
  border-bottom: 1px solid #eee;
`;

export const DetailContainer = styled.div`
  background: #f9f9f9;
  border-radius: 6px;
  padding: 6px 10px;
  margin-bottom: 4px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.05);

  div {
    margin-bottom: 2px;
    font-size: 13px;

    &:last-child {
      margin-bottom: 0;
    }
  }
`;