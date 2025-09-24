import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Sidebar } from './style/components/sidebar/index';
import Dashboard from './pages/dashboard/dashboard';
import { Automations } from './pages/automation/Automations';
import { Restaurantes } from './pages/database/restaurantes/restaurante-page';
import { Obras } from './pages/database/obras/obras-page';
import { Funcionarios } from './pages/database/funcionarios/funcionario-page';
import { Lancamentos } from './pages/database/lancamentos/lancamentos-cadastrados';
import { CronogramaLancamento } from './pages/cronograma/lancamento/lancamento-page';
import { CronogramaPlanejamento } from './pages/cronograma/planejamento/planejamento-page';
import { Patrimonio as CadastrarPatrimonio } from './pages/patrimonio/cadastrar/cadastrar-patrimonio';
import { PatrimonioDB } from './pages/patrimonio/cadastros/patrimonios-cadastrados';
import { AlocacaoPatrimonio } from './pages/patrimonio/alocacao/alocacao-patrimonio';
import { AlocacaoDetalhe } from './pages/patrimonio/alocacao/alocacao-detalhe';
import { PatrimonioDetalhe } from './pages/patrimonio/cadastros/patrimonio-detalhe';
import { ManutencaoPatrimonio } from './pages/patrimonio/manutencao/manutencao-patrimonio';
import { ManutencaoDetalhe } from './pages/patrimonio/manutencao/manutencao-detalhe';
import { useRouteRefresh } from './services/hooks/use-route-refresh';

// Componente wrapper para aplicar o hook
const AppWithRouteRefresh: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useRouteRefresh();
  return <>{children}</>;
};

function App() {
  const menuItems = [
    {
      id: 1,
      label: 'Dashboard',
      subItems: [
        { id: 'dash1', label: 'Visão Geral', path: '/dashboard/overview' },
        { id: 'dash2', label: 'Relatórios', path: '/dashboard/reports' }
      ]
    },
    {
      id: 2,
      label: 'Automações',
      subItems: [
        { id: 'auto1', label: 'Configurações', path: '/automations/settings' },
        { id: 'auto2', label: 'Histórico', path: '/automations/history' }
      ]
    },
    {
      id: 3,
      label: 'Banco de Dados',
      subItems: [
        { id: 'db1', label: 'Restaurantes', path: 'database/restaurantes' },
        { id: 'db2', label: 'Obras', path: '/database/obras' },
        { id: 'db3', label: 'Funcionários', path: '/database/funcionarios' },
        { id: 'db4', label: 'Lançamentos', path: '/database/lancamentos' },
      ]
    },
    {
      id: 4,
      label: 'Cronograma',
      subItems: [
        { id: 'crono1', label: 'Lançamento', path: '/cronograma/lancamento' },
        { id: 'crono2', label: 'Planejamento', path: '/cronograma/planejamento' }
      ]
    },
    {
      id: 5,
      label: 'Patrimônio',
      subItems: [
        { id: 'patri2', label: 'Cadastros', path: '/patrimonio/cadastros' },
        { id: 'patri3', label: 'Alocação', path: '/patrimonio/alocacao' },
        { id: 'patri4', label: 'Manutenção', path: '/patrimonio/manutencao' }
      ]
    }
  ];

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar items={menuItems} />
      <div style={{ marginLeft: '250px', padding: '20px', width: '100%' }}>
        <Routes>
          <Route path="/dashboard/overview" element={<Dashboard />} />
          <Route path="/dashboard/reports" element={<Dashboard />} />
          <Route path="/automations/settings" element={<Automations />} />
          <Route path="/automations/history" element={<Automations />} />
          <Route path="/database/restaurantes" element={<Restaurantes />} />
          <Route path="/database/obras" element={<Obras />} />
          <Route path="/database/funcionarios" element={<Funcionarios />} />
          <Route path="/database/lancamentos" element={<Lancamentos />} />
          <Route path="/cronograma/lancamento" element={<CronogramaLancamento />} />
          <Route path="/cronograma/planejamento" element={<CronogramaPlanejamento />} />
          <Route path="/patrimonio/cadastrar" element={<CadastrarPatrimonio />} />
          <Route path="/patrimonio/cadastros" element={<PatrimonioDB />} />
          <Route path="/patrimonio/alocacao" element={<AlocacaoPatrimonio />} />
          <Route path="/patrimonio/alocacao/detalhe/:id" element={<AlocacaoDetalhe />} />
          <Route path="/patrimonio/:id" element={<PatrimonioDetalhe />} />
          <Route path="/patrimonio/manutencao" element={<ManutencaoPatrimonio />} />
          {/* NOVA ROTA PARA DETALHES DA MANUTENÇÃO */}
          <Route path="/patrimonio/manutencao/detalhe/:id" element={<ManutencaoDetalhe />} />
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </div>
    </div>
  );
}

// Wrapper component para fornecer o Router
export function AppWrapper() {
  return (
    <Router>
      <AppWithRouteRefresh>
        <App />
      </AppWithRouteRefresh>
    </Router>
  );
}

export default AppWrapper;