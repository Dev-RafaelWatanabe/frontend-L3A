import React from 'react';
import styled from 'styled-components';

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.08);
`;

const Th = styled.th`
  padding: 12px;
  text-align: center; /* Títulos centralizados */
  background-color: #f8f9fa;
  font-weight: 600;
  border-bottom: 2px solid #dee2e6;
  color: #495057;
  
  &:first-child {
    border-top-left-radius: 4px;
  }
  
  &:last-child {
    border-top-right-radius: 4px;
  }
`;

const Td = styled.td`
  padding: 12px;
  text-align: center; /* Conteúdo centralizado */
  border-bottom: 1px solid #dee2e6;
  color: #495057;
`;

const Tr = styled.tr`
  &:nth-child(even) {
    background-color: #f8f9fa;
  }
  
  &:hover {
    background-color: #e9ecef;
  }
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
  font-style: italic;
`;

interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any) => React.ReactNode;
}

interface AlocacaoDataTableProps {
  data: any[];
  columns: Column[];
}

export const AlocacaoDataTable: React.FC<AlocacaoDataTableProps> = ({ data, columns }) => {
  console.log('AlocacaoDataTable recebeu:', { data, columns });

  if (!data || !Array.isArray(data)) {
    console.error('Dados inválidos recebidos:', data);
    return <div>Erro: Dados inválidos</div>;
  }

  if (data.length === 0) {
    return <EmptyMessage>Nenhuma alocação encontrada</EmptyMessage>;
  }

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
              <Td key={`${index}-${column.key}`}>
                {column.render ? column.render(row[column.key], row) : row[column.key]}
              </Td>
            ))}
          </Tr>
        ))}
      </tbody>
    </Table>
  );
};