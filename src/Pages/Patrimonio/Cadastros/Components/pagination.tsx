import { useState, useEffect, forwardRef, useImperativeHandle, useRef } from 'react';
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
} from '../Styles';

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
    console.log('🔧 PaginacaoComponent montado');
    
    const [currentPage, setCurrentPage] = useState(1);
    const [allItems, setAllItems] = useState<any[]>([]);
    const [totalItems, setTotalItems] = useState(0);
    const [loading, setLoading] = useState(false);
    const [dataLoaded, setDataLoaded] = useState(false); // ✅ Novo estado para controlar se dados foram carregados
    
    // Refs para controlar requisições
    const isRequestingRef = useRef(false);
    const hasInitializedRef = useRef(false);
    
    const cacheKey = 'patrimonio_lista';

    // Função para verificar se o cache é válido
    const isCacheValid = (key: string): boolean => {
      const cached = dataCache.get(key);
      if (!cached) return false;
      
      const now = Date.now();
      return (now - cached.timestamp) < CACHE_DURATION;
    };

    // Função para mostrar página específica (navegação local)
    const showPage = (page: number) => {
      if (allItems.length === 0) return;
      
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const pageItems = allItems.slice(startIndex, endIndex);
      
      console.log(`📄 Mostrando página ${page} (${pageItems.length} itens)`);
      onDataChange(pageItems, false);
    };

    // Função principal para carregar dados (COM PROTEÇÃO CONTRA LOOPS)
    const loadInitialData = async () => {
      // ✅ PROTEÇÕES CONTRA REQUISIÇÕES MÚLTIPLAS
      if (isRequestingRef.current) {
        console.log('⚠️ Requisição já em andamento, cancelando');
        return;
      }

      if (dataLoaded) {
        console.log('✅ Dados já carregados, não fazendo nova requisição');
        return;
      }

      if (hasInitializedRef.current) {
        console.log('✅ Componente já inicializado, não fazendo nova requisição');
        return;
      }

      // Verificar cache primeiro
      if (isCacheValid(cacheKey)) {
        console.log('📦 Dados encontrados em cache válido');
        const cached = dataCache.get(cacheKey)!;
        
        setAllItems(cached.data);
        setTotalItems(cached.total);
        setDataLoaded(true);
        hasInitializedRef.current = true;
        
        // Mostrar primeira página
        const pageItems = cached.data.slice(0, itemsPerPage);
        onDataChange(pageItems, false);
        return;
      }

      // Fazer requisição ao backend
      console.log('🌐 Fazendo requisição ao backend...');
      isRequestingRef.current = true;
      setLoading(true);
      onDataChange([], true);

      try {
        const response = await fetchData({ skip: 0 });
        console.log(`✅ ${response.data?.length || 0} itens recebidos do backend`);
        
        const items = response.data || [];
        
        // Armazenar no cache
        dataCache.set(cacheKey, {
          data: items,
          timestamp: Date.now(),
          total: items.length
        });
        
        setAllItems(items);
        setTotalItems(items.length);
        setDataLoaded(true); // ✅ Marcar como carregado
        hasInitializedRef.current = true;
        
        // Mostrar primeira página
        const pageItems = items.slice(0, itemsPerPage);
        onDataChange(pageItems, false);
        
      } catch (error) {
        console.error('❌ Erro ao carregar dados:', error);
        setAllItems([]);
        setTotalItems(0);
        onDataChange([], false);
      } finally {
        setLoading(false);
        isRequestingRef.current = false;
      }
    };

    // ✅ useEffect SIMPLIFICADO - executa apenas UMA VEZ
    useEffect(() => {
      console.log('🚀 useEffect inicial - carregando dados uma única vez');
      
      // Timeout para garantir que o componente esteja totalmente montado
      const timer = setTimeout(() => {
        loadInitialData();
      }, 100);

      return () => clearTimeout(timer);
    }, []); // ✅ Dependências VAZIAS - executa apenas na montagem

    // useEffect para navegação entre páginas (SEM fazer requisições)
    useEffect(() => {
      if (dataLoaded && allItems.length > 0) {
        showPage(currentPage);
      }
    }, [currentPage]); // Apenas currentPage como dependência

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Funções de navegação
    const nextPage = () => {
      if (currentPage < totalPages && !loading && dataLoaded) {
        console.log('➡️ Próxima página');
        setCurrentPage(prev => prev + 1);
      }
    };

    const previousPage = () => {
      if (currentPage > 1 && !loading && dataLoaded) {
        console.log('⬅️ Página anterior');
        setCurrentPage(prev => prev - 1);
      }
    };

    // Função para recarregar dados (limpa tudo e recarrega)
    const reloadData = () => {
      console.log('🔄 Recarregando dados...');
      
      // Limpar todos os controles
      dataCache.delete(cacheKey);
      setDataLoaded(false);
      hasInitializedRef.current = false;
      isRequestingRef.current = false;
      setCurrentPage(1);
      setAllItems([]);
      setTotalItems(0);
      
      // Recarregar
      setTimeout(() => {
        loadInitialData();
      }, 100);
    };

    // Expor funções via ref
    useImperativeHandle(ref, () => ({
      reloadData,
      resetToFirstPage: () => setCurrentPage(1),
      currentPage,
      totalPages,
      totalItems
    }));

    // Calcular informações para exibição
    const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    // ✅ Log de status para debug
    console.log(`📊 Status: dataLoaded=${dataLoaded}, items=${allItems.length}, loading=${loading}, page=${currentPage}/${totalPages}`);

    // Não renderizar controles se não há dados E não está carregando
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
              Carregando dados...
            </div>
          ) : (
            `Mostrando ${startItem} a ${endItem} de ${totalItems} registros`
          )}
        </PaginationInfo>
        
        {totalPages > 1 && dataLoaded && (
          <PaginationControls>
            <PaginationButton 
              onClick={previousPage} 
              disabled={currentPage === 1 || loading}
              title="Página anterior"
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