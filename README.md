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

- **React 18.2.0** - Biblioteca JavaScript para interfaces de usuário
- **Vite** - Ferramenta de build rápida e moderna
- **JavaScript (JSX)** - Linguagem de programação principal

### Styling & UI

- **Styled Components 6.1.8** - CSS-in-JS para estilização componetizada
- **Tailwind CSS 3.4.1** - Framework CSS utilitário
- **Twin.macro 3.4.1** - Integração entre Styled Components e Tailwind
- **Framer Motion 10.16.4** - Biblioteca de animações

### Navigation & UX

- **React Router DOM 6.22.1** - Roteamento SPA
- **React Anchor Link Smooth Scroll** - Navegação suave entre seções
- **React Modal 3.16.1** - Modais acessíveis
- **React Slick 0.29.0** - Carrossel de imagens

### Developer Experience

- **Rollup Plugin Visualizer** - Análise de bundle
- **SVGR** - Conversão de SVG em componentes React
- **Babel Macros** - Transformações de código em build time

### Performance & SEO

- **Lazy Loading** - Carregamento otimizado de componentes
- **Code Splitting** - Divisão automática do código
- **Image Optimization** - Otimização de imagens em WebP
- **PWA Ready** - Preparado para Progressive Web App

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
├── components/          # Componentes reutilizáveis
│   ├── cards/          # Componentes de cartões
│   ├── faqs/           # Componentes de FAQ
│   ├── features/       # Seções de features
│   ├── footers/        # Rodapés
│   ├── forms/          # Formulários
│   ├── hero/           # Seções hero
│   ├── navbar/         # Navegação
│   └── testimonials/   # Depoimentos
├── pages/              # Páginas da aplicação
├── helpers/            # Utilitários e helpers
├── styles/             # Configurações de estilo
├── assets/             # Recursos estáticos
└── backup/             # Componentes de backup
```

## 🎨 Features do Site

### 📱 Design Responsivo

- Layout adaptável para desktop, tablet e mobile
- Componentes otimizados para diferentes tamanhos de tela
- Imagens responsivas com lazy loading

### 🚀 Performance

- **Lighthouse Score**: 95+ em todas as métricas
- **Code Splitting** automático por rota
- **Lazy Loading** de componentes e imagens
- **Bundle otimizado** com tree-shaking

### 🔍 SEO Otimizado

- Meta tags estruturadas
- Open Graph para redes sociais
- Sitemap automático
- URLs amigáveis

### ♿ Acessibilidade

- Componentes acessíveis (ARIA)
- Navegação por teclado
- Alto contraste
- Textos alternativos em imagens

## 🤝 Contribuição

1. **Fork** o projeto
2. Crie uma **branch** para sua feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. **Push** para a branch (`git push origin feature/AmazingFeature`)
5. Abra um **Pull Request**

## 👨‍💻 Desenvolvedor

**Roberto Moraes**

- 🌐 **GitHub**: [@Rdemora2](https://github.com/Rdemora2)
- 💼 **LinkedIn**: [Roberto Moraes Zarzur](https://www.linkedin.com/in/robertomoraeszarzur/)

**Desenvolvido por:**

- 🏢 **Tivix Technologies**: [www.tivix.com.br](https://www.tivix.com.br/)

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

<div align="center">
  <p>Feito com ❤️ por <a href="https://www.tivix.com.br/">Tivix Technologies</a></p>
  <p><em>Transformando ideias em experiências digitais excepcionais</em></p>
</div>
