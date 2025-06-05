import React, { useEffect } from 'react';
import { Sidebar } from './Style/Components/Sidebar/index';
import { Axios } from './Services/Api/Api';

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

  useEffect(() => {
    Axios()
      .then(response => console.log('Conexão deu certo', response))
      .catch(error => console.error('Erro Axios:', error));
  }, []);

  return (
    <div>
      <Sidebar items={menuItems} />
    </div>
  );
}

export default App;