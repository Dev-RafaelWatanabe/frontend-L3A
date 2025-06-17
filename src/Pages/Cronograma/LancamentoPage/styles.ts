import styled from 'styled-components';

export const Container = styled.div`
  padding: 20px;
`;

export const FormContainer = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 20px;
  max-width: 600px;
`;

export const FormField = styled.div`
  margin-bottom: 15px;
  
  label {
    display: block;
    margin-bottom: 5px;
    font-weight: 500;
  }

  select, input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;

    &:focus {
      outline: none;
      border-color: rgba(8, 1, 104, 0.94);
    }
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;

  button {
    width: 200px;
  }
`;

export const ComboboxContainer = styled.div`
  position: relative;
`;

export const ComboboxInput = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: rgba(8, 1, 104, 0.94);
  }
`;

export const ComboboxOptions = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-top: 4px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

export const ComboboxOption = styled.div`
  padding: 8px;
  cursor: pointer;

  &:hover {
    background-color: rgba(8, 1, 104, 0.05);
  }

  &:not(:last-child) {
    border-bottom: 1px solid #eee;
  }
`;