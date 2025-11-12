import React from 'react';
import styled from 'styled-components';
import { FaPlus } from 'react-icons/fa';
import { Api } from '../../../services/api/api';
import {LancamentoHistorico} from './lancamento-historico';

const Container = styled.div`
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  
  h1 {
    margin: 0;
    color: #333;
  }
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #007bff;
  color: white;
  
  &:hover {
    background: #0056b3;
    transform: translateY(-1px);
  }
`;

export const CronogramaLancamento: React.FC = () => {
  const [lancamentos, setLancamentos] = useState<Lancamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLancamentos = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        skip: 0,
        limit: 999999,
      };

      const response = await Api.getLancamentos(params);
      
      // Normaliza diferentes formatos de resposta (data.data ou data)
      const items = response?.data?.data ?? response?.data ?? [];
      if (Array.isArray(items)) {
        setLancamentos(items);
      } else {
        setLancamentos([]);
      }
    } catch (error) {
      console.error('Erro ao carregar lançamentos:', error);
      setError('Erro ao carregar os lançamentos.');
      setLancamentos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLancamentos();
  }, []);

  if (error) {
    return (
      <Container>
        <div style={{ padding: '2rem', textAlign: 'center', color: '#dc3545' }}>
          <h2>Erro ao carregar página</h2>
          <p>{error}</p>
          <Button onClick={() => { setError(null); fetchLancamentos(); }}>
            Tentar Novamente
          </Button>
        </div>
      </Container>
    );
  }

  if (loading) {
    return <Container><p>Carregando...</p></Container>;
  }

  return (
    <Container>
      <HeaderContainer>
        <h1>Histórico de Lançamentos</h1>
        <Button>
          <FaPlus /> Novo Lançamento
        </Button>
      </HeaderContainer>

      {/* Componente de Histórico com Filtros e Tabela */}
      <LancamentoHistorico
        lancamentos={lancamentos}
        loading={loading}
        onRefresh={fetchLancamentos}
      />
    </Container>
  );
};

export default CronogramaLancamento;