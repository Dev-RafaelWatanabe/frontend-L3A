import { useState, useEffect } from 'react';
import { FaTimes, FaTrash } from 'react-icons/fa';
import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  CloseButton,
  ModalBody,
  FormField,
  ButtonGroup,
  Button,
} from './modal-styles';
import { Api } from '../../../services/api/api';
import type { Restaurante, LancamentoCreate, Funcionario, Obra, Regime } from '../../../services/api/types';

interface ObraHorarioGroup {
  obra: { id: number; nome: string };
  horario_inicio: string;
  funcionarios: { id: number; nome: string }[];
}

interface DayPlanejamentoGroup {
  data_trabalho: string;
  obras: ObraHorarioGroup[];
}

interface FuncionarioLancamento {
  funcionario_id: number;
  funcionario_nome: string;
  obra_id: number;
  obra_nome: string;
  turnos: string[];
  restaurante_id: number | null;
  regime_id: number;
}

interface PublicarPlanejamentoModalProps {
  dayGroup: DayPlanejamentoGroup;
  onClose: () => void;
  onPublish: () => void;
}

const TURNOS_DISPONIVEIS = [
  'Manhã/Tarde',
  'Manhã',
  'Tarde',
  'Noite',
  'Madrugada'
];

export function PublicarPlanejamentoModal({ dayGroup, onClose, onPublish }: PublicarPlanejamentoModalProps) {
  const [restaurantes, setRestaurantes] = useState<Restaurante[]>([]);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [obras, setObras] = useState<Obra[]>([]);
  const [regimes, setRegimes] = useState<Regime[]>([]);
  const [lancamentos, setLancamentos] = useState<FuncionarioLancamento[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carregar restaurantes, funcionários, obras, regimes e inicializar lançamentos
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [restaurantesRes, funcionariosRes, obrasRes, regimesRes] = await Promise.all([
          Api.getRestaurantes(),
          Api.getFuncionarios(),
          Api.getObras(),
          Api.getRegimes()
        ]);
        
        setRestaurantes(restaurantesRes.data);
        setFuncionarios(funcionariosRes.data);
        setObras(obrasRes.data);
        setRegimes(regimesRes.data);

        // Inicializar lançamentos a partir do planejamento
        const initialLancamentos: FuncionarioLancamento[] = [];
        dayGroup.obras.forEach((obraGroup) => {
          obraGroup.funcionarios.forEach((func) => {
            initialLancamentos.push({
              funcionario_id: func.id,
              funcionario_nome: func.nome,
              obra_id: obraGroup.obra.id,
              obra_nome: obraGroup.obra.nome,
              turnos: ['Manhã'], // Turno padrão
              restaurante_id: null,
              regime_id: 1, // Valor padrão (ID do regime "Hora")
            });
          });
        });
        setLancamentos(initialLancamentos);
      } catch (err) {
        console.error('Erro ao buscar dados:', err);
        setError('Erro ao carregar dados');
      }
    };
    fetchData();
  }, [dayGroup]);

  const handleRemoveLancamento = (index: number) => {
    setLancamentos(lancamentos.filter((_, i) => i !== index));
  };

  const handleChangeFuncionario = (index: number, funcionarioId: number) => {
    const funcionario = funcionarios.find(f => f.id === funcionarioId);
    if (funcionario) {
      const newLancamentos = [...lancamentos];
      newLancamentos[index].funcionario_id = funcionario.id;
      newLancamentos[index].funcionario_nome = funcionario.nome;
      setLancamentos(newLancamentos);
    }
  };

  const handleChangeObra = (index: number, obraId: number) => {
    const obra = obras.find(o => o.id === obraId);
    if (obra) {
      const newLancamentos = [...lancamentos];
      newLancamentos[index].obra_id = obra.id;
      newLancamentos[index].obra_nome = obra.nome;
      setLancamentos(newLancamentos);
    }
  };

  const handleChangeRegime = (index: number, regime_id: number) => {
    const newLancamentos = [...lancamentos];
    newLancamentos[index].regime_id = regime_id;
    setLancamentos(newLancamentos);
  };

  const handleToggleTurno = (index: number, turno: string) => {
    const newLancamentos = [...lancamentos];
    const currentTurnos = newLancamentos[index].turnos;

    if (turno === 'Manhã/Tarde') {
      // Se selecionou Manhã/Tarde, limpa outros turnos
      newLancamentos[index].turnos = ['Manhã/Tarde'];
    } else {
      // Remove Manhã/Tarde se existir
      const filteredTurnos = currentTurnos.filter((t) => t !== 'Manhã/Tarde');
      
      if (filteredTurnos.includes(turno)) {
        newLancamentos[index].turnos = filteredTurnos.filter((t) => t !== turno);
      } else {
        newLancamentos[index].turnos = [...filteredTurnos, turno];
      }
    }

    // Se não tem Manhã ou Manhã/Tarde, limpa o restaurante
    if (!newLancamentos[index].turnos.includes('Manhã') && !newLancamentos[index].turnos.includes('Manhã/Tarde')) {
      newLancamentos[index].restaurante_id = null;
    }

    setLancamentos(newLancamentos);
  };

  const handleChangeRestaurante = (index: number, restauranteId: number | null) => {
    const newLancamentos = [...lancamentos];
    newLancamentos[index].restaurante_id = restauranteId;
    setLancamentos(newLancamentos);
  };

  const handlePublish = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Validar que todos os lançamentos têm pelo menos um turno
      const lancamentosInvalidos = lancamentos.filter((l) => l.turnos.length === 0);
      if (lancamentosInvalidos.length > 0) {
        setError('Todos os funcionários devem ter pelo menos um turno selecionado');
        setIsLoading(false);
        return;
      }

      // Criar lançamentos
      for (const lanc of lancamentos) {
        // Se o turno é Manhã/Tarde, criar dois lançamentos
        if (lanc.turnos.includes('Manhã/Tarde')) {
          // Lançamento de Manhã (com restaurante)
          const restaurante = lanc.restaurante_id
            ? restaurantes.find((r) => r.id === lanc.restaurante_id)
            : null;

          const lancamentoManha: LancamentoCreate = {
            data_trabalho: dayGroup.data_trabalho,
            funcionario_nome: lanc.funcionario_nome,
            obra_nome: lanc.obra_nome.includes('-')
              ? lanc.obra_nome.split('-')[0].trim().substring(0, 4)
              : lanc.obra_nome.substring(0, 4),
            turno_nome: 'Manhã',
            restaurante_nome: restaurante?.nome,
            regime_id: lanc.regime_id,
          };

          await Api.createLancamento(lancamentoManha);

          // Lançamento de Tarde (sem restaurante)
          const lancamentoTarde: LancamentoCreate = {
            data_trabalho: dayGroup.data_trabalho,
            funcionario_nome: lanc.funcionario_nome,
            obra_nome: lanc.obra_nome.includes('-')
              ? lanc.obra_nome.split('-')[0].trim().substring(0, 4)
              : lanc.obra_nome.substring(0, 4),
            turno_nome: 'Tarde',
            regime_id: lanc.regime_id,
          };

          await Api.createLancamento(lancamentoTarde);
        } else {
          // Criar lançamentos individuais para cada turno
          for (const turno of lanc.turnos) {
            const restaurante =
              turno === 'Manhã' && lanc.restaurante_id
                ? restaurantes.find((r) => r.id === lanc.restaurante_id)
                : null;

            const lancamento: LancamentoCreate = {
              data_trabalho: dayGroup.data_trabalho,
              funcionario_nome: lanc.funcionario_nome,
              obra_nome: lanc.obra_nome.includes('-')
                ? lanc.obra_nome.split('-')[0].trim().substring(0, 4)
                : lanc.obra_nome.substring(0, 4),
              turno_nome: turno,
              restaurante_nome: restaurante?.nome,
              regime_id: lanc.regime_id,
            };

            await Api.createLancamento(lancamento);
          }
        }
      }

      alert('Planejamento publicado com sucesso!');
      onPublish();
      onClose();
    } catch (err: any) {
      console.error('Erro ao publicar planejamento:', err);
      setError(err.response?.data?.detail || 'Erro ao publicar planejamento');
    } finally {
      setIsLoading(false);
    }
  };

  const temTurnoManha = (turnos: string[]) => {
    return turnos.includes('Manhã') || turnos.includes('Manhã/Tarde');
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e: React.MouseEvent) => e.stopPropagation()} style={{ maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto' }}>
        <ModalHeader>
          <h2>Publicar Planejamento - {new Date(dayGroup.data_trabalho + 'T00:00:00').toLocaleDateString('pt-BR')}</h2>
          <CloseButton onClick={onClose}>
            <FaTimes />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          {error && <div style={{ color: 'red', marginBottom: '1rem', padding: '0.5rem', background: '#fee', borderRadius: '4px' }}>{error}</div>}

          <p style={{ marginBottom: '1rem', color: '#666' }}>
            Revise e ajuste os lançamentos antes de publicar. Você pode remover funcionários, alterar turnos e definir restaurantes.
          </p>

          {lancamentos.map((lanc, index) => (
            <div
              key={index}
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '1rem',
                marginBottom: '1rem',
                background: '#f9f9f9',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div style={{ flex: 1 }}>
                  {/* Dropdown de Funcionário */}
                  <FormField>
                    <label style={{ fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>Funcionário:</label>
                    <select
                      value={lanc.funcionario_id}
                      onChange={(e) => handleChangeFuncionario(index, Number(e.target.value))}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        background: '#fff',
                      }}
                    >
                      {funcionarios.map((func) => (
                        <option key={func.id} value={func.id}>
                          {func.nome}
                        </option>
                      ))}
                    </select>
                  </FormField>

                  {/* Dropdown de Obra */}
                  <FormField style={{ marginTop: '0.5rem' }}>
                    <label style={{ fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>Obra:</label>
                    <select
                      value={lanc.obra_id}
                      onChange={(e) => handleChangeObra(index, Number(e.target.value))}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        background: '#fff',
                      }}
                    >
                      {obras.map((obra) => (
                        <option key={obra.id} value={obra.id}>
                          {obra.nome}
                        </option>
                      ))}
                    </select>
                  </FormField>
                </div>
                
                <button
                  onClick={() => handleRemoveLancamento(index)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'red',
                    cursor: 'pointer',
                    fontSize: '1.2rem',
                    marginLeft: '1rem',
                  }}
                  title="Remover funcionário"
                >
                  <FaTrash />
                </button>
              </div>

              <FormField>
                <label style={{ fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>Turnos:</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {TURNOS_DISPONIVEIS.map((turno) => (
                    <label
                      key={turno}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0.5rem',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        background: lanc.turnos.includes(turno) ? '#080168' : '#fff',
                        color: lanc.turnos.includes(turno) ? '#fff' : '#333',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={lanc.turnos.includes(turno)}
                        onChange={() => handleToggleTurno(index, turno)}
                        style={{ marginRight: '0.5rem' }}
                      />
                      {turno}
                    </label>
                  ))}
                </div>
              </FormField>

              {temTurnoManha(lanc.turnos) && (
                <FormField style={{ marginTop: '0.75rem' }}>
                  <label style={{ fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>
                    Restaurante (apenas para turno da Manhã):
                  </label>
                  <select
                    value={lanc.restaurante_id || ''}
                    onChange={(e) => handleChangeRestaurante(index, e.target.value ? Number(e.target.value) : null)}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      background: '#fff',
                    }}
                  >
                    <option value="">Sem restaurante</option>
                    {restaurantes.map((rest) => (
                      <option key={rest.id} value={rest.id}>
                        {rest.nome}
                      </option>
                    ))}
                  </select>
                </FormField>
              )}

              {/* Campo de Regime */}
              <FormField style={{ marginTop: '0.75rem' }}>
                <label style={{ fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>
                  Regime:
                </label>
                <select
                  value={lanc.regime_id}
                  onChange={(e) => handleChangeRegime(index, Number(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    background: '#fff',
                  }}
                >
                  {regimes.map((regime) => (
                    <option key={regime.id} value={regime.id}>
                      {regime.nome}
                    </option>
                  ))}
                </select>
              </FormField>
            </div>
          ))}

          {lancamentos.length === 0 && (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>
              Nenhum funcionário para lançar. Adicione funcionários ao planejamento.
            </div>
          )}

          <ButtonGroup style={{ marginTop: '1.5rem' }}>
            <Button
              onClick={handlePublish}
              disabled={isLoading || lancamentos.length === 0}
              style={{
                background: lancamentos.length === 0 ? '#ccc' : '#080168',
                cursor: lancamentos.length === 0 ? 'not-allowed' : 'pointer',
              }}
            >
              {isLoading ? 'Publicando...' : 'Lançar Planejamento'}
            </Button>
            <Button onClick={onClose} style={{ background: '#999' }}>
              Cancelar
            </Button>
          </ButtonGroup>
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
}
