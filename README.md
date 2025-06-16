# 🏋️ GymTech System 🚀

Bem-vindo ao GymTech System, uma aplicação web completa para gerenciamento de academias. Este sistema robusto e intuitivo foi construído com tecnologias modernas para fornecer uma experiência de usuário fluida e eficiente para administradores de academias, instrutores e alunos.

![GymTech Dashboard](https://img.shields.io/badge/GymTech-Dashboard_Example-blue?style=for-the-badge&logo=react)

## ✨ Visão Geral

O GymTech System visa simplificar as operações diárias de uma academia, desde o cadastro de alunos e planos até o gerenciamento de aulas, pagamentos e relatórios. Com uma interface responsiva, ele se adapta a diferentes dispositivos, garantindo acessibilidade em desktops, tablets e smartphones.

## 🌟 Funcionalidades Principais

O sistema oferece uma gama de funcionalidades para cobrir todas as necessidades de uma academia moderna:

* 🔑 **Autenticação Segura:**
    * Registro de novos usuários (administradores/funcionários).
    * Login com e-mail e senha.
    * Rotas protegidas para garantir que apenas usuários autenticados acessem o sistema.
* 📊 **Dashboard Interativo:**
    * Visão geral com estatísticas chave, como total de alunos, alunos ativos, planos ativos e pagamentos.
    * Distribuição de alunos por planos.
    * Ações rápidas para funcionalidades comuns.
* 🎓 **Gerenciamento de Alunos:**
    * Cadastro, edição e exclusão de alunos.
    * Visualização da lista de alunos com busca e filtros.
    * Associação de alunos a planos.
    * Controle de status (ativo, inativo, expirado).
* 📝 **Gerenciamento de Planos:**
    * Criação, edição e exclusão de planos de academia.
    * Definição de nome, duração, preço e descrição para cada plano.
* 💰 **Gerenciamento de Pagamentos:**
    * Registro de pagamentos de alunos.
    * Visualização do histórico de pagamentos com status (pendente, pago, vencido).
    * Opção de marcar pagamentos como pagos e registrar método de pagamento.
* 👨‍🏫 **Gerenciamento de Professores:**
    * Cadastro, edição e exclusão de professores.
    * Gerenciamento de especialidades dos professores.
    * Controle de status (ativo, inativo).
* 🤸 **Gerenciamento de Aulas:**
    * Agendamento, edição e exclusão de aulas.
    * Associação de professores e definição de horários, tipo, local e capacidade máxima de alunos.
    * Visualização de aulas com informações detalhadas.
* 📄 **Relatórios:**
    * Visão geral dos dados da academia, incluindo estatísticas de alunos e pagamentos.
    * Identificação de alunos com planos próximos do vencimento.
    * Opção de exportar relatórios detalhados em PDF.
* 👤 **Perfil do Usuário:**
    * Atualização das informações do perfil do usuário autenticado (nome de usuário, nome completo).
    * Opção de alterar a senha.
* 📱 **Interface Responsiva:**
    * Layout adaptável para desktops e dispositivos móveis, garantindo uma boa experiência em qualquer tela.
    * Navegação mobile otimizada.

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído utilizando um stack moderno de tecnologias de desenvolvimento web:

* **Frontend:**
    * [React](https://reactjs.org/): Biblioteca JavaScript para construção de interfaces de usuário.
    * [TypeScript](https://www.typescriptlang.org/): Superset do JavaScript que adiciona tipagem estática.
    * [Vite](https://vitejs.dev/): Ferramenta de build extremamente rápida para desenvolvimento frontend.
    * [Tailwind CSS](https://tailwindcss.com/): Framework CSS utility-first para estilização rápida e customizável.
    * [shadcn/ui](https://ui.shadcn.com/): Coleção de componentes de UI reutilizáveis e acessíveis.
    * [React Router DOM](https://reactrouter.com/): Para gerenciamento de rotas na aplicação.
    * [TanStack React Query](https://tanstack.com/query/latest): Para fetching, caching, e atualização de dados de forma eficiente.
    * [Lucide React](https://lucide.dev/): Biblioteca de ícones SVG.
    * [Zod](https://zod.dev/): Para validação de schemas e dados.
    * [date-fns](https://date-fns.org/): Para manipulação de datas.
    * [Recharts](https://recharts.org/): Biblioteca de gráficos para React (utilizada no dashboard e relatórios).
    * [jsPDF](https://github.com/parallax/jsPDF): Para geração de relatórios em PDF.
* **Backend & Banco de Dados:**
    * [Supabase](https://supabase.io/): Plataforma open-source que oferece banco de dados PostgreSQL, autenticação, APIs instantâneas, e mais.
* **Linting & Formatação:**
    * [ESLint](https://eslint.org/): Para análise estática de código e identificação de padrões problemáticos.
* **Gerenciamento de Pacotes:**
    * [npm](https://www.npmjs.com/)

## 🚀 Começando

Siga estas instruções para configurar e rodar o projeto localmente.

### Pré-requisitos

* [Node.js](https://nodejs.org/) (versão LTS recomendada)
* [npm](https://www.npmjs.com/) (geralmente vem com o Node.js)

### Configuração do Ambiente

1.  **Clone o repositório:**
    ```bash
    git clone <URL_DO_SEU_REPOSITORIO_GIT>
    cd gymtechsystem # ou o nome da pasta do seu projeto
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```
   

3.  **Configuração do Supabase:**
    O projeto utiliza Supabase para backend e banco de dados. As credenciais do Supabase estão configuradas em `src/integrations/supabase/client.ts`.
    Para um ambiente de desenvolvimento seguro, é recomendado utilizar variáveis de ambiente.

    * Crie um arquivo `.env` na raiz do projeto.
    * Adicione as seguintes variáveis com suas credenciais do Supabase:
        ```env
        VITE_SUPABASE_URL=SUA_SUPABASE_URL
        VITE_SUPABASE_ANON_KEY=SUA_SUPABASE_ANON_KEY
        ```
    * Modifique o arquivo `src/integrations/supabase/client.ts` para usar essas variáveis de ambiente:
        ```typescript
        // src/integrations/supabase/client.ts
        import { createClient } from '@supabase/supabase-js';

        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseAnonKey) {
          throw new Error("Supabase URL and Anon Key must be defined in .env file");
        }

        export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
          auth: {
            storage: localStorage,
            persistSession: true,
            autoRefreshToken: true,
          }
        });
        ```
    * **Observação:** Certifique-se de que as tabelas e funções necessárias estejam configuradas no seu projeto Supabase conforme as definições em `src/integrations/supabase/types.ts`.

### Rodando o Servidor de Desenvolvimento

Para iniciar o servidor de desenvolvimento com recarregamento automático:

```bash
npm run dev
Isto irá iniciar a aplicação Vite, geralmente na porta http://localhost:8080.

📂 Estrutura de Pastas
A estrutura de pastas do projeto é organizada da seguinte forma:

gymtechsystem/
├── public/                 # Arquivos estáticos (robots.txt, favicon)
├── src/
│   ├── components/         # Componentes React da aplicação
│   │   └── ui/             # Componentes shadcn/ui customizados
│   ├── contexts/           # Context API providers (AuthContext, SupabaseDataProvider)
│   ├── hooks/              # Hooks customizados (useStudents, useAuth, etc.)
│   ├── integrations/       # Integrações com serviços externos (Supabase)
│   │   └── supabase/
│   │       ├── client.ts   # Configuração do cliente Supabase
│   │       └── types.ts    # Tipos gerados pelo Supabase (schema do DB)
│   ├── lib/                # Funções utilitárias gerais (ex: cn)
│   ├── pages/              # Componentes de página (Index, NotFound)
│   ├── types/              # Definições de tipos TypeScript globais
│   ├── utils/              # Utilitários específicos (validators, dataTransforms)
│   ├── App.css             # Estilos globais para App
│   ├── App.tsx             # Componente principal da aplicação e configuração de rotas
│   ├── index.css           # Estilos Tailwind CSS e customizações base
│   └── main.tsx            # Ponto de entrada da aplicação React
├── tailwind.config.ts      # Configuração do Tailwind CSS
├── vite.config.ts          # Configuração do Vite
├── tsconfig.json           # Configuração principal do TypeScript
├── package.json            # Metadados do projeto e dependências
└── README.md               # Este arquivo

📜 Scripts Disponíveis
No package.json, você encontrará os seguintes scripts:

npm run dev: Inicia o servidor de desenvolvimento Vite.
npm run build: Compila a aplicação para produção.
npm run build:dev: Compila a aplicação para produção em modo de desenvolvimento.
npm run lint: Executa o ESLint para verificar erros de código.
npm run preview: Inicia um servidor local para visualizar a build de produção.