import { useState, useEffect, useRef } from 'react';
import Api from '../../../services/api/api';
import { Form, Row, Field, Label, Input, TextArea, Actions, Button, SmallText } from './styles';

type Obra = {
  id: number;
  nome?: string;
};

export function OrcamentoForm({ onCreated }: { onCreated?: () => void }) {
  const [obraId, setObraId] = useState<number | ''>('');
  const [obraName, setObraName] = useState<string>('');
  const [valorMaterial, setValorMaterial] = useState<number | ''>('');
  const [valorDeslocamento, setValorDeslocamento] = useState<number | ''>('');
  const [valorHospedagem, setValorHospedagem] = useState<number | ''>('');
  const [valorServico, setValorServico] = useState<number | ''>('');
  const [descricao, setDescricao] = useState('');

  const [saving, setSaving] = useState(false);

  // obras dropdown
  const [obras, setObras] = useState<Obra[]>([]);
  const [obraSearch, setObraSearch] = useState('');
  const [isObraOpen, setIsObraOpen] = useState(false);
  const obraRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    async function loadObras() {
      try {
        const resp = await Api.getObras();
        setObras(resp.data || []);
      } catch {
        setObras([]);
      }
    }
    loadObras();
  }, []);

  // close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (obraRef.current && !obraRef.current.contains(e.target as Node)) {
        setIsObraOpen(false);
      }
    }
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const filteredObras = obras.filter(o =>
    (o.nome ?? String(o.id)).toLowerCase().includes(obraSearch.toLowerCase())
  );

  function handleSelectObra(o: Obra) {
    setObraId(o.id);
    setObraName(o.nome ?? String(o.id));
    setIsObraOpen(false);
    setObraSearch('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!obraId) return alert('Informe obra');
    const vm = Number(valorMaterial || 0);
    const vd = Number(valorDeslocamento || 0);
    const vh = Number(valorHospedagem || 0);
    const vs = Number(valorServico || 0);
    const payload = {
      obra_id: Number(obraId),
      valor_material: vm,
      valor_deslocamento: vd,
      valor_hospedagem: vh,
      valor_servico: vs,
      valor_total: Number((vm + vd + vh + vs).toFixed(2)),
      descricao,
    };

    setSaving(true);
    try {
      await Api.createOrcamento(payload);
      alert('Orçamento criado');
      if (onCreated) onCreated();
      // limpar
      setObraId('');
      setObraName('');
      setValorMaterial('');
      setValorDeslocamento('');
      setValorHospedagem('');
      setValorServico('');
      setDescricao('');
    } catch (err: any) {
      alert(err?.response?.data?.detail || 'Erro ao criar orçamento');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Field style={{ position: 'relative' }} ref={obraRef}>
          <Label>Obra</Label>
          <Input
            placeholder="Selecione obra..."
            value={obraName || obraSearch}
            onChange={e => {
              setObraSearch(e.target.value);
              setIsObraOpen(true);
              // clear selected id when user types a new search
              setObraId('');
              setObraName('');
            }}
            onFocus={() => setIsObraOpen(true)}
            autoComplete="off"
          />
          {isObraOpen && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 6px)',
                left: 0,
                right: 0,
                background: '#fff',
                border: '1px solid #e6e6e6',
                maxHeight: 200,
                overflow: 'auto',
                zIndex: 40,
                borderRadius: 4,
              }}
            >
              {filteredObras.length === 0 ? (
                <div style={{ padding: 8, color: '#666' }}>Nenhuma obra encontrada</div>
              ) : (
                filteredObras.map(o => (
                  <div
                    key={o.id}
                    onClick={() => handleSelectObra(o)}
                    style={{ padding: 8, cursor: 'pointer', borderBottom: '1px solid #f2f2f2' }}
                  >
                    <div style={{ fontWeight: 600 }}>{o.nome ?? `Obra ${o.id}`}</div>
                    <div style={{ fontSize: 12, color: '#666' }}>ID: {o.id}</div>
                  </div>
                ))
              )}
            </div>
          )}
          <small>
            {obraId ? `Selecionada: ${obraName || obraId}` : 'Nenhuma obra selecionada'}
          </small>
        </Field>

        <Field>
          <Label>Valor material</Label>
          <Input type="number" value={valorMaterial} onChange={e => setValorMaterial(Number(e.target.value) || '')} />
        </Field>
        <Field>
          <Label>Valor deslocamento</Label>
          <Input type="number" value={valorDeslocamento} onChange={e => setValorDeslocamento(Number(e.target.value) || '')} />
        </Field>
      </Row>

      <Row>
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
        <Button type="submit" variant="primary" disabled={saving}>{saving ? 'Salvando...' : 'Salvar'}</Button>
      </Actions>

      <SmallText>Valor total é calculado automaticamente a partir dos componentes.</SmallText>
    </Form>
  );
}

export default OrcamentoForm;