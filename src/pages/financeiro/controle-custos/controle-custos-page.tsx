import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Title, DashboardContainer, FilterContainer, Table, TableHeader, TableRow, TableCell, DetailContainer } from './styles';

// Define o tipo dos dados que vêm do backend
interface ResumoFinanceiro {
  descricao_financeira: string;
  nome_centro_custo: string;
  grupo: string;
  complemento: string;
  valor_reais: number;
  data?: string;
}

export function ControleCustos() {
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
    <Container>
      <Title>Controle de Custos</Title>
      
      <DashboardContainer>
        <h2>Resumo Financeiro</h2>

        <FilterContainer>
          <label htmlFor="filtroCentroCusto">Centro de Custo:</label>
          <input
            id="filtroCentroCusto"
            type="text"
            placeholder="Digite o nome..."
            value={filtroCentroCusto}
            onChange={e => setFiltroCentroCusto(e.target.value)}
          />
          
          <label htmlFor="dataInicio">Data Início:</label>
          <input
            id="dataInicio"
            type="date"
            value={dataInicio}
            onChange={e => setDataInicio(e.target.value)}
          />
          
          <label htmlFor="dataFim">Data Fim:</label>
          <input
            id="dataFim"
            type="date"
            value={dataFim}
            onChange={e => setDataFim(e.target.value)}
          />
        </FilterContainer>

        <Table>
          <thead>
            <TableHeader>
              <th>Descrição Financeira</th>
              <th>Grupo</th>
              <th>Valor (R$)</th>
            </TableHeader>
          </thead>
          <tbody>
            {Object.entries(agrupado).map(([descricao, grupos]) => {
              const valorDescricao = Object.values(grupos).flat().reduce((soma, i) => soma + i.valor_reais, 0);
              return (
                <React.Fragment key={descricao}>
                  <TableRow
                    isGroupRow
                    onClick={() => toggleGrupo(descricao)}
                  >
                    <TableCell>
                      <b>{descricao}</b> <span style={{ color: 'rgba(8, 1, 104, 0.94)' }}>({Object.values(grupos).flat().length} registros)</span>
                      <span style={{ float: 'right', fontSize: 18 }}>
                        {abertos.includes(descricao) ? '▲' : '▼'}
                      </span>
                    </TableCell>
                    <TableCell></TableCell>
                    <TableCell>
                      <b>{valorDescricao.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</b>
                    </TableCell>
                  </TableRow>
                  {abertos.includes(descricao) && Object.entries(grupos).map(([grupo, itens]) => {
                    const valorGrupo = itens.reduce((soma, i) => soma + i.valor_reais, 0);
                    return (
                      <React.Fragment key={grupo}>
                        <TableRow
                          isSubGroupRow
                          onClick={() => toggleSubGrupo(descricao + grupo)}
                        >
                          <TableCell></TableCell>
                          <TableCell>
                            <b>{grupo}</b> <span style={{ color: 'rgba(8, 1, 104, 0.94)' }}>({itens.length} registros)</span>
                            <span style={{ float: 'right', fontSize: 16 }}>
                              {subAbertos.includes(descricao + grupo) ? '▲' : '▼'}
                            </span>
                          </TableCell>
                          <TableCell>
                            <b>{valorGrupo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</b>
                          </TableCell>
                        </TableRow>
                        {subAbertos.includes(descricao + grupo) && itens.map((item, idx) => (
                          <TableRow key={idx}>
                            <TableCell></TableCell>
                            <TableCell>
                              <DetailContainer>
                                <div><b>Centro de Custo:</b> {item.nome_centro_custo}</div>
                                <div><b>Complemento:</b> {item.complemento}</div>
                                <div><b>Data:</b> {item.data}</div>
                              </DetailContainer>
                            </TableCell>
                            <TableCell>
                              <span style={{ fontWeight: 500 }}>
                                {item.valor_reais.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </React.Fragment>
                    );
                  })}
                </React.Fragment>
              );
            })}
          </tbody>
        </Table>
      </DashboardContainer>
    </Container>
  );
}