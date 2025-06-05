# PontoFácil

Sistema Web de Ponto Eletrônico Corporativo  
Projeto da disciplina de Arquitetura de Sistemas (Unifor)

---

## Estrutura do Projeto

- **usuario-service/**: microserviço em Java Spring Boot para gerenciamento de usuários  
- **api-gateway/**: roteador de requisições com Spring Cloud Gateway  
- **eureka-server/**: serviço de descoberta (Service Discovery com Eureka)  
- **frontend/**: aplicação React (Vite)  
- Backend integrado ao Supabase (REST e Auth Admin API)  
- Suporte a autenticação com funções: `admin`, `gestor`, `funcionário`  
- Aplicados os padrões: `MVC`, `DAO`, `Strategy`, `Factory`
- POA **implementado** com `AspectJ` para logging de ações administrativas
- Todas as operações com o banco são feitas exclusivamente no backend, o frontend apenas consome as APIs

---

## Requisitos

- Java 17 ou superior  
- Node.js 18 ou superior  
- Maven  
- Conta no Supabase (https://supabase.com)  
- Chave `service_role` do Supabase (somente para backend)

---

## Como rodar o projeto

### 1. Iniciar o Eureka Server

Entre na pasta `eureka-server`  
Execute: `./mvnw spring-boot:run` ou `mvn spring-boot:run`

### 2. Iniciar o API Gateway

Entre na pasta `api-gateway`  
Execute: `./mvnw spring-boot:run` ou `mvn spring-boot:run`

### 3. Iniciar o Microserviço de Usuário

Entre na pasta `usuario-service`  
Execute: `./mvnw spring-boot:run` ou `mvn spring-boot:run`  
Verifique se as variáveis `supabase.url`, `supabase.key` e `supabase.serviceKey` estão configuradas no `application.yml`

### 4. Iniciar o Microserviço de Registro

Entre na pasta `registro-service`  
Execute: `./mvnw spring-boot:run` ou `mvn spring-boot:run`  
Verifique se as variáveis `supabase.url`, `supabase.key` e `supabase.serviceKey` estão configuradas no `application.yml`

### 5. Iniciar o Frontend

Entre na pasta `frontend`  
Execute: `npm install`  
Depois: `npm run dev`

---

## Testes Manuais

- Utilize Postman para testar as rotas:
  - `POST /admin/cadastrar-usuario`
  - `PUT /admin/usuarios/{id}`
  - `DELETE /admin/usuarios/{id}`
  - `GET /usuarios/auth/{authId}`
  - `GET /usuarios/{id}`
  - `GET /usuarios/funcionarios`
  - `GET /registros/usuario/{usuarioId}`
  - `POST /registros/manual`
  - `PUT /registros/{registroId}`
  - `DELETE /registros/{registroId}`
- No painel do Supabase:
  - Verifique os dados na tabela `usuarios`
  - Acesse a aba `Authentication > Users` para validar os usuários criados

---

## Contribuindo

1. Clone o repositório do projeto  
2. Crie uma nova branch com o nome da feature:  
   `git checkout -b minha-feature`  
3. Faça commits com mensagens descritivas:  
   `git commit -m "minha feature"`  
4. Envie sua branch para o repositório remoto:  
   `git push origin minha-feature`
