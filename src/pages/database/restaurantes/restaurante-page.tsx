import React, { useEffect, useState } from 'react';
import { Api } from '../../../services/api/api';
import { DataTable } from '../components/data-table';
import { Button } from '../../../style/components/buttons';
import type { Restaurante } from '../../../services/api/types';
import { FaPlus } from 'react-icons/fa';
import {
  Modal,
  ModalContent,
  FormField,
  ButtonGroup,
  HeaderContainer,
  CreateButton
} from './styles';

export const Restaurantes: React.FC = () => {
  const [data, setData] = useState<Restaurante[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRestaurante, setSelectedRestaurante] = useState<Restaurante | null>(null);
  const [newRestaurante, setNewRestaurante] = useState({
    nome: '',
    valor: ''  // Keep as string for input handling
  });

  const columns = [
    { key: 'nome', label: 'Nome' },
    { 
      key: 'valor', 
      label: 'Valor',
      render: (value: number) => {
        try {
          return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          }).format(value);
        } catch {
          return 'R$ 0,00';
        }
      }
    },
    {
      key: 'actions',
      label: 'Ações',
      render: (_: any, row: Restaurante) => (
        <Button 
          className="secondary"
          onClick={(e: React.MouseEvent) => {
            e.preventDefault();
            handleEdit(row);
          }}
        >
          Editar
        </Button>
      )
    }
  ];

  const refreshData = async () => {
    try {
      const response = await Api.getRestaurantes();
      setData(response.data);
    } catch (error) {
      console.error('Erro ao atualizar dados:', error);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleEdit = (restaurante: Restaurante) => {
    setSelectedRestaurante(restaurante);
    setNewRestaurante({
      nome: restaurante.nome,
      valor: restaurante.valor.toString()
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Convert string to number with 2 decimal places
      const valorNumerico = Number(parseFloat(newRestaurante.valor).toFixed(2));
      
      if (isNaN(valorNumerico)) {
        throw new Error('Valor inválido');
      }

      setIsModalOpen(false);
      setNewRestaurante({ nome: '', valor: '' });
      setSelectedRestaurante(null);

      if (selectedRestaurante?.id) {
        await Api.updateRestaurante(selectedRestaurante.id, {
          nome: newRestaurante.nome,
          valor: valorNumerico
        });
        
        await refreshData();
      } else {
        await Api.createRestaurante({
          nome: newRestaurante.nome,
          valor: valorNumerico
        });
      }
      
    } catch (error) {
      console.error('Erro ao salvar restaurante:', error);
      alert('Erro ao salvar restaurante. Verifique se o valor está correto.');
    }
  };

  return (
    <div>
      <HeaderContainer>
        <h1>Restaurantes</h1>
        <CreateButton onClick={() => {
          setSelectedRestaurante(null);
          setNewRestaurante({ nome: '', valor: '' });
          setIsModalOpen(true);
        }}>
          <FaPlus />
          Adicionar Restaurante
        </CreateButton>
      </HeaderContainer>
      <DataTable data={data} columns={columns} />

      {isModalOpen && (
        <Modal>
          <ModalContent>
            <h2>{selectedRestaurante ? 'Editar Restaurante' : 'Novo Restaurante'}</h2>
            <form onSubmit={handleSubmit}>
              <FormField>
                <label htmlFor="nome">Nome do Restaurante</label>
                <input
                  id="nome"
                  type="text"
                  value={newRestaurante.nome}
                  onChange={(e) => setNewRestaurante({
                    ...newRestaurante,
                    nome: e.target.value
                  })}
                  required
                  placeholder="Digite o nome do restaurante"
                />
              </FormField>

              <FormField>
                <label htmlFor="valor">Valor</label>
                <input
                  id="valor"
                  type="number"
                  value={newRestaurante.valor}
                  onChange={(e) => setNewRestaurante({
                    ...newRestaurante,
                    valor: e.target.value
                  })}
                  required
                  step="0.01"
                  min="0"
                  placeholder="Coloque o valor da refeição (R$)"
                />
              </FormField>

              <ButtonGroup>
                <Button 
                  className="secondary" 
                  type="button" 
                  onClick={() => {
                    setIsModalOpen(false);
                    setNewRestaurante({ nome: '', valor: '' });
                    setSelectedRestaurante(null);
                  }}
                >
                  Cancelar
                </Button>
                <Button type="submit">
                  {selectedRestaurante ? 'Salvar Alterações' : 'Salvar'}
                </Button>
              </ButtonGroup>
            </form>
          </ModalContent>
        </Modal>
      )}
    </div>
  );
};
