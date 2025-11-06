import { useState } from 'react';
import { Container, Title, TabContainer, Tab, TabContent } from './styles';
import { Restaurantes } from '../../database/restaurantes/restaurante-page';
import { Obras } from '../../database/obras/obras-page';

export function BancoDados() {
  const [activeTab, setActiveTab] = useState('restaurantes');

  return (
    <Container>
      <Title>Banco de Dados</Title>
      
      <TabContainer>
        <Tab 
          active={activeTab === 'restaurantes'} 
          onClick={() => setActiveTab('restaurantes')}
        >
          Restaurantes
        </Tab>
        <Tab 
          active={activeTab === 'obras'} 
          onClick={() => setActiveTab('obras')}
        >
          Obras
        </Tab>
      </TabContainer>

      <TabContent>
        {activeTab === 'restaurantes' && <Restaurantes />}
        {activeTab === 'obras' && <Obras />}
      </TabContent>
    </Container>
  );
}