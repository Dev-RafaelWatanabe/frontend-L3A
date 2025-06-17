import styled from 'styled-components';

export const Container = styled.div`
  padding: 20px;
`;

export const ComboboxContainer = styled.div`
  position: relative;
`;

export const FormContainer = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 20px;
`;

export const SelectGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
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
  gap: 10px;
  margin-top: 20px;

  button {
    width: 250px;
    height: 48px;
    margin: 0;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

export const Calendar = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 10px;
  margin-top: 20px;
`;

export const CalendarContainer = styled.div`
  margin-bottom: 30px;
`;

export const DayCell = styled.div<{ isSelected?: boolean; isWeekend?: boolean }>`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  background-color: ${props => {
    if (props.isSelected) return 'rgba(8, 1, 104, 0.1)';
    if (props.isWeekend) return '#f5f5f5';
    return 'white';
  }};
  text-align: center;

  &:hover {
    background-color: ${props => 
      props.isWeekend ? '#e9e9e9' : 'rgba(8, 1, 104, 0.05)'
    };
  }

  .weekday {
    font-size: 12px;
    color: ${props => props.isWeekend ? '#666' : '#333'};
    display: block;
    margin-bottom: 4px;
  }

  .date {
    font-weight: ${props => props.isWeekend ? '400' : '500'};
  }
`;

export const MultiSelectContainer = styled.div`
  border: 1px solid #ddd;
  border-radius: 4px;
  max-height: 200px;
  overflow-y: auto;
`;

export const CheckboxOption = styled.div`
  padding: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    background-color: rgba(8, 1, 104, 0.05);
  }

  input[type="checkbox"] {
    width: auto;
  }

  label {
    cursor: pointer;
    flex: 1;
  }
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 8px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: rgba(8, 1, 104, 0.94);
  }
`;

export const SelectWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const PlanningCardContainer = styled.div`
  margin-top: 30px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  padding: 0 20px;
  width: 100%;
`;

export const PlanningCard = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  min-width: 300px;
  max-width: 350px;
  height: fit-content;

  h3 {
    color: rgba(8, 1, 104, 0.94);
    margin-bottom: 15px;
    font-size: 16px;
    border-bottom: 2px solid rgba(8, 1, 104, 0.1);
    padding-bottom: 10px;
  }

  .planejamento-grupo {
    margin-bottom: 15px;
    padding: 12px;
    background-color: #f8f9fa;
    border-radius: 6px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .obra {
    font-weight: 500;
    margin-bottom: 8px;
    color: rgba(8, 1, 104, 0.94);
    font-size: 14px;

    .turnos {
      color: rgba(0, 0, 0, 0.66);
      font-style: italic;
      margin-left: 4px;
    }
  }

  .funcionarios {
    list-style: none;
    padding-left: 15px;
    
    li {
      padding: 3px 0;
      font-size: 14px;
    }
  }

  .turno {
    color: #666;
    font-size: 13px;
    margin-bottom: 8px;
    font-style: italic;
  }
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
  max-height: 161px;
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

export const FuncionariosCombobox = styled(ComboboxContainer)`
  .checkbox-container {
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
  }
`;

export const SelectedFuncionariosDisplay = styled.div`
  font-size: 14px;
  color: #666;
  margin-top: 5px;
`;