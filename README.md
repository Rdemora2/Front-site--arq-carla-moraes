# 🌿 Carla Moraes - Arquitetura Paisagística

<div align="center">
  <img src="./public/images/logo/logo_full.webp" alt="Carla Moraes Logo" width="300">
  
  <p><strong>Há mais de 25 anos criando projetos paisagísticos exclusivos que harmonizam arquitetura e natureza</strong></p>
  
  [![Deploy Status](https://img.shields.io/github/deployments/Rdemora2/Front-site--arq-carla-moraes/production?label=vercel&logo=vercel)](https://arqcarlamoraes.com.br/)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
  [![Vite](https://img.shields.io/badge/Vite-latest-646CFF.svg)](https://vitejs.dev/)
</div>

## 🌟 Sobre o Projeto

Este é o site institucional da **Carla Moraes Arquitetura Paisagística**, uma empresa especializada em projetos paisagísticos exclusivos que combinam beleza natural com design contemporâneo. O site apresenta o portfólio da empresa, serviços oferecidos e facilita o contato com clientes potenciais.

### 🚀 Links de Acesso

- **🌐 Produção**: [arqcarlamoraes.com.br](https://arqcarlamoraes.com.br/)
- **📱 Staging**: [front-site-arq-carla-moraes.vercel.app](https://front-site-arq-carla-moraes.vercel.app/)
- **🔧 Desenvolvimento**: [front-site-arq-carla-moraes-git-dev](https://front-site-arq-carla-moraes-git-dev-roberto-moraes-projects.vercel.app/)

## 🛠️ Tecnologias Utilizadas

### Core Technologies

- **React 18.2.0**
- **Vite**
- **JavaScript (JSX)**

### Styling & UI

- **Styled Components 6.1.8**
- **Tailwind CSS 3.4.1**
- **Twin.macro 3.4.1**
- **Framer Motion 10.16.4**

### Navigation & UX

- **React Router DOM 6.22.1**
- **React Anchor Link Smooth Scroll**
- **React Modal 3.16.1**
- **React Slick 0.29.0**

### Developer Experience

- **Rollup Plugin Visualizer**
- **SVGR**
- **Babel Macros**

### Performance & SEO

- **Lazy Loading**
- **Code Splitting**
- **Image Optimization**
- **PWA Ready**

## 🏗️ Hospedagem

O projeto está hospedado na **Vercel**, oferecendo:

- ⚡ **Deploy automático** via Git
- 🌍 **CDN global** para performance otimizada
- 🔧 **Preview deployments** para cada PR
- 📊 **Analytics integrado**
- 🛡️ **HTTPS por padrão**

### Configuração de Branches

- `main` → Produção (arqcarlamoraes.com.br)
- `dev` → Ambiente de desenvolvimento

## 📊 Rollup Plugin Visualizer

O **Rollup Plugin Visualizer** é uma ferramenta essencial para análise e otimização de bundles JavaScript. Ele gera um relatório visual interativo que mostra:

### 🔍 O que analisa:

- **Tamanho dos módulos**: Visualiza o peso de cada dependência
- **Estrutura de dependências**: Mostra como os módulos se relacionam
- **Code splitting**: Exibe como o código foi dividido em chunks
- **Imports desnecessários**: Identifica bibliotecas subutilizadas

### 🎯 Como funciona:

1. **Executa durante o build** em modo desenvolvimento
2. **Gera arquivo `stats.html`** na raiz do projeto
3. **Abre automaticamente** no navegador após o build
4. **Análise interativa** com zoom e filtros

### 📈 Como analisar os resultados:

#### Interpretação do Gráfico:

- **Blocos grandes** = Dependências pesadas que podem precisar de otimização
- **Muitos blocos pequenos** = Possível fragmentação excessiva
- **Cores diferentes** = Diferentes tipos de módulos (node_modules, src, etc.)

#### Principais métricas:

- **Parsed Size**: Tamanho real dos arquivos
- **Stat Size**: Tamanho antes da minificação
- **Gzip Size**: Tamanho comprimido (mais próximo do real)

#### Dicas de otimização:

- 🔍 **Identifique bibliotecas grandes** desnecessárias
- 📦 **Verifique imports não utilizados**
- 🎯 **Analise se tree-shaking** está funcionando
- 📊 **Compare tamanhos** antes e depois de mudanças

### 🚀 Como usar:

```bash
npm run dev  # Gera stats.html automaticamente
```

O arquivo `stats.html` será criado na raiz e abrirá automaticamente mostrando a análise completa do bundle.

## 🔧 Configuração de Desenvolvimento Local

### Pré-requisitos

- **Node.js** (versão 16 ou superior)
- **npm** ou **yarn**
- **Git**

### 📥 Instalação

1. **Clone o repositório**:

```bash
git clone https://github.com/Rdemora2/Front-site--arq-carla-moraes.git
cd Front-site--arq-carla-moraes
```

2. **Instale as dependências**:

```bash
npm install
# ou
yarn install
```

3. **Configure as variáveis de ambiente**:

```bash
cp .env.example .env
```

4. **Execute o projeto**:

```bash
npm run dev
# ou
yarn dev
```

5. **Acesse no navegador**:

```
http://localhost:3000
```

### 📜 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento

# Build
npm run build        # Gera build de produção
npm run preview      # Preview do build de produção
```

### 🔧 Estrutura de Pastas

```
src/
├── components/             # Componentes reutilizáveis
│   ├── cards/             # Componentes de cartões e sliders
│   ├── errors/            # Componentes de tratamento de erro
│   ├── faqs/              # Componentes de FAQ
│   ├── features/          # Seções de features e destaques
│   ├── footers/           # Componentes de rodapé
│   ├── forms/             # Formulários de contato
│   ├── hero/              # Seções hero/banner
│   ├── misc/              # Utilitários diversos (MetaTags, Analytics)
│   ├── navbar/            # Componentes de navegação
│   └── testimonials/      # Seções de depoimentos
├── pages/                 # Páginas da aplicação
│   ├── Home.jsx           # Página inicial
│   ├── AboutUs.jsx        # Sobre nós
│   ├── ContactUs.jsx      # Contato
│   ├── BlogIndex.jsx      # Blog
│   └── ...                # Outras páginas
├── helpers/               # Utilitários e helpers
│   ├── AnimationRevealPage.jsx  # Animações de página
│   ├── ImageOptimizer.jsx       # Otimização de imagens
│   ├── useAnimatedNavToggler.jsx # Hook de navegação
│   └── ...                      # Outros helpers
├── hooks/                 # Custom React hooks
├── config/                # Configurações de ambiente
├── styles/                # Configurações de estilo global
├── assets/                # Recursos estáticos (ícones, imagens)
└── backup/                # Componentes de backup para referência
```

## 🎨 Features do Site

### 📱 Design Responsivo ✅

- Layout adaptável para desktop, tablet e mobile usando Tailwind CSS
- Componentes otimizados para diferentes tamanhos de tela (breakpoints configurados)
- Imagens responsivas com lazy loading via `ImageOptimizer.jsx`

### 🚀 Performance ✅

- **Code Splitting** implementado com React.lazy() e Suspense
- **Lazy Loading** de componentes e imagens (react-intersection-observer)
- **Bundle otimizado** com tree-shaking e configuração Vite
- **Manual Chunks** configurados para otimização de carregamento

### 🔍 SEO Otimizado ✅

- Meta tags estruturadas via componente `MetaTags.jsx`
- Open Graph e Twitter Cards configurados no `index.html`
- URLs canônicas implementadas
- **Robots.txt** configurado para indexação completa

### ♿ Acessibilidade ✅

- Componentes com `aria-label`, `aria-expanded` e `aria-hidden`
- Navegação por teclado implementada
- Textos alternativos em imagens (`alt` tags)
- Contraste adequado através do design system Tailwind

### 🌐 PWA Ready ✅

- **Manifest.json** configurado com ícones e tema
- Service Worker pronto para implementação
- Ícones de múltiplos tamanhos (16x16 a 512x512)
- Meta tags para dispositivos móveis

### 🔧 Melhorias à serem implementadas

- **Sitemap.xml**: Não implementado (mencionado como "automático" mas não encontrado)
- **Lighthouse Score**: Precisa ser validado (mencionado como "95+" mas não verificado)
- **Service Worker**: Manifest existe mas SW não está ativo
- **Estruturação Schema.org**: Poderia ser implementada para melhor SEO

## 👨‍💻 Desenvolvedor

**Roberto Moraes**

- 🌐 **GitHub**: [@Rdemora2](https://github.com/Rdemora2)
- 💼 **LinkedIn**: [Roberto Moraes Zarzur](https://www.linkedin.com/in/robertomoraeszarzur/)

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
