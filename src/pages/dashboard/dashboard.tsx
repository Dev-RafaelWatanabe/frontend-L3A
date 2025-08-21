import React, { useEffect, useState } from 'react';
import axios from 'axios';
import estilosDashboard from './dashboard-styles';

// Define o tipo dos dados que vêm do backend
interface ResumoFinanceiro {
  descricao_financeira: string;
  nome_centro_custo: string;
  grupo: string;
  complemento: string;
  valor_reais: number;
  data?: string; // <-- inclui data
}

const Dashboard: React.FC = () => {
  const [resumo, setResumo] = useState<ResumoFinanceiro[]>([]);
  const [abertos, setAbertos] = useState<string[]>([]);
  const [subAbertos, setSubAbertos] = useState<string[]>([]);
  const [filtroCentroCusto, setFiltroCentroCusto] = useState<string>('');
  const [dataInicio, setDataInicio] = useState<string>('');
  const [dataFim, setDataFim] = useState<string>('');

  useEffect(() => {
    axios.get('http://localhost:8000/relatorio/resumo')
      .then(response => {
        setResumo(response.data);
      })
      .catch(error => {
        console.error('Erro ao buscar resumo:', error);
      });
  }, []);

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

  // Agrupa por descricao_financeira, depois por grupo
  const agrupado = resumoFiltrado.reduce((acc, item) => {
    const chave1 = item.descricao_financeira;
    const chave2 = item.grupo;
    if (!acc[chave1]) acc[chave1] = {};
    if (!acc[chave1][chave2]) acc[chave1][chave2] = [];
    acc[chave1][chave2].push(item);
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

  return (
    <div style={estilosDashboard.container}>
      <h1 style={{ marginBottom: 0, color: '#1976d2' }}>Dashboard</h1>
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
      </div>

      <table style={estilosDashboard.table}>
        <thead>
          <tr>
            <th style={estilosDashboard.th}>Descrição Financeira</th>
            <th style={estilosDashboard.th}>Grupo</th>
            <th style={estilosDashboard.th}>Valor (R$)</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(agrupado).map(([descricao, grupos]) => {
            const valorDescricao = Object.values(grupos).flat().reduce((soma, i) => soma + i.valor_reais, 0);
            return (
              <React.Fragment key={descricao}>
                <tr
                  style={estilosDashboard.trGrupo}
                  onClick={() => toggleGrupo(descricao)}
                >
                  <td style={estilosDashboard.td}>
                    <b>{descricao}</b> <span style={{ color: '#1976d2' }}>({Object.values(grupos).flat().length} registros)</span>
                    <span style={{ float: 'right', fontSize: 18 }}>
                      {abertos.includes(descricao) ? '▲' : '▼'}
                    </span>
                  </td>
                  <td style={estilosDashboard.td}></td>
                  <td style={estilosDashboard.td}>
                    <b>{valorDescricao.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</b>
                  </td>
                </tr>
                {abertos.includes(descricao) && Object.entries(grupos).map(([grupo, itens]) => {
                  const valorGrupo = itens.reduce((soma, i) => soma + i.valor_reais, 0);
                  return (
                    <React.Fragment key={grupo}>
                      <tr
                        style={{ ...estilosDashboard.trGrupo, background: '#f5f5f5' }}
                        onClick={() => toggleSubGrupo(descricao + grupo)}
                      >
                        <td style={estilosDashboard.td}></td>
                        <td style={estilosDashboard.td}>
                          <b>{grupo}</b> <span style={{ color: '#1976d2' }}>({itens.length} registros)</span>
                          <span style={{ float: 'right', fontSize: 16 }}>
                            {subAbertos.includes(descricao + grupo) ? '▲' : '▼'}
                          </span>
                        </td>
                        <td style={estilosDashboard.td}>
                          <b>{valorGrupo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</b>
                        </td>
                      </tr>
                      {subAbertos.includes(descricao + grupo) && itens.map((item, idx) => (
                        <tr key={idx}>
                          <td style={estilosDashboard.td}></td>
                          <td style={estilosDashboard.td}>
                            <div style={estilosDashboard.detalhe}>
                              <div><b>Centro de Custo:</b> {item.nome_centro_custo}</div>
                              <div><b>Complemento:</b> {item.complemento}</div>
                              <div><b>Data:</b> {item.data}</div>
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
    </div>
  );
};

export default Dashboard;