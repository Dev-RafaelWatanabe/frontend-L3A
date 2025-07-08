import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Api } from '../../../Services/Api/Api';
import {
  Container,
  FormContainer,
  FormField,
  ButtonGroup,
  Select,
  TextArea,
  Label,
  AlocarButton,
  LimparButton
} from './Styles';


export const AlocarPatrimonio: React.FC = () => {
  const { register, handleSubmit, reset } = useForm();
  const [obras, setObras] = useState<any[]>([]);
  const [funcionarios, setFuncionarios] = useState<any[]>([]);
  const [ferramentas, setFerramentas] = useState<any[]>([]);
  const [situacoes, setSituacoes] = useState<any[]>([]);

  useEffect(() => {
    Api.getObras().then(res => setObras(res.data));
    Api.getFuncionarios().then(res => setFuncionarios(res.data));
    Api.getFerramentas().then(res => setFerramentas(res.data));
    Api.getSituacoes().then(res => setSituacoes(res.data));
  }, []);

  const verificarAlocacoesCriadas = async () => {
    try {
      await Api.getAlocacoes();
      console.log('consegui verificar as alocações criadas');
    } catch (error) {
      console.error('Erro ao verificar alocações:', error);
    }
  };

  const onSubmit = async (data: any) => {
    try {
      console.log('Payload alocacao:', {
      ferramenta_nome: data.ferramenta_nome,
      obra_nome: data.obra_nome
      });
      await Api.createAlocacao({
        ferramenta_nome: data.ferramenta_nome,
        obra_nome: data.obra_nome
      });
      await verificarAlocacoesCriadas();

      // Atualiza a obra, situação e valor da ferramenta após alocar
      await Api.updateFerramentaObra(
        data.ferramenta_nome, // ainda pode ser pelo nome, se sua função busca pelo nome
        Number(data.obra_id),
        Number(data.situacao_id),
        Number(data.valor)
      );

      reset();
    } catch (error) {
      console.error('Erro ao criar alocação ou atualizar obra:', error);
      alert('Erro ao criar alocação ou atualizar obra.');
    }
  };

  return (
    <Container>
      <h1>Alocação de Patrimônio</h1>
      <FormContainer>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormField>
            <Label>Obra</Label>
            <Select {...register('obra_id', { required: true })}>
              <option value="">Selecione uma obra</option>
              {obras.map((obra) => (
                <option key={obra.id} value={obra.id}>{obra.nome}</option>
              ))}
            </Select>
          </FormField>

          <FormField>
            <Label>Observação</Label>
            <TextArea
              {...register('observacao')}
              placeholder="Adicione informações adicionais"
              rows={3}
            />
          </FormField>

          <FormField>
            <Label>Responsável (opcional)</Label>
            <Select {...register('funcionarioId')}>
              <option value="">Nenhum</option>
              {funcionarios.map((func) => (
                <option key={func.id} value={func.id}>{func.nome}</option>
              ))}
            </Select>
          </FormField>

          <FormField>
            <Label>Patrimônio/Ferramenta</Label>
            <Select {...register('ferramenta_nome', { required: true })}>
              <option value="">Selecione um patrimônio/ferramenta</option>
              {ferramentas.map((ferramenta) => (
                <option key={ferramenta.id} value={ferramenta.nome}>{ferramenta.nome}</option>
              ))}
            </Select>
          </FormField>

          <FormField>
            <Label>Situação</Label>
            <Select {...register('situacao_id', { required: true })}>
              <option value="">Selecione a situação</option>
              {situacoes.map((situacao) => (
                <option key={situacao.id} value={situacao.id}>{situacao.nome}</option>
              ))}
            </Select>
          </FormField>

          <FormField>
            <Label>Valor</Label>
            <input
              type="number"
              step="0.01"
              min="0"
              {...register('valor')}
              placeholder="Valor do patrimônio"
            />
          </FormField>

          <ButtonGroup>
            <AlocarButton type="submit">Alocar</AlocarButton>
            <LimparButton type="button" onClick={() => reset()}>Limpar</LimparButton>
          </ButtonGroup>
        </form>
      </FormContainer>
    </Container>
  );
};