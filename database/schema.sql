CREATE TABLE `paciente` (
  `id_paciente` int PRIMARY KEY AUTO_INCREMENT,
  `nome` varchar(255) NOT NULL,
  `idade` int,
  `peso` double,
  `sexo` ENUM('Masculino', 'Feminino') NOT NULL,
  `cpf_paciente` varchar(11) UNIQUE NOT NULL
);

CREATE TABLE `medico` (
  `id_medico` int PRIMARY KEY AUTO_INCREMENT,
  `nome` varchar(255) NOT NULL,
  `crm` varchar(20) UNIQUE NOT NULL,
  `senha` varchar(255) NOT NULL,
  `termos_aceitos` boolean NOT NULL DEFAULT false,
  `data_aceite_termos` timestamp,
  `status_medico` ENUM('ATIVO', 'FERIAS', 'DESATIVADO') NOT NULL DEFAULT 'ATIVO',
  `tipo` ENUM('MEDICO', 'ADM') NOT NULL DEFAULT 'MEDICO'
);

CREATE TABLE `acompanhante` (
  `id_acompanhante` int PRIMARY KEY AUTO_INCREMENT,
  `paciente_id` int NOT NULL,
  `nome` varchar(255) NOT NULL,
  `cpf_acompanhante` varchar(11) NOT NULL,
  `telefone` varchar(15) NOT NULL,
  `firebase_uid` varchar(255),
  FOREIGN KEY (`paciente_id`) REFERENCES `paciente` (`id_paciente`)
);

CREATE TABLE `examen` (
  `id_exame` int PRIMARY KEY AUTO_INCREMENT,
  `paciente_id` int NOT NULL,
  `resultado` boolean NOT NULL,
  `data_exame` timestamp DEFAULT (now()),
  
  -- 12 Colunas para o Checklist Clínico de Triagem (0 = Não, 1 = Sim)
  `sintoma_deficiencia_intelectual` boolean NOT NULL DEFAULT false,
  `sintoma_face_alongada_orelhas` boolean NOT NULL DEFAULT false,
  `sintoma_macroorquidismo` boolean NOT NULL DEFAULT false,
  `sintoma_hipermobilidade_articular` boolean NOT NULL DEFAULT false,
  `sintoma_dificuldade_aprendizagem` boolean NOT NULL DEFAULT false,
  `sintoma_deficit_atencao` boolean NOT NULL DEFAULT false,
  `sintoma_movimentos_repetitivos` boolean NOT NULL DEFAULT false,
  `sintoma_atraso_fala` boolean NOT NULL DEFAULT false,
  `sintoma_hiperatividade` boolean NOT NULL DEFAULT false,
  `sintoma_evita_contato_visual` boolean NOT NULL DEFAULT false,
  `sintoma_evita_contato_fisico` boolean NOT NULL DEFAULT false,
  `sintoma_agressividade` boolean NOT NULL DEFAULT false,
  
  -- 4 Colunas para armazenar os caminhos das fotos no servidor
  `foto_paciente_1` varchar(255) DEFAULT NULL,
  `foto_paciente_2` varchar(255) DEFAULT NULL,
  `foto_paciente_3` varchar(255) DEFAULT NULL,
  `foto_paciente_4` varchar(255) DEFAULT NULL,
  
  FOREIGN KEY (`paciente_id`) REFERENCES `paciente` (`id_paciente`)
);

CREATE TABLE `autorizacoes_medicas` (
  `id_autorizacao` int PRIMARY KEY AUTO_INCREMENT,
  `medico_id` int NOT NULL,
  `paciente_id` int NOT NULL,
  `validado` boolean DEFAULT false,
  `data_autorizacao` timestamp DEFAULT (now()),
  FOREIGN KEY (`medico_id`) REFERENCES `medico` (`id_medico`),
  FOREIGN KEY (`paciente_id`) REFERENCES `paciente` (`id_paciente`)
);
