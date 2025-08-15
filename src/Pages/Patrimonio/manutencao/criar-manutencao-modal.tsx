import React, { useState, useEffect } from 'react';
import * as S from '../Alocacao/styles';
import { Api } from '../../../Services/Api/Api';

interface Ferramenta {
  id: number;
  nome: string;
}

interface Funcionario {
  id: number;
  nome: string;
}

export const CriarManutencaoModal: React.FC<{ onClose: () => void; onSubmit: (dados: any) => void; }> = ({ onClose, onSubmit }) => {
  const [form, setForm] = useState({
    ferramenta_id: '',
    ferramenta_nome: '',
    motivo: '',
    descricao_servico: '',
    responsavel_id: '',
    custo: ''
  });

  const [ferramentas, setFerramentas] = useState<Ferramenta[]>([]);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);

  useEffect(() => {
    buscarFerramentas();
    buscarFuncionarios();
  }, []);

  const buscarFerramentas = async () => {
    try {
      const resp = await Api.getFerramentas();
      setFerramentas(resp.data || []);
    } catch {
      setFerramentas([]);
    }
  };

  const buscarFuncionarios = async () => {
    try {
      const resp = await Api.getFuncionarios();
      setFuncionarios(resp.data || []);
    } catch {
      setFuncionarios([]);
    }
  };

  const handleChange = (campo: string, valor: string) => {
    setForm({ ...form, [campo]: valor });
    // Se selecionar ferramenta, preenche o nome também
    if (campo === 'ferramenta_id') {
      const ferramenta = ferramentas.find(f => f.id === Number(valor));
      setForm(f => ({
        ...f,
        ferramenta_id: valor,
        ferramenta_nome: ferramenta ? ferramenta.nome : ''
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload = {
      ferramenta_nome: form.ferramenta_nome,
      motivo: form.motivo,
      descricao_servico: form.descricao_servico || undefined,
      responsavel_id: form.responsavel_id ? Number(form.responsavel_id) : undefined,
      custo: form.custo ? Number(form.custo) : undefined
    };
    onSubmit(payload);
  };

  return (
    <S.ModalOverlay>
      <S.ModalContent>
        <S.ModalHeader>
          <S.ModalTitle>Nova Manutenção</S.ModalTitle>
          <S.CloseButton onClick={onClose}>×</S.CloseButton>
        </S.ModalHeader>
        <form onSubmit={handleSubmit}>
          <S.FormField>
            <S.Label>Ferramenta</S.Label>
            <S.Select
              value={form.ferramenta_id}
              onChange={e => handleChange('ferramenta_id', e.target.value)}
              required
            >
              <option value="">Selecione</option>
              {ferramentas.map(f => (
                <option key={f.id} value={f.id}>{f.nome}</option>
              ))}
            </S.Select>
          </S.FormField>
          <S.FormField>
            <S.Label>Motivo</S.Label>
            <S.Input
              type="text"
              value={form.motivo}
              onChange={e => handleChange('motivo', e.target.value)}
              required
            />
          </S.FormField>
          <S.FormField>
            <S.Label>Descrição do Serviço</S.Label>
            <S.Input
              type="text"
              value={form.descricao_servico}
              onChange={e => handleChange('descricao_servico', e.target.value)}
            />
          </S.FormField>
          <S.FormField>
            <S.Label>Responsável</S.Label>
            <S.Select
              value={form.responsavel_id}
              onChange={e => handleChange('responsavel_id', e.target.value)}
            >
              <option value="">Selecione</option>
              {funcionarios.map(f => (
                <option key={f.id} value={f.id}>{f.nome}</option>
              ))}
            </S.Select>
          </S.FormField>
          <S.FormField>
            <S.Label>Custo</S.Label>
            <S.Input
              type="number"
              value={form.custo}
              onChange={e => handleChange('custo', e.target.value)}
              min="0"
              step="0.01"
            />
          </S.FormField>
          <S.ButtonGroup>
            <S.Button type="submit">Salvar</S.Button>
            <S.Button type="button" onClick={onClose}>Cancelar</S.Button>
          </S.ButtonGroup>
        </form>
      </S.ModalContent>
    </S.ModalOverlay>
  );
};