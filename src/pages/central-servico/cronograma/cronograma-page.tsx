import { useState } from 'react';
import { Container, Title, TabContainer, Tab, TabContent } from './styles';
import { CronogramaPlanejamento } from '../../cronograma/planejamento/planejamento-page';
import { CronogramaLancamento } from '../../cronograma/lancamento/lancamento-page';

export function CronogramaPage() {
  const [activeTab, setActiveTab] = useState('planejamento');

  return (
    <Container>
      <Title>Cronograma</Title>
      
      <TabContainer>
        <Tab 
          active={activeTab === 'planejamento'} 
          onClick={() => setActiveTab('planejamento')}
        >
          Planejamento
        </Tab>
        <Tab 
          active={activeTab === 'lancamento'} 
          onClick={() => setActiveTab('lancamento')}
        >
          Lançamento
        </Tab>
      </TabContainer>

      <TabContent>
        {activeTab === 'planejamento' && <CronogramaPlanejamento />}
        {activeTab === 'lancamento' && <CronogramaLancamento />}
      </TabContent>
    </Container>
  );
}