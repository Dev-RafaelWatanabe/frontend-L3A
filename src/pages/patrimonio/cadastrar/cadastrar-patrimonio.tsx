import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  FormContainer,
  FormField,
  ButtonGroup,
  PatrimonioButton,
  PatrimonioDeleteButton
} from './styles';
import type { PatrimonioFormData, Obra, Categoria, Situacao, Marca } from '../../../services/api/types';
import { Api } from '../../../services/api/api';

export const Patrimonio: React.FC = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<PatrimonioFormData>();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [situacoes, setSituacoes] = useState<Situacao[]>([]);
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [obras, setObras] = useState<Obra[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('🔄 Carregando dados...');
        const [obrasRes, categoriasRes, marcasRes, situacoesRes] = await Promise.all([
          Api.getObras(),
          Api.getCategorias(),
          Api.getMarcas(),
          Api.getSituacoes()
        ]);
        
        setObras(obrasRes.data || []);
        setCategorias(categoriasRes.data || []);
        setMarcas(marcasRes.data || []);
        setSituacoes(situacoesRes.data || []);
        
        console.log('✅ Dados carregados:', {
          obras: obrasRes.data?.length,
          categorias: categoriasRes.data?.length,
          marcas: marcasRes.data?.length,
          situacoes: situacoesRes.data?.length
        });
      } catch (error) {
        console.error('❌ Erro ao carregar dados:', error);
        alert('Erro ao carregar dados. Recarregue a página.');
      }
    };

    loadData();
  }, []);

  const onSubmit = async (data: PatrimonioFormData) => {
    if (loading) return;
    
    try {
      setLoading(true);
      console.log('📋 Dados do formulário:', data);

      // Validação básica
      if (!data.nome?.trim()) {
        alert('Nome é obrigatório');
        return;
      }

      // Buscar os nomes dos itens selecionados
      const marcaSelecionada = marcas.find(m => m.id === Number(data.marca));
      const categoriaSelecionada = categorias.find(c => c.id === Number(data.categoria));
      const obraSelecionada = obras.find(o => o.id === Number(data.centro_custo));
      const situacaoSelecionada = situacoes.find(s => s.id === Number(data.situacao));

      console.log('🔍 Itens encontrados:', {
        marca: marcaSelecionada,
        categoria: categoriaSelecionada,
        obra: obraSelecionada,
        situacao: situacaoSelecionada
      });

      if (!marcaSelecionada || !categoriaSelecionada || !obraSelecionada || !situacaoSelecionada) {
        alert('Erro: Todos os campos obrigatórios devem ser preenchidos.');
        return;
      }

      // PAYLOAD NO FORMATO EXATO QUE O BACKEND ESPERA
      const payload = {
        nome: data.nome.trim(),
        categoria_nome: categoriaSelecionada.nome,
        marca_nome: marcaSelecionada.nome,
        obra_nome: obraSelecionada.nome,
        situacao_nome: situacaoSelecionada.nome,
        valor: data.valor ? Number(data.valor) : 0,
        descricao: data.descricao?.trim() || '',
        // Adicionando série se o backend aceitar (opcional)
        ...(data.serie?.trim() && { serie: data.serie.trim() })
      };

      console.log('📤 Enviando payload no formato correto:', payload);

      const response = await Api.createFerramenta(payload);
      console.log('✅ Sucesso:', response);
      alert('Patrimônio cadastrado com sucesso!');
      reset();
      navigate('/patrimonio/cadastros');

    } catch (error: any) {
      console.error('❌ Erro completo:', error);
      
      // Log detalhado
      if (error.response) {
        console.error('📋 Resposta de erro:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data,
          url: error.config?.url,
          method: error.config?.method,
          sentData: error.config?.data
        });
      }

      let errorMessage = 'Erro desconhecido';

      if (error.response?.status === 400) {
        const errorData = error.response.data;
        console.error('❌ Erro 400:', errorData);
        
        if (typeof errorData === 'string') {
          errorMessage = errorData;
        } else if (errorData?.detail) {
          errorMessage = errorData.detail;
        } else if (errorData?.message) {
          errorMessage = errorData.message;
        } else {
          errorMessage = `Bad Request: ${JSON.stringify(errorData)}`;
        }
        
      } else if (error.response?.status === 422) {
        const validationErrors = error.response.data?.detail || [];
        console.error('❌ Erro 422:', validationErrors);
        
        if (Array.isArray(validationErrors)) {
          errorMessage = validationErrors.map(err => {
            const field = err.loc ? err.loc.join(' -> ') : 'Campo';
            const message = err.msg || 'Erro de validação';
            const input = err.input ? ` (valor enviado: ${JSON.stringify(err.input)})` : '';
            return `${field}: ${message}${input}`;
          }).join('\n');
        } else {
          errorMessage = `Validation Error: ${JSON.stringify(validationErrors)}`;
        }
        
      } else if (error.response?.status === 500) {
        errorMessage = 'Erro interno do servidor';
        
      } else if (!error.response) {
        errorMessage = 'Erro de conexão com o servidor';
        
      } else {
        errorMessage = `Erro ${error.response.status}: ${error.response.statusText}`;
      }

      alert(`Erro ao cadastrar patrimônio:\n\n${errorMessage}`);
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <h1>Cadastro de Patrimônio</h1>
      <FormContainer>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormField>
            <label htmlFor="nome">Nome *</label>
            <input
              id="nome"
              {...register('nome', { required: 'Nome é obrigatório' })}
              placeholder="Nome do patrimônio"
              disabled={loading}
            />
            {errors.nome && <span style={{ color: 'red', fontSize: 12 }}>{errors.nome.message}</span>}
          </FormField>

          <FormField>
            <label htmlFor="descricao">Descrição</label>
            <textarea
              id="descricao"
              {...register('descricao')}
              placeholder="Descrição do patrimônio (opcional)"
              rows={3}
              disabled={loading}
            />
          </FormField>

          <FormField>
            <label htmlFor="marca">Marca *</label>
            <select 
              id="marca" 
              {...register('marca', { required: 'Selecione uma marca' })}
              disabled={loading}
            >
              <option value="">Selecione uma marca</option>
              {marcas.map((marca) => (
                <option key={marca.id} value={marca.id}>{marca.nome}</option>
              ))}
            </select>
            {errors.marca && <span style={{ color: 'red', fontSize: 12 }}>{errors.marca.message}</span>}
          </FormField>

          <FormField>
            <label htmlFor="categoria">Categoria *</label>
            <select 
              id="categoria" 
              {...register('categoria', { required: 'Selecione uma categoria' })}
              disabled={loading}
            >
              <option value="">Selecione uma categoria</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.nome}</option>
              ))}
            </select>
            {errors.categoria && <span style={{ color: 'red', fontSize: 12 }}>{errors.categoria.message}</span>}
          </FormField>

          <FormField>
            <label htmlFor="centro_custo">Centro de Custo (Obra) *</label>
            <select 
              id="centro_custo" 
              {...register('centro_custo', { required: 'Selecione uma obra' })}
              disabled={loading}
            >
              <option value="">Selecione uma obra</option>
              {obras.map(obra => (
                <option key={obra.id} value={obra.id}>{obra.nome}</option>
              ))}
            </select>
            {errors.centro_custo && <span style={{ color: 'red', fontSize: 12 }}>{errors.centro_custo.message}</span>}
          </FormField>

          <FormField>
            <label htmlFor="situacao">Situação *</label>
            <select 
              id="situacao" 
              {...register('situacao', { required: 'Selecione a situação' })}
              disabled={loading}
            >
              <option value="">Selecione uma situação</option>
              {situacoes.map((sit) => (
                <option key={sit.id} value={sit.id}>{sit.nome}</option>
              ))}
            </select>
            {errors.situacao && <span style={{ color: 'red', fontSize: 12 }}>{errors.situacao.message}</span>}
          </FormField>

          <FormField>
            <label htmlFor="valor">Valor (R$)</label>
            <input
              id="valor"
              type="number"
              step="0.01"
              min="0"
              {...register('valor')}
              placeholder="0.00"
              disabled={loading}
            />
          </FormField>

          <ButtonGroup>
            <PatrimonioButton type="submit" disabled={loading}>
              {loading ? 'Cadastrando...' : 'Cadastrar'}
            </PatrimonioButton>
            <PatrimonioDeleteButton 
              type="button" 
              onClick={() => reset()}
              disabled={loading}
            >
              Limpar
            </PatrimonioDeleteButton>
          </ButtonGroup>
        </form>
      </FormContainer>
    </Container>
  );
};