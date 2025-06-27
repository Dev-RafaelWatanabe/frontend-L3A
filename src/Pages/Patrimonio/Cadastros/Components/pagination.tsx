import { useState, useEffect, forwardRef, useImperativeHandle, useCallback } from 'react';
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import type { 
  PaginacaoComponentProps, 
  PaginacaoRef 
} from '../../../../Services/Api/Types';
import { 
  PaginationContainer, 
  PaginationInfo, 
  PaginationButton,
  PaginationControls,
  PageInfo,
  LoadingSpinner
} from '../styles';

// Cache global para armazenar dados por mais tempo
interface CacheData<T> {
  data: T[];
  timestamp: number;
  total: number;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos
const dataCache = new Map<string, CacheData<any>>();

export const PaginacaoComponent = forwardRef<PaginacaoRef, PaginacaoComponentProps<any>>(
  ({ fetchData, itemsPerPage = 20, onDataChange }, ref) => {
    console.log('🔧 PaginacaoComponent montado com:', { fetchData: !!fetchData, itemsPerPage, onDataChange: !!onDataChange });
    
    const [currentPage, setCurrentPage] = useState(1);
    const [allItems, setAllItems] = useState<any[]>([]);
    const [totalItems, setTotalItems] = useState(0);
    const [loading, setLoading] = useState(false);
    const [isFirstLoad, setIsFirstLoad] = useState(true);
    const cacheKey = 'patrimonio_lista';

    // Função para verificar se o cache é válido
    const isCacheValid = useCallback((key: string): boolean => {
      const cached = dataCache.get(key);
      if (!cached) return false;
      
      const now = Date.now();
      return (now - cached.timestamp) < CACHE_DURATION;
    }, []);

    // Função para buscar dados do cache ou backend
    const loadAllData = useCallback(async () => {
      console.log('📥 loadAllData chamada - loading atual:', loading);
      
      if (loading) {
        console.log('⚠️ Já está carregando, cancelando');
        return;
      }
      
      // Verificar cache primeiro
      if (isCacheValid(cacheKey)) {
        console.log('📦 Dados encontrados em cache');
        const cached = dataCache.get(cacheKey)!;
        setAllItems(cached.data);
        setTotalItems(cached.total);
        
        // Mostrar primeira página dos dados em cache
        const pageItems = cached.data.slice(0, itemsPerPage);
        onDataChange(pageItems, false);
        return;
      }
      
      console.log('🌐 Fazendo requisição ao backend...');
      setLoading(true);
      onDataChange([], true);
      
      try {
        console.log('📡 Chamando fetchData com params:', { skip: 0 });
        const response = await fetchData({ skip: 0 });
        console.log('📨 Resposta recebida:', response);
        const items = response.data || [];
        
        console.log(`✅ ${items.length} itens recebidos do backend`);
        
        // Armazenar no cache
        dataCache.set(cacheKey, {
          data: items,
          timestamp: Date.now(),
          total: items.length
        });
        
        setAllItems(items);
        setTotalItems(items.length);
        
        // Mostrar primeira página
        const pageItems = items.slice(0, itemsPerPage);
        console.log(`📄 Mostrando primeira página com ${pageItems.length} itens`);
        onDataChange(pageItems, false);
        
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setAllItems([]);
        setTotalItems(0);
        onDataChange([], false);
      } finally {
        setLoading(false);
      }
    }, [loading, cacheKey, isCacheValid, fetchData, itemsPerPage, onDataChange]);

    // Função para navegar entre páginas (usando dados já carregados em memória)
    const showPage = useCallback((page: number) => {
      if (allItems.length === 0) return;
      
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const pageItems = allItems.slice(startIndex, endIndex);
      
      console.log(`Mostrando página ${page} (${startIndex + 1}-${Math.min(endIndex, allItems.length)} de ${allItems.length})`);
      onDataChange(pageItems, false);
    }, [allItems, itemsPerPage, onDataChange]);

    // Carrega dados apenas na primeira montagem ou quando necessário
    useEffect(() => {
      console.log('🔄 useEffect disparado - isFirstLoad:', isFirstLoad);
      if (isFirstLoad) {
        console.log('🚀 Primeira carga - executando diretamente');
        
        // Executar diretamente para debug
        const loadData = async () => {
          console.log('📥 Função loadData executada');
          
          // Verificar cache primeiro
          if (isCacheValid(cacheKey)) {
            console.log('📦 Dados encontrados em cache');
            const cached = dataCache.get(cacheKey)!;
            setAllItems(cached.data);
            setTotalItems(cached.total);
            
            // Mostrar primeira página dos dados em cache
            const pageItems = cached.data.slice(0, itemsPerPage);
            onDataChange(pageItems, false);
            return;
          }
          
          console.log('🌐 Fazendo requisição ao backend...');
          setLoading(true);
          onDataChange([], true);
          
          try {
            console.log('📡 Chamando fetchData com params:', { skip: 0 });
            const response = await fetchData({ skip: 0 });
            console.log('📨 Resposta recebida:', response);
            const items = response.data || [];
            
            console.log(`✅ ${items.length} itens recebidos do backend`);
            
            // Armazenar no cache
            dataCache.set(cacheKey, {
              data: items,
              timestamp: Date.now(),
              total: items.length
            });
            
            setAllItems(items);
            setTotalItems(items.length);
            
            // Mostrar primeira página
            const pageItems = items.slice(0, itemsPerPage);
            console.log(`📄 Mostrando primeira página com ${pageItems.length} itens`);
            onDataChange(pageItems, false);
            
          } catch (error) {
            console.error('❌ Erro ao carregar dados:', error);
            setAllItems([]);
            setTotalItems(0);
            onDataChange([], false);
          } finally {
            setLoading(false);
          }
        };
        
        loadData();
        setIsFirstLoad(false);
      }
    }, [isFirstLoad, cacheKey, isCacheValid, fetchData, itemsPerPage, onDataChange]);

    // Modificar o useEffect para garantir que a requisição inicial aconteça
    useEffect(() => {
      console.log('🔄 useEffect inicial executado - forçando carregamento');
      
      // Função imediata para carregar dados
      const initialLoad = async () => {
        try {
          console.log('📡 Iniciando carregamento inicial...');
          setLoading(true);
          
          // Chamada direta para o fetchData
          const response = await fetchData({ skip: 0 });
          console.log('✅ Resposta inicial recebida:', response);
          
          const items = response.data || [];
          console.log(`📦 ${items.length} itens recebidos do backend`);
          
          // Armazenar no cache
          dataCache.set(cacheKey, {
            data: items,
            timestamp: Date.now(),
            total: items.length
          });
          
          setAllItems(items);
          setTotalItems(items.length);
          
          // Mostrar primeira página
          const pageItems = items.slice(0, itemsPerPage);
          onDataChange(pageItems, false);
        } catch (error) {
          console.error('❌ Erro no carregamento inicial:', error);
          onDataChange([], false);
        } finally {
          setLoading(false);
          setIsFirstLoad(false);
        }
      };

      // Executar imediatamente
      initialLoad();
      
    }, []); // Dependências vazias para executar apenas uma vez

    // Navega entre páginas quando currentPage muda (sem fazer requisições)
    useEffect(() => {
      if (!isFirstLoad && allItems.length > 0) {
        showPage(currentPage);
      }
    }, [currentPage, allItems, isFirstLoad, showPage]);

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Função para avançar página
    const nextPage = useCallback(() => {
      if (currentPage < totalPages && !loading) {
        setCurrentPage(prev => prev + 1);
      }
    }, [currentPage, totalPages, loading]);

    // Função para voltar página
    const previousPage = useCallback(() => {
      if (currentPage > 1 && !loading) {
        setCurrentPage(prev => prev - 1);
      }
    }, [currentPage, loading]);

    // Função para recarregar dados (limpa cache)
    const reloadData = useCallback(() => {
      if (!loading) {
        dataCache.delete(cacheKey);
        setCurrentPage(1);
        setIsFirstLoad(true);
        loadAllData();
      }
    }, [loading, cacheKey, loadAllData]);

    // Função para resetar para primeira página
    const resetToFirstPage = useCallback(() => {
      setCurrentPage(1);
    }, []);

    // Expor funções via ref
    useImperativeHandle(ref, () => ({
      reloadData,
      resetToFirstPage,
      currentPage,
      totalPages,
      totalItems
    }), [reloadData, resetToFirstPage, currentPage, totalPages, totalItems]);

    // Calcular informações para exibição
    const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    // Não renderizar nada se não há dados e não está carregando
    if (totalItems === 0 && !loading) {
      return (
        <PaginationContainer>
          <PaginationInfo>Nenhum registro encontrado</PaginationInfo>
        </PaginationContainer>
      );
    }

    return (
      <PaginationContainer>
        <PaginationInfo>
          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <LoadingSpinner />
              Carregando...
            </div>
          ) : (
            `Mostrando ${startItem} a ${endItem} de ${totalItems} registros`
          )}
        </PaginationInfo>
        
        {totalPages > 1 && (
          <PaginationControls>
            <PaginationButton 
              onClick={previousPage} 
              disabled={currentPage === 1 || loading}
              title="Página anterior"
              aria-label="Página anterior"
            >
              <FaArrowLeft size={14} />
            </PaginationButton>

            <PageInfo>
              Página {currentPage} de {totalPages}
            </PageInfo>

            <PaginationButton 
              onClick={nextPage} 
              disabled={currentPage >= totalPages || loading}
              title="Próxima página"
              aria-label="Próxima página"
            >
              <FaArrowRight size={14} />
            </PaginationButton>
          </PaginationControls>
        )}
      </PaginationContainer>
    );
  }
);

PaginacaoComponent.displayName = 'PaginacaoComponent';