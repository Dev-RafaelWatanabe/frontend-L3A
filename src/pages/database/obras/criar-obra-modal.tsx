import React, { useState } from 'react';
import styled from 'styled-components';
import { Api } from '../../../services/api/api';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 30px;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 2px solid #e9ecef;
`;

const ModalTitle = styled.h2`
  margin: 0;
  color: #333;
  font-size: 24px;
  font-weight: 600;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #6c757d;
  
  &:hover {
    color: #dc3545;
  }
`;

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;
  
  &.full-width {
    grid-column: 1 / -1;
  }
`;

const Label = styled.label`
  font-weight: 600;
  color: #495057;
  margin-bottom: 8px;
  font-size: 14px;
`;

const Input = styled.input`
  padding: 12px 15px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #007bff;
  }
  
  &:invalid {
    border-color: #dc3545;
  }
`;

const Select = styled.select`
  padding: 12px 15px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 14px;
  background-color: white;
  transition: border-color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 25px;
  padding-top: 20px;
  border-top: 1px solid #e9ecef;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.3s ease;
  
  ${props => props.variant === 'primary' ? `
    background-color: #007bff;
    color: white;
    
    &:hover {
      background-color: #0056b3;
      transform: translateY(-1px);
    }
  ` : `
    background-color: #6c757d;
    color: white;
    
    &:hover {
      background-color: #5a6268;
    }
  `}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const RequiredMark = styled.span`
  color: #dc3545;
  margin-left: 4px;
`;

interface CriarObraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

// Interface local para o formulário
interface FormDataObra {
  atividade: string;
  ativo: boolean;
  centro_custo: number;
  codigo_obra: number;
  data_fim: string;
  data_inicio: string;
  nome: string;
  orcamento_previsto: number;
  tipo_unidade: string;
}

export const CriarObraModal: React.FC<CriarObraModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormDataObra>({
    atividade: '',
    ativo: true,
    centro_custo: 0,
    codigo_obra: 0,
    data_fim: '',
    data_inicio: '',
    nome: '',
    orcamento_previsto: 0,
    tipo_unidade: 'Obra'
  });

  const handleInputChange = (field: keyof FormDataObra, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNumberChange = (field: keyof FormDataObra, value: string) => {
    const numValue = value === '' ? 0 : parseFloat(value);
    if (!isNaN(numValue)) {
      setFormData(prev => ({
        ...prev,
        [field]: numValue
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.atividade || !formData.codigo_obra || !formData.centro_custo) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    setLoading(true);
    
    try {
      // Preparar payload removendo campos vazios
      const payload = {
        atividade: formData.atividade,
        ativo: formData.ativo,
        centro_custo: formData.centro_custo,
        codigo_obra: formData.codigo_obra,
        nome: formData.nome,
        tipo_unidade: formData.tipo_unidade,
        ...(formData.data_inicio && { data_inicio: formData.data_inicio }),
        ...(formData.data_fim && { data_fim: formData.data_fim }),
        ...(formData.orcamento_previsto > 0 && { orcamento_previsto: formData.orcamento_previsto })
      };
      
      console.log('📤 Enviando dados da obra:', payload);
      
      await Api.createObra(payload);
      
      alert('Obra criada com sucesso!');
      
      // Reset form
      setFormData({
        atividade: '',
        ativo: true,
        centro_custo: 0,
        codigo_obra: 0,
        data_fim: '',
        data_inicio: '',
        nome: '',
        orcamento_previsto: 0,
        tipo_unidade: 'Obra'
      });
      
      onSuccess();
      onClose();
      
    } catch (error) {
      console.error('❌ Erro ao criar obra:', error);
      alert('Erro ao criar obra. Verifique os dados e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Adicionar Nova Obra</ModalTitle>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ModalHeader>

        <FormContainer onSubmit={handleSubmit}>
          <FormRow>
            <FormField>
              <Label>
                Nome da Obra<RequiredMark>*</RequiredMark>
              </Label>
              <Input
                type="text"
                value={formData.nome}
                onChange={(e) => handleInputChange('nome', e.target.value)}
                placeholder="Ex: Obra Central"
                required
              />
            </FormField>

            <FormField>
              <Label>
                Atividade<RequiredMark>*</RequiredMark>
              </Label>
              <Input
                type="text"
                value={formData.atividade}
                onChange={(e) => handleInputChange('atividade', e.target.value)}
                placeholder="Ex: Construção"
                required
              />
            </FormField>
          </FormRow>

          <FormRow>
            <FormField>
              <Label>
                Código da Obra<RequiredMark>*</RequiredMark>
              </Label>
              <Input
                type="number"
                value={formData.codigo_obra || ''}
                onChange={(e) => handleNumberChange('codigo_obra', e.target.value)}
                placeholder="Ex: 123"
                required
                min="1"
              />
            </FormField>

            <FormField>
              <Label>
                Centro de Custo<RequiredMark>*</RequiredMark>
              </Label>
              <Input
                type="number"
                value={formData.centro_custo || ''}
                onChange={(e) => handleNumberChange('centro_custo', e.target.value)}
                placeholder="Ex: 456"
                required
                min="1"
              />
            </FormField>
          </FormRow>

          <FormRow>
            <FormField>
              <Label>Tipo de Unidade</Label>
              <Select
                value={formData.tipo_unidade}
                onChange={(e) => handleInputChange('tipo_unidade', e.target.value)}
              >
                <option value="Obra">Obra</option>
                <option value="Projeto">Projeto</option>
                <option value="Manutenção">Manutenção</option>
                <option value="Reforma">Reforma</option>
              </Select>
            </FormField>

            <FormField>
              <Label>Orçamento Previsto</Label>
              <Input
                type="number"
                value={formData.orcamento_previsto || ''}
                onChange={(e) => handleNumberChange('orcamento_previsto', e.target.value)}
                placeholder="Ex: 1000000"
                min="0"
                step="0.01"
              />
            </FormField>
          </FormRow>

          <FormRow>
            <FormField>
              <Label>Data de Início</Label>
              <Input
                type="date"
                value={formData.data_inicio}
                onChange={(e) => handleInputChange('data_inicio', e.target.value)}
              />
            </FormField>

            <FormField>
              <Label>Data de Fim</Label>
              <Input
                type="date"
                value={formData.data_fim}
                onChange={(e) => handleInputChange('data_fim', e.target.value)}
              />
            </FormField>
          </FormRow>

          <FormField>
            <CheckboxContainer>
              <Checkbox
                type="checkbox"
                id="ativo"
                checked={formData.ativo}
                onChange={(e) => handleInputChange('ativo', e.target.checked)}
              />
              <Label htmlFor="ativo">Obra Ativa</Label>
            </CheckboxContainer>
          </FormField>

          <ButtonGroup>
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? 'Criando...' : 'Criar Obra'}
            </Button>
          </ButtonGroup>
        </FormContainer>
      </ModalContent>
    </ModalOverlay>
  );
};