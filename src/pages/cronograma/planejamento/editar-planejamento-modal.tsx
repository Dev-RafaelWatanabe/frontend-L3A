import { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  CloseButton,
  ModalBody,
  FormField,
  ButtonGroup,
  Button,
  SearchInput,
} from './modal-styles';
import { Api } from '../../../services/api/api';
import type { Funcionario, Obra } from '../../../services/api/types';

interface ObraHorarioGroup {
  obra: { id: number; nome: string };
  horario_inicio: string;
  funcionarios: { id: number; nome: string }[];
}

interface DayPlanejamentoGroup {
  data_trabalho: string;
  obras: ObraHorarioGroup[];
}

interface EditarPlanejamentoModalProps {
  dayGroup: DayPlanejamentoGroup;
  onClose: () => void;
  onSave: () => void;
}

export function EditarPlanejamentoModal({ dayGroup, onClose, onSave }: EditarPlanejamentoModalProps) {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [obras, setObras] = useState<Obra[]>([]);
  const [editedGroups, setEditedGroups] = useState<ObraHorarioGroup[]>(JSON.parse(JSON.stringify(dayGroup.obras)));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estados para adicionar nova obra
  const [showAddObra, setShowAddObra] = useState(false);
  const [newObraId, setNewObraId] = useState<number | null>(null);
  const [newHorario, setNewHorario] = useState('07:00');
  const [newFuncionarios, setNewFuncionarios] = useState<number[]>([]);
  const [obraSearch, setObraSearch] = useState('');
  const [funcionarioSearch, setFuncionarioSearch] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [funcionariosRes, obrasRes] = await Promise.all([
          Api.getFuncionarios(),
          Api.getObras(),
        ]);
        // Filtrar apenas funcionários ativos
        const funcionariosAtivos = funcionariosRes.data.filter((f: any) => f.ativo === true);
        setFuncionarios(funcionariosAtivos);
        setObras(obrasRes.data);
      } catch (err) {
        console.error('Erro ao buscar dados:', err);
        setError('Erro ao carregar dados');
      }
    };
    fetchData();
  }, []);  const handleRemoveFuncionario = (obraIndex: number, funcionarioId: number) => {
    const newGroups = [...editedGroups];
    newGroups[obraIndex].funcionarios = newGroups[obraIndex].funcionarios.filter(
      (f) => f.id !== funcionarioId
    );
    // Se não sobrou nenhum funcionário, remove a obra também
    if (newGroups[obraIndex].funcionarios.length === 0) {
      newGroups.splice(obraIndex, 1);
    }
    setEditedGroups(newGroups);
  };

  const handleAddFuncionarioToObra = (obraIndex: number, funcionarioId: number) => {
    const funcionario = funcionarios.find((f) => f.id === funcionarioId);
    if (!funcionario) return;

    const newGroups = [...editedGroups];
    // Verificar se o funcionário já está na obra
    if (!newGroups[obraIndex].funcionarios.find((f) => f.id === funcionarioId)) {
      newGroups[obraIndex].funcionarios.push(funcionario);
      setEditedGroups(newGroups);
    }
  };

  const handleUpdateHorario = (obraIndex: number, newHorario: string) => {
    const newGroups = [...editedGroups];
    newGroups[obraIndex].horario_inicio = newHorario;
    setEditedGroups(newGroups);
  };

  const handleAddNovaObra = () => {
    if (!newObraId || newFuncionarios.length === 0) {
      setError('Selecione uma obra e pelo menos um funcionário');
      return;
    }

    const obra = obras.find((o) => o.id === newObraId);
    if (!obra) return;

    const funcionariosSelecionados = funcionarios.filter((f) =>
      newFuncionarios.includes(f.id)
    );

    const newGroup: ObraHorarioGroup = {
      obra: { id: obra.id, nome: obra.nome },
      horario_inicio: newHorario,
      funcionarios: funcionariosSelecionados,
    };

    setEditedGroups([...editedGroups, newGroup]);
    setShowAddObra(false);
    setNewObraId(null);
    setNewHorario('07:00');
    setNewFuncionarios([]);
    setObraSearch('');
    setFuncionarioSearch('');
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Aqui você pode implementar a lógica de salvar as alterações
      // Por exemplo, deletar os planejamentos antigos e criar novos
      alert('Funcionalidade de salvar edições será implementada');
      onSave();
      onClose();
    } catch (err: any) {
      console.error('Erro ao salvar alterações:', err);
      setError(err.response?.data?.detail || 'Erro ao salvar alterações');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredObras = obras.filter((obra) =>
    obra.nome.toLowerCase().includes(obraSearch.toLowerCase())
  );

  const filteredFuncionarios = funcionarios.filter((func) =>
    func.nome.toLowerCase().includes(funcionarioSearch.toLowerCase())
  );

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <h2>Editar Planejamento - {new Date(dayGroup.data_trabalho + 'T00:00:00').toLocaleDateString('pt-BR')}</h2>
          <CloseButton onClick={onClose}>
            <FaTimes />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

          {editedGroups.map((group, obraIndex) => (
            <div
              key={obraIndex}
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '1rem',
                marginBottom: '1rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{group.obra.nome}</h3>
                <input
                  type="time"
                  value={group.horario_inicio}
                  onChange={(e) => handleUpdateHorario(obraIndex, e.target.value)}
                  style={{
                    padding: '0.25rem 0.5rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                  }}
                />
              </div>

              <div style={{ marginBottom: '0.5rem' }}>
                <strong>Funcionários:</strong>
                {group.funcionarios.map((func) => (
                  <div
                    key={func.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.25rem',
                      borderBottom: '1px solid #f0f0f0',
                    }}
                  >
                    <span>{func.nome}</span>
                    <button
                      onClick={() => handleRemoveFuncionario(obraIndex, func.id)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'red',
                        cursor: 'pointer',
                        padding: '0.25rem 0.5rem',
                      }}
                    >
                      Remover
                    </button>
                  </div>
                ))}
              </div>

              <div>
                <SearchInput
                  placeholder="Adicionar funcionário..."
                  value=""
                  onChange={(e) => {
                    const funcionarioId = parseInt(e.target.value);
                    if (funcionarioId) {
                      handleAddFuncionarioToObra(obraIndex, funcionarioId);
                    }
                  }}
                  list={`funcionarios-${obraIndex}`}
                />
                <datalist id={`funcionarios-${obraIndex}`}>
                  {funcionarios.map((func) => (
                    <option key={func.id} value={func.id}>
                      {func.nome}
                    </option>
                  ))}
                </datalist>
              </div>
            </div>
          ))}

          {!showAddObra ? (
            <Button onClick={() => setShowAddObra(true)} style={{ width: '100%', marginBottom: '1rem' }}>
              + Adicionar Nova Obra
            </Button>
          ) : (
            <div style={{ border: '2px dashed #ddd', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
              <h4>Nova Obra</h4>
              <FormField>
                <label>Obra:</label>
                <SearchInput
                  placeholder="Buscar obra..."
                  value={obraSearch}
                  onChange={(e) => setObraSearch(e.target.value)}
                  list="obras-list"
                />
                <datalist id="obras-list">
                  {filteredObras.map((obra) => (
                    <option key={obra.id} value={obra.nome} onClick={() => setNewObraId(obra.id)} />
                  ))}
                </datalist>
              </FormField>

              <FormField>
                <label>Horário:</label>
                <input
                  type="time"
                  value={newHorario}
                  onChange={(e) => setNewHorario(e.target.value)}
                  style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }}
                />
              </FormField>

              <FormField>
                <label>Funcionários:</label>
                {filteredFuncionarios.map((func) => (
                  <div key={func.id}>
                    <input
                      type="checkbox"
                      id={`new-func-${func.id}`}
                      checked={newFuncionarios.includes(func.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setNewFuncionarios([...newFuncionarios, func.id]);
                        } else {
                          setNewFuncionarios(newFuncionarios.filter((id) => id !== func.id));
                        }
                      }}
                    />
                    <label htmlFor={`new-func-${func.id}`} style={{ marginLeft: '0.5rem' }}>
                      {func.nome}
                    </label>
                  </div>
                ))}
              </FormField>

              <ButtonGroup>
                <Button onClick={handleAddNovaObra}>Adicionar</Button>
                <Button onClick={() => setShowAddObra(false)}>Cancelar</Button>
              </ButtonGroup>
            </div>
          )}

          <ButtonGroup>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
            <Button onClick={onClose}>Cancelar</Button>
          </ButtonGroup>
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
}
