# Iniciar o projeto
## Instalações
> ```npm init -y```
### Adicionar TS
> ```npm i -D typescript```
### Criar arquivo de Configuração TS (tsconfig.json)
> ```npx tsc --init```
- Modificar o target para: "ES2020"
### Instalar Fastify
> ```npm i fastify```
### Instalar @types
> ```npm install -D @types/node```
- converter arquivo em .js para executar a aplicação: ```npx tsc src/server.ts```
### Instalar TSX (Somente para ambiente de desenvolvimento)
> ```npm install tsx -D```
- Processo de converter o arquivo no comando de execução da aplicação: ```tsx src/server.ts```

### Instalar KNEX + Driver do Banco(DEV)
> ```npm install knex sqlite3```
- Query Builder

---
### ⚠️Error [ERR_MODULE_NOT_FOUND]
- Instalar ts-node
> ```npm install typescript ts-node @types/node -D```
---

### DotEnv
> ```npm install dotenv```

### ZOD (validador de dados)
> ```npm install zod```

### Cookies
> ```npm install @fastify/cookie```
- Para criar sessões
