# HOSPITAL-CRMJ

Projeto focado para funcionamento para um hospital solicitado pelo professor na matéria de experiência criativa no curso BCC 3º período na PUC-PR.


## 🗄️ Banco de Dados

O banco de dados do projeto foi modelado seguindo as melhores práticas de **normalização** e as diretrizes da **LGPD (Lei Geral de Proteção de Dados)**, garantindo que dados sensíveis de pacientes vulneráveis estejam devidamente protegidos.

A estrutura foi dividida em entidades independentes para evitar duplicação de dados e otimizar o desempenho do sistema.

### 📊 Modelagem das Tabelas

* **`paciente`**: Armazena os dados básicos e fixos do paciente (`nome`, `idade`, `cpf_paciente`).
* **`acompanhante`**: Como o paciente não responde legalmente por si, esta tabela armazena os dados do responsável legal. O campo `cpf_acompanhante` permite repetições para os casos em que um mesmo responsável cuide de mais de um paciente. Inclui o `telefone` para disparos de autenticação e o `firebase_uid`.
* **`examen`**: Guarda o histórico de exames e o `resultado` (positivo/negativo). Está vinculada ao paciente, permitindo que o histórico de exames seja preservado sem duplicar os dados pessoais do paciente.
* **`medico`**: Cadastro dos profissionais que utilizam o sistema (`crm`). Conta com um sistema de auditoria jurídica (`termos_aceitos` e `data_aceite_termos`), registrando o momento exato em que o profissional aceitou os termos de confidencialidade e sigilo de dados.
* **`autorizacoes_medicas`**: Tabela intermediária de segurança. Controla o fluxo de acesso baseado em consentimento. Quando um novo médico precisa acessar os exames, um PIN de 5 dígitos é enviado via SMS (Firebase) para o acompanhante. Uma vez validado, o campo `validado` vira `true` e o médico ganha acesso permanente à ficha daquele paciente específico.

### 📐 Diagrama de Relacionamentos (DER)

Os relacionamentos de chaves estrangeiras (`FOREIGN KEY`) foram estruturados da seguinte forma:

* Um **Paciente** pode ter vários **Acompanhantes** cadastrados.
* Um **Paciente** pode ter vários **Exames** realizados.
* A tabela **Autorizações Médicas** conecta **Médicos** e **Pacientes** de forma segura, gerenciando as permissões de visualização.

O script oficial com a criação das tabelas e chaves estrangeiras está localizado em: `/database/schema.sql`.
