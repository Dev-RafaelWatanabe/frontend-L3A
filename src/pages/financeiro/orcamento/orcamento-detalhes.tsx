import { useEffect, useState } from 'react';
import Api from '../../../services/api/api';
import { ListWrapper, Row, Field, Label, Input, TextArea, Actions, Button } from './styles';

type Orcamento = {
  id: number;
  obra_id: number;
  valor_material: number;
  valor_deslocamento: number;
  valor_hospedagem: number;
  valor_servico: number;
  valor_total: number;
  descricao: string;
};

export function OrcamentoDetalhes({ id, onDeleted, onUpdated }: { id: number; onDeleted?: () => void; onUpdated?: () => void }) {
  const [item, setItem] = useState<Orcamento | null>(null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);

  // editable fields
  const [descricao, setDescricao] = useState('');
  const [valorMaterial, setValorMaterial] = useState<number | ''>('');
  const [valorDeslocamento, setValorDeslocamento] = useState<number | ''>('');
  const [valorHospedagem, setValorHospedagem] = useState<number | ''>('');
  const [valorServico, setValorServico] = useState<number | ''>('');

  // obra nome para melhor visualização
  const [obraName, setObraName] = useState<string | null>(null);

  async function loadObraName(obraId: number) {
    try {
      const resp = await Api.getObras();
      const obras = resp.data || [];
      const found = obras.find((o: any) => o.id === obraId);
      setObraName(found?.nome ?? String(obraId));
    } catch {
      setObraName(String(obraId));
    }
  }

  async function load() {
    setLoading(true);
    try {
      const resp = await Api.getOrcamentoById(id);
      setItem(resp.data);
      setDescricao(resp.data.descricao);
      setValorMaterial(resp.data.valor_material);
      setValorDeslocamento(resp.data.valor_deslocamento);
      setValorHospedagem(resp.data.valor_hospedagem);
      setValorServico(resp.data.valor_servico);

      // buscar o nome da obra após carregar o orçamento
      if (resp.data && resp.data.obra_id != null) {
        loadObraName(resp.data.obra_id);
      } else {
        setObraName(null);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, [id]);

  async function handleDelete() {
    if (!confirm('Deseja excluir este orçamento?')) return;
    try {
      await Api.deleteOrcamento(id);
      alert('Excluído');
      if (onDeleted) onDeleted();
    } catch {
      alert('Erro ao excluir');
    }
  }

  async function handleSave() {
    const vm = Number(valorMaterial || 0);
    const vd = Number(valorDeslocamento || 0);
    const vh = Number(valorHospedagem || 0);
    const vs = Number(valorServico || 0);
    const payload = {
      descricao,
      valor_material: vm,
      valor_deslocamento: vd,
      valor_hospedagem: vh,
      valor_servico: vs,
      valor_total: Number((vm + vd + vh + vs).toFixed(2)),
    };
    try {
      await Api.updateOrcamento(id, payload);
      alert('Atualizado');
      setEditing(false);
      if (onUpdated) onUpdated();
      await load();
    } catch {
      alert('Erro ao atualizar');
    }
  }

  if (loading) return <div>Carregando...</div>;
  if (!item) return <div>Orçamento não encontrado</div>;

  return (
    <ListWrapper>
      <h3>Orçamento #{item.id}</h3>

      {!editing ? (
        <>
          <p><strong>Obra:</strong> {obraName ?? item.obra_id}</p>
          <p><strong>Descrição:</strong> {item.descricao}</p>
          <p><strong>Valor material:</strong> {item.valor_material.toFixed(2)}</p>
          <p><strong>Valor deslocamento:</strong> {item.valor_deslocamento.toFixed(2)}</p>
          <p><strong>Valor hospedagem:</strong> {item.valor_hospedagem.toFixed(2)}</p>
          <p><strong>Valor serviço:</strong> {item.valor_servico.toFixed(2)}</p>
          <p><strong>Valor total:</strong> {item.valor_total.toFixed(2)}</p>

          <Actions>
            <Button onClick={() => setEditing(true)}>Editar</Button>
            <Button variant="danger" onClick={handleDelete}>Excluir</Button>
          </Actions>
        </>
      ) : (
        <>
          <Row>
            <Field>
              <Label>Valor material</Label>
              <Input type="number" value={valorMaterial} onChange={e => setValorMaterial(Number(e.target.value) || '')} />
            </Field>
            <Field>
              <Label>Valor deslocamento</Label>
              <Input type="number" value={valorDeslocamento} onChange={e => setValorDeslocamento(Number(e.target.value) || '')} />
            </Field>
            <Field>
              <Label>Valor hospedagem</Label>
              <Input type="number" value={valorHospedagem} onChange={e => setValorHospedagem(Number(e.target.value) || '')} />
            </Field>
            <Field>
              <Label>Valor serviço</Label>
              <Input type="number" value={valorServico} onChange={e => setValorServico(Number(e.target.value) || '')} />
            </Field>
          </Row>

          <Row>
            <Field style={{ flex: 2 }}>
              <Label>Descrição</Label>
              <TextArea value={descricao} onChange={e => setDescricao(e.target.value)} />
            </Field>
          </Row>

          <Actions>
            <Button onClick={handleSave}>Salvar</Button>
            <Button variant="danger" onClick={() => setEditing(false)}>Cancelar</Button>
          </Actions>
        </>
      )}
    </ListWrapper>
  );
}

export default OrcamentoDetalhes;