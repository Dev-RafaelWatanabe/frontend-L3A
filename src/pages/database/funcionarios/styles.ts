import styled from 'styled-components';

export const Container = styled.div`
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  h1 {
    color: #080168;
    font-size: 2rem;
    margin: 0;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

export const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #080168;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: #060150;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(8, 1, 104, 0.3);
  }
`;

export const Table = styled.table`
  width: 100%;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-collapse: collapse;
`;

export const TableHeader = styled.tr`
  background: linear-gradient(135deg, #080168 0%, #060150 100%);
  color: white;

  th {
    padding: 1rem;
    text-align: left;
    font-weight: 600;
    font-size: 0.95rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`;

export const TableRow = styled.tr`
  border-bottom: 1px solid #e0e0e0;
  transition: background 0.2s;

  &:hover {
    background: #f8f9fa;
  }

  &:last-child {
    border-bottom: none;
  }
`;

export const TableCell = styled.td`
  padding: 1rem;
  color: #333;
  font-size: 0.95rem;
`;

export const ActionButton = styled.button<{ $variant: 'primary' | 'success' | 'danger' }>`
  padding: 0.5rem;
  margin-right: 0.5rem;
  background: ${props => {
    switch (props.$variant) {
      case 'primary': return '#080168';
      case 'success': return '#28a745';
      case 'danger': return '#dc3545';
    }
  }};
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;

  &:hover {
    transform: scale(1.1);
    opacity: 0.9;
  }
`;

export const StatusBadge = styled.span<{ $variant: 'success' | 'warning' | 'danger' }>`
  display: inline-block;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  background: ${props => {
    switch (props.$variant) {
      case 'success': return '#d4edda';
      case 'warning': return '#fff3cd';
      case 'danger': return '#f8d7da';
    }
  }};
  color: ${props => {
    switch (props.$variant) {
      case 'success': return '#155724';
      case 'warning': return '#856404';
      case 'danger': return '#721c24';
    }
  }};
`;

// Modal styles
export const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

export const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
`;

export const ModalHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #e0e0e0;
  background: linear-gradient(135deg, #080168 0%, #060150 100%);
  color: white;
  border-radius: 12px 12px 0 0;

  h2 {
    margin: 0;
    font-size: 1.5rem;
  }
`;

export const ModalBody = styled.div`
  padding: 2rem;
`;

export const ModalFooter = styled.div`
  padding: 1.5rem;
  border-top: 1px solid #e0e0e0;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  background: #f8f9fa;
  border-radius: 0 0 12px 12px;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

export const FormField = styled.div`
  margin-bottom: 1.5rem;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #333;
  font-size: 0.95rem;
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: #080168;
    box-shadow: 0 0 0 3px rgba(8, 1, 104, 0.1);
  }
`;

export const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  cursor: pointer;
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: #080168;
    box-shadow: 0 0 0 3px rgba(8, 1, 104, 0.1);
  }
`;

export const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  cursor: pointer;
  font-size: 0.95rem;
  color: #333;

  &:hover {
    color: #080168;
  }
`;

export const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #080168;
`;

export const Button = styled.button`
  padding: 0.75rem 1.5rem;
  background: #080168;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: #060150;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(8, 1, 104, 0.3);
  }
`;

export const CancelButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: #5a6268;
    transform: translateY(-2px);
  }
`;