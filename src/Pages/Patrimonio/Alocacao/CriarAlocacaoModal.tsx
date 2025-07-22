import React, { useState, useEffect } from 'react';
import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalTitle,
  CloseButton,
  FormField,
  Label,
  Select,
  TextArea,
  ButtonGroup,
  Button,
  ErrorMessage
} from './Styles';
import { Api } from '../../../Services/Api/Api';
import type { Ferramenta, Obra, Funcionario } from '../../../Services/Api/Types';

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

    // Validação dos campos obrigatórios
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

      // ✅ VALIDAÇÃO ADICIONAL - NÃO PERMITA OBJETOS UNDEFINED
      if (!ferramentaSelecionada) {
        setError('Ferramenta selecionada inválida');
        return;
      }
      if (!obraSelecionada) {
        setError('Obra selecionada inválida');
        return;
      }

      // ✅ MONTA O PAYLOAD CORRETAMENTE
      const payload: {
        ferramenta_nome: string;
        obra_nome: string;
        funcionario_nome: string;  // Sempre string, mesmo que vazia
      } = {
        ferramenta_nome: ferramentaSelecionada.nome,
        obra_nome: obraSelecionada.nome,
        funcionario_nome: funcionarioSelecionado ? funcionarioSelecionado.nome : ''  // String vazia se não selecionado
      };

      console.log('📤 Payload enviado:', payload);  // ✅ DEBUG

      // Cria a alocação
      await Api.createAlocacao(payload);

      // Resto do código permanece igual...
      if (ferramentaSelecionada && obraSelecionada) {
        await Api.updateFerramenta(ferramentaSelecionada.id, {
          nome: ferramentaSelecionada.nome,
          obra_id: obraSelecionada.id,
          situacao_id: typeof ferramentaSelecionada.situacao === 'object'
            ? ferramentaSelecionada.situacao.id
            : ferramentaSelecionada.situacao,
          valor: ferramentaSelecionada.valor
        });
      }

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