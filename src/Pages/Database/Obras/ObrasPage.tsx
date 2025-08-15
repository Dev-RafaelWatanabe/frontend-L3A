import React, { useState, useEffect } from 'react';
import { Api } from '../../../Services/Api/Api';
import { DataTable } from '../Components/DataTable';
import { CriarObraModal } from './CriarObraModal';
import { FaPlus } from 'react-icons/fa';
import type { Obra } from '../../../Services/Api/Types';
import {
  Container,
  Header,
  Title,
  AddButton,
  TableContainer,
  LoadingContainer
} from './styles';

export const Obras: React.FC = () => {
  const [obras, setObras] = useState<Obra[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const loadObras = async () => {
    try {
      setLoading(true);
      const response = await Api.getObras();
      setObras(response.data || []);
    } catch (error) {
      console.error('Erro ao carregar obras:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadObras();
  }, []);

  const handleCreateSuccess = () => {
    loadObras();
    setShowModal(false);
  };

  const formatCurrency = (value?: number) => {
    if (!value) return '-';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    try {
      if (dateString.includes('/')) return dateString;
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR');
    } catch {
      return dateString;
    }
  };

  const columns = [
    { key: 'id', label: 'Nº' },
    { key: 'codigo_obra', label: 'Cód. Obra' },
    { key: 'nome', label: 'Nome da Obra' },
    { key: 'atividade', label: 'Atividade' },
    { key: 'tipo_unidade', label: 'Unidade' },
    {
      key: 'data_inicio',
      label: 'Início',
      render: (value: string) => formatDate(value)
    },
    {
      key: 'data_fim',
      label: 'Fim',
      render: (value: string) => formatDate(value)
    },
    {
      key: 'orcamento_previsto',
      label: 'Orçamento',
      render: (value: number) => formatCurrency(value)
    },
    {
      key: 'ativo',
      label: 'Status',
      render: (value: boolean) => (
        <span style={{ 
          color: value ? '#28a745' : '#dc3545',
          fontWeight: 'bold'
        }}>
          {value ? 'Ativa' : 'Inativa'}
        </span>
      )
    }
  ];

  return (
    <Container>
      <Header>
        <Title>Obras</Title>
        <AddButton onClick={() => setShowModal(true)}>
          <FaPlus />
          Adicionar Obra
        </AddButton>
      </Header>

      <TableContainer>
        {loading ? (
          <LoadingContainer>
            <span>Carregando obras...</span>
          </LoadingContainer>
        ) : (
          <DataTable data={obras} columns={columns} />
        )}
      </TableContainer>

      <CriarObraModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={handleCreateSuccess}
      />
    </Container>
  );
};
