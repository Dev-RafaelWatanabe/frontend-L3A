import { useEffect, useState } from 'react';
import { Api } from '../../../Services/Api/Api';
import { ManutencaoDataTable } from './manutencao-data-table';
import { CriarManutencaoModal } from './criar-manutencao-modal';
import * as S from './styles';

export const ManutencaoPatrimonio: React.FC = () => {
  const [manutencoes, setManutencoes] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);

  useEffect(() => {
    buscarManutencoes();
  }, []);

  const buscarManutencoes = async () => {
    const resp = await Api.getManutencoes();
    setManutencoes(resp.data);
  };

  const handleNovaManutencao = async (dados: any) => {
    await Api.createManutencao(dados);
    buscarManutencoes();
    setModalAberto(false);
  };

  return (
    <S.Container>
      <S.Header>
        <S.Title>Manutenções de Patrimônio</S.Title>
        <S.Button onClick={() => setModalAberto(true)}>Nova Manutenção</S.Button>
      </S.Header>
      <ManutencaoDataTable manutencoes={manutencoes} />
      {modalAberto && (
        <CriarManutencaoModal
          onClose={() => setModalAberto(false)}
          onSubmit={handleNovaManutencao}
        />
      )}
    </S.Container>
  );
};

