import React, { useEffect, useState } from 'react';
import { Api } from '../../../Services/Api/Api';
import type { Obra, Funcionario, Situacao, Alocacao } from '../../../Services/Api/Types';
import { ModalOverlay, ModalContent, ModalHeader, ModalTitle, CloseButton, FormField, Label, Select, ButtonGroup, Button, ErrorMessage } from './Styles';

interface RealocarModalProps {
  isOpen: boolean;
  alocacao: Alocacao | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const RealocarModal: React.FC<RealocarModalProps> = ({ isOpen, alocacao, onClose, onSuccess }) => {
  const [obras, setObras] = useState<Obra[]>([]);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [situacoes, setSituacoes] = useState<Situacao[]>([]);
  const [formData, setFormData] = useState({
    obra_id: '',
    funcionario_nome: '',
    situacao_id: '',
    observacao: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      console.log('🔄 RealocarModal: Modal aberto, carregando dados...');
      console.log('📋 Alocacao recebida:', alocacao);
      
      Promise.all([
        Api.getObras(),
        Api.getFuncionarios(),
        Api.getSituacoes()
      ]).then(([obrasRes, funcionariosRes, situacoesRes]) => {
        console.log('✅ Dados carregados:', {
          obras: obrasRes.data?.length || 0,
          funcionarios: funcionariosRes.data?.length || 0,
          situacoes: situacoesRes.data?.length || 0
        });
        
        setObras(obrasRes.data || []);
        setFuncionarios(funcionariosRes.data || []);
        setSituacoes(situacoesRes.data || []);
      }).catch(err => {
        console.error('❌ Erro ao carregar dados iniciais:', err);
        setError('Erro ao carregar dados. Tente novamente.');
      });
      
      if (alocacao) {
        setFormData({
          obra_id: '',
          funcionario_nome: '',
          situacao_id: '',
          observacao: ''
        });
      }
    }
  }, [isOpen, alocacao]);

  const handleInputChange = (field: string, value: string) => {
    console.log(`📝 Campo alterado: ${field} = ${value}`);
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🚀 Iniciando processo de realocação...');
    console.log('📋 Dados do formulário:', formData);
    console.log('📋 Alocacao atual:', alocacao);
    
    if (!alocacao) {
      console.error('❌ Alocacao não encontrada');
      setError('Erro: Alocação não encontrada');
      return;
    }
    
    if (!formData.obra_id || !formData.situacao_id) {
      console.error('❌ Campos obrigatórios não preenchidos:', {
        obra_id: formData.obra_id,
        situacao_id: formData.situacao_id
      });
      setError('Preencha todos os campos obrigatórios.');
      return;
    }
    
    setLoading(true);
    
    try {
      // ================== PASSO 1: DESALOCAR ==================
      console.log('📤 PASSO 1: Desalocando alocação ID:', alocacao.id);
      await Api.desalocarAlocacao(alocacao.id);
      console.log('✅ PASSO 1: Alocação desalocada com sucesso');

      // ================== PASSO 2: BUSCAR FERRAMENTA ==================
      console.log('📤 PASSO 2: Buscando ferramenta...');
      
      // PROBLEMA POTENCIAL: alocacao.ferramenta_id pode não existir
      if (!alocacao.ferramenta_id) {
        console.error('❌ ferramenta_id não encontrado na alocacao:', alocacao);
        throw new Error('ID da ferramenta não encontrado na alocação');
      }
      
      console.log('📤 Buscando ferramenta ID:', alocacao.ferramenta_id);
      const ferramentaResp = await Api.getFerramentaById(alocacao.ferramenta_id);
      const ferramenta = ferramentaResp.data;
      
      console.log('✅ PASSO 2: Ferramenta encontrada:', ferramenta);

      // ================== PASSO 3: ATUALIZAR FERRAMENTA ==================
      const updatePayload = {
        nome: ferramenta.nome,
        obra_id: Number(formData.obra_id),
        situacao_id: Number(formData.situacao_id),
        valor: ferramenta.valor
      };
      
      console.log('📤 PASSO 3: Atualizando ferramenta...');
      console.log('📤 Payload para updateFerramenta:', updatePayload);
      console.log('📤 ID da ferramenta:', ferramenta.id);
      
      await Api.updateFerramenta(ferramenta.id, updatePayload);
      console.log('✅ PASSO 3: Ferramenta atualizada com sucesso');

      // ================== PASSO 4: CRIAR NOVA ALOCAÇÃO ==================
      const obraSelecionada = obras.find(o => o.id === Number(formData.obra_id));
      
      if (!obraSelecionada) {
        console.error('❌ Obra não encontrada com ID:', formData.obra_id);
        throw new Error('Obra selecionada não encontrada');
      }
      
      const alocacaoPayload = {
        ferramenta_nome: alocacao.ferramenta_nome,
        obra_nome: obraSelecionada.nome,
        funcionario_nome: formData.funcionario_nome || '',
      };
      
      console.log('📤 PASSO 4: Criando nova alocação...');
      console.log('📤 Payload para createAlocacao:', alocacaoPayload);
      
      await Api.createAlocacao(alocacaoPayload);
      console.log('✅ PASSO 4: Nova alocação criada com sucesso');

      console.log('🎉 Realocação concluída com sucesso!');
      alert('Ferramenta realocada com sucesso!');
      onSuccess();
      onClose();
      
    } catch (err: any) {
      console.error('❌ Erro durante realocação:', err);
      console.error('❌ Detalhes do erro:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      
      let errorMessage = 'Erro ao realocar. ';
      if (err.response?.data?.detail) {
        errorMessage += err.response.data.detail;
      } else if (err.message) {
        errorMessage += err.message;
      } else {
        errorMessage += 'Tente novamente.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !alocacao) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Realocar Ferramenta: {alocacao.ferramenta_nome}</ModalTitle>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>
        <form onSubmit={handleSubmit}>
          <FormField>
            <Label>Nova Obra *</Label>
            <Select value={formData.obra_id} onChange={e => handleInputChange('obra_id', e.target.value)} required>
              <option value="">Selecione uma obra</option>
              {obras.map(obra => (
                <option key={obra.id} value={obra.id}>{obra.nome}</option>
              ))}
            </Select>
          </FormField>
          <FormField>
            <Label>Novo Responsável</Label>
            <Select value={formData.funcionario_nome} onChange={e => handleInputChange('funcionario_nome', e.target.value)}>
              <option value="">Selecione um funcionário</option>
              {funcionarios.map(func => (
                <option key={func.id} value={func.nome}>{func.nome}</option>
              ))}
            </Select>
          </FormField>
          <FormField>
            <Label>Nova Situação *</Label>
            <Select value={formData.situacao_id} onChange={e => handleInputChange('situacao_id', e.target.value)} required>
              <option value="">Selecione uma situação</option>
              {situacoes.map(sit => (
                <option key={sit.id} value={sit.id}>{sit.nome}</option>
              ))}
            </Select>
          </FormField>
          <FormField>
            <Label>Observação</Label>
            <textarea value={formData.observacao} onChange={e => handleInputChange('observacao', e.target.value)} />
          </FormField>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <ButtonGroup>
            <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>Cancelar</Button>
            <Button type="submit" variant="primary" disabled={loading}>{loading ? 'Salvando...' : 'Realocar'}</Button>
          </ButtonGroup>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
};