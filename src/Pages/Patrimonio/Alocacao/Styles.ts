import styled from 'styled-components';

export const Container = styled.div`
  padding: 20px;
`;

export const FormContainer = styled.div`
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.08);
  max-width: 500px;
  margin: 0 auto;
`;

export const FormField = styled.div`
  margin-bottom: 18px;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
`;

export const Select = styled.select`
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
`;

export const Input = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-top: 20px;
`;

export const AlocarButton = styled.button`
  min-width: 140px;
  padding: 10px 0;
  border-radius: 4px;
  border: none;
  background: rgba(8, 1, 104, 0.94);
  color: #fff;
  font-size: 15px;
  cursor: pointer;
  transition: background 0.2s;
  width: 100%;

  &:hover {
    background: rgba(8, 1, 104, 0.8);
  }
`;

export const LimparButton = styled(AlocarButton)`
  background: #dc3545;

  &:hover {
    background: #b52a37;
  }
`;