import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100%;
  background-color: #f8f9fa;
  padding: 20px;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 auto 24px auto;
  padding: 0 8px;
  max-width: 900px;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
`;

export const BackButton = styled.button`
  background-color: #6c757d;
  color: white;
  border: none;
  padding: 6px 10px; // botão mais compacto
  border-radius: 6px;
  font-size: 0.85rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
  align-self: flex-end;

  @media (max-width: 768px) {
    align-self: flex-start;
  }

  &:hover {
    background-color: #5a6268;
    transform: translateY(-1px);
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

export const Title = styled.h1`
  color: #081168;
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

export const StatusBadge = styled.span<{ color: string }>`
  background-color: ${props => props.color};
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const ContentCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
  padding: 32px 40px;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  max-width: 900px;
  margin: 0 auto;
  width: 100%;

  @media (max-width: 768px) {
    padding: 24px 20px;
    gap: 1rem;
  }

  @media (max-width: 480px) {
    padding: 20px 16px;
  }
`;

export const DetailSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e9ecef;

  @media (max-width: 768px) {
    gap: 0.25rem;
    padding-bottom: 0.75rem;
  }

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
`;

export const DetailLabel = styled.label`
  font-weight: 600;
  color: #081168;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  @media (max-width: 768px) {
    font-size: 0.8rem;
  }

  svg {
    width: 16px;
    height: 16px;
    color: #081168;
  }
`;

export const DetailValue = styled.div`
  color: #333;
  font-size: 1rem;
  line-height: 1.5;
  padding: 0.5rem 0;

  @media (max-width: 768px) {
    font-size: 0.9rem;
    padding: 0.25rem 0;
  }

  &.description {
    background-color: #f8f9fa;
    padding: 1rem;
    border-radius: 6px;
    border-left: 4px solid #081168;
    white-space: pre-wrap;
  }

  &.cost {
    font-size: 1.25rem;
    font-weight: 600;
    color:rgb(192, 27, 27);
    background-color: #f8f9fa;
    padding: 0.75rem;
    border-radius: 6px;
    border-left: 4px solid rgb(192, 27, 27);
    display: inline-block;
    width: fit-content;
  }

  &.date {
    background-color: #f8f9fa;
    padding: 0.75rem;
    border-radius: 6px;
    border-left: 4px solid #17a2b8;
    font-weight: 500;
  }
`;

export const DateInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  background-color: #f8f9fa;
  padding: 1rem;
  border-radius: 6px;
  border-left: 4px solid #17a2b8;

  > div {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.95rem;

    strong {
      color: #081168;
      min-width: 60px;
    }
  }
`;

export const CostInfo = styled.div`
  font-size: 1.25rem;
  font-weight: 600;
  color: #28a745;
  background-color: #f8f9fa;
  padding: 0.75rem;
  border-radius: 6px;
  border-left: 4px solid #28a745;
  display: inline-block;
  width: fit-content;
`;

export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 50vh;
  gap: 1rem;
  color: #6c757d;

  svg {
    color: #081168;
    animation: spin 2s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  p {
    font-size: 1.1rem;
    margin: 0;
  }
`;

export const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 50vh;
  gap: 1rem;
  color: #dc3545;
  text-align: center;

  h3 {
    margin: 0;
    font-size: 1.5rem;
  }

  p {
    margin: 0;
    font-size: 1.1rem;
    color: #6c757d;
  }
`;