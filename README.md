<h1 align="center">
  <br />
  Pillow Princess
  <br />
</h1>

<p align="center">
  <em>O clube exclusivo de pijamas e lingerie que você merecia.</em>
</p>

<p align="center">
  <img alt="React Native" src="https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img alt="Expo" src="https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" />
  <img alt="NestJS" src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" />
  <img alt="Zustand" src="https://img.shields.io/badge/Zustand-4A4A4A?style=for-the-badge&logo=react&logoColor=white" />
  <img alt="TanStack Query" src="https://img.shields.io/badge/TanStack_Query-FF4154?style=for-the-badge&logo=reactquery&logoColor=white" />
</p>

---

## Sobre o Projeto

**Pillow Princess** é um ecossistema de e-commerce mobile-first construído para oferecer uma experiência de compra fluida, visualmente atraente e exclusiva. O conceito da marca vai além de uma loja comum — é um clube de confiança para quem valoriza conforto e estética no seu íntimo.

O software foi projetado com foco em:

- **Experiência do usuário**: navegação fluida entre telas, feedback visual imediato e microinterações cuidadosas
- **Performance**: estado global eficiente com Zustand, cache inteligente de dados com TanStack Query e carregamento otimizado
- **Escalabilidade**: arquitetura modular por domínio (features), pronta para crescer junto com o negócio
- **Fidelidade à marca**: paleta de cores, tipografia e componentes 100% customizados para o universo Pillow Princess

---

## Demonstração

[Assista ao vídeo de demonstração no Google Drive](https://drive.google.com/drive/u/0/folders/1VqQnLJFxfQ1Yf8r4rg6T81i3MyrTyopY)

---

## Funcionalidades

| Feature | Descrição |
|---|---|
| **Autenticação** | Login e cadastro com validação, roles (admin / user) e persistência de sessão |
| **Home personalizada** | Saudação por nome, categorias, produtos em destaque e banners dinâmicos via API |
| **Catálogo dinâmico** | Filtro por categoria, busca, grade e lista — dados gerenciados por TanStack Query |
| **Detalhe do produto** | Seleção de tamanho e cor, galeria, preço promocional e "Adicionar ao carrinho" |
| **Carrinho inteligente** | Controle de quantidade, cálculo de frete automático e indicador de frete grátis |
| **Checkout em 3 etapas** | Endereço → Pagamento → Revisão, com estado persistente entre telas |
| **PIX com QR Code** | Geração de QR Code e código copia-e-cola ao finalizar com PIX |
| **Rastreamento de pedido** | Timeline de status em tempo real após a confirmação |
| **Perfil completo** | Gerenciamento de endereços, métodos de pagamento e histórico de pedidos |
| **Painel Admin** | Gestão de produtos exclusiva para administradores |

---

## Tecnologias Utilizadas

### Frontend — Mobile

| Tecnologia | Versão | Função |
|---|---|---|
| React Native | 0.76.3 | Base do app mobile cross-platform |
| Expo SDK | ~52.0 | Toolchain, build e APIs nativas |
| TypeScript | ^5.3 | Tipagem estática em todo o projeto |
| Expo Router | ~4.0 | Roteamento baseado em arquivos |
| Zustand | ^5.0 | Estado global (auth, cart, navigation, orders) |
| TanStack Query | ^5.62 | Cache e sincronização de dados servidor |
| NativeWind | 4.1.23 | Tailwind CSS para React Native |
| expo-linear-gradient | ~14.0 | Gradientes nas telas e componentes |

### Backend — API

| Tecnologia | Função |
|---|---|
| NestJS | Framework Node.js com arquitetura modular e escalável |
| TypeScript | Tipagem end-to-end entre frontend e backend |
| REST API | Endpoints para produtos, usuários, pedidos e anúncios |

### UI & Design System

- Componentes atômicos próprios: `Button`, `Input`, `Card`, `Badge`, `Toast`, `BottomNav`, `ScreenHeader`
- Tema centralizado em `src/styles/theme.ts` (cores, espaçamentos, border-radius)
- Design responsivo orientado a mobile (360–430px)
- Paleta exclusiva: `night #1C1018`, `deepRose #C45C75`, `cream #FDF6F0`

---

## Arquitetura

O projeto segue uma **arquitetura modular por domínio** (Feature-Sliced Design), separando responsabilidades de forma clara:

```
pillow-princess/
├── app/
│   └── index.tsx              # Entry point — roteamento de telas
├── src/
│   ├── @types/                # Tipos globais (Product, Order, User, Screen…)
│   ├── components/            # Design System — componentes reutilizáveis
│   │   ├── Button/
│   │   ├── Card/
│   │   ├── Input/
│   │   ├── Badge/
│   │   ├── Toast/
│   │   ├── BottomNav/
│   │   └── ScreenHeader/
│   ├── features/              # Domínios da aplicação
│   │   ├── auth/              # Login e cadastro
│   │   ├── home/              # Tela inicial
│   │   ├── products/          # Catálogo e detalhe de produto
│   │   ├── cart/              # Carrinho de compras
│   │   ├── checkout/          # Fluxo de pagamento
│   │   ├── orders/            # Histórico, rastreamento e pós-compra
│   │   ├── profile/           # Endereços e pagamentos do usuário
│   │   └── admin/             # Painel administrativo
│   ├── hooks/                 # Hooks de negócio (useAuth, useCart, useCheckout…)
│   ├── services/              # Camada de acesso a dados (queries TanStack, services)
│   ├── store/                 # Stores Zustand (auth, cart, navigation, orders…)
│   └── styles/                # Tema global e CSS
└── assets/                    # Imagens, ícones e splash screen
```

> **Princípio**: cada `feature/` é um módulo autossuficiente com sua própria UI. Os `hooks/` orquestram a lógica de negócio, consumindo `store/` (estado local) e `services/` (estado servidor).

---

## Como Rodar o Projeto

### Pré-requisitos

- Node.js >= 18
- npm >= 9
- Expo CLI (`npm install -g expo-cli`)
- Emulador Android/iOS **ou** navegador web

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/pillow-princess.git
cd pillow-princess
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Inicie o backend (NestJS)

```bash
cd backend
npm install
npm run start:dev
```

> A API estará disponível em `http://localhost:3000`

### 4. Inicie o app mobile (Expo)

```bash
# Na raiz do projeto
npx expo start

# Para rodar direto no navegador:
npx expo start --web

# Para Android:
npx expo start --android

# Para iOS:
npx expo start --ios
```

> Escaneie o QR Code com o app **Expo Go** (Android/iOS) ou acesse `http://localhost:8081` no navegador.

### 5. Acesso de demonstração

| Perfil | E-mail | Senha |
|---|---|---|
| Admin | `admin@pillowprincess.com` | `admin123` |
| Usuário | Cadastre-se no app | — |

---

## Contribuindo

1. Faça um fork do projeto
2. Crie uma branch: `git checkout -b feature/minha-feature`
3. Commit suas mudanças: `git commit -m 'feat: minha feature'`
4. Push para a branch: `git push origin feature/minha-feature`
5. Abra um Pull Request

---

## Licença

Distribuído sob a licença MIT. Veja `LICENSE` para mais informações.

---

<p align="center">
  Feito com 💕 e muito café por <strong>Clara Medeiros</strong>
</p>
