import { useEffect, useState } from 'react';
import Api from '../../../services/api/api';
import { ListWrapper, Table, Thead, Tbody, Tr, Th, Td, Button } from './styles';

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

type Obra = {
  id: number;
  nome?: string;
  // ajuste se o campo no backend tiver outro nome, ex: 'nome_fantasia' ou 'titulo'
};

export function OrcamentoList({ onOpenDetails }: { onOpenDetails: (id: number) => void }) {
  const [items, setItems] = useState<Orcamento[]>([]);
  const [loading, setLoading] = useState(false);
  const [obrasMap, setObrasMap] = useState<Record<number, string>>({});

  async function fetchObras() {
    try {
      const resp = await Api.getObras();
      const obras: Obra[] = resp.data || [];
      const map: Record<number, string> = {};
      obras.forEach(o => {
        map[o.id] = o.nome ?? String(o.id);
      });
      setObrasMap(map);
    } catch {
      // se falhar, manter map vazio — iremos mostrar obra_id
      setObrasMap({});
    }
  }

  async function fetchList() {
    setLoading(true);
    try {
      const resp = await Api.getOrcamentos({ skip: 0, limit: 100 });
      setItems(resp.data || []);
      // buscar obras após obter orçamentos (se ainda não buscadas)
      if (Object.keys(obrasMap).length === 0) {
        await fetchObras();
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchList();
    // eslint-disable-next-line
  }, []);

  return (
    <ListWrapper>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        <h3>Orçamentos</h3>
        <Button onClick={fetchList}>Atualizar</Button>
      </div>

      {loading ? <div>Carregando...</div> : (
        <Table>
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Obra</Th>
              <Th>Descrição</Th>
              <Th>Valor Total</Th>
              <Th>Ações</Th>
            </Tr>
          </Thead>
          <Tbody>
            {items.map(it => (
              <Tr key={it.id}>
                <Td>{it.id}</Td>
                <Td>{obrasMap[it.obra_id] ?? it.obra_id}</Td>
                <Td>{it.descricao}</Td>
                <Td>{it.valor_total.toFixed(2)}</Td>
                <Td>
                  <Button onClick={() => onOpenDetails(it.id)}>Ver</Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </ListWrapper>
  );
}

export default OrcamentoList;