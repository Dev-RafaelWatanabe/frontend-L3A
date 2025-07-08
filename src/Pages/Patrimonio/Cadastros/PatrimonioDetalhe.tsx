import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Api } from '../../../Services/Api/Api';
import type { Ferramenta } from '../../../Services/Api/Types';
import { CardDetalhe } from './Styles';

export const PatrimonioDetalhe: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [ferramenta, setFerramenta] = useState<Ferramenta | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setErro(null);
    if (id) {
      Api.getFerramentaById(Number(id))
        .then(res => setFerramenta(res.data))
        .catch(() => setErro('Erro ao carregar os dados do patrimônio.'))
        .finally(() => setLoading(false));
    } else {
      setErro('ID inválido.');
      setLoading(false);
    }
  }, [id]);

  if (loading) return <div>Carregando...</div>;
  if (erro) return <div style={{ color: 'red' }}>{erro}</div>;
  if (!ferramenta) return <div>Nenhum dado encontrado.</div>;

  return (
    <CardDetalhe>
      <h2>{ferramenta.nome}</h2>
      <p><b>Marca:</b> {typeof ferramenta.marca === 'object' ? ferramenta.marca.nome : ferramenta.marca}</p>
      <p><b>Situação:</b> {typeof ferramenta.situacao === 'object' ? ferramenta.situacao.nome : ferramenta.situacao}</p>
      <p><b>Categoria:</b> {typeof ferramenta.categoria === 'object' ? ferramenta.categoria.nome : ferramenta.categoria}</p>
      <p><b>Obra:</b> {typeof ferramenta.obra === 'object' ? ferramenta.obra.nome : ferramenta.obra}</p>
      <p><b>Valor:</b> {ferramenta.valor !== undefined ? `R$ ${ferramenta.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '-'}</p>
      <p><b>Descrição:</b> {ferramenta.descricao || '-'}</p>
      <p><b>Nota Fiscal:</b> <i>(em breve)</i></p>
    </CardDetalhe>
  );
};