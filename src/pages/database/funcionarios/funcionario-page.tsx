import React, { useEffect, useState } from 'react';
import { FaEdit, FaToggleOn, FaToggleOff, FaPlus } from 'react-icons/fa';
import { Api } from '../../../services/api/api';
import type { Funcionario } from '../../../services/api/types';
import {
  Container,
  Header,
  ButtonGroup,
  AddButton,
  Table,
  TableHeader,
  TableRow,
  TableCell,
  ActionButton,
  StatusBadge,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormField,
  Label,
  Input,
  Select,
  Checkbox,
  CheckboxLabel,
  Button,
  CancelButton
} from './styles';

interface FuncionarioFormData {
  nome: string;
  gestor: boolean;
  tipo_contrato: 'L3A' | 'TERCEIRO';
  tipos_empregabilidade_nome: string[];
}

export const Funcionarios: React.FC = () => {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<FuncionarioFormData>({
    nome: '',
    gestor: false,
    tipo_contrato: 'L3A',
    tipos_empregabilidade_nome: []
  });

  // Tipos de empregabilidade disponíveis
  const tiposEmpregabilidade = ['CLT', 'PJ', 'Autônomo', 'Estagiário'];

  useEffect(() => {
    loadFuncionarios();
  }, []);

  const loadFuncionarios = async () => {
    setLoading(true);
    try {
      const response = await Api.getFuncionarios();
      // Filtrar apenas funcionários ativos
      const funcionariosAtivos = response.data.filter((f: Funcionario) => f.ativo === true);
      setFuncionarios(funcionariosAtivos);
    } catch (error) {
      console.error('Erro ao carregar funcionários:', error);
      alert('Erro ao carregar funcionários');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (funcionario?: Funcionario) => {
    if (funcionario) {
      // Modo edição
      setEditingId(funcionario.id);
      setFormData({
        nome: funcionario.nome,
        gestor: funcionario.gestor || false,
        tipo_contrato: funcionario.tipo_contrato || 'L3A',
        tipos_empregabilidade_nome: funcionario.tipos_empregabilidade?.map((t: any) => t.nome || t) || []
      });
    } else {
      // Modo criação
      setEditingId(null);
      setFormData({
        nome: '',
        gestor: false,
        tipo_contrato: 'L3A',
        tipos_empregabilidade_nome: []
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({
      nome: '',
      gestor: false,
      tipo_contrato: 'L3A',
      tipos_empregabilidade_nome: []
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nome.trim()) {
      alert('Nome é obrigatório');
      return;
    }

    if (formData.tipos_empregabilidade_nome.length === 0) {
      alert('Selecione pelo menos um tipo de empregabilidade');
      return;
    }

    try {
      if (editingId) {
        // Editar funcionário existente
        await Api.updateFuncionario(editingId, formData);
        alert('Funcionário atualizado com sucesso!');
      } else {
        // Criar novo funcionário (sempre ativo)
        await Api.createFuncionario({
          ...formData,
          ativo: true // Novo funcionário sempre ativo
        });
        alert('Funcionário criado com sucesso!');
      }
      handleCloseModal();
      loadFuncionarios();
    } catch (error: any) {
      console.error('Erro ao salvar funcionário:', error);
      alert(error.response?.data?.detail || 'Erro ao salvar funcionário');
    }
  };

  const handleToggleAtivo = async (id: number, ativoAtual: boolean) => {
    const acao = ativoAtual ? 'desativar' : 'reativar';
    if (!confirm(`Deseja ${acao} este funcionário?`)) return;

    try {
      await Api.ativarDesativarFuncionario(id, !ativoAtual);
      alert(`Funcionário ${acao === 'desativar' ? 'desativado' : 'reativado'} com sucesso!`);
      loadFuncionarios();
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      alert('Erro ao alterar status do funcionário');
    }
  };

  const handleTipoEmpregabilidadeChange = (tipo: string) => {
    setFormData(prev => ({
      ...prev,
      tipos_empregabilidade_nome: prev.tipos_empregabilidade_nome.includes(tipo)
        ? prev.tipos_empregabilidade_nome.filter(t => t !== tipo)
        : [...prev.tipos_empregabilidade_nome, tipo]
    }));
  };

  if (loading) {
    return <Container><div>Carregando...</div></Container>;
  }

  return (
    <Container>
      <Header>
        <h1>Gerenciar Funcionários</h1>
        <ButtonGroup>
          <AddButton onClick={() => handleOpenModal()}>
            <FaPlus /> Novo Funcionário
          </AddButton>
        </ButtonGroup>
      </Header>

      <Table>
        <thead>
          <TableHeader>
            <th>ID</th>
            <th>Nome</th>
            <th>Equipe</th>
            <th>Tipo Contratação</th>
            <th>Status</th>
            <th>Ações</th>
          </TableHeader>
        </thead>
        <tbody>
          {funcionarios.map(funcionario => (
            <TableRow key={funcionario.id}>
              <TableCell>{funcionario.id}</TableCell>
              <TableCell>{funcionario.nome}</TableCell>
              <TableCell>
                <StatusBadge $variant={funcionario.tipo_contrato === 'L3A' ? 'success' : 'warning'}>
                  {funcionario.tipo_contrato || 'L3A'}
                </StatusBadge>
              </TableCell>
              <TableCell>
                {funcionario.tipos_empregabilidade?.map((t: any) => t.nome || t).join(', ') || '-'}
              </TableCell>
              <TableCell>
                <StatusBadge $variant={funcionario.ativo ? 'success' : 'danger'}>
                  {funcionario.ativo ? 'Ativo' : 'Inativo'}
                </StatusBadge>
              </TableCell>
              <TableCell>
                <ActionButton 
                  $variant="primary" 
                  onClick={() => handleOpenModal(funcionario)}
                  title="Editar"
                >
                  <FaEdit />
                </ActionButton>
                <ActionButton 
                  $variant={funcionario.ativo ? 'danger' : 'success'}
                  onClick={() => handleToggleAtivo(funcionario.id, funcionario.ativo)}
                  title={funcionario.ativo ? 'Desativar' : 'Reativar'}
                >
                  {funcionario.ativo ? <FaToggleOff /> : <FaToggleOn />}
                </ActionButton>
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>

      {funcionarios.length === 0 && (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
          Nenhum funcionário ativo encontrado.
        </div>
      )}

      {/* Modal de Cadastro/Edição */}
      {showModal && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <h2>{editingId ? 'Editar Funcionário' : 'Novo Funcionário'}</h2>
            </ModalHeader>
            <Form onSubmit={handleSubmit}>
              <ModalBody>
                <FormField>
                  <Label htmlFor="nome">Nome *</Label>
                  <Input
                    id="nome"
                    type="text"
                    value={formData.nome}
                    onChange={e => setFormData({ ...formData, nome: e.target.value })}
                    placeholder="Digite o nome do funcionário"
                    required
                  />
                </FormField>

                <FormField>
                  <Label htmlFor="tipo_contrato">Equipe *</Label>
                  <Select
                    id="tipo_contrato"
                    value={formData.tipo_contrato}
                    onChange={e => setFormData({ ...formData, tipo_contrato: e.target.value as 'L3A' | 'TERCEIRO' })}
                  >
                    <option value="L3A">L3A (Interno)</option>
                    <option value="TERCEIRO">Terceirizado</option>
                  </Select>
                </FormField>

                <FormField>
                  <CheckboxLabel>
                    <Checkbox
                      type="checkbox"
                      checked={formData.gestor}
                      onChange={e => setFormData({ ...formData, gestor: e.target.checked })}
                    />
                    <span>Este funcionário é gestor de obra</span>
                  </CheckboxLabel>
                </FormField>

                <FormField>
                  <Label>Tipo de Contratação *</Label>
                  {tiposEmpregabilidade.map(tipo => (
                    <CheckboxLabel key={tipo}>
                      <Checkbox
                        type="checkbox"
                        checked={formData.tipos_empregabilidade_nome.includes(tipo)}
                        onChange={() => handleTipoEmpregabilidadeChange(tipo)}
                      />
                      <span>{tipo}</span>
                    </CheckboxLabel>
                  ))}
                </FormField>
              </ModalBody>

              <ModalFooter>
                <CancelButton type="button" onClick={handleCloseModal}>
                  Cancelar
                </CancelButton>
                <Button type="submit">
                  {editingId ? 'Salvar Alterações' : 'Criar Funcionário'}
                </Button>
              </ModalFooter>
            </Form>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};
