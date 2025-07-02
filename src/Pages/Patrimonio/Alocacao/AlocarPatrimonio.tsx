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
} from './styles';

interface AlocarFormData {
  obraId: string;
  observacao: string;
  funcionarioId?: string;
  ferramentaId: string;
}

export const AlocarPatrimonio: React.FC = () => {
  const { register, handleSubmit, reset } = useForm<AlocarFormData>();
  const [obras, setObras] = useState<any[]>([]);
  const [funcionarios, setFuncionarios] = useState<any[]>([]);
  const [ferramentas, setFerramentas] = useState<any[]>([]);

  useEffect(() => {
    Api.getObras().then(res => setObras(res.data));
    Api.getFuncionarios().then(res => setFuncionarios(res.data));
    Api.getFerramentas().then(res => setFerramentas(res.data));
  }, []);

  const onSubmit = (data: AlocarFormData) => {
    console.log('Dados para alocação:', data);
    // Chame a API de alocação aqui
  };

  return (
    <Container>
      <h1>Alocação de Patrimônio</h1>
      <FormContainer>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormField>
            <Label>Obra</Label>
            <Select {...register('obraId', { required: true })}>
              <option value="">Selecione uma obra</option>
              {obras.map((obra) => (
                <option key={obra.id} value={obra.id}>{obra.nome}</option>
              ))}
            </Select>
          </FormField>

          <FormField>
            <Label>Observação</Label>
            <TextArea
              {...register('observacao', { required: true })}
              placeholder="Adicione informações adicionais"
              rows={3}
            />
          </FormField>

          <FormField>
            <Label>Funcionário (opcional)</Label>
            <Select {...register('funcionarioId')}>
              <option value="">Nenhum</option>
              {funcionarios.map((func) => (
                <option key={func.id} value={func.id}>{func.nome}</option>
              ))}
            </Select>
          </FormField>

          <FormField>
            <Label>Patrimônio/Ferramenta</Label>
            <Select {...register('ferramentaId', { required: true })}>
              <option value="">Selecione um patrimônio/ferramenta</option>
              {ferramentas.map((ferramenta) => (
                <option key={ferramenta.id} value={ferramenta.id}>{ferramenta.nome}</option>
              ))}
            </Select>
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