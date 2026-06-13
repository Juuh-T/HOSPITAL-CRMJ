# 🏥 HOSPITAL-CRMJ

> **CRM Hospitalar com Foco em Diagnóstico de Síndrome do X Frágil**

Um sistema completo de gerenciamento de pacientes e profissionais de saúde, desenvolvido como projeto acadêmico para a disciplina de **Experiência Criativa** no curso de **Bacharelado em Ciência da Computação (BCC)** - 3º período da PUC-PR.

---

## 📋 Sumário

- [Sobre o Projeto](#-sobre-o-projeto)
- [Stack de Tecnologias](#-stack-de-tecnologias)
- [Funcionalidades](#-funcionalidades)
- [Requisitos](#-requisitos)
- [Instalação](#-instalação)
- [Como Usar](#-como-usar)
- [Demonstração](#-demonstração)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Banco de Dados](#-banco-de-dados)
- [API Endpoints](#-api-endpoints)
- [Segurança e LGPD](#-segurança-e-lgpd)
- [Contribuidores](#-contribuidores)

---

## 🎯 Sobre o Projeto

O **HOSPITAL-CRMJ** é um sistema web de gerenciamento de pacientes que permite:

- 👨‍⚕️ **Médicos** cadastrarem e acessarem fichas de pacientes de forma segura
- 🏥 **Administradores** gerenciarem profissionais cadastrados no sistema
- 📋 **Triagem Clínica** com checklist de 12 sintomas relacionados à Síndrome do X Frágil
- 📊 **Relatórios** em PDF com histórico de exames
- 🔐 **Controle de acesso** baseado em permissões de usuário
- 📱 **Proteção de dados** conforme LGPD

---

## 💻 Stack de Tecnologias

| Componente | Tecnologia |
|-----------|-----------|
| **Frontend** | HTML5, CSS3, JavaScript (Vanilla) |
| **Backend** | PHP 7.4+ |
| **Banco de Dados** | MySQL 8.0+ |
| **Configuração** | .env (variáveis de ambiente) |
| **Relatórios** | FPDF (geração de PDF) |
| **Servidor** | Apache (XAMPP) |
| **Versionamento** | Git |

---

## ✨ Funcionalidades

### 🔐 Autenticação
- [x] Login com CRM ou nome de usuário
- [x] Verificação de sessão
- [x] Logout com segurança
- [x] Modo médico com alternância de perfil
- [x] Verificação de permissões (ADM)

### 👨‍⚕️ Gerenciamento de Médicos
- [x] Cadastro de novos profissionais
- [x] Listagem de médicos com status
- [x] Alteração de status (ATIVO/FÉRIAS/DESATIVADO)
- [x] Auditoria de aceitação de termos
- [x] Controle de tipo (MÉDICO/ADM)

### 🏥 Gerenciamento de Pacientes
- [x] Cadastro de pacientes
- [x] Listagem de pacientes
- [x] Painel do paciente com histórico
- [x] Registro de acompanhantes/responsáveis legais

### 📋 Triagem Clínica
- [x] Checklist de 12 sintomas clínicos
- [x] Gravação de resultados
- [x] Histórico de exames
- [x] Validação de dados

### 📄 Relatórios
- [x] Geração de PDF com histórico completo
- [x] Listagem de relatórios
- [x] Download seguro de documentos

### 🔑 Controle de Acesso
- [x] Autenticação segura com CRM
- [x] Validação de permissões por tipo de usuário
- [x] Controle de permissões por paciente
- [x] Gerenciamento de roles (MÉDICO/ADM)

---

## 📦 Requisitos

### Softwares Necessários
- **XAMPP** (Apache + MySQL + PHP) ou equivalente
- **PHP** 7.4+
- **MySQL** 8.0+
- **Navegador moderno** (Chrome, Firefox, Safari, Edge)
- **Git**

### Dependências PHP
- **FPDF** (incluído no projeto para geração de PDF)
- **PHP dotenv** ou suporte nativo a .env

---

## 🚀 Instalação

### 1. Clonar o Repositório

```bash
cd c:\xampp\htdocs
git clone https://github.com/Juuh-T/HOSPITAL-CRMJ.git
cd HOSPITAL-CRMJ
```

### 2. Configurar o Banco de Dados

Abra o **phpMyAdmin** e:

1. Crie um banco de dados chamado `hospital_crmj`:
```sql
CREATE DATABASE hospital_crmj CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. Importe o schema:
```bash
mysql -u root -p hospital_crmj < database/schema.sql
```

Ou pelo phpMyAdmin:
- Acesse: `http://localhost/phpmyadmin`
- Selecione o banco `hospital_crmj`
- Clique em "Importar"
- Escolha o arquivo `database/schema.sql`

### 3. Configurar Variáveis de Ambiente

1. Copie o arquivo `.env.example` para `.env`:
```bash
cp .env.example .env
```

2. Edite o arquivo `.env` com suas configurações:
```env
# Banco de Dados
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=hospital_crmj
DB_PORT=3306
DB_CHARSET=utf8mb4

# Aplicação
BASE_URL=http://localhost/HOSPITAL-CRMJ
DEBUG_MODE=true
SESSION_TIMEOUT=3600
```

⚠️ **Importante**: O arquivo `.env` é ignorado pelo Git e não deve ser commitado. Sempre use `.env.example` como template.

### 4. Iniciar o Servidor

```bash
# Se usar XAMPP
cd C:\xampp
apache_start.bat
mysql_start.bat

# Abra no navegador:
http://localhost/HOSPITAL-CRMJ
```

---

## 💡 Como Usar

### 🔑 Primeiro Acesso

1. **Acesse a página de login**: `http://localhost/HOSPITAL-CRMJ`
2. **Use credenciais de teste** ou cadastre um novo médico
3. **Para proteger dados**: A primeira vez, aceite os termos de confidencialidade

### 👨‍⚕️ Se for Médico

1. Faça login com seu CRM
2. Visualize lista de pacientes autorizados
3. Solicite autorização para novos pacientes (PIN será enviado ao acompanhante)
4. Acesse a ficha do paciente e realize triagem clínica
5. Gere relatórios em PDF

### 🔧 Se for Administrador

1. Faça login com sua conta ADM
2. Acesse "Profissionais" para gerenciar médicos
3. Ative, desative ou mude status de profissionais
4. Visualize auditoria de aceitação de termos

---

## 🎬 Demonstração

Assista a um vídeo de demonstração completa do sistema:

[![Demonstração do HOSPITAL-CRMJ](https://img.youtube.com/vi/cCWhcnVNFeg/0.jpg)](https://youtu.be/cCWhcnVNFeg "Demonstração do HOSPITAL-CRMJ")

[▶️ Clique aqui para assistir](https://youtu.be/cCWhcnVNFeg)

---

## 📁 Estrutura do Projeto

```
HOSPITAL-CRMJ/
├── 📄 index.html                  ← Página de Login (entry point)
├── 📄 README.md                   ← Este arquivo
├── 📄 STRUCTURE.md                ← Documentação de estrutura
│
├── 📁 public/                     ← Arquivos públicos (Frontend)
│   ├── css/
│   │   ├── index.css              ← Estilos da página de login
│   │   ├── cadastro.css           ← Estilos do cadastro
│   │   ├── paciente.css           ← Estilos do painel do paciente
│   │   ├── profissionais.css      ← Estilos do painel de profissionais
│   │   └── relatorio.css          ← Estilos do relatório
│   └── js/
│       ├── index.js               ← Scripts da página de login
│       ├── cadastro.js            ← Scripts do cadastro
│       ├── paciente.js            ← Scripts do painel do paciente
│       ├── profissionais.js       ← Scripts do painel de profissionais
│       └── relatorio.js           ← Scripts do relatório
│
├── 📁 pages/                      ← Páginas HTML secundárias
│   ├── cadastro.html              ← Cadastro de profissionais
│   ├── cadastro-paciente.html     ← Cadastro de pacientes
│   ├── paciente.html              ← Painel de pacientes
│   ├── profissionais.html         ← Gerenciamento de profissionais
│   └── relatorio.html             ← Visualização de relatórios
│
├── 📁 api/                        ← Backend (PHP) - Endpoints
│   ├── auth/                      ← Autenticação
│   │   ├── login.php              ← Endpoint de login
│   │   ├── logout.php             ← Endpoint de logout
│   │   ├── verificar_sessao.php   ← Verifica sessão ativa
│   │   ├── assumir_medico.php     ← Alterna perfil de médico
│   │   ├── sair_modo_medico.php   ← Sai do modo médico
│   │   └── verificar_adm.php      ← Verifica permissão ADM
│   │
│   ├── config/
│   │   ├── conexao.php            ← Conexão com banco de dados
│   │   ├── salvar_triagem.php     ← Salva checklist de triagem
│   │   └── uploads/               ← Pasta para uploads (se houver)
│   │
│   ├── medicos/
│   │   ├── cadastrar_medico.php   ← Cadastra novo médico
│   │   ├── listar_medicos.php     ← Lista médicos cadastrados
│   │   └── alterar_status.php     ← Altera status do médico
│   │
│   ├── pacientes/
│   │   ├── listar_pacientes.php   ← Lista pacientes
│   │   └── testa_banco.php        ← Teste de conexão
│   │
│   ├── relatorios/
│   │   ├── gerar_pdf.php          ← Gera PDF do relatório
│   │   └── listar_relatorios.php  ← Lista relatórios
│   │
│   └── lib/
│       └── fpdf/                  ← Biblioteca FPDF para PDFs
│           ├── fpdf.php
│           └── font/              ← Fontes para PDF
│
├── 📁 database/                   ← Scripts SQL
│   └── schema.sql                 ← Schema completo do banco
│
├── 📁 config/                     ← Configurações globais
│   └── config.php                 ← Variáveis de ambiente
│
└── 📁 .git/                       ← Controle de versão Git
```

---

## 🗄️ Banco de Dados

O banco de dados foi modelado seguindo as melhores práticas de **normalização** e as diretrizes da **LGPD (Lei Geral de Proteção de Dados)**.

### 📊 Tabelas Principais

#### **`paciente`**
Armazena os dados básicos dos pacientes.
```
- id_paciente (PK)
- nome
- idade
- peso
- sexo
- cpf_paciente (UNIQUE)
```

#### **`medico`**
Cadastro dos profissionais de saúde.
```
- id_medico (PK)
- nome
- crm (UNIQUE)
- senha
- termos_aceitos (boolean)
- data_aceite_termos (timestamp)
- status_medico (ATIVO, FÉRIAS, DESATIVADO)
- tipo (MEDICO, ADM)
```

#### **`acompanhante`**
Responsáveis legais dos pacientes.
```
- id_acompanhante (PK)
- paciente_id (FK)
- nome
- cpf_acompanhante
- telefone
```

#### **`examen`**
Histórico de exames e resultados.
```
- id_exame (PK)
- paciente_id (FK)
- resultado (boolean)
- data_exame (timestamp)
- 12 campos de sintomas (boolean)
```

#### **`autorizacoes_medicas`**
Controle de acesso baseado em permissões.
```
- id_autorizacao (PK)
- medico_id (FK)
- paciente_id (FK)
- data_autorizacao (timestamp)
- ativo (boolean)
```

### 📐 Relacionamentos

```
Paciente ──1:N── Acompanhante
Paciente ──1:N── Examen
Médico ──N:N── Paciente (via Autorizações Médicas)
```

---

## 🔌 API Endpoints

### 🔐 Autenticação

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/auth/login.php` | Realiza login |
| GET | `/api/auth/logout.php` | Realiza logout |
| GET | `/api/auth/verificar_sessao.php` | Verifica se está logado |
| POST | `/api/auth/verificar_adm.php` | Verifica permissão ADM |

### 👨‍⚕️ Médicos

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/medicos/cadastrar_medico.php` | Cadastra novo médico |
| GET | `/api/medicos/listar_medicos.php` | Lista todos os médicos |
| POST | `/api/medicos/alterar_status.php` | Altera status do médico |

### 🏥 Pacientes

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/pacientes/listar_pacientes.php` | Lista pacientes |
| POST | `/api/pacientes/cadastrar_paciente.php` | Cadastra novo paciente |

### 📋 Triagem

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/config/salvar_triagem.php` | Salva checklist de triagem |

### 📄 Relatórios

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/relatorios/gerar_pdf.php` | Gera PDF do relatório |
| GET | `/api/relatorios/listar_relatorios.php` | Lista relatórios gerados |

---

## 🔐 Segurança e LGPD

### 🛡️ Medidas de Segurança Implementadas

1. **Autenticação Segura**
   - Hashing de senhas com `password_hash()`
   - Verificação segura com `password_verify()`
   - Sessões PHP com timeout configurável

2. **Controle de Acesso**
   - Verificação de permissões por tipo de usuário (MÉDICO/ADM)
   - Autorização baseada em permissões de acesso
   - Acesso granular: um médico só vê pacientes autorizados

3. **Proteção de Dados**
   - Validação e sanitização de entrada
   - Prepared Statements para prevenir SQL Injection
   - Charsets UTF-8MB4 para segurança Unicode

4. **Auditoria Jurídica**
   - Registro de aceitação de termos de confidencialidade
   - Timestamp de quando o médico aceitou termos
   - Histórico completo de exames e acessos

### 📋 Conformidade LGPD

- ✅ Dados sensíveis de pacientes vulneráveis são protegidos
- ✅ Consentimento explícito para acesso (PIN via SMS)
- ✅ Direito ao esquecimento implementável (estrutura preparada)
- ✅ Registros de auditoria para rastreabilidade
- ✅ Segregação de dados por responsável legal
- ✅ Proteção especial para menores de idade

---

## 📝 Exemplo de Fluxo de Login

```
1. Usuário acessa index.html
   ↓
2. Insere CRM e senha
   ↓
3. JavaScript envia POST para /api/auth/login.php
   ↓
4. PHP valida credenciais no banco
   ↓
5. Se válido: cria sessão e retorna perfil (MÉDICO/ADM)
   ↓
6. JavaScript redireciona para painel apropriado
   ↓
7. Painel carrega dados do paciente
   ↓
8. Se primeiro acesso: exibe checklist de triagem
   ↓
9. Dados salvos em /api/config/salvar_triagem.php
   ↓
10. Relatório disponível em /api/relatorios/gerar_pdf.php
```

---

## 👥 Contribuidores

- **Desenvolvedor**: Juliana (Juuh-T)
- **Instituição**: PUC-PR
- **Curso**: Bacharelado em Ciência da Computação (BCC)
- **Período**: 3º semestre
- **Disciplina**: Experiência Criativa

---

## 📞 Suporte e Dúvidas

Para mais informações, consulte:
- [STRUCTURE.md](STRUCTURE.md) - Detalhes da estrutura
- `database/schema.sql` - Script completo do banco
- `config/config.php` - Variáveis de configuração

---

## 📄 Licença

Projeto acadêmico desenvolvido para fins educacionais.

---

**Última atualização**: Junho de 2026
