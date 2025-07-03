import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Sidebar } from './Style/Components/Sidebar/index';
import { Dashboard } from './Pages/Dashboard/Dashboard';
import { Automations } from './Pages/Automation/Automations';
import { Restaurantes } from './Pages/Database/Restaurantes/RestaurantePage';
import { Obras } from './Pages/Database/Obras/ObrasPage';
import { Funcionarios } from './Pages/Database/Funcionarios/FuncionariosPage';
import { Lancamentos } from './Pages/Database/Lancamentos/LancamentosCadastrados';
import { CronogramaLancamento } from './Pages/Cronograma/LancamentoPage';
import { CronogramaPlanejamento } from './Pages/Cronograma/Planejamento';
import { Patrimonio as CadastrarPatrimonio } from './Pages/Patrimonio/Cadastrar/CadastrarPatrimonio';
import { PatrimonioDB } from './Pages/Patrimonio/Cadastros/PatrimoniosCadastrados';
import { AlocarPatrimonio } from './Pages/Patrimonio/Alocacao/AlocarPatrimonio';

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
        { id: 'db1', label: 'Restaurantes', path: '/database/restaurantes' },
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
        { id: 'patri1', label: 'Cadastrar Patrimônio', path: '/patrimonio/cadastrar' },
        { id: 'patri2', label: 'Cadastros', path: '/patrimonio/cadastros' },
        { id: 'patri3', label: 'Alocar Patrimônio', path: '/patrimonio/alocar' }
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
          <Route path="/patrimonio/alocar" element={<AlocarPatrimonio />} />
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
      <App />
    </Router>
  );
}

export default AppWrapper;