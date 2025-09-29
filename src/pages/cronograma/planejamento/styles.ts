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
  margin-top: 25px;
  
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
    background-color: rgba(8, 1, 104, 0.94);
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
      background-color: rgba(8, 1, 104, 0.8);
      transition: background-color 0.3s ease;
    }

    &:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
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
    if (props.isSelected) return '#e9e9e9';
    if (props.isWeekend) return '#cfcfcfff';
    return 'white';
  }};
  color: ${props => {
    if (props.isSelected) return '#000000ff';
    if (props.isWeekend) return '#000000ff';
    return '#333';
  }};
  text-align: center;

  &:hover {
    background-color: ${props => 
      props.isWeekend ? '#e9e9e9' : 'rgba(8, 1, 104, 0.05)'
    };
    transition: background-color 0.5s ease;
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

export const SearchInput = styled.input`
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

export const SelectWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
`;

export const DropdownContainer = styled.div`
  position: relative;
`;

export const DropdownList = styled.div<{ isOpen?: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  border-top: none;
  border-radius: 0 0 4px 4px;
  max-height: ${props => props.isOpen ? '200px' : '0'};
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: max-height 0.2s ease;
  opacity: ${props => props.isOpen ? '1' : '0'};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
`;

export const DropdownOption = styled.div`
  padding: 8px 12px;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;

  &:hover {
    background-color: rgba(8, 1, 104, 0.05);
  }

  &:last-child {
    border-bottom: none;
  }
`;

export const CheckboxOption = styled.div`
  padding: 8px 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
  
  &:hover {
    background-color: rgba(8, 1, 104, 0.05);
  }

  &:last-child {
    border-bottom: none;
  }

  input[type="checkbox"] {
    width: auto;
    margin: 0;
  }

  label {
    cursor: pointer;
    flex: 1;
    margin: 0;
  }
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
  border-left: 4px solid rgba(8, 1, 104, 0.94);

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;

    h3 {
      margin: 0;
      color: rgba(8, 1, 104, 0.94);
      font-size: 16px;
      flex: 1;
    }

    .card-actions {
      display: flex;
      gap: 8px;

      .action-btn {
        background: none;
        border: none;
        padding: 6px 8px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 16px;
        transition: background-color 0.2s ease;

        &:hover {
          background-color: rgba(0, 0, 0, 0.1);
        }

        &.copy-btn {
          color: #28a745;
          &:hover {
            background-color: rgba(40, 167, 69, 0.1);
          }
        }

        &.edit-btn {
          color: #ffc107;
          &:hover {
            background-color: rgba(255, 193, 7, 0.1);
          }
        }

        &.delete-btn {
          color: #dc3545;
          &:hover {
            background-color: rgba(220, 53, 69, 0.1);
          }
        }
      }
    }
  }

  h3 {
    margin: 0 0 15px 0;
    color: rgba(8, 1, 104, 0.94);
    font-size: 16px;
  }

  .planejamento-grupo {
    .obra-header {
      margin-bottom: 10px;
      
      .obra-info {
        .obra {
          font-weight: 600;
          font-size: 14px;
          color: #333;
          margin-bottom: 4px;
        }
        
        .turno {
          font-size: 12px;
          color: #666;
          background: rgba(8, 1, 104, 0.1);
          padding: 4px 8px;
          border-radius: 4px;
          display: inline-block;
        }
      }
    }
    
    .funcionarios {
      list-style: none;
      padding: 0;
      margin: 10px 0 0 0;
      
      li {
        background: #f8f9fa;
        padding: 8px 12px;
        border-radius: 4px;
        margin-bottom: 4px;
        font-size: 14px;
        color: #555;
        border-left: 3px solid rgba(8, 1, 104, 0.3);
      }
    }
  }
`;

export const TurnoContainer = styled.div`
  .turno-options {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 8px;
  }
`;