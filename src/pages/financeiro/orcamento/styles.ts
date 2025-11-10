import styled from 'styled-components';

export const Container = styled.div`
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 100vh;
`;

export const Title = styled.h1`
  color: rgba(8, 1, 104, 0.94);
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 20px;
`;

export const TabContainer = styled.div`
  display: flex;
  border-bottom: 2px solid #ddd;
  margin-bottom: 20px;
`;

export const Tab = styled.button<{ active?: boolean }>`
  padding: 12px 24px;
  border: none;
  background: ${props => (props.active ? 'rgba(8, 1, 104, 0.94)' : 'transparent')};
  color: ${props => (props.active ? 'white' : 'rgba(8, 1, 104, 0.94)')};
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  border-radius: 4px 4px 0 0;

  &:hover {
    background: ${props => (props.active ? 'rgba(8, 1, 104, 0.94)' : 'rgba(8, 1, 104, 0.06)')};
  }
`;

export const TabContent = styled.div`
  background: transparent;
`;

/* Lista */
export const ListWrapper = styled.div`
  background: #fff;
  padding: 16px;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
`;

export const Thead = styled.thead``;

export const Tbody = styled.tbody``;

export const Tr = styled.tr`
  &:nth-child(even) {
    background: #fafafa;
  }
`;

export const Th = styled.th`
  text-align: left;
  padding: 10px;
  color: rgba(8, 1, 104, 0.8);
  font-weight: 600;
  border-bottom: 1px solid #eee;
`;

export const Td = styled.td`
  padding: 10px;
  color: #333;
  vertical-align: middle;
`;

/* Form */
export const Form = styled.form`
  background: #fff;
  padding: 16px;
  border-radius: 6px;
  max-width: 900px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
`;

export const Row = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 12px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const Field = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const Label = styled.label`
  font-size: 13px;
  margin-bottom: 6px;
  color: rgba(8, 1, 104, 0.8);
`;

export const Input = styled.input`
  padding: 10px;
  border: 1px solid #e6e6e6;
  border-radius: 4px;
  font-size: 14px;
`;

export const TextArea = styled.textarea`
  padding: 10px;
  border: 1px solid #e6e6e6;
  border-radius: 4px;
  font-size: 14px;
  min-height: 100px;
`;

export const Actions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 12px;
`;

export const Button = styled.button<{ variant?: 'primary' | 'danger' }>`
  padding: 10px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: #fff;
  background: ${props => (props.variant === 'danger' ? '#d9534f' : 'rgba(8, 1, 104, 0.94)')};
  font-weight: 600;

  &:hover {
    opacity: 0.95;
  }
`;

export const SmallText = styled.div`
  font-size: 12px;
  color: #666;
  margin-top: 6px;
`;