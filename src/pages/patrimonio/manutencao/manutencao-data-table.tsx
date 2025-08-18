import * as S from './styles';

export const ManutencaoDataTable: React.FC<{ manutencoes: any[] }> = ({ manutencoes }) => (
  <S.Table>
    <thead>
      <tr>
        <th>Patrimônio</th>
        <th>Descrição</th>
        <th>Data de Início</th>
      </tr>
    </thead>
    <tbody>
      {manutencoes.map((m) => (
        <tr key={m.id}>
          <td>{m.ferramenta_nome}</td>
          <td>{m.descricao_servico}</td>
          <td>{m.data_inicio}</td>
        </tr>
      ))}
    </tbody>
  </S.Table>
);

