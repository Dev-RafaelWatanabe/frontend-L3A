import React, { useEffect, useState } from 'react';
import Api from '../../../services/api/api'; // importa o serviço

// Define o tipo dos dados que vêm do backend
interface ResumoFinanceiro {
  descricao_financeira?: string;
  descricao?: string;
  nome_centro_custo: string;
  grupo?: string;
  plano_financeiro?: string;
  complemento: string;
  nivel1?: string;   // API retorna "nivel1"
  nive1?: string;    // mantido para compatibilidade com typo anterior
  valor_reais: number;
  data?: string;
  observacao?: string;
  lancamento?: string;
  documento?: string;
}

// tipo para as métricas retornadas pela API
interface Metricas {
  receitas?: number;
  impostos?: number;
  receita_liquida?: number;
  custos?: number;
  margem_contribuicao?: number;
  despesas?: number;
  total_gastos?: number;
  resultado_operacional?: number;
  porcentagem_margem?: number;
  porcentagem_resultado?: number;
}

// Estilos inline
const estilosDashboard = {
  container: {
    maxWidth: 900,
    margin: '32px auto',
    padding: 24,
    background: '#fff',
    borderRadius: 12,
    boxShadow: '0 2px 12px #0002'
  } as React.CSSProperties,
  select: {
    padding: '6px 12px',
    borderRadius: 6,
    border: '1px solid #ccc',
    fontSize: 16,
    marginLeft: 8
  } as React.CSSProperties,
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: 16,
    fontSize: 15
  } as React.CSSProperties,
  th: {
    background: '#1976d2',
    color: '#fff',
    padding: '10px 8px',
    textAlign: 'left',
    fontWeight: 600
  } as React.CSSProperties,
  trGrupo: {
    background: '#e3f2fd',
    cursor: 'pointer',
    fontWeight: 500,
    transition: 'background 0.2s'
  } as React.CSSProperties,
  td: {
    padding: '8px 8px',
    borderBottom: '1px solid #eee'
  } as React.CSSProperties,
  detalhe: {
    background: '#f9f9f9',
    borderRadius: 6,
    padding: '6px 10px',
    marginBottom: 4,
    boxShadow: '0 1px 4px #0001'
  } as React.CSSProperties,
  metricCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    padding: '12px 16px',
    borderRadius: 10,
    background: '#f4f7fb',
    minWidth: 180,
    boxShadow: '0 4px 10px rgba(0,0,0,0.04)',
    alignItems: 'flex-start',
    justifyContent: 'center'
  } as React.CSSProperties,
  metricLabel: {
    fontSize: 13,
    color: '#55606a',
    fontWeight: 600
  } as React.CSSProperties,
  metricValue: {
    fontSize: 18,
    color: '#1976d2',
    fontWeight: 700
  } as React.CSSProperties,
  actionButton: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: 14,
    color: '#1976d2',
    padding: 4
  } as React.CSSProperties,
  detailRow: {
    background: '#fcfeff'
  } as React.CSSProperties,
  detailGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: 6,
    fontSize: 13,
    color: '#333'
  } as React.CSSProperties
};

