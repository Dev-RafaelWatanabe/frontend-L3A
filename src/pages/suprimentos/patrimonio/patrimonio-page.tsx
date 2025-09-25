import { useState } from 'react';
import { Container, Title, TabContainer, Tab, TabContent } from './styles';
import { PatrimonioDB } from '../../patrimonio/cadastros/patrimonios-cadastrados';
import { AlocacaoPatrimonio } from '../../patrimonio/alocacao/alocacao-patrimonio';
import { ManutencaoPatrimonio } from '../../patrimonio/manutencao/manutencao-patrimonio';

export function PatrimonioPage() {
  const [activeTab, setActiveTab] = useState('cadastros');

  return (
    <Container>
      <Title>Patrimônio</Title>
      
      <TabContainer>
        <Tab 
          active={activeTab === 'cadastros'} 
          onClick={() => setActiveTab('cadastros')}
        >
          Cadastros
        </Tab>
        <Tab 
          active={activeTab === 'alocacao'} 
          onClick={() => setActiveTab('alocacao')}
        >
          Alocação
        </Tab>
        <Tab 
          active={activeTab === 'manutencao'} 
          onClick={() => setActiveTab('manutencao')}
        >
          Manutenção
        </Tab>
      </TabContainer>

      <TabContent>
        {activeTab === 'cadastros' && <PatrimonioDB />}
        {activeTab === 'alocacao' && <AlocacaoPatrimonio />}
        {activeTab === 'manutencao' && <ManutencaoPatrimonio />}
      </TabContent>
    </Container>
  );
}