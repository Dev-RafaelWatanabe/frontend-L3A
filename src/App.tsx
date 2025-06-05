import { Sidebar } from './Style/Components/Sidebar/index';

function App() {
  const menuItems = [
    {
      id: 1,
      label: 'Dashboard',
      onClick: () => console.log('Dashboard clicked')
    },
    {
      id: 2,
      label: 'Automações',
      onClick: () => console.log('Profile clicked')
    }
  ];

  return (
    <div>
      <Sidebar items={menuItems} />
      {/* Resto do seu conteúdo */}
    </div>
  );
}

export default App;