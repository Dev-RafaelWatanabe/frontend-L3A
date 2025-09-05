import React, { useEffect, useState } from 'react';
import axios from 'axios';
import estilosDashboard from './dashboard-styles';

// Define o tipo dos dados que vêm do backend
interface ResumoFinanceiro {
  data?: string;
  nome_centro_custo: string;
  valor_reais: number;
  descricao_financeira: string;
  observacao?: string;
}

const Dashboard: React.FC = () => {
  const [resumo, setResumo] = useState<ResumoFinanceiro[]>([]);
  const [filtroDescricao, setFiltroDescricao] = useState<string>(''); // Filtro de descrição financeira
  const [filtroCentroCusto, setFiltroCentroCusto] = useState<string>(''); // Filtro de centro de custo
  const [dataInicio, setDataInicio] = useState<string>(''); // Filtro de data inicial
  const [dataFim, setDataFim] = useState<string>(''); // Filtro de data final
  const [pagina, setPagina] = useState<number>(1); // Paginação
  const [gruposExpandido, setGruposExpandido] = useState<Record<string, boolean>>({}); // Controle de expansão dos grupos
  const tamanhoPagina = 100; // Tamanho da página

  // Função para buscar os dados da API
  const buscarDados = () => {
    const url = new URL('http://localhost:8000/relatorio/resumo');
    url.searchParams.append('pagina', pagina.toString());
    url.searchParams.append('tamanho_pagina', tamanhoPagina.toString());
    if (filtroDescricao) {
      url.searchParams.append('descricao_financeira', filtroDescricao);
    }
    if (filtroCentroCusto) {
      url.searchParams.append('centro_custo', filtroCentroCusto);
    }
    if (dataInicio) {
      url.searchParams.append('data_inicio', dataInicio);
    }
    if (dataFim) {
      url.searchParams.append('data_fim', dataFim);
    }

    axios.get(url.toString())
      .then(response => {
        setResumo(response.data);
      })
      .catch(error => {
        console.error('Erro ao buscar resumo:', error);
      });
  };

  // Atualiza os dados sempre que a página ou os filtros mudarem
  useEffect(() => {
    buscarDados();
  }, [pagina, filtroDescricao, filtroCentroCusto, dataInicio, dataFim]);

  const proximaPagina = () => setPagina(prev => prev + 1);
  const paginaAnterior = () => pagina > 1 && setPagina(prev => prev - 1);

  // Agrupa os dados por descrição financeira
  const agruparPorDescricaoFinanceira = (dados: ResumoFinanceiro[]) => {
    return dados.reduce((acc, item) => {
      if (!acc[item.descricao_financeira]) {
        acc[item.descricao_financeira] = [];
      }
      acc[item.descricao_financeira].push(item);
      return acc;
    }, {} as Record<string, ResumoFinanceiro[]>);
  };

  // Ordena os grupos pela soma dos valores
  const ordenarGrupos = (dadosAgrupados: Record<string, ResumoFinanceiro[]>) => {
    return Object.entries(dadosAgrupados)
      .sort(([, grupoA], [, grupoB]) => {
        const somaA = grupoA.reduce((acc, item) => acc + item.valor_reais, 0);
        const somaB = grupoB.reduce((acc, item) => acc + item.valor_reais, 0);
        return somaB - somaA; // Ordena em ordem decrescente
      });
  };

  const dadosAgrupados = ordenarGrupos(agruparPorDescricaoFinanceira(resumo));

  // Alterna o estado de expansão de um grupo
  const alternarGrupo = (descricao: string) => {
    setGruposExpandido(prev => ({
      ...prev,
      [descricao]: !prev[descricao],
    }));
  };

  return (
    <div style={estilosDashboard.container}>
      <h1 style={{ marginBottom: 0, color: '#1976d2' }}>Dashboard</h1>
      <h2 style={{ marginTop: 4, fontWeight: 400, color: '#333' }}>Resumo Financeiro</h2>

      <div style={{ marginBottom: 16, display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
        <label htmlFor="filtroDescricao" style={{ fontWeight: 500 }}>
          Descrição Financeira:
        </label>
        <input
          id="filtroDescricao"
          type="text"
          style={estilosDashboard.select}
          placeholder="Digite a descrição..."
          value={filtroDescricao}
          onChange={e => setFiltroDescricao(e.target.value)}
        />
        <label htmlFor="filtroCentroCusto" style={{ fontWeight: 500 }}>
          Centro de Custo:
        </label>
        <input
          id="filtroCentroCusto"
          type="text"
          style={estilosDashboard.select}
          placeholder="Digite o centro de custo..."
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

      <div style={{ overflowX: 'auto' }}>
        <table style={estilosDashboard.table}>
          <thead>
            <tr>
              <th style={estilosDashboard.th}>Data</th>
              <th style={estilosDashboard.th}>Centro de Custo</th>
              <th style={estilosDashboard.th}>Valor (R$)</th>
              <th style={estilosDashboard.th}>Observação</th>
            </tr>
          </thead>
          <tbody>
            {dadosAgrupados.map(([descricao, grupo], idx) => {
              const subtotal = grupo.reduce((acc, item) => acc + item.valor_reais, 0); // Calcula o subtotal do grupo

              return (
                <React.Fragment key={idx}>
                  {/* Cabeçalho do grupo com subtotal */}
                  <tr style={estilosDashboard.trGrupo}>
                    <td colSpan={2} style={{ fontWeight: 'bold', cursor: 'pointer' }} onClick={() => alternarGrupo(descricao)}>
                      {descricao} {gruposExpandido[descricao] ? '[-]' : '[+]'}
                    </td>
                    <td style={{ fontWeight: 'bold' }}>
                      {subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </td>
                    <td></td>
                  </tr>
                  {/* Linhas do grupo */}
                  {gruposExpandido[descricao] &&
                    grupo.map((item, subIdx) => (
                      <tr key={subIdx}>
                        <td style={estilosDashboard.td}>{item.data}</td>
                        <td style={estilosDashboard.td}>{item.nome_centro_custo}</td>
                        <td style={estilosDashboard.td}>
                          {item.valor_reais.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </td>
                        <td style={estilosDashboard.td}>{item.observacao || '-'}</td>
                      </tr>
                    ))}
                  {/* Subtotal do grupo (quando expandido) */}
                  {gruposExpandido[descricao] && (
                    <tr style={{ backgroundColor: '#f0f0f0', fontWeight: 'bold' }}>
                      <td colSpan={2} style={estilosDashboard.td}>Subtotal</td>
                      <td style={estilosDashboard.td}>
                        {subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </td>
                      <td style={estilosDashboard.td}></td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between' }}>
        <button onClick={paginaAnterior} disabled={pagina === 1} style={estilosDashboard.botao}>
          Página Anterior
        </button>
        <span>Página {pagina}</span>
        <button onClick={proximaPagina} style={estilosDashboard.botao}>
          Próxima Página
        </button>
      </div>
    </div>
  );
};

export default Dashboard;