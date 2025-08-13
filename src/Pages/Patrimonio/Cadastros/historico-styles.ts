import styled from 'styled-components';

export const HistoricoTableContainer = styled.div`
  margin-top: 24px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.07);
  padding: 16px 8px 8px 8px;
  width: 100%;
  overflow-x: auto;
`;

export const HistoricoTable = styled.table`
  width: 100%;
  min-width: 600px;
  border-collapse: separate;
  border-spacing: 0;
  background: transparent;
`;

export const HistoricoTh = styled.th`
  padding: 8px 12px;
  background: #f4f6fb;
  border-bottom: 2px solid #e0e3e8;
  color: #1a237e;
  font-weight: 600;
  text-align: left;
  position: sticky;
  top: 0;
  z-index: 1;
`;

export const HistoricoTd = styled.td`
  padding: 8px 12px;
  border-bottom: 1px solid #f0f0f0;
  color: #222;
  background: #fff;
  font-size: 15px;
  max-width: 220px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;