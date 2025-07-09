import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CiEdit } from "react-icons/ci";
import { Api } from '../../../Services/Api/Api';
import type { Ferramenta, Marca, Categoria, Situacao, Obra } from '../../../Services/Api/Types';
import {
  CardDetalhe,
  DetalhesContainer,
  BotaoEditar,
  ContainerBotoes,
  BotaoSalvar,
  BotaoCancelar,
  FormContainer,
  CampoContainer,
  Label,
  Input,
  Select,
  TextArea,
  VisualizacaoContainer,
  Campo,
  ErroMensagem,
  LoadingContainer
} from './Styles';

export const PatrimonioDetalhe: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [ferramenta, setFerramenta] = useState<Ferramenta | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Estados para os dados de edição
  const [editData, setEditData] = useState({
    nome: '',
    descricao: '',
    valor: 0,
    marca_id: '',
    categoria_id: '',
    obra_id: '',
    situacao_id: ''
  });
  
  // Estados para os dados de seleção
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [obras, setObras] = useState<Obra[]>([]);
  const [situacoes, setSituacoes] = useState<Situacao[]>([]);

  useEffect(() => {
    const fetchFerramentaDetails = async () => {
      setLoading(true);
      setErro(null);
      
      if (!id) {
        setErro('ID inválido.');
        setLoading(false);
        return;
      }

      try {
        // Busca todas as ferramentas usando o endpoint GET /ferramentas/
        const response = await Api.getFerramentas();
        const ferramentas = response.data || [];
        
        // Filtra a ferramenta específica pelo ID
        const ferramentaEncontrada = ferramentas.find(
          (item: Ferramenta) => item.id === Number(id)
        );

        if (ferramentaEncontrada) {
          setFerramenta(ferramentaEncontrada);
          
          // Inicializa os dados de edição
          setEditData({
            nome: ferramentaEncontrada.nome,
            descricao: ferramentaEncontrada.descricao || '',
            valor: ferramentaEncontrada.valor,
            marca_id: typeof ferramentaEncontrada.marca === 'object' ? ferramentaEncontrada.marca.id.toString() : '',
            categoria_id: typeof ferramentaEncontrada.categoria === 'object' ? ferramentaEncontrada.categoria.id.toString() : '',
            obra_id: typeof ferramentaEncontrada.obra === 'object' ? ferramentaEncontrada.obra.id.toString() : '',
            situacao_id: typeof ferramentaEncontrada.situacao === 'object' ? ferramentaEncontrada.situacao.id.toString() : ''
          });
        } else {
          setErro('Ferramenta não encontrada.');
        }
      } catch (error) {
        console.error('Erro ao buscar dados da ferramenta:', error);
        setErro('Erro ao carregar dados da ferramenta. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    const fetchSelectData = async () => {
      try {
        const [marcasRes, categoriasRes, obrasRes, situacoesRes] = await Promise.all([
          Api.getMarcas(),
          Api.getCategorias(),
          Api.getObras(),
          Api.getSituacoes()
        ]);
        
        setMarcas(marcasRes.data || []);
        setCategorias(categoriasRes.data || []);
        setObras(obrasRes.data || []);
        setSituacoes(situacoesRes.data || []);
      } catch (error) {
        console.error('Erro ao carregar dados de seleção:', error);
      }
    };

    fetchFerramentaDetails();
    fetchSelectData();
  }, [id]);

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditMode(false);
    if (ferramenta) {
      // Restaura os dados originais
      setEditData({
        nome: ferramenta.nome,
        descricao: ferramenta.descricao || '',
        valor: ferramenta.valor,
        marca_id: typeof ferramenta.marca === 'object' ? ferramenta.marca.id.toString() : '',
        categoria_id: typeof ferramenta.categoria === 'object' ? ferramenta.categoria.id.toString() : '',
        obra_id: typeof ferramenta.obra === 'object' ? ferramenta.obra.id.toString() : '',
        situacao_id: typeof ferramenta.situacao === 'object' ? ferramenta.situacao.id.toString() : ''
      });
    }
  };

  const handleSave = async () => {
    if (!ferramenta) return;
    
    setSaving(true);
    
    try {
      // Prepara o payload conforme esperado pelo backend
      const payload = {
        nome: editData.nome.trim(),
        obra_id: Number(editData.obra_id),
        situacao_id: Number(editData.situacao_id),
        valor: Number(editData.valor)
      };

      console.log('Payload enviado para API:', payload);

      // Faz a requisição PUT com o ID da ferramenta
      await Api.updateFerramenta(ferramenta.id, payload);
      
      // Busca os objetos atualizados para atualizar a visualização local
      const obraSelecionada = obras.find(o => o.id === Number(editData.obra_id));
      const situacaoSelecionada = situacoes.find(s => s.id === Number(editData.situacao_id));
      
      // Atualiza os dados locais
      const ferramentaAtualizada = {
        ...ferramenta,
        nome: editData.nome,
        valor: Number(editData.valor),
        obra: obraSelecionada || ferramenta.obra,
        situacao: situacaoSelecionada || ferramenta.situacao
      };
      
      setFerramenta(ferramentaAtualizada);
      setEditMode(false);
      setErro(null);
      
      alert('Ferramenta atualizada com sucesso!');
      
    } catch (error) {
      console.error('Erro ao atualizar ferramenta:', error);
      setErro('Erro ao atualizar ferramenta. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) return <LoadingContainer>Carregando...</LoadingContainer>;
  if (erro) return <ErroMensagem>{erro}</ErroMensagem>;
  if (!ferramenta) return <LoadingContainer>Nenhum dado encontrado.</LoadingContainer>;

  // Função para extrair o nome de campos que podem ser objetos ou strings
  const getNome = (campo: any): string => {
    if (typeof campo === 'object' && campo !== null) {
      return campo.nome || '-';
    }
    return campo || '-';
  };

  // Função para formatar valor monetário
  const formatarValor = (valor: number | undefined): string => {
    if (valor === undefined || valor === null) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(valor);
  };

  return (
    <CardDetalhe>
      <DetalhesContainer>
        <h2>Detalhes da Ferramenta</h2>
        {!editMode ? (
          <BotaoEditar onClick={handleEdit}>
            <CiEdit />
            Editar
          </BotaoEditar>
        ) : (
          <ContainerBotoes>
            <BotaoSalvar 
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'Salvando...' : 'Salvar'}
            </BotaoSalvar>
            <BotaoCancelar 
              onClick={handleCancel}
              disabled={saving}
            >
              Cancelar
            </BotaoCancelar>
          </ContainerBotoes>
        )}
      </DetalhesContainer>

      {editMode ? (
        <FormContainer>
          <CampoContainer>
            <Label>Nome:</Label>
            <Input
              type="text"
              value={editData.nome}
              onChange={(e) => handleInputChange('nome', e.target.value)}
            />
          </CampoContainer>
          
          <CampoContainer>
            <Label>Marca:</Label>
            <Select
              value={editData.marca_id}
              onChange={(e) => handleInputChange('marca_id', e.target.value)}
            >
              <option value="">Selecione uma marca</option>
              {marcas.map(marca => (
                <option key={marca.id} value={marca.id}>{marca.nome}</option>
              ))}
            </Select>
          </CampoContainer>

          <CampoContainer>
            <Label>Situação:</Label>
            <Select
              value={editData.situacao_id}
              onChange={(e) => handleInputChange('situacao_id', e.target.value)}
            >
              <option value="">Selecione uma situação</option>
              {situacoes.map(situacao => (
                <option key={situacao.id} value={situacao.id}>{situacao.nome}</option>
              ))}
            </Select>
          </CampoContainer>

          <CampoContainer>
            <Label>Categoria:</Label>
            <Select
              value={editData.categoria_id}
              onChange={(e) => handleInputChange('categoria_id', e.target.value)}
            >
              <option value="">Selecione uma categoria</option>
              {categorias.map(categoria => (
                <option key={categoria.id} value={categoria.id}>{categoria.nome}</option>
              ))}
            </Select>
          </CampoContainer>

          <CampoContainer>
            <Label>Obra:</Label>
            <Select
              value={editData.obra_id}
              onChange={(e) => handleInputChange('obra_id', e.target.value)}
            >
              <option value="">Selecione uma obra</option>
              {obras.map(obra => (
                <option key={obra.id} value={obra.id}>{obra.nome}</option>
              ))}
            </Select>
          </CampoContainer>

          <CampoContainer>
            <Label>Valor:</Label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={editData.valor}
              onChange={(e) => handleInputChange('valor', Number(e.target.value))}
            />
          </CampoContainer>

          <CampoContainer>
            <Label>Descrição:</Label>
            <TextArea
              value={editData.descricao}
              onChange={(e) => handleInputChange('descricao', e.target.value)}
              rows={3}
            />
          </CampoContainer>
        </FormContainer>
      ) : (
        <VisualizacaoContainer>
          <Campo><b>Nome:</b> {ferramenta.nome}</Campo>
          <Campo><b>Marca:</b> {getNome(ferramenta.marca)}</Campo>
          <Campo><b>Situação:</b> {getNome(ferramenta.situacao)}</Campo>
          <Campo><b>Categoria:</b> {getNome(ferramenta.categoria)}</Campo>
          <Campo><b>Obra:</b> {getNome(ferramenta.obra)}</Campo>
          <Campo><b>Valor:</b> {formatarValor(ferramenta.valor)}</Campo>
          <Campo><b>Descrição:</b> {ferramenta.descricao || '-'}</Campo>
        </VisualizacaoContainer>
      )}
    </CardDetalhe>
  );
};