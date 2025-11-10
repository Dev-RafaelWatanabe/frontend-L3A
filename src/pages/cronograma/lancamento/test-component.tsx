import React from 'react';

export const LancamentoPageTest: React.FC = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>🧪 Teste - Página de Lançamento</h1>
      <p>Se você está vendo esta mensagem, o componente básico está funcionando!</p>
      <ul>
        <li>✅ Importações React funcionando</li>
        <li>✅ Renderização básica funcionando</li>
        <li>✅ Roteamento funcionando</li>
      </ul>
      <p><strong>Próximo passo:</strong> Verificar carregamento de dados da API</p>
    </div>
  );
};

export default LancamentoPageTest;