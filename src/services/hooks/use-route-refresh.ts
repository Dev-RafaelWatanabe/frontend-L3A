import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useRouteRefresh = () => {
  const location = useLocation();

  useEffect(() => {
    // Lista de rotas que precisam de refresh ao trocar
    const routesThatNeedRefresh = [
      '/patrimonio/alocacao',
      '/patrimonio/cadastros',
      '/patrimonio/cadastrar',
      '/patrimonio/'
    ];

    // Verifica se a rota atual está na lista
    const currentRouteNeedsRefresh = routesThatNeedRefresh.some(route => 
      location.pathname.startsWith(route)
    );

    // Verifica se houve mudança de seção (não apenas parâmetros)
    const previousPath = sessionStorage.getItem('previousPath');
    const currentPath = location.pathname;

    if (previousPath && currentRouteNeedsRefresh) {
      // Verifica se mudou de seção (ex: de alocacao para cadastros)
      const previousSection = previousPath.split('/')[2]; // ex: 'alocacao'
      const currentSection = currentPath.split('/')[2]; // ex: 'cadastros'

      if (previousSection !== currentSection && previousSection && currentSection) {
        console.log('🔄 Mudança de seção detectada:', { 
          from: previousSection, 
          to: currentSection 
        });
        
        // Força refresh da página (equivalente a Ctrl+F5)
        window.location.reload();
      }
    }

    // Atualiza o caminho anterior
    sessionStorage.setItem('previousPath', currentPath);
  }, [location]);
};