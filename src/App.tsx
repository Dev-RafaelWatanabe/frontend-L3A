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
      label: 'Profile',
      onClick: () => console.log('Profile clicked')
    },
    {
      id: 3,
      label: 'Settings',
      onClick: () => console.log('Settings clicked')
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