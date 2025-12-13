# ⚠️ ATENÇÃO: Convenções de Nomenclatura da API

Todas as rotas da API (Controllers, Services e Schemas) foram desenvolvidas pela Dupla 3 utilizando o idioma Português para a nomenclatura dos campos.

**Isto é CRÍTICO para o envio de dados via JSON.**

## 1. Nomenclatura dos Campos (Payload JSON)

Ao enviar dados para as rotas POST e PUT (ex: /transactions), utilize a nomenclatura em Português:

| Inglês (NÃO USAR) | Português (Obrigatório) |
| :--- | :--- |
| `description` | `descricao` |
| `amount` | `valor` |
| `type` | `tipo` |
| `category` | `categoria` |
| `userId` | `userId` (Manter em camelCase) |

## 2. Valores Válidos para Enum

Ao preencher o campo `tipo`, utilize apenas os valores definidos no schema:

* "receita" (e não "income")
* "despesa" (e não "outcome")

## 3. Restrições de Validação (Zod)

Para garantir a qualidade dos dados e a segurança, todos os dados enviados às rotas de `POST` e `PUT` (usuário e transações) passam por validações rígidas. O envio de dados que violem estas regras resultará em um erro **400 Bad Request**.

### A. Criação/Login de Usuário

| Campo | Restrição de Validação | Observação |
| :--- | :--- | :--- |
| **`email`** | Deve ser um formato de e-mail válido. | Ex: `usuario@dominio.com` |
| **`senha`** | Mínimo de 6 caracteres. | Segurança mínima exigida. |

### B. Criação/Atualização de Transação

| Campo | Restrição de Validação | Observação |
| :--- | :--- | :--- |
| **`valor`** | Deve ser um número positivo (maior que zero). | Transações negativas não são permitidas. |
| **`tipo`** | Deve ser apenas `"receita"` ou `"despesa"`. | Não aceita outros textos. |
| **`descricao`** | Obrigatório e não pode ser vazio. | |