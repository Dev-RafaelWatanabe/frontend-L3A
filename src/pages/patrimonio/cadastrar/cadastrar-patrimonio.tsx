import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
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

  useEffect(() => {
    Api.getObras().then(res => setObras(res.data || []));
    Api.getCategorias().then(res => setCategorias(res.data || []));
    Api.getMarcas().then(res => setMarcas(res.data || []));
    Api.getSituacoes().then(res => setSituacoes(res.data || []));
  }, []);

  const onSubmit = async (data: PatrimonioFormData) => {
    try {
      console.log('📋 Dados do formulário recebidos:', data);

      const marcaSelecionada = marcas.find(m => m.id === Number(data.marca));
      const categoriaSelecionada = categorias.find(c => c.id === Number(data.categoria));
      const obraSelecionada = obras.find(o => o.id === Number(data.centro_custo));
      const situacaoSelecionada = situacoes.find(s => s.id === Number(data.situacao));

      if (!marcaSelecionada || !categoriaSelecionada || !obraSelecionada || !situacaoSelecionada) {
        alert('Erro: Não foi possível encontrar os dados completos para os itens selecionados. Verifique se todos os campos estão preenchidos.');
        return;
      }

      // Converte o arquivo para base64 se existir
      let notaFiscalBase64 = '';
      if (data.nota_fiscal && data.nota_fiscal.length > 0 && data.nota_fiscal[0]) {
        const file = data.nota_fiscal[0];
        const toBase64 = (file: File) =>
          new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
          });
        notaFiscalBase64 = await toBase64(file);
      }

      // Monta o objeto conforme esperado pelo backend
      const payload = {
        nome: data.nome.trim(),
        descricao: data.descricao?.trim() || '',
        marca_nome: marcaSelecionada.nome,
        categoria_nome: categoriaSelecionada.nome,
        obra_nome: obraSelecionada.nome,
        situacao_nome: situacaoSelecionada.nome,
        valor: data.valor ? Number(data.valor) : 0.00,
        nota_fiscal: notaFiscalBase64 // string base64 ou ''
      };

      // Aqui você envia para a API:
      const response = await Api.createFerramenta(payload);
      console.log("Resposta do servidor:", response);

      alert('Patrimônio cadastrado com sucesso!');
      window.location.reload();
      reset();

    } catch (error: any) {
      console.error("Erro completo:", error);
      
      if (error.response?.status === 500) {
        console.error("Erro 500 - Detalhes:", {
          status: error.response.status,
          data: error.response.data,
          message: error.message
        });
        
        // Tentar mostrar erro específico do backend
        const errorMessage = error.response?.data?.detail || 
                            error.response?.data?.message || 
                            'Erro interno do servidor';
        
        alert(`Erro no servidor: ${errorMessage}`);
        
      } else if (error.response?.status === 400) {
        console.error("Erro 400 - Dados inválidos:", error.response.data);
        alert(`Dados inválidos: ${JSON.stringify(error.response.data)}`);
        
      } else if (error.response?.status === 422) {
        console.error("Erro 422 - Validação:", error.response.data);
        alert(`Erro de validação: ${JSON.stringify(error.response.data)}`);
        
      } else {
        alert('Erro ao cadastrar patrimônio. Verifique o console e os logs do backend.');
      }
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
            />
            {errors.nome && <span style={{ color: 'red', fontSize: 12 }}>{errors.nome.message}</span>}
          </FormField>

          <FormField>
            <label htmlFor="serie">Número de Série</label>
            <input
              id="serie"
              {...register('serie')}
              placeholder="Número de série"
            />
          </FormField>

          <FormField>
            <label htmlFor="descricao">Descrição</label>
            <textarea
              id="descricao"
              {...register('descricao')}
              placeholder="Descrição do patrimônio"
              rows={3}
            />
          </FormField>

          <FormField>
            <label htmlFor="marca">Marca</label>
            <select id="marca" {...register('marca', { required: 'Selecione uma marca' })}>
              <option value="">Selecione</option>
              {marcas.map((marca) => (
                <option key={marca.id} value={marca.id}>{marca.nome}</option>
              ))}
            </select>
            {errors.marca && <span style={{ color: 'red', fontSize: 12 }}>{errors.marca.message}</span>}
          </FormField>

          <FormField>
            <label htmlFor="categoria">Categoria</label>
            <select id="categoria" {...register('categoria', { required: 'Selecione uma categoria' })}>
              <option value="">Selecione</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.nome}</option>
              ))}
            </select>
            {errors.categoria && <span style={{ color: 'red', fontSize: 12 }}>{errors.categoria.message}</span>}
          </FormField>

          <FormField>
            <label htmlFor="centro_custo">Centro de Custo (Obra)</label>
            <select id="centro_custo" {...register('centro_custo', { required: 'Selecione um centro de custo' })}>
              <option value="">Selecione</option>
              {obras.map(obra => (
                <option key={obra.id} value={obra.id}>{obra.nome}</option>
              ))}
            </select>
            {errors.centro_custo && <span style={{ color: 'red', fontSize: 12 }}>{errors.centro_custo.message}</span>}
          </FormField>

          <FormField>
            <label htmlFor="valor">Valor (R$)</label>
            <input
              id="valor"
              type="number"
              step="0.01"
              min="0"
              {...register('valor', { valueAsNumber: true })}
              placeholder="Valor do patrimônio"
            />
          </FormField>

          <FormField>
            <label htmlFor="nota_fiscal">Nota Fiscal (PDF, Excel ou Imagem)</label>
            <input
              id="nota_fiscal"
              type="file"
              accept=".pdf,.xls,.xlsx,image/*"
              multiple
              {...register('nota_fiscal')}
            />
          </FormField>

          <FormField>
            <label htmlFor="situacao">Situação</label>
            <select id="situacao" {...register('situacao', { required: 'Selecione a situação' })}>
              <option value="">Selecione</option>
              {situacoes.map((sit) => (
                <option key={sit.id} value={sit.id}>{sit.nome}</option>
              ))}
            </select>
            {errors.situacao && <span style={{ color: 'red', fontSize: 12 }}>{errors.situacao.message}</span>}
          </FormField>

          <ButtonGroup>
            <PatrimonioButton type="submit">Cadastrar</PatrimonioButton>
            <PatrimonioDeleteButton type="button" onClick={() => reset()}>Limpar</PatrimonioDeleteButton>
          </ButtonGroup>
        </form>
      </FormContainer>
    </Container>
  );
};