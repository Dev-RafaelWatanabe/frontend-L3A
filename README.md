
# frontend-L3A

## Sobre o Projeto

Este projeto é o frontend do sistema de Rateio, desenvolvido com React, TypeScript e Vite. Ele fornece a interface visual para o usuário interagir com funcionalidades como gerenciamento de equipes, obras, cronogramas, patrimônios e lançamentos. O objetivo é facilitar o controle e a visualização de dados do sistema de Rateio de forma rápida e intuitiva.

## Estrutura de Pastas

```
frontend-L3A/
│
├── src/
│   ├── App.tsx                // Configuração de rotas e layout principal
│   ├── main.tsx               // Ponto de entrada do React
│   ├── Pages/                 // Páginas principais do sistema
│   │   ├── Dashboard/
│   │   ├── Automation/
│   │   ├── Database/
│   │   ├── Cronograma/
│   │   └── Patrimonio/
│   ├── Services/
│   │   ├── Api/               // Serviços de integração com backend
│   │   └── hooks/             // Hooks customizados
│   ├── Style/
│   │   ├── GlobalStyle.ts     // Estilos globais
│   │   └── Components/        // Componentes de estilo reutilizáveis
│   └── vite-env.d.ts
├── public/                    // Assets públicos (imagens, favicon)
├── package.json
├── tsconfig*.json
├── vite.config.ts
└── README.md
```

## Padrões e Tecnologias

- **Componentização:** Componentes reutilizáveis e organizados por página ou por função.
- **Estilização:** CSS-in-JS, geralmente com styled-components.
- **Gerenciamento de Estado:** Principalmente local (useState/useEffect), sem uso de Redux ou Context API global.
- **Rotas:** Definidas em `App.tsx` usando React Router.
- **Integração com Backend:** Centralizada em `src/Services/Api/Api.ts`.

## Como rodar o projeto

1. Instale as dependências:
   ```
   npm install
   ```
2. Inicie o servidor de desenvolvimento:
   ```
   npm run dev
   ```
3. Acesse no navegador:
   ```
   http://localhost:5173
   ```

## Recomendações para novos desenvolvedores

- Leia o código em `src/App.tsx` para entender as rotas e a navegação.
- Explore as pastas em `src/Pages` para conhecer as principais funcionalidades.
- Consulte `src/Services/Api` para ver como são feitas as integrações com o backend.
- Siga os padrões de componentes e estilos já existentes.
- Utilize o ESLint para manter a padronização do código.

---

## Configuração Avançada do ESLint

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
