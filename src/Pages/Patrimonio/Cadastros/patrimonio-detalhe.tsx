import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CiEdit } from "react-icons/ci";
import { Api } from '../../../Services/Api/Api';
import type { Ferramenta, Marca, Categoria, Situacao, Obra, Alocacao } from '../../../Services/Api/Types';
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
} from './styles';
import { HistoricoTableContainer, HistoricoTable, HistoricoTh, HistoricoTd } from './historico-styles'; // novo import

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
  const [historico, setHistorico] = useState<Alocacao[]>([]);
  const [loadingHistorico, setLoadingHistorico] = useState(false);

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

    const fetchHistorico = async () => {
      if (!id) return;
      setLoadingHistorico(true);
      try {
        const response = await Api.getAlocacaoHistoricoPorFerramenta(Number(id));
        setHistorico(response.data || []);
      } catch (error) {
        setHistorico([]);
        console.error('Erro ao buscar histórico de alocações:', error);
      } finally {
        setLoadingHistorico(false);
      }
    };

    fetchFerramentaDetails();
    fetchSelectData();
    fetchHistorico();
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
    setErro(null);
    
    let payload: any = null; // Declare payload no escopo da função
    
    try {
      // 1. Validações mais robustas
      if (!editData.nome?.trim()) {
        setErro('Nome é obrigatório.');
        return;
      }

      if (!editData.obra_id || editData.obra_id === '') {
        setErro('Obra é obrigatória.');
        return;
      }

      if (!editData.situacao_id || editData.situacao_id === '') {
        setErro('Situação é obrigatória.');
        return;
      }

      // 2. Validação se os IDs existem nos arrays
      const obraSelecionada = obras.find(o => o.id === Number(editData.obra_id));
      const situacaoSelecionada = situacoes.find(s => s.id === Number(editData.situacao_id));

      if (!obraSelecionada) {
        setErro(`Obra com ID ${editData.obra_id} não encontrada.`);
        return;
      }

      if (!situacaoSelecionada) {
        setErro(`Situação com ID ${editData.situacao_id} não encontrada.`);
        return;
      }

      // 3. Prepara o payload - testando diferentes formatos
      payload = {
        nome: editData.nome.trim(),
        obra_id: Number(editData.obra_id),
        situacao_id: Number(editData.situacao_id),
        valor: Number(editData.valor) || 0
      };

      console.log('🔧 Debug completo antes do envio:', {
        ferramentaId: ferramenta.id,
        payloadEnviado: payload,
        dadosOriginais: {
          nome: ferramenta.nome,
          obra: ferramenta.obra,
          situacao: ferramenta.situacao,
          valor: ferramenta.valor
        },
        dadosEditados: editData,
        obraSelecionada,
        situacaoSelecionada
      });

      // 4. Teste se a API existe
      if (!Api.updateFerramenta) {
        throw new Error('Método Api.updateFerramenta não existe');
      }

      console.log('🚀 Iniciando requisição PUT...');
      
      // 5. Faz a requisição PUT
      const response = await Api.updateFerramenta(ferramenta.id, payload);
      
      console.log('✅ Resposta da API:', response);
      
      // 6. Atualiza os dados locais
      const ferramentaAtualizada = {
        ...ferramenta,
        nome: editData.nome.trim(),
        valor: Number(editData.valor) || 0,
        obra: obraSelecionada,
        situacao: situacaoSelecionada
      };
      
      setFerramenta(ferramentaAtualizada);
      setEditMode(false);
      setErro(null);
      
      alert('Ferramenta atualizada com sucesso!');
      
      // 7. Atualiza a página após sucesso
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } catch (error: any) {
      console.error('❌ Erro completo ao atualizar ferramenta:', error);
      
      // Debug detalhado do erro
      let errorMessage = 'Erro desconhecido ao atualizar ferramenta.';
      
      if (error.response) {
        // Erro da API (4xx, 5xx)
        console.error('🔍 Detalhes do erro da API:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data,
          headers: error.response.headers,
          config: {
            url: error.response.config?.url,
            method: error.response.config?.method,
            data: error.response.config?.data
          }
        });
        
        switch (error.response.status) {
          case 400:
            errorMessage = `Erro 400 - Dados inválidos: ${JSON.stringify(error.response.data)}`;
            break;
          case 401:
            errorMessage = 'Erro 401 - Não autorizado. Verifique suas credenciais.';
            break;
          case 403:
            errorMessage = 'Erro 403 - Acesso negado. Você não tem permissão para esta operação.';
            break;
          case 404:
            errorMessage = `Erro 404 - Ferramenta com ID ${ferramenta.id} não encontrada.`;
            break;
          case 422:
            errorMessage = `Erro 422 - Dados de validação: ${JSON.stringify(error.response.data)}`;
            break;
          case 500:
            errorMessage = `Erro 500 - Erro interno do servidor: ${error.response.data?.detail || error.response.data?.message || 'Erro interno'}`;
            break;
          default:
            errorMessage = `Erro ${error.response.status}: ${error.response.data?.detail || error.response.data?.message || error.response.statusText}`;
        }
      } else if (error.request) {
        // Erro de rede/conexão
        console.error('🌐 Erro de rede:', error.request);
        errorMessage = 'Erro de conexão. Verifique sua internet e tente novamente.';
      } else if (error.message) {
        // Erro na configuração da requisição
        console.error('⚙️ Erro de configuração:', error.message);
        errorMessage = `Erro de configuração: ${error.message}`;
      }
      
      // Debug adicional
      console.error('🔍 Debug adicional:', {
        payloadEnviado: payload || 'Payload não foi criado',
        ferramentaId: ferramenta.id,
        dadosOriginais: ferramenta,
        dadosEditados: editData,
        errorType: error.constructor.name,
        errorStack: error.stack,
        apiExists: !!Api.updateFerramenta,
        apiMethods: Object.keys(Api)
      });
      
      setErro(errorMessage);
      
      // Também mostra o erro em um alert para facilitar visualização
      alert(`❌ ${errorMessage}\n\nVerifique o console (F12) para mais detalhes técnicos.`);
      
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

      <HistoricoTableContainer>
        <h3>Histórico de Alocações</h3>
        {loadingHistorico ? (
          <div>Carregando histórico...</div>
        ) : historico.length === 0 ? (
          <div>Nenhum histórico encontrado.</div>
        ) : (
          <HistoricoTable>
            <thead>
              <tr>
                <HistoricoTh>Obra</HistoricoTh>
                <HistoricoTh>Responsável</HistoricoTh>
                <HistoricoTh>Data Alocação</HistoricoTh>
                <HistoricoTh>Data Desalocação</HistoricoTh>
              </tr>
            </thead>
            <tbody>
              {historico.map((aloc) => (
                <tr key={aloc.id}>
                  <HistoricoTd>{aloc.obra_nome || '-'}</HistoricoTd>
                  <HistoricoTd>{aloc.funcionario_nome || '-'}</HistoricoTd>
                  <HistoricoTd>{aloc.data_alocacao ? new Date(aloc.data_alocacao).toLocaleDateString('pt-BR') : '-'}</HistoricoTd>
                  <HistoricoTd>{aloc.data_desalocacao ? new Date(aloc.data_desalocacao).toLocaleDateString('pt-BR') : '-'}</HistoricoTd>
                </tr>
              ))}
            </tbody>
          </HistoricoTable>
        )}
      </HistoricoTableContainer>
    </CardDetalhe>
  );
};