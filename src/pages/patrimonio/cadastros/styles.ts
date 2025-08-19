import styled from 'styled-components';

export const Container = styled.div`
  padding: 20px;
`;

export const Title = styled.h1`
  margin-bottom: 24px;
  color: rgba(0, 0, 0, 0.94);
  font-size: 2rem;
`;

export const TableContainer = styled.div`
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.08);
  margin-bottom: 20px;
`;

// Novos estilos para debug e estados
export const DebugInfo = styled.div`
  margin-bottom: 10px;
  font-size: 12px;
  color: #666;
  padding: 8px;
  background: #f8f9fa;
  border-radius: 4px;
  border-left: 3px solid #007bff;
`;

export const EmptyStateContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: #666;
  font-size: 16px;
  flex-direction: column;
  gap: 10px;
`;

export const DataContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const FirstItemDebug = styled.div`
  margin-top: 10px;
  font-size: 12px;
  color: #666;
  background: #f8f9fa;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #e9ecef;
  max-height: 200px;
  overflow: auto;
  
  pre {
    margin: 0;
    white-space: pre-wrap;
    word-break: break-word;
  }
`;

// Estilos para paginação
export const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.08);
  margin-top: 20px;
  min-height: 60px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 15px;
    padding: 15px;
  }
`;

export const PaginationInfo = styled.div`
  font-size: 14px;
  color: #666;
  font-weight: 500;
  
  @media (max-width: 768px) {
    text-align: center;
  }
`;

export const PaginationButton = styled.button<{ isActive?: boolean }>`
  padding: 10px 14px;
  border: 1px solid #ddd;
  background: #fff;
  color: #333;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  min-width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);

  &:hover:not(:disabled) {
    background: rgba(8, 1, 104, 0.05);
    color: rgba(8, 1, 104, 0.94);
    border-color: rgba(8, 1, 104, 0.3);
    transform: translateY(-1px);
    box-shadow: 0 2px 6px rgba(0,0,0,0.15);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }

  &:disabled {
    background: #f8f9fa;
    color: #ccc;
    cursor: not-allowed;
    border-color: #eee;
    box-shadow: none;
    transform: none;
  }

  svg {
    transition: transform 0.2s ease;
  }

  &:hover:not(:disabled) svg {
    transform: scale(1.1);
  }

  &:focus {
    outline: 2px solid rgba(8, 1, 104, 0.2);
    outline-offset: 2px;
  }
`;

export const PaginationControls = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: center;
  
  @media (max-width: 768px) {
    gap: 8px;
  }
`;

export const PageInfo = styled.span`
  padding: 0 16px;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  min-width: 120px;
  text-align: center;
  
  @media (max-width: 768px) {
    min-width: 100px;
    font-size: 13px;
  }
`;

export const LoadingSpinner = styled.div`
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid rgba(8, 1, 104, 0.94);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 8px;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export const DeleteIconButton = styled.button`
  background: none;
  border: none;
  color: #dc3545;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-left: auto;
  padding: 4px;

  &:hover {
    color: #a71d2a;
    background: rgba(220, 53, 69, 0.08);
    border-radius: 4px;
  }

  &:focus {
    outline: 2px solid #dc3545;
    outline-offset: 2px;
  }
`;

export const SituacaoBadge = styled.span<{ cor: string; letra: string }>`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 16px;
  font-weight: 600;
  color: ${({ letra }) => letra};
  background: ${({ cor }) => cor};
  font-size: 13px;
`;

// Estilos para página de detalhes
export const CardDetalhe = styled.div`
  max-width: 900px; // antes era 480px
  margin: 40px auto;
  padding: 32px 40px; // mais espaço lateral
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.10);

  h2 {
    margin-bottom: 24px;
    color: #081168;
  }

  p {
    margin: 8px 0;
    font-size: 16px;
  }
`;

export const DetalhesContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

export const BotaoEditar = styled.button`
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #0056b3;
  }

  svg {
    font-size: 16px;
  }
`;

export const ContainerBotoes = styled.div`
  display: flex;
  gap: 8px;
`;

export const BotaoSalvar = styled.button<{ disabled?: boolean }>`
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

export const BotaoCancelar = styled.button<{ disabled?: boolean }>`
  padding: 8px 16px;
  background-color: #6c757d;
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
    background-color: #5a6268;
  }

  svg {
    font-size: 16px;
  }
`;

export const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

export const CampoContainer = styled.div`
  /* Contêiner para cada campo do formulário */
`;

export const Label = styled.label`
  font-weight: bold;
  display: block;
  margin-bottom: 5px;
`;

export const Input = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }
`;

export const Select = styled.select`
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }
`;

export const VisualizacaoContainer = styled.div`
  /* Contêiner para o modo de visualização */
`;

export const Campo = styled.p`
  margin-bottom: 10px;
  
  b {
    margin-right: 8px;
  }
`;

export const ErroMensagem = styled.div`
  color: red;
  padding: 10px;
  border: 1px solid red;
  border-radius: 4px;
  background-color: #ffe6e6;
  margin-bottom: 15px;
`;

export const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  font-size: 16px;
`;

export const FilterContainer = styled.div`
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`;

export const FilterRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: end;
`;

export const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 200px;
  flex: 1;
`;

export const FilterLabel = styled.label`
  font-weight: 600;
  color: #495057;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
`;

export const FilterSelect = styled.select`
  padding: 0.5rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 0.9rem;
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: #081168;
    box-shadow: 0 0 0 2px rgba(8, 17, 104, 0.2);
  }
`;

export const FilterInput = styled.input`
  padding: 0.5rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: #081168;
    box-shadow: 0 0 0 2px rgba(8, 17, 104, 0.2);
  }
`;

export const ClearFiltersButton = styled.button`
  color: #505050ff;
  width: fit-content;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  height: fit-content;
  
  &:hover {
    color: black;
  }
`;