export function ControleCustos() {
  const [resumo, setResumo] = useState<ResumoFinanceiro[]>([]);
  const [metricas, setMetricas] = useState<Metricas | null>(null);
  const [abertos, setAbertos] = useState<string[]>([]);
  const [subAbertos, setSubAbertos] = useState<string[]>([]);
  const [filtroCentroCusto, setFiltroCentroCusto] = useState<string>('');
  const [dataInicio, setDataInicio] = useState<string>('');
  const [dataFim, setDataFim] = useState<string>('');
  const [transferOpen, setTransferOpen] = useState<boolean>(true);
  const [adiantamentoOpen, setAdiantamentoOpen] = useState<boolean>(true);
  const [expandedTransfers, setExpandedTransfers] = useState<number[]>([]);
  const [expandedAdiantamentos, setExpandedAdiantamentos] = useState<number[]>([]);
  
  // carrega do backend com filtros como na sua curl
  const loadResumo = async (params?: { pagina?: number; tamanho_pagina?: number; centro_custo?: string; data_inicio?: string; data_fim?: string }) => {
    try {
      const response = await Api.getDashboardResumo(params);
      const payload = response.data;
      if (payload && typeof payload === 'object' && 'resumo' in payload) {
        setResumo(payload.resumo || []);
        setMetricas(payload.metricas || null);
      } else {
        setResumo(Array.isArray(payload) ? payload : []);
        setMetricas(null);
      }
    } catch (err) {
      console.error('Erro ao buscar resumo:', err);
    }
  };

  useEffect(() => {
    // opcional: carregar inicial sem filtros
    loadResumo({ pagina: 1, tamanho_pagina: 50 });
  }, []);

  // helper para formatar valores monetários
  const formatCurrency = (value: number | undefined | null) => {
    if (value === undefined || value === null || Number.isNaN(value)) return '-';
    return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  // Filtra pelo nome do centro de custo e intervalo de datas
  const resumoFiltrado = resumo.filter(item => {
    const centroOk = filtroCentroCusto
      ? item.nome_centro_custo.toLowerCase().includes(filtroCentroCusto.toLowerCase())
      : true;

    // Converte data para formato YYYY-MM-DD
    const dataItem = item.data
      ? item.data.length === 10 && item.data.includes('/')
        ? item.data.split('/').reverse().join('-')
        : item.data
      : '';

    const inicioOk = dataInicio ? dataItem >= dataInicio : true;
    const fimOk = dataFim ? dataItem <= dataFim : true;

    return centroOk && inicioOk && fimOk;
  });

  // Normaliza string para comparação exata (sem acentos, espaços extras, etc.)
  const normalizeExact = (v?: string) =>
    (v || '')
      .toString()
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '') // remove acentos
      .replace(/\s+/g, ' ')           // normaliza espaços
      .trim()
      .toLowerCase();

  // Busca o texto exato "adiantamento a fornecedores" em vários campos
  const isAdiantamentoFornecedores = (item: ResumoFinanceiro) => {
    const campos = [
      item.descricao_financeira,
      item.descricao,
      item.complemento,
      item.observacao,
      item.lancamento
    ];
    return campos.some(c => normalizeExact(c) === 'adiantamento a fornecedores');
  };

  // Separar transferências ("Transferencia entre contas - Mutuo")
  // Não considera itens já identificados como adiantamento
  const isTransferenciaItem = (item: ResumoFinanceiro) => {
    if (isAdiantamentoFornecedores(item)) return false;
    const descOrig = normalizeExact(item.descricao_financeira);
    const desc = normalizeExact(item.descricao);
    return desc === 'transferencia entre contas - mutuo' || descOrig === 'transferencia entre contas - mutuo';
  };

  // Primeiro extraí adiantamentos, depois transferências (transferências excluem adiantamentos)
  const adiantamentos = resumoFiltrado.filter(isAdiantamentoFornecedores);
  const transferencias = resumoFiltrado.filter(isTransferenciaItem);

  // DEBUG: mostra alguns registros identificados para inspeção
  console.log('ADIANTAMENTOS DETECTADOS:', adiantamentos.slice(0,10).map(a => ({ df: a.descricao_financeira, d: a.descricao, comp: a.complemento, obs: a.observacao, lanc: a.lancamento, v: a.valor_reais })));
  console.log('TRANSFERENCIAS DETECTADAS:', transferencias.slice(0,10).map(t => ({ df: t.descricao_financeira, d: t.descricao, comp: t.complemento, v: t.valor_reais })));
  
  // Soma usando o valor absoluto para que negativos virem positivos na agregação
  const totalTransferencias = transferencias.reduce((s, i) => s + Math.abs(Number(i.valor_reais) || 0), 0);
  const totalAdiantamentos = adiantamentos.reduce((s, i) => s + Math.abs(Number(i.valor_reais) || 0), 0);

  // Exibição: dividir o resultado final por 2 (apenas para mostrar)
  const totalTransferenciasExibicao = totalTransferencias / 2;
  const totalAdiantamentosExibicao = totalAdiantamentos / 1;

  // Remove transferências e adiantamentos dos dados usados na tabela principal
  const resumoSemTransferencias = resumoFiltrado.filter(item => !isTransferenciaItem(item) && !isAdiantamentoFornecedores(item));

  // Agrupa por nivel1 (Nível 1), depois por descricao (campo "descricao")
  const agrupado = resumoSemTransferencias.reduce((acc, item) => {
    const nivel1 = item.nivel1 || item.nive1 || 'Sem Nível';
    const descricao = item.descricao || item.descricao_financeira || 'Sem Descrição';
    if (!acc[nivel1]) acc[nivel1] = {};
    if (!acc[nivel1][descricao]) acc[nivel1][descricao] = [];
    acc[nivel1][descricao].push(item);
    return acc;
  }, {} as Record<string, Record<string, ResumoFinanceiro[]>>);

  const toggleGrupo = (chave: string) => {
    setAbertos(prev =>
      prev.includes(chave)
        ? prev.filter(d => d !== chave)
        : [...prev, chave]
    );
  };

  const toggleSubGrupo = (chave: string) => {
    setSubAbertos(prev =>
      prev.includes(chave)
        ? prev.filter(d => d !== chave)
        : [...prev, chave]
    );
  };

  const toggleExpandedTransfer = (idx: number) => {
    setExpandedTransfers(prev => (prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]));
  };
  const toggleExpandedAdiant = (idx: number) => {
    setExpandedAdiantamentos(prev => (prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]));
  };

  return (
    <div style={{ ...estilosDashboard.container, boxSizing: 'border-box', maxWidth: 1200, margin: '0 auto', padding: 16, overflowX: 'hidden' }}>
      <h1 style={{ marginBottom: 0, color: '#1976d2' }}>Controle de Custos</h1>
      <h2 style={{ marginTop: 4, fontWeight: 400, color: '#333' }}>Resumo Financeiro</h2>

      <div style={{ marginBottom: 16, display: 'flex', gap: 16, alignItems: 'center' }}>
        <label htmlFor="filtroCentroCusto" style={{ fontWeight: 500 }}>
          Centro de Custo:
        </label>
        <input
          id="filtroCentroCusto"
          type="text"
          style={estilosDashboard.select}
          placeholder="Digite o nome..."
          value={filtroCentroCusto}
          onChange={e => setFiltroCentroCusto(e.target.value)}
        />
        <label htmlFor="dataInicio" style={{ fontWeight: 500 }}>
          Data Início:
        </label>
        <input
          id="dataInicio"
          type="date"
          style={estilosDashboard.select}
          value={dataInicio}
          onChange={e => setDataInicio(e.target.value)}
        />
        <label htmlFor="dataFim" style={{ fontWeight: 500 }}>
          Data Fim:
        </label>
        <input
          id="dataFim"
          type="date"
          style={estilosDashboard.select}
          value={dataFim}
          onChange={e => setDataFim(e.target.value)}
        />
        <button
          onClick={() => loadResumo({ pagina: 1, tamanho_pagina: 50, centro_custo: filtroCentroCusto, data_inicio: dataInicio, data_fim: dataFim })}
          style={{
            padding: '8px 16px',
            backgroundColor: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
            fontWeight: 500,
          }}
        >
          Buscar
        </button>
      </div>

      {/* Exibe métricas retornadas pela API (se houver) e cartão de Transferências */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        {metricas && (
          <>
            <div style={estilosDashboard.metricCard}>
              <div style={estilosDashboard.metricLabel}>Receitas</div>
              <div style={estilosDashboard.metricValue}>{formatCurrency(metricas.receitas)}</div>
            </div>
            <div style={estilosDashboard.metricCard}>
              <div style={estilosDashboard.metricLabel}>Receita Líquida</div>
              <div style={estilosDashboard.metricValue}>{formatCurrency(metricas.receita_liquida)}</div>
            </div>
            <div style={estilosDashboard.metricCard}>
              <div style={estilosDashboard.metricLabel}>Margem de Contribuição</div>
              <div style={estilosDashboard.metricValue}>{formatCurrency(metricas.margem_contribuicao)}</div>
            </div>
            <div style={estilosDashboard.metricCard}>
              <div style={estilosDashboard.metricLabel}>Despesas</div>
              <div style={estilosDashboard.metricValue}>{formatCurrency(metricas.despesas)}</div>
            </div>
            <div style={estilosDashboard.metricCard}>
              <div style={estilosDashboard.metricLabel}>Total de Gastos</div>
              <div style={estilosDashboard.metricValue}>{formatCurrency(metricas.total_gastos)}</div>
            </div>
            <div style={estilosDashboard.metricCard}>
              <div style={estilosDashboard.metricLabel}>Resultado Operacional</div>
              <div style={estilosDashboard.metricValue}>{formatCurrency(metricas.resultado_operacional)}</div>
            </div>
            <div style={estilosDashboard.metricCard}>
              <div style={estilosDashboard.metricLabel}>% Margem de Contribuição</div>
              <div style={estilosDashboard.metricValue}>{metricas.porcentagem_margem?.toFixed(2)}%</div>
            </div>
            <div style={estilosDashboard.metricCard}>
              <div style={estilosDashboard.metricLabel}>% Resultado Operacional</div>
              <div style={estilosDashboard.metricValue}>{metricas.porcentagem_resultado?.toFixed(2)}%</div>
            </div>
          </>
        )}

        
      </div>

      <table style={estilosDashboard.table}>
        <thead>
          <tr>
            <th style={estilosDashboard.th}>Nível 1</th>
            <th style={estilosDashboard.th}>Descrição</th>
            <th style={estilosDashboard.th}>Valor (R$)</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(agrupado).map(([nivel1, descricoes]) => {
            const valorNivel1 = Object.values(descricoes).flat().reduce((soma, i) => soma + i.valor_reais, 0);
            return (
              <React.Fragment key={nivel1}>
                <tr
                  style={estilosDashboard.trGrupo}
                  onClick={() => toggleGrupo(nivel1)}
                >
                  <td style={estilosDashboard.td}>
                    <b>{nivel1}</b> <span style={{ color: '#1976d2' }}>({Object.values(descricoes).flat().length} registros)</span>
                    <span style={{ float: 'right', fontSize: 18 }}>
                      {abertos.includes(nivel1) ? '▲' : '▼'}
                    </span>
                  </td>
                  <td style={estilosDashboard.td}></td>
                  <td style={estilosDashboard.td}>
                    <b>{valorNivel1.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</b>
                  </td>
                </tr>
                {abertos.includes(nivel1) && Object.entries(descricoes).map(([descricao, itens]) => {
                  const valorDescricao = itens.reduce((soma, i) => soma + i.valor_reais, 0);
                  const chaveSub = nivel1 + '||' + descricao;
                  return (
                    <React.Fragment key={chaveSub}>
                      <tr
                        style={{ ...estilosDashboard.trGrupo, background: '#f5f5f5' }}
                        onClick={() => toggleSubGrupo(chaveSub)}
                      >
                        <td style={estilosDashboard.td}></td>
                        <td style={estilosDashboard.td}>
                          <b>{descricao}</b> <span style={{ color: '#1976d2' }}>({itens.length} registros)</span>
                          <span style={{ float: 'right', fontSize: 16 }}>
                            {subAbertos.includes(chaveSub) ? '▲' : '▼'}
                          </span>
                        </td>
                        <td style={estilosDashboard.td}>
                          <b>{valorDescricao.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</b>
                        </td>
                      </tr>
                      {subAbertos.includes(chaveSub) && itens.map((item, idx) => (
                        <tr key={idx}>
                          <td style={estilosDashboard.td}></td>
                          <td style={estilosDashboard.td}>
                            <div style={estilosDashboard.detalhe}>
                              <div><b>Centro de Custo:</b> {item.nome_centro_custo}</div>
                              <div><b>Complemento:</b> {item.complemento}</div>
                              <div><b>Descrição:</b> {item.descricao || item.descricao_financeira}</div>
                              <div><b>Data:</b> {item.data}</div>
                              <div><b>Observação:</b> {item.observacao}</div>
                              <div><b>Lançamento:</b> {item.lancamento}</div>
                            </div>
                          </td>
                          <td style={estilosDashboard.td}>
                            <span style={{ fontWeight: 500 }}>
                              {item.valor_reais.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  );
                })}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>

      {/* Agrupa Transferências e Adiantamentos usando o mesmo container do dashboard */}
      <div style={{ width: '100%', boxSizing: 'border-box' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 12, width: '100%' }}>
          {/* Cartão Transferências — versão compacta com linhas expansíveis */}
          <div style={{ ...estilosDashboard.metricCard, width: '100%', boxSizing: 'border-box' }}>
            <div
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', padding: '8px 0' }}
              onClick={() => setTransferOpen(prev => !prev)}
            >
              <div style={{ fontWeight: 700 }}>Transferências entre contas - Mútuo</div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{ fontSize: 12, color: '#666' }}>{transferencias.length} registros</div>
                <div style={estilosDashboard.metricValue}>{formatCurrency(totalTransferenciasExibicao)}</div>
                <div style={{ fontSize: 18 }}>{transferOpen ? '▲' : '▼'}</div>
              </div>
            </div>

            {transferOpen && (
              <div style={{ marginTop: 8, overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed', minWidth: 0 }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #eee' }}>Centro</th>
                      <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #eee', width: 120 }}>Data</th>
                      <th style={{ textAlign: 'right', padding: 8, borderBottom: '1px solid #eee', width: 120 }}>Valor</th>
                      <th style={{ textAlign: 'center', padding: 8, borderBottom: '1px solid #eee', width: 56 }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {transferencias.map((t, i) => (
                      <React.Fragment key={`tr-${i}`}>
                        <tr style={{ borderBottom: '1px solid #fafafa' }}>
                          <td style={{ padding: 8, wordBreak: 'break-word', maxWidth: 320 }}>{t.nome_centro_custo}</td>
                          <td style={{ padding: 8 }}>{t.data}</td>
                          <td style={{ padding: 8, textAlign: 'right', whiteSpace: 'nowrap' }}>{formatCurrency(t.valor_reais)}</td>
                          <td style={{ padding: 8, textAlign: 'center' }}>
                            <button onClick={() => toggleExpandedTransfer(i)} style={estilosDashboard.actionButton}>
                              {expandedTransfers.includes(i) ? '▲' : '▼'}
                            </button>
                          </td>
                        </tr>
                        {expandedTransfers.includes(i) && (
                          <tr style={estilosDashboard.detailRow}>
                            <td colSpan={4} style={{ padding: 8 }}>
                              <div style={estilosDashboard.detailGrid}>
                                <div><b>Complemento:</b> {t.complemento}</div>
                                <div><b>Descrição:</b> {t.descricao || t.descricao_financeira}</div>
                                <div><b>Observação:</b> {t.observacao}</div>
                                <div><b>Lançamento:</b> {t.lancamento}</div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Cartão Adiantamentos — versão compacta com linhas expansíveis */}
          <div style={{ ...estilosDashboard.metricCard, width: '100%', boxSizing: 'border-box' }}>
            <div
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', padding: '8px 0' }}
              onClick={() => setAdiantamentoOpen(prev => !prev)}
            >
              <div style={{ fontWeight: 700 }}>Caju</div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{ fontSize: 12, color: '#666' }}>{adiantamentos.length} registros</div>
                <div style={estilosDashboard.metricValue}>{formatCurrency(totalAdiantamentosExibicao)}</div>
                <div style={{ fontSize: 18 }}>{adiantamentoOpen ? '▲' : '▼'}</div>
              </div>
            </div>

            {adiantamentoOpen && (
              <div style={{ marginTop: 8, overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed', minWidth: 0 }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #eee' }}>Centro</th>
                      <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #eee', width: 120 }}>Data</th>
                      <th style={{ textAlign: 'right', padding: 8, borderBottom: '1px solid #eee', width: 120 }}>Valor</th>
                      <th style={{ textAlign: 'center', padding: 8, borderBottom: '1px solid #eee', width: 56 }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {adiantamentos.map((t, i) => (
                      <React.Fragment key={`ad-${i}`}>
                        <tr style={{ borderBottom: '1px solid #fafafa' }}>
                          <td style={{ padding: 8, wordBreak: 'break-word', maxWidth: 320 }}>{t.nome_centro_custo}</td>
                          <td style={{ padding: 8 }}>{t.data}</td>
                          <td style={{ padding: 8, textAlign: 'right', whiteSpace: 'nowrap' }}>{formatCurrency(t.valor_reais)}</td>
                          <td style={{ padding: 8, textAlign: 'center' }}>
                            <button onClick={() => toggleExpandedAdiant(i)} style={estilosDashboard.actionButton}>
                              {expandedAdiantamentos.includes(i) ? '▲' : '▼'}
                            </button>
                          </td>
                        </tr>
                        {expandedAdiantamentos.includes(i) && (
                          <tr style={estilosDashboard.detailRow}>
                            <td colSpan={4} style={{ padding: 8 }}>
                              <div style={estilosDashboard.detailGrid}>
                                <div><b>Complemento:</b> {t.complemento}</div>
                                <div><b>Descrição:</b> {t.descricao || t.descricao_financeira}</div>
                                <div><b>Observação:</b> {t.observacao}</div>
                                <div><b>Lançamento:</b> {t.lancamento}</div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
