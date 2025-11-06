import { useState } from 'react';
import { Container, Title, TabContainer, Tab, TabContent } from './styles';

export function Estoque() {
  const [activeTab, setActiveTab] = useState('controle-material');

  return (
    <Container>
      <Title>Estoque</Title>
      
      <TabContainer>
        <Tab 
          active={activeTab === 'controle-material'} 
          onClick={() => setActiveTab('controle-material')}
        >
          Controle de Material
        </Tab>
        <Tab 
          active={activeTab === 'frota'} 
          onClick={() => setActiveTab('frota')}
        >
          Frota
        </Tab>
      </TabContainer>

      <TabContent>
        {activeTab === 'controle-material' && (
          <div>
            <p>Página em desenvolvimento</p>
          </div>
        )}
        {activeTab === 'frota' && (
          <div>
            <p>Página em desenvolvimento</p>
          </div>
        )}
      </TabContent>
    </Container>
  );
}