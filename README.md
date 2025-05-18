PontoFacil
Sistema Web de Ponto Eletronico Corporativo - Projeto de Arquitetura de Sistemas (Unifor)
Estrutura do Projeto
--------------------
- backend/: API em Node.js com Supabase
- frontend/: Aplicacao React (Vite)
- Suporte a autenticacao por funcao (admin, gestor, funcionario)
- Backend usa padroes MVC, DAO e Strategy

Requisitos
----------
- Node.js 18+
- Conta no Supabase: https://supabase.com

Como rodar o projeto
--------------------
1. Backend
----------
cd backend
npm install
npm run dev

2. Frontend
-----------
cd frontend
npm install
npm run dev

Testes Manuais
--------------
- Use ferramentas como Postman para testar as rotas protegidas
- Use o painel do Supabase para confirmar se registros e usuarios estao sendo salvos corretamente

Contribuindo
------------
1. Clone o projeto
2. Crie uma branch: git checkout -b minha-feature
3. Faca o commit: git commit -m 'minha feature'
4. Envie: git push origin minha-feature
