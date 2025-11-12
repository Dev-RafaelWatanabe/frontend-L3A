import { useEffect, useState } from 'react';
import Api from '../../../services/api/api';
import { ListWrapper, Row, Field, Label, Input, TextArea, Actions, Button } from './styles';

// Formatação de moeda BRL
const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

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

  // orçamentos relacionados (mesma obra / centro de custo)
  const [relatedOrcamentos, setRelatedOrcamentos] = useState<Orcamento[]>([]);
  const [loadingRelated, setLoadingRelated] = useState(false);

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

  async function fetchRelatedOrcamentos(obraId?: number) {
    if (!obraId) {
      setRelatedOrcamentos([]);
      return;
    }
    setLoadingRelated(true);
    try {
      const resp = await Api.getOrcamentosByObra(obraId, { skip: 0, limit: 100 });
      const list = resp.data || [];
      // remover o próprio orçamento da lista
      setRelatedOrcamentos(Array.isArray(list) ? list.filter((o: any) => o.id !== id) : []);
    } catch (err) {
      console.error('Erro ao buscar orçamentos relacionados:', err);
      setRelatedOrcamentos([]);
    } finally {
      setLoadingRelated(false);
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
        // buscar orçamentos relacionados da mesma obra
        fetchRelatedOrcamentos(resp.data.obra_id);
      } else {
        setObraName(null);
        setRelatedOrcamentos([]);
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
          <p><strong>Valor material:</strong> {currencyFormatter.format(item.valor_material)}</p>
          <p><strong>Valor deslocamento:</strong> {currencyFormatter.format(item.valor_deslocamento)}</p>
          <p><strong>Valor hospedagem:</strong> {currencyFormatter.format(item.valor_hospedagem)}</p>
          <p><strong>Valor serviço:</strong> {currencyFormatter.format(item.valor_servico)}</p>
          <p><strong>Valor total:</strong> {currencyFormatter.format(item.valor_total)}</p>

          {/* Lista comparativa: orçamentos da mesma obra (exclui o atual) */}
          <div style={{ marginTop: 18 }}>
            <h4 style={{ marginBottom: 8 }}>Orçamentos da mesma obra / centro de custo</h4>
            {loadingRelated ? (
              <div>Carregando orçamentos relacionados...</div>
            ) : relatedOrcamentos.length === 0 ? (
              <div style={{ color: '#666' }}>Nenhum outro orçamento encontrado para esta obra.</div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 8 }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', padding: 6 }}>ID</th>
                    <th style={{ textAlign: 'left', padding: 6 }}>Descrição</th>
                    <th style={{ textAlign: 'right', padding: 6 }}>Valor Total</th>
                    <th style={{ textAlign: 'center', padding: 6 }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {relatedOrcamentos.map(r => (
                    <tr key={r.id}>
                      <td style={{ padding: 6 }}>{r.id}</td>
                      <td style={{ padding: 6 }}>{r.descricao}</td>
                      <td style={{ padding: 6, textAlign: 'right' }}>{currencyFormatter.format(r.valor_total)}</td>
                      <td style={{ padding: 6, textAlign: 'center' }}>
                        <Button onClick={() => window.location.assign(`#orcamento/${r.id}`)}>Ver</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

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