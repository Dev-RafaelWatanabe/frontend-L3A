import { useState } from 'react';
import { Container, Title, TabContainer, Tab, TabContent } from './styles';
import { OrcamentoList } from './orcamento-list';
import { OrcamentoForm } from './orcamento-form';
import { OrcamentoDetalhes } from './orcamento-detalhes';

export function OrcamentoPage() {
  const [activeTab, setActiveTab] = useState<'lista'|'novo'|'detalhes'>('lista');
  const [selectedId, setSelectedId] = useState<number | null>(null);

  function handleOpenDetails(id: number) {
    setSelectedId(id);
    setActiveTab('detalhes');
  }

  function handleCreated() {
    setActiveTab('lista');
  }

  return (
    <Container>
      <Title>Orçamento</Title>

      <TabContainer>
        <Tab active={activeTab === 'lista'} onClick={() => setActiveTab('lista')}>Lista</Tab>
        <Tab active={activeTab === 'novo'} onClick={() => setActiveTab('novo')}>Novo</Tab>
        <Tab active={activeTab === 'detalhes'} onClick={() => setActiveTab('detalhes')}>Detalhes</Tab>
      </TabContainer>

      <TabContent>
        {activeTab === 'lista' && <OrcamentoList onOpenDetails={handleOpenDetails} />}
        {activeTab === 'novo' && <OrcamentoForm onCreated={handleCreated} />}
        {activeTab === 'detalhes' && selectedId != null && (
          <OrcamentoDetalhes id={selectedId} onDeleted={() => setActiveTab('lista')} onUpdated={() => setActiveTab('lista')} />
        )}
      </TabContent>
    </Container>
  );
}

export default OrcamentoPage;