# GymTechSystem

Sistema para gestão de academias, desenvolvido com foco em escalabilidade, manutenibilidade e experiência do usuário.

## Tecnologias Utilizadas

- **Vite** (v5.4.1)
- **React** (v18.3.1)
- **TypeScript** (v5.5.3)
- **Tailwind CSS** (v3.4.11)
- **shadcn/ui**
- **React Router DOM** (v6.26.2)
- **React Hook Form** (v7.53.0)
- **Zod** (v3.23.8)
- **@tanstack/react-query** (v5.56.2)
- **Recharts** (v2.12.7)

> Consulte o `package.json` para a lista completa de dependências e versões.

## Instalação

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

## Estrutura do Projeto

```
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

## Configurações

- **Porta padrão:** 8080
- **Alias:** `@` aponta para `src/`
- **Tailwind:** Customizações em `tailwind.config.ts` e animações via `tailwindcss-animate`
- **PostCSS:** Plugins `tailwindcss` e `autoprefixer`
- **TypeScript:** Configurações em `tsconfig.json` e `tsconfig.app.json`