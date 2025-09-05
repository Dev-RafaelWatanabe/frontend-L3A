import React, { useEffect, useState } from 'react';
import { Api } from '../../../services/api/api';
import { DataTable } from '../components/data-table';
import type { Lancamento } from '../../../services/api/types';

export const Lancamentos: React.FC = () => {
  const [data, setData] = useState<Lancamento[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados para os filtros
  const [filtroFuncionario, setFiltroFuncionario] = useState('');
  const [filtroObra, setFiltroObra] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');

  const columns = [
    { 
      key: 'data_trabalho', 
      label: 'Data',
      render: (value: string) => value ? new Date(value).toLocaleDateString('pt-BR') : 'N/A'
    },
    { 
      key: 'funcionario', 
      label: 'Funcionário',
      render: (value: { nome: string } | null) => value?.nome || 'N/A'
    },
    { 
      key: 'obra', 
      label: 'Obra',
      render: (value: { nome: string } | null) => value?.nome || 'N/A'
    },
    { 
      key: 'restaurante', 
      label: 'Restaurante',
      render: (value: { nome: string } | null) => value?.nome || 'N/A'
    },
    { 
      key: 'turno', 
      label: 'Turno',
      render: (value: { nome: string } | null) => value?.nome || 'N/A'
    }
  ];

  // Função para buscar os lançamentos com filtros
  const buscarLancamentos = () => {
    setLoading(true);

    const params: Record<string, string> = {};
    if (filtroFuncionario) params.nome_funcionario = filtroFuncionario; // Ajuste para o nome correto do parâmetro
    if (filtroObra) params.nome_obra = filtroObra; // Certifique-se de que o backend espera "nome_obra"
    if (dataInicio) params.data_inicio = dataInicio;
    if (dataFim) params.data_fim = dataFim;

    Api.getLancamentos(params)
      .then(response => {
        console.log('Dados recebidos:', response.data);
        setData(response.data);
      })
      .catch(error => {
        console.error('Erro ao buscar lançamentos:', error);
      })
      .finally(() => setLoading(false));
  };

  // Busca inicial
  useEffect(() => {
    buscarLancamentos();
  }, []);

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div>
      <h1>Controle de obra</h1>

      {/* Filtros */}
      <div style={{ marginBottom: '16px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Nome do funcionário"
          value={filtroFuncionario}
          onChange={e => setFiltroFuncionario(e.target.value)}
          style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
        />
        <input
          type="text"
          placeholder="Nome da obra"
          value={filtroObra}
          onChange={e => setFiltroObra(e.target.value)}
          style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
        />
        <input
          type="date"
          placeholder="Data de início"
          value={dataInicio}
          onChange={e => setDataInicio(e.target.value)}
          style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
        />
        <input
          type="date"
          placeholder="Data de fim"
          value={dataFim}
          onChange={e => setDataFim(e.target.value)}
          style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
        />
        <button
          onClick={buscarLancamentos}
          style={{ padding: '8px 16px', backgroundColor: '#1976d2', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Filtrar
        </button>
      </div>

      {/* Tabela */}
      {data.length > 0 ? (
        <DataTable data={data} columns={columns} />
      ) : (
        <p>Nenhum lançamento encontrado.</p>
      )}
    </div>
  );
};
