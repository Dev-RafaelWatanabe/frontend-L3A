import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Api } from '../../../Services/Api/Api';
import type { Ferramenta, Obra, Funcionario } from '../../../Services/Api/Types';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 8px;
  padding: 24px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #eee;
`;

const ModalTitle = styled.h2`
  margin: 0;
  color: #333;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  padding: 0;
  
  &:hover {
    color: #333;
  }
`;

const FormField = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 4px;
  font-weight: 600;
  color: #333;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  resize: vertical;
  min-height: 80px;
  
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 20px;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  
  ${props => props.variant === 'primary' ? `
    background: #007bff;
    color: white;
    
    &:hover {
      background: #0056b3;
    }
  ` : `
    background: #6c757d;
    color: white;
    
    &:hover {
      background: #545b62;
    }
  `}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  font-size: 14px;
  margin-top: 4px;
`;

interface CriarAlocacaoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CriarAlocacaoModal: React.FC<CriarAlocacaoModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [ferramentas, setFerramentas] = useState<Ferramenta[]>([]);
  const [obras, setObras] = useState<Obra[]>([]);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    ferramenta_id: '',
    obra_id: '',
    funcionario_id: '',
    observacao: ''
  });

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [ferramentasRes, obrasRes, funcionariosRes] = await Promise.all([
        Api.getFerramentas(),
        Api.getObras(),
        Api.getFuncionarios()
      ]);

      setFerramentas(ferramentasRes.data || []);
      setObras(obrasRes.data || []);
      setFuncionarios(funcionariosRes.data || []);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setError('Erro ao carregar dados. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpa erro quando usuário começa a digitar
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações
    if (!formData.ferramenta_id) {
      setError('Selecione uma ferramenta');
      return;
    }
    
    if (!formData.obra_id) {
      setError('Selecione uma obra');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Busca os dados completos para enviar
      const ferramentaSelecionada = ferramentas.find(f => f.id === Number(formData.ferramenta_id));
      const obraSelecionada = obras.find(o => o.id === Number(formData.obra_id));
      const funcionarioSelecionado = funcionarios.find(f => f.id === Number(formData.funcionario_id));

      const payload = {
        ferramenta_nome: ferramentaSelecionada?.nome || '',
        obra_nome: obraSelecionada?.nome || '',
        funcionario_nome: funcionarioSelecionado?.nome || '',
        observacao: formData.observacao || '',
        data_alocacao: new Date().toISOString().split('T')[0] // Data atual
      };

      console.log('📦 Criando alocação:', payload);

      // Chama a API para criar a alocação
      await Api.createAlocacao(payload);

      console.log('✅ Alocação criada com sucesso!');
      
      alert('Alocação criada com sucesso!');
      onSuccess();
      handleClose();
      
    } catch (error) {
      console.error('Erro ao criar alocação:', error);
      setError('Erro ao criar alocação. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      ferramenta_id: '',
      obra_id: '',
      funcionario_id: '',
      observacao: ''
    });
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={handleClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Criar Nova Alocação</ModalTitle>
          <CloseButton onClick={handleClose}>×</CloseButton>
        </ModalHeader>

        <form onSubmit={handleSubmit}>
          <FormField>
            <Label>Ferramenta/Patrimônio *</Label>
            <Select
              value={formData.ferramenta_id}
              onChange={(e) => handleInputChange('ferramenta_id', e.target.value)}
              disabled={loading}
            >
              <option value="">Selecione uma ferramenta</option>
              {ferramentas.map((ferramenta) => (
                <option key={ferramenta.id} value={ferramenta.id}>
                  {ferramenta.nome}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField>
            <Label>Obra/Centro de Custo *</Label>
            <Select
              value={formData.obra_id}
              onChange={(e) => handleInputChange('obra_id', e.target.value)}
              disabled={loading}
            >
              <option value="">Selecione uma obra</option>
              {obras.map((obra) => (
                <option key={obra.id} value={obra.id}>
                  {obra.nome}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField>
            <Label>Funcionário Responsável (opcional)</Label>
            <Select
              value={formData.funcionario_id}
              onChange={(e) => handleInputChange('funcionario_id', e.target.value)}
              disabled={loading}
            >
              <option value="">Selecione um funcionário</option>
              {funcionarios.map((funcionario) => (
                <option key={funcionario.id} value={funcionario.id}>
                  {funcionario.nome}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField>
            <Label>Observação (opcional)</Label>
            <TextArea
              value={formData.observacao}
              onChange={(e) => handleInputChange('observacao', e.target.value)}
              placeholder="Observações sobre a alocação..."
              disabled={loading}
            />
          </FormField>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <ButtonGroup>
            <Button type="button" variant="secondary" onClick={handleClose} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? 'Criando...' : 'Criar Alocação'}
            </Button>
          </ButtonGroup>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
};