import React from 'react';
import styled from 'styled-components';

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
`;

const Th = styled.th`
  background-color: rgba(8, 1, 104, 0.94);
  color: white;
  padding: 12px;
  text-align: left;
`;

const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid #ddd;
`;

const Tr = styled.tr`
  &:hover {
    background-color: #f5f5f5;
  }
`;

interface DataTableProps {
  data: any[];
  columns: { key: string; label: string }[];
}

export const DataTable: React.FC<DataTableProps> = ({ data, columns }) => {
  return (
    <Table>
      <thead>
        <tr>
          {columns.map((column) => (
            <Th key={column.key}>{column.label}</Th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <Tr key={index}>
            {columns.map((column) => (
              <Td key={`${index}-${column.key}`}>{row[column.key]}</Td>
            ))}
          </Tr>
        ))}
      </tbody>
    </Table>
  );
};
