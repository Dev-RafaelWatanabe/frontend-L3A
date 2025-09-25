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

// Novas páginas
import { Indicadores } from './pages/engenharia/indicadores/indicadores-page';
import { GestaoObra } from './pages/engenharia/gestao-obra/gestao-obra-page';
import { CronogramaPage } from './pages/central-servico/cronograma/cronograma-page';
import { BancoDados } from './pages/central-servico/banco-dados/banco-dados-page';
import { PerfilPersonalidade } from './pages/rh/perfil-personalidade/perfil-personalidade-page';
import { PatrimonioPage } from './pages/suprimentos/patrimonio/patrimonio-page';
import { Estoque } from './pages/suprimentos/estoque/estoque-page';
import { Leads } from './pages/comercial/leads/leads-page';
import { ControleCustos } from './pages/financeiro/controle-custos/controle-custos-page';

// Componente wrapper para aplicar o hook
const AppWithRouteRefresh: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useRouteRefresh();
  return <>{children}</>;
};

function App() {
  const menuItems = [
    {
      id: 1,
      label: 'Engenharia',
      subItems: [
        { id: 'eng1', label: 'Indicadores', path: '/engenharia/indicadores' },
        { id: 'eng2', label: 'Gestão de Obra', path: '/engenharia/gestao-obra' }
      ]
    },
    {
      id: 2,
      label: 'Central de Serviço',
      subItems: [
        { id: 'cs1', label: 'Cronograma', path: '/central-servico/cronograma' },
        { id: 'cs2', label: 'Banco de Dados', path: '/central-servico/banco-dados' }
      ]
    },
    {
      id: 3,
      label: 'RH',
      subItems: [
        { id: 'rh1', label: 'Funcionários', path: '/rh/funcionarios' },
        { id: 'rh2', label: 'Perfil de Personalidade', path: '/rh/perfil-personalidade' }
      ]
    },
    {
      id: 4,
      label: 'Suprimentos',
      subItems: [
        { id: 'sup1', label: 'Patrimônio', path: '/suprimentos/patrimonio' },
        { id: 'sup2', label: 'Estoque', path: '/suprimentos/estoque' }
      ]
    },
    {
      id: 5,
      label: 'Comercial',
      subItems: [
        { id: 'com1', label: 'Leads', path: '/comercial/leads' }
      ]
    },
    {
      id: 6,
      label: 'Financeiro',
      subItems: [
        { id: 'fin1', label: 'Controle de Custos', path: '/financeiro/controle-custos' }
      ]
    }
  ];

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar items={menuItems} />
      <div style={{ marginLeft: '250px', padding: '20px', width: '100%' }}>
        <Routes>
          {/* Engenharia */}
          <Route path="/engenharia/indicadores" element={<Indicadores />} />
          <Route path="/engenharia/gestao-obra" element={<GestaoObra />} />
          
          {/* Central de Serviço */}
          <Route path="/central-servico/cronograma" element={<CronogramaPage />} />
          <Route path="/central-servico/banco-dados" element={<BancoDados />} />
          
          {/* RH */}
          <Route path="/rh/funcionarios" element={<Funcionarios />} />
          <Route path="/rh/perfil-personalidade" element={<PerfilPersonalidade />} />
          
          {/* Suprimentos */}
          <Route path="/suprimentos/patrimonio" element={<PatrimonioPage />} />
          <Route path="/suprimentos/estoque" element={<Estoque />} />
          
          {/* Comercial */}
          <Route path="/comercial/leads" element={<Leads />} />
          
          {/* Financeiro */}
          <Route path="/financeiro/controle-custos" element={<ControleCustos />} />

          {/* Rotas antigas mantidas para compatibilidade */}
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