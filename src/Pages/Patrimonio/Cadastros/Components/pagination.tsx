import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import type { 
  PaginacaoParams, 
  PaginacaoComponentProps, 
  PaginacaoRef 
} from '../../../../Services/Api/Types';
import { 
  PaginationContainer, 
  PaginationInfo, 
  PaginationButton 
} from '../styles';

export const PaginacaoComponent = forwardRef<PaginacaoRef, PaginacaoComponentProps<any>>(
  ({ fetchData, itemsPerPage = 20, onDataChange }, ref) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [allItems, setAllItems] = useState<any[]>([]); // Armazena todos os itens
    const [totalItems, setTotalItems] = useState(0);
    const [loading, setLoading] = useState(false);
    const [isFirstLoad, setIsFirstLoad] = useState(true);

    // Função para buscar TODOS os dados do backend
    const loadAllData = async () => {
      if (loading) return;
      
      setLoading(true);
      onDataChange([], true);
      
      try {
        // Buscar todos os dados sem skip (primeira requisição)
        const response = await fetchData({ skip: 0 });
        const items = response.data || [];
        
        setAllItems(items);
        setTotalItems(items.length);
        
        // Mostrar apenas os primeiros 20 itens (página 1)
        const pageItems = items.slice(0, itemsPerPage);
        onDataChange(pageItems, false);
        
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setAllItems([]);
        setTotalItems(0);
        onDataChange([], false);
      } finally {
        setLoading(false);
      }
    };

    // Função para navegar entre as páginas (usando dados já carregados)
    const showPage = (page: number) => {
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const pageItems = allItems.slice(startIndex, endIndex);
      
      onDataChange(pageItems, false);
    };

    // Carrega todos os dados apenas na primeira montagem
    useEffect(() => {
      if (isFirstLoad) {
        loadAllData();
        setIsFirstLoad(false);
      }
    }, []);

    // Navega entre páginas quando currentPage muda
    useEffect(() => {
      if (!isFirstLoad && allItems.length > 0) {
        showPage(currentPage);
      }
    }, [currentPage, allItems]);

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Função para avançar página
    const nextPage = () => {
      if (currentPage < totalPages && !loading) {
        setCurrentPage(prev => prev + 1);
      }
    };

    // Função para voltar página
    const previousPage = () => {
      if (currentPage > 1 && !loading) {
        setCurrentPage(prev => prev - 1);
      }
    };

    // Função para recarregar dados
    const reloadData = () => {
      if (!loading) {
        setCurrentPage(1);
        loadAllData();
      }
    };

    // Função para resetar para primeira página
    const resetToFirstPage = () => {
      setCurrentPage(1);
    };

    // Expor funções via ref
    useImperativeHandle(ref, () => ({
      reloadData,
      resetToFirstPage,
      currentPage,
      totalPages,
      totalItems
    }));

    // Calcular informações para exibição
    const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    return (
      <PaginationContainer>
        <PaginationInfo>
          {totalItems > 0 
            ? `Mostrando ${startItem} a ${endItem} de ${totalItems} registros (Página ${currentPage} de ${totalPages})`
            : 'Nenhum registro encontrado'}
        </PaginationInfo>
        
        {totalPages > 1 && (
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <PaginationButton 
              onClick={previousPage} 
              disabled={currentPage === 1 || loading}
              title="Página anterior"
            >
              <FaArrowLeft size={16} />
            </PaginationButton>

            <span style={{ padding: '0 10px', fontSize: '14px' }}>
              Página {currentPage} de {totalPages}
            </span>

            <PaginationButton 
              onClick={nextPage} 
              disabled={currentPage >= totalPages || loading}
              title="Próxima página"
            >
              <FaArrowRight size={16} />
            </PaginationButton>
          </div>
        )}
      </PaginationContainer>
    );
  }
);

PaginacaoComponent.displayName = 'PaginacaoComponent';