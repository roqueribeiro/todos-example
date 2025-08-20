# TODO List Full-Stack (Vue 3 + Tailwind + NestJS + Postgres)

Este monorepo contém dois projetos:

- frontend/ — Aplicação web (Vue 3 + Vite + TypeScript + TailwindCSS)
- backend/ — API REST (NestJS + TypeORM + Postgres)

Orquestração com Docker Compose, com containers separados para frontend, backend e banco de dados Postgres.

## Requisitos
- Docker e Docker Compose
- Porta 5173 (frontend), 3000 (backend) e 5432 (db) livres

## Executar com Docker
1. Crie um arquivo `.env` na raiz (opcional) ou use os padrões do `backend/.env.example` e `frontend/.env.example`.
2. Execute:
   ```bash
   docker compose up -d --build
   ```
3. Acesse:
   - Frontend: http://localhost:5173
   - Swagger (Backend): http://localhost:3000/docs

## Desenvolvimento local
Você também pode rodar separadamente sem Docker.

### Backend
1. Entre em `backend/` e crie `.env` com base em `.env.example`.
2. Suba um Postgres local ou via Docker:
   ```bash
   docker run --name todo-db -e POSTGRES_DB=todo -e POSTGRES_USER=todo -e POSTGRES_PASSWORD=todo -p 5432:5432 -d postgres:15-alpine
   ```
3. Instale dependências e rode:
   ```bash
   npm install
   npm run start:dev
   ```
4. Rodar migrations:
   ```bash
   npm run migration:run
   ```

### Frontend
1. Entre em `frontend/` e crie `.env` com base em `.env.example`.
2. Instale dependências e rode:
   ```bash
   npm install
   npm run dev
   ```
3. Por padrão, o frontend utiliza `VITE_API_BASE_URL=http://localhost:3000/api`.

## Estrutura e Padrões
- Vue 3 (Composition API), Vite, TypeScript, TailwindCSS, Pinia, Vue Router.
- NestJS, TypeORM, class-validator, Swagger em `/docs`.
- CRUD de tarefas com filtros, paginação e busca.
- Dockerfiles multi-stage prontos em `frontend/` e `backend/`.

## Endpoints esperados
- GET    /api/health
- GET    /api/tasks
- GET    /api/tasks/:id
- POST   /api/tasks
- PATCH  /api/tasks/:id
- DELETE /api/tasks/:id

## Variáveis de Ambiente
- Backend: `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS`, `DB_NAME`, `PORT`.
- Frontend: `VITE_API_BASE_URL`.

## Qualidade de Código
- ESLint + Prettier em ambos os projetos.
- EditorConfig na raiz.

## Observações
- Tipos em TypeScript em todo o projeto.
- Nomes dos pacotes: `todo-frontend` e `todo-backend`.
- O app deve funcionar após `docker compose up -d --build`.
