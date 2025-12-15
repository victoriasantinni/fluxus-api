# 📮 Collections do Postman/Insomnia

Esta pasta contém a collection completa da API Fluxus para uso no Postman ou Insomnia.

## 📥 Download

- **Arquivo ZIP:** [`Fluxus_API.postman_collection.zip`](./Fluxus_API.postman_collection.zip)
- **Arquivo JSON:** [`Fluxus_API.postman_collection.json`](./Fluxus_API.postman_collection.json)

## 🚀 Como Usar

### No Postman

1. Abra o Postman
2. Clique em **"Import"** (canto superior esquerdo)
3. Selecione o arquivo `Fluxus_API.postman_collection.zip`
4. A collection será importada automaticamente

### No Insomnia

1. Abra o Insomnia
2. Clique em **"Create"** → **"Import From"** → **"File"**
3. Selecione o arquivo `Fluxus_API.postman_collection.json` (extraia do zip primeiro)
4. A collection será importada automaticamente

## ⚙️ Configuração

Após importar, configure as variáveis:

1. **`baseUrl`** - URL base da API:
   - **Produção:** `https://fluxus-api-service.onrender.com`
   - **Local:** `http://localhost:3000`

2. **`token`** - Token JWT (será preenchido automaticamente após fazer login)

## 📝 Endpoints Incluídos

- ✅ Criar Usuário
- ✅ Login (salva token automaticamente)
- ✅ Ver Perfil
- ✅ Listar Transações
- ✅ Ver Extrato/Saldo
- ✅ Buscar Transação por ID
- ✅ Criar Transação
- ✅ Atualizar Transação
- ✅ Deletar Transação
- ✅ Health Check
- ✅ Informações da API

## 💡 Dica

Após fazer login usando o endpoint "Login", o token será salvo automaticamente na variável `token` e todas as requisições protegidas usarão esse token automaticamente.

