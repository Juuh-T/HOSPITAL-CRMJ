CREATE TABLE `paciente` (
  `id_paciente` int PRIMARY KEY AUTO_INCREMENT,
  `nome` varchar(255) NOT NULL,
  `idade` int,
  `peso` double,
  `cpf_paciente` varchar(11) UNIQUE NOT NULL
);

CREATE TABLE `acompanhante` (
  `id_acompanhante` int PRIMARY KEY AUTO_INCREMENT,
  `paciente_id` int NOT NULL,
  `nome` varchar(255) NOT NULL,
  `cpf_acompanhante` varchar(11) NOT NULL,
  `telefone` varchar(15) NOT NULL,
  `firebase_uid` varchar(255)
);

CREATE TABLE `examen` (
  `id_exame` int PRIMARY KEY AUTO_INCREMENT,
  `paciente_id` int NOT NULL,
  `resultado` boolean NOT NULL,
  `data_exame` timestamp DEFAULT (now())
);

CREATE TABLE `medico` (
  `id_medico` int PRIMARY KEY AUTO_INCREMENT,
  `nome` varchar(255) NOT NULL,
  `crm` varchar(20) UNIQUE NOT NULL,
  `senha` varchar(255) NOT NULL,
  `termos_aceitos` boolean NOT NULL DEFAULT false,
  `data_aceite_termos` timestamp
);

CREATE TABLE `autorizacoes_medicas` (
  `id_autorizacao` int PRIMARY KEY AUTO_INCREMENT,
  `medico_id` int NOT NULL,
  `paciente_id` int NOT NULL,
  `validado` boolean DEFAULT false,
  `data_autorizacao` timestamp DEFAULT (now())
);

ALTER TABLE `autorizacoes_medicas` ADD FOREIGN KEY (`medico_id`) REFERENCES `medico` (`id_medico`);

ALTER TABLE `autorizacoes_medicas` ADD FOREIGN KEY (`paciente_id`) REFERENCES `paciente` (`id_paciente`);

ALTER TABLE `acompanhante` ADD FOREIGN KEY (`paciente_id`) REFERENCES `paciente` (`id_paciente`);

ALTER TABLE `examen` ADD FOREIGN KEY (`paciente_id`) REFERENCES `paciente` (`id_paciente`);

ALTER TABLE medico ADD COLUMN status_medico ENUM(
    'ATIVO',
    'FERIAS',
    'DESATIVADO'
) NOT NULL DEFAULT 'ATIVO';

ALTER TABLE medico ADD COLUMN tipo ENUM(
    'MEDICO',
    'ADM',
) NOT NULL DEFAULT 'MEDICO';