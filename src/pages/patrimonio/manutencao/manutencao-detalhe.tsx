import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Api } from '../../../services/api/api';
import {
  Container,
  Header,
  Title,
  ContentCard,
  DetailSection,
  DetailLabel,
  DetailValue,
  BackButton,
} from './manutencao-detalhe-styles';

interface ManutencaoDetalhe {
  ferramenta_nome: string;
  motivo: string;
  descricao_servico: string;
  responsavel_nome: string;
  custo: number;
  data_inicio: string;
  data_fim: string;
} 

export const ManutencaoDetalhe: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [manutencao, setManutencao] = useState<ManutencaoDetalhe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchManutencao = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        const response = await Api.getManutencaoById(Number(id));
        console.log('🔍 API Response completa:', response);
        console.log('📊 Dados da manutenção:', response.data);
        
        // Validação dos dados recebidos
        if (response.data) {
          const dados = response.data;
          console.log('📋 Campos recebidos:', {
            ferramenta_nome: dados.ferramenta_nome,
            motivo: dados.motivo,
            descricao_servico: dados.descricao_servico,
            responsavel_nome: dados.responsavel_nome,
            custo: dados.custo,
            data_inicio: dados.data_inicio,
            data_fim: dados.data_fim
          });
          
          setManutencao(dados);
        } else {
          setError('Dados da manutenção não encontrados');
        }
      } catch (err) {
        console.error('❌ Erro ao buscar manutenção:', err);
        setError('Erro ao carregar dados da manutenção');
      } finally {
        setLoading(false);
      }
    };
    
    fetchManutencao();
  }, [id]);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Data não informada';
    
    try {
      // Se a data já está no formato brasileiro (DD/MM/AAAA), retorna como está
      if (dateString.includes('/') && dateString.split('/').length === 3) {
        return dateString; // ← SIMPLESMENTE RETORNA A DATA COMO ESTÁ
      }
      
      // Para outros formatos, tenta converter diretamente
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        console.warn('⚠️ Data inválida recebida:', dateString);
        return 'Data inválida';
      }
      
      return date.toLocaleDateString('pt-BR');
    } catch (err) {
      console.warn('⚠️ Erro ao formatar data:', dateString, err);
      return 'Data inválida';
    }
  };

  const formatCurrency = (value: number) => {
    if (!value && value !== 0) return 'Valor não informado';
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const getResponsavelNome = (dados: ManutencaoDetalhe) => {
    // Verifica se o responsável tem nome
    if (dados.responsavel_nome && dados.responsavel_nome.trim() !== '') {
      return dados.responsavel_nome;
    }
    
    // Se não tiver nome, pode ser que o campo esteja vazio ou null
    console.warn('⚠️ Campo responsavel_nome está vazio ou null');
    return 'Não informado';
  };

  if (loading) {
    return (
      <Container>
        <p>Carregando...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <p style={{ color: 'red' }}>{error}</p>
      </Container>
    );
  }

  if (!manutencao) {
    return (
      <Container>
        <p>Manutenção não encontrada</p>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Detalhes da Manutenção</Title>
        <BackButton onClick={() => navigate('/patrimonio/manutencao')}>Voltar</BackButton>
      </Header>
      <ContentCard>
        <DetailSection>
          <DetailLabel>Ferramenta</DetailLabel>
          <DetailValue>{manutencao.ferramenta_nome || 'Não informado'}</DetailValue>
        </DetailSection>
        <DetailSection>
          <DetailLabel>Motivo</DetailLabel>
          <DetailValue>{manutencao.motivo || 'Não informado'}</DetailValue>
        </DetailSection>
        <DetailSection>
          <DetailLabel>Descrição do Serviço</DetailLabel>
          <DetailValue className="description">{manutencao.descricao_servico || 'Não informado'}</DetailValue>
        </DetailSection>
        <DetailSection>
          <DetailLabel>Responsável</DetailLabel>
          <DetailValue>{getResponsavelNome(manutencao)}</DetailValue>
        </DetailSection>
        <DetailSection>
          <DetailLabel>Custo</DetailLabel>
          <DetailValue className="cost">
            {formatCurrency(manutencao.custo)}
          </DetailValue>
        </DetailSection>
        <DetailSection>
          <DetailLabel>Data de Início</DetailLabel>
          <DetailValue className="date">
            {formatDate(manutencao.data_inicio)}
          </DetailValue>
        </DetailSection>
        <DetailSection>
          <DetailLabel>Data de Fim</DetailLabel>
          <DetailValue className="date">
            {formatDate(manutencao.data_fim)}
          </DetailValue>
        </DetailSection>
      </ContentCard>
    </Container>
  );
};