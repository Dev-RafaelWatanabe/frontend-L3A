import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Container,
  FormContainer,
  FormField,
  ButtonGroup,
  PatrimonioButton,
  PatrimonioDeleteButton
} from './Styles';
import type { PatrimonioFormData, Obra, Categoria, Situacao, Marca } from '../../../Services/Api/Types';
import { Api } from '../../../Services/Api/Api';

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
      const formData = new FormData();
      formData.append('nome', data.nome);
      formData.append('descricao', data.descricao || '');
      
      // Enviar apenas os IDs dos campos relacionais
      formData.append('marca', String(data.marca)); // ID da marca
      formData.append('categoria', String(data.categoria)); // ID da categoria
      formData.append('obra', String(data.centro_custo)); // ID da obra
      formData.append('situacao', String(data.situacao)); // ID da situação
      
      // Valor como string (como aparece no banco)
      if (data.valor) {
        formData.append('valor', String(data.valor));
      }
      
      // Remove o campo serie se não existe no backend
      // if (data.serie) {
      //   formData.append('serie', String(data.serie));
      // }

      // Nota fiscal é opcional - só envie se houver arquivo
      if (data.nota_fiscal && data.nota_fiscal.length > 0) {
        formData.append('nota_fiscal', data.nota_fiscal[0]);
      }

      console.log("Enviando dados:", Object.fromEntries(formData));
      const response = await Api.createFerramenta(formData);
      console.log("Resposta:", response);

      alert('Patrimônio cadastrado com sucesso!');
      reset();
    } catch (error: any) {
      console.error("Erro completo:", error);
      console.error("Detalhes do erro:", error.response?.data);
      
      if (error.response?.data) {
        alert(`Erro ao cadastrar patrimônio: ${JSON.stringify(error.response.data)}`);
      } else {
        alert('Erro ao cadastrar patrimônio. Verifique o console para mais detalhes.');
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