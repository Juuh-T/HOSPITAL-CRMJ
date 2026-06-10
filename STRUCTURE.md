# 📁 Estrutura do Projeto - HOSPITAL-CRMJ

## 🏗️ Visão Geral

A estrutura foi reorganizada seguindo boas práticas de desenvolvimento web, com separação clara entre frontend, backend e dados.

```
HOSPITAL-CRMJ/
├── 📄 index.html              ← PÁGINA PRINCIPAL (Login)
├── 📄 README.md
├── 📄 STRUCTURE.md            ← Este arquivo
│
├── 📁 public/                 ← Arquivos públicos (CSS, JS, imagens)
│   ├── css/
│   │   ├── index.css          ← Estilos da página de login
│   │   ├── cadastro.css
│   │   ├── paciente.css
│   │   └── profissionais.css
│   ├── js/
│   │   ├── index.js           ← Scripts da página de login
│   │   ├── cadastro.js
│   │   ├── paciente.js
│   │   └── profissionais.js
│   └── images/                ← Imagens da aplicação
│
├── 📁 pages/                  ← Páginas HTML secundárias
│   ├── cadastro.html          ← Cadastro de profissionais
│   ├── paciente.html          ← Painel de pacientes
│   └── profissionais.html     ← Gerenciamento de profissionais
│
├── 📁 api/                    ← Backend (PHP)
│   ├── config/
│   │   └── conexao.php        ← Conexão com banco de dados
│   ├── auth/                  ← Autenticação
│   │   ├── login.php
│   │   ├── logout.php
│   │   └── verificar_sessao.php
│   └── medicos/               ← Endpoints de médicos
│       └── cadastrar_medico.php
│
├── 📁 database/               ← Scripts e schema do banco
│   └── schema.sql             ← Criação das tabelas
│
├── 📁 config/                 ← Configurações globais
│   └── config.php             ← Variáveis de ambiente e constantes
│
└── 📁 .git/                   ← Controle de versão
```

## 🚀 Como Começar

### 1️⃣ Fluxo de Acesso
- Abra **`index.html`** no navegador
- Faça login com suas credenciais
- Será redirecionado para o painel apropriado (paciente ou profissional)

### 2️⃣ Estrutura de URLs Relativas
Todos os arquivos usam caminhos relativos:
- De `index.html` → `public/css/index.css`
- De `pages/cadastro.html` → `../public/css/cadastro.css`
- De `public/js/index.js` → `./api/auth/login.php`
- De `public/js/paciente.js` → `../api/auth/logout.php`

### 3️⃣ Banco de Dados
Execute o script de criação:
```sql
-- Importar schema.sql no seu banco MySQL
mysql -u root -p hospital_crmj < database/schema.sql
```

## 📋 Guia de Pastas

| Pasta | Propósito | Tipos de Arquivo |
|-------|----------|------------------|
| `public/` | Arquivos estáticos servidos ao cliente | CSS, JS, imagens |
| `pages/` | Páginas HTML secundárias | HTML |
| `api/` | Endpoints PHP do backend | PHP |
| `database/` | Scripts SQL | SQL |
| `config/` | Configurações globais | PHP, ENV |

## 🔄 Fluxo de Dados

```
index.html
    ↓
public/js/index.js (fetch)
    ↓
api/auth/login.php
    ↓
api/config/conexao.php (conexão ao BD)
    ↓
Banco de Dados (MySQL)
```

## 🔐 Segurança

- Arquivo `config/config.php` centraliza todas as configurações
- Conexões ao banco via `api/config/conexao.php`
- Verificação de sessão em `api/auth/verificar_sessao.php`
- Implementação de LGPD conforme documentado no README

## 📝 Notas Importantes

1. **Primeiro arquivo a abrir:** `index.html` (na raiz)
2. **Não alterar:** Nomes de pasta da estrutura API (podem quebrar referências)
3. **Atualizar:** `config/config.php` com dados do seu banco MySQL
4. **Caminhos:** Sempre usar caminhos relativos para portabilidade

## 🛠️ Desenvolvimento

### Adicionar Nova Página
1. Criar arquivo em `pages/nova_pagina.html`
2. Linkar CSS de `../public/css/nova_pagina.css`
3. Linkar JS de `../public/js/nova_pagina.js`
4. Criar arquivo JS em `public/js/nova_pagina.js` se necessário

### Adicionar Novo Endpoint API
1. Criar arquivo em `api/secao/novo_endpoint.php`
2. Importar `config/conexao.php` no início
3. Usar fetch() em um JS com caminho relativo apropriado

---

**Última atualização:** 09/06/2026  
**Responsável:** Estrutura reorganizada para melhor manutenibilidade
