# GymTechSystem

![GymTechSystem](https://img.shields.io/badge/GymTechSystem-React-blue?style=for-the-badge&logo=react) ![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?style=for-the-badge&logo=typescript) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-38bdf8?style=for-the-badge&logo=tailwindcss)

> **Sistema moderno e escalável para gestão de academias, focado em experiência do usuário, performance e facilidade de manutenção.**

---

## ✨ Visão Geral
O **GymTechSystem** é uma solução completa para academias, permitindo o controle de alunos, professores, planos, pagamentos, aulas e relatórios gerenciais. O sistema foi projetado para ser altamente modular, fácil de evoluir e com uma interface responsiva e agradável.

---

## 🚀 Tecnologias Utilizadas

- **[Vite](https://vitejs.dev/)** – Bundler ultrarrápido para desenvolvimento moderno
- **[React 18+](https://react.dev/)** – Biblioteca para construção de interfaces reativas
- **[TypeScript](https://www.typescriptlang.org/)** – Tipagem estática para maior robustez
- **[Tailwind CSS](https://tailwindcss.com/)** – Utilitários para estilização rápida e responsiva
- **[shadcn/ui](https://ui.shadcn.com/)** – Componentes UI modernos e acessíveis
- **[React Router DOM](https://reactrouter.com/)** – Gerenciamento de rotas SPA
- **[React Hook Form](https://react-hook-form.com/)** + **[Zod](https://zod.dev/)** – Formulários e validação
- **[@tanstack/react-query](https://tanstack.com/query/latest)** – Gerenciamento de estado assíncrono
- **[Recharts](https://recharts.org/)** – Gráficos e visualização de dados
- **[Lucide Icons](https://lucide.dev/)** – Ícones SVG modernos

> Consulte o `package.json` para a lista completa de dependências e versões.

---

## 🧩 Funcionalidades Principais

- **Dashboard**: Visão geral de alunos, planos, receitas e alertas
- **Gestão de Alunos**: Cadastro, edição, status, planos e vencimentos
- **Gestão de Professores**: Cadastro, especialidades e status
- **Gestão de Planos**: Criação, edição, valores e duração
- **Pagamentos**: Controle de mensalidades, status (pago, pendente, vencido) e métodos
- **Aulas**: Cadastro, agendamento, professores, alunos inscritos
- **Relatórios**: Visão gerencial, exportação em PDF, estatísticas
- **Autenticação**: Login, cadastro e perfil do usuário (simulado/local)
- **Interface Responsiva**: Layout adaptado para desktop e mobile

---

## 📁 Estrutura do Projeto

```text
src/
  components/        # Componentes reutilizáveis e páginas principais
  contexts/          # Contextos globais (ex: autenticação, dados)
  hooks/             # Hooks customizados
  lib/               # Utilitários e funções auxiliares
  pages/             # Páginas e rotas
  types/             # Tipos globais TypeScript
  utils/             # Funções utilitárias e validadores
  App.tsx            # Componente principal
  main.tsx           # Ponto de entrada da aplicação
```

---

## ⚙️ Instalação e Uso

1. **Clone o repositório:**
   ```sh
   git clone <URL_DO_REPOSITORIO>
   cd <NOME_DA_PASTA>
   ```

2. **Instale as dependências:**
   ```sh
   npm install
   ```

3. **Rodando o ambiente de desenvolvimento:**
   ```sh
   npm run dev
   ```

4. **Build para produção:**
   ```sh
   npm run build
   ```

5. **Preview do build:**
   ```sh
   npm run preview
   ```

6. **Lint:**
   ```sh
   npm run lint
   ```

---

## 🔒 Autenticação e Dados
- O sistema utiliza autenticação simulada/local para login, cadastro e perfil.
- Os dados (alunos, professores, planos, pagamentos, aulas) são mantidos em memória (Context API), ideal para testes e desenvolvimento.
- Para produção, recomenda-se integrar com uma API real (REST, GraphQL, Supabase, Firebase, etc).

---

## 🛠️ Configurações e Customizações
- **Porta padrão:** 8080
- **Alias:** `@` aponta para `src/`
- **Tailwind:** Customizações em `tailwind.config.ts` e animações via `tailwindcss-animate`
- **PostCSS:** Plugins `tailwindcss` e `autoprefixer`
- **TypeScript:** Configurações em `tsconfig.json` e `tsconfig.app.json`
