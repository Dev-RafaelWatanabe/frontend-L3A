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
  font-weight: 500;
  border-bottom: 2px solid rgba(8, 1, 104, 0.1);
`;

const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid #ddd;
  vertical-align: top;
`;

const Tr = styled.tr`
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

interface DataTableProps {
  data: any[];
  columns: Column[];
}

export const DataTable: React.FC<DataTableProps> = ({ data, columns }) => {
  console.log('DataTable recebeu:', { data, columns });

  if (!data || !Array.isArray(data)) {
    console.error('Dados inválidos recebidos:', data);
    return <div>Erro: Dados inválidos</div>;
  }

  if (data.length === 0) {
    return <EmptyMessage>Nenhum dado encontrado</EmptyMessage>;
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


// import React from 'react';
// import styled from 'styled-components';

// const Table = styled.table`
//   width: 100%;
//   border-collapse: collapse;
//   margin: 20px 0;
// `;

// const Th = styled.th`
//   background-color: rgba(8, 1, 104, 0.94);
//   color: white;
//   padding: 12px;
//   text-align: left;
// `;

// const Td = styled.td`
//   padding: 12px;
//   border-bottom: 1px solid #ddd;
// `;

// const Tr = styled.tr`
//   &:hover {
//     background-color: #f5f5f5;
//   }
// `;

// interface DataTableProps {
//   data: any[];
//   columns: { key: string; label: string }[];
// }

// export const DataTable: React.FC<DataTableProps> = ({ data, columns }) => {
//   return (
//     <Table>
//       <thead>
//         <tr>
//           {columns.map((column) => (
//             <Th key={column.key}>{column.label}</Th>
//           ))}
//         </tr>
//       </thead>
//       <tbody>
//         {data.map((row, index) => (
//           <Tr key={index}>
//             {columns.map((column) => (
//               <Td key={`${index}-${column.key}`}>{row[column.key]}</Td>
//             ))}
//           </Tr>
//         ))}
//       </tbody>
//     </Table>
//   );
// };
