import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Api } from '../../../services/api/api';
import type { Alocacao } from '../../../services/api/types';
import {
  Container,
  HeaderContainer,
  Title,
  BackButton,
  ContentContainer,
  DetailSection,
  DetailRow,
  DetailLabel,
  DetailValue,
  StatusBadge,
  ActionButtonsContainer,
  ActionButton,
  LoadingContainer,
  ErrorContainer
} from './detalhe-styles';

export const AlocacaoDetalhe: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [alocacao, setAlocacao] = useState<Alocacao | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAlocacao = async () => {
      if (!id) {
        setError('ID da alocação não fornecido');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await Api.getAlocacaoById(parseInt(id));
        setAlocacao(response.data);
      } catch (error) {
        console.error('Erro ao carregar alocação:', error);
        setError('Erro ao carregar os dados da alocação');
      } finally {
        setLoading(false);
      }
    };

    loadAlocacao();
  }, [id]);

  const handleVoltar = () => {
    navigate('/patrimonio/alocacao');
  };

  const handleDesalocar = async () => {
    if (!alocacao || !window.confirm('Tem certeza que deseja desalocar esta ferramenta?')) return;
    
    try {
      await Api.desalocarAlocacao(alocacao.id);

      if (!alocacao.ferramenta_id) {
        throw new Error('ID da ferramenta não encontrado na alocação');
      }

      const ferramentaResp = await Api.getFerramentaById(alocacao.ferramenta_id);
      const ferramenta = ferramentaResp.data;

      const updatePayload = {
        nome: ferramenta.nome,
        obra_id: 1,
        situacao_id: 1,
        valor: ferramenta.valor
      };
      
      await Api.updateFerramenta(ferramenta.id, updatePayload);
      alert('Ferramenta desalocada e movida para o Estoque com sucesso!');
      navigate('/patrimonio/alocacao');
      
    } catch (error: any) {
      console.error('Erro durante desalocação:', error);
      alert('Erro ao desalocar ferramenta. Tente novamente.');
    }
  };

  const handleDeletar = async () => {
    if (!alocacao || !window.confirm('Tem certeza que deseja excluir esta alocação? Esta ação não poderá ser desfeita!')) return;
    
    try {
      await Api.deleteAlocacao(alocacao.id);
      alert('Alocação excluída com sucesso!');
      navigate('/patrimonio/alocacao');
    } catch (error) {
      console.error('Erro ao excluir alocação:', error);
      alert('Erro ao excluir alocação. Tente novamente.');
    }
  };

  const getStatusPrevisao = (previsao: string) => {
    if (!previsao) return null;
    
    const hoje = new Date();
    const dataPrevisao = new Date(previsao);
    const diasRestantes = Math.ceil((dataPrevisao.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diasRestantes < 0) {
      return { status: 'vencida', cor: '#dc3545', texto: 'Vencida' };
    } else if (diasRestantes <= 7) {
      return { status: 'proxima', cor: '#ffc107', texto: 'Próxima' };
    } else {
      return { status: 'normal', cor: '#28a745', texto: 'Normal' };
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('pt-BR');
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <Container>
        <LoadingContainer>
          <span>Carregando detalhes da alocação...</span>
        </LoadingContainer>
      </Container>
    );
  }

  if (error || !alocacao) {
    return (
      <Container>
        <ErrorContainer>
          <span>{error || 'Alocação não encontrada'}</span>
          <BackButton onClick={handleVoltar}>
            Voltar para Alocações
          </BackButton>
        </ErrorContainer>
      </Container>
    );
  }

  const statusPrevisao = getStatusPrevisao(alocacao.previsao_desalocacao);

  return (
    <Container>
      <HeaderContainer>
        <div>
          <BackButton onClick={handleVoltar}>
            ← Voltar
          </BackButton>
          <Title>Detalhes da Alocação #{alocacao.id}</Title>
        </div>
        <ActionButtonsContainer>
          <ActionButton
            color="#007bff"
            onClick={() => navigate(`/patrimonio/alocacao/realocar/${alocacao.id}`)}
          >
            Realocar
          </ActionButton>
          <ActionButton
            color="#6c757d"
            onClick={handleDesalocar}
          >
            Desalocar
          </ActionButton>
          <ActionButton
            color="#dc3545"
            onClick={handleDeletar}
          >
            Excluir
          </ActionButton>
        </ActionButtonsContainer>
      </HeaderContainer>

      <ContentContainer>
        <DetailSection>
          <h3>Informações Gerais</h3>
          
          <DetailRow>
            <DetailLabel>ID da Alocação:</DetailLabel>
            <DetailValue>{alocacao.id}</DetailValue>
          </DetailRow>

          <DetailRow>
            <DetailLabel>Ferramenta/Patrimônio:</DetailLabel>
            <DetailValue>{alocacao.ferramenta_nome || '-'}</DetailValue>
          </DetailRow>

          <DetailRow>
            <DetailLabel>Centro de Custo/Obra:</DetailLabel>
            <DetailValue>{alocacao.obra_nome || '-'}</DetailValue>
          </DetailRow>

          <DetailRow>
            <DetailLabel>Responsável:</DetailLabel>
            <DetailValue>{alocacao.funcionario_nome || '-'}</DetailValue>
          </DetailRow>
        </DetailSection>

        <DetailSection>
          <h3>Datas</h3>
          
          <DetailRow>
            <DetailLabel>Data de Alocação:</DetailLabel>
            <DetailValue>{formatDate(alocacao.data_alocacao)}</DetailValue>
          </DetailRow>

          <DetailRow>
            <DetailLabel>Previsão de Desalocação:</DetailLabel>
            <DetailValue>
              {alocacao.previsao_desalocacao ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {formatDate(alocacao.previsao_desalocacao)}
                  {statusPrevisao && (
                    <StatusBadge status={statusPrevisao.status}>
                      {statusPrevisao.texto}
                    </StatusBadge>
                  )}
                </div>
              ) : '-'}
            </DetailValue>
          </DetailRow>

          <DetailRow>
            <DetailLabel>Data de Desalocação:</DetailLabel>
            <DetailValue>{formatDate(alocacao.data_desalocacao || '')}</DetailValue>
          </DetailRow>
        </DetailSection>

        <DetailSection>
          <h3>IDs de Referência</h3>
          
          <DetailRow>
            <DetailLabel>ID da Ferramenta:</DetailLabel>
            <DetailValue>{alocacao.ferramenta_id || '-'}</DetailValue>
          </DetailRow>

          <DetailRow>
            <DetailLabel>ID da Obra:</DetailLabel>
            <DetailValue>{alocacao.obra_id || '-'}</DetailValue>
          </DetailRow>

          <DetailRow>
            <DetailLabel>ID do Funcionário:</DetailLabel>
            <DetailValue>{alocacao.funcionario_id || '-'}</DetailValue>
          </DetailRow>
        </DetailSection>
      </ContentContainer>
    </Container>
  );
};