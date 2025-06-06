import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Sidebar } from './Style/Components/Sidebar/index';
import { Dashboard } from './Pages/Dashboard/Dashboard';
import { Automations } from './Pages/Automation/Automations';
import { Restaurantes } from './Pages/Database/Restaurantes';
import { Obras } from './Pages/Database/Obras';
import { Funcionarios } from './Pages/Database/Funcionarios';
import { Lancamentos } from './Pages/Database/Lancamentos';

function App() {
  const navigate = useNavigate();

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
        { id: 'db1', label: 'Restaurantes', path: '/database/restaurants' },
        { id: 'db2', label: 'Obras', path: '/database/obras' },
        { id: 'db3', label: 'Funcionários', path: '/database/funcionarios' },
        { id: 'db4', label: 'Lançamentos', path: '/database/lancamentos' }
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
          <Route path="/database/restaurants" element={<Restaurantes />} />
          <Route path="/database/obras" element={<Obras />} />
          <Route path="/database/funcionarios" element={<Funcionarios />} />
          <Route path="/database/lancamentos" element={<Lancamentos />} />
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