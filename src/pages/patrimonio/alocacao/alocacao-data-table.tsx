import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import type { Alocacao } from '../../../services/api/types';

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
`;

const StyledTableHead = styled.thead`
  background-color: #f8f9fa;
`;

const StyledTableHeader = styled.th`
  padding: 12px 15px;
  text-align: left;
  font-weight: 600;
  color: #495057;
  border-bottom: 2px solid #dee2e6;
  font-size: 14px;
`;

const StyledTableBody = styled.tbody``;

const StyledTableRow = styled.tr`
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #f8f9fa;
  }

  &:nth-child(even) {
    background-color: #f9f9f9;
  }

  &:nth-child(even):hover {
    background-color: #f0f0f0;
  }
`;

const StyledTableCell = styled.td`
  padding: 12px 15px;
  border-bottom: 1px solid #dee2e6;
  color: #495057;
  font-size: 14px;
  vertical-align: middle;
`;

interface AlocacaoDataTableProps {
  data: Alocacao[];
  columns: Array<{
    key: string;
    label: string;
    render?: (value: any, row?: any) => React.ReactNode;
  }>;
}

export const AlocacaoDataTable: React.FC<AlocacaoDataTableProps> = ({ data, columns }) => {
  const navigate = useNavigate();

  const handleRowClick = (alocacao: Alocacao, event: React.MouseEvent) => {
    // Verifica se o clique foi em um botão de ação
    const target = event.target as HTMLElement;
    if (target.closest('button')) {
      return; // Não navega se clicou em um botão
    }
    
    navigate(`/patrimonio/alocacao/detalhe/${alocacao.id}`);
  };

  return (
    <StyledTable>
      <StyledTableHead>
        <StyledTableRow>
          {columns.map((column) => (
            <StyledTableHeader key={column.key}>
              {column.label}
            </StyledTableHeader>
          ))}
        </StyledTableRow>
      </StyledTableHead>
      <StyledTableBody>
        {data.map((row) => (
          <StyledTableRow 
            key={row.id} 
            onClick={(event) => handleRowClick(row, event)}
            title="Clique para ver detalhes"
          >
            {columns.map((column) => (
              <StyledTableCell key={`${row.id}-${column.key}`}>
                {column.render 
                  ? column.render(row[column.key as keyof typeof row], row)
                  : row[column.key as keyof typeof row]
                }
              </StyledTableCell>
            ))}
          </StyledTableRow>
        ))}
      </StyledTableBody>
    </StyledTable>
  );
};