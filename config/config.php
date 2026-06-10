<?php
/**
 * Arquivo de Configuração Global
 * Define constantes e configurações que serão usadas em toda a aplicação
 */

// ============================================
// CONFIGURAÇÕES DE DIRETÓRIOS
// ============================================

define('BASE_URL', 'http://localhost');
define('ROOT_PATH', dirname(dirname(__FILE__)));
define('API_PATH', ROOT_PATH . '/api');
define('DATABASE_PATH', ROOT_PATH . '/database');
define('CONFIG_PATH', ROOT_PATH . '/config');

// ============================================
// CONFIGURAÇÕES DE BANCO DE DADOS
// ============================================

define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASSWORD', '');
define('DB_NAME', 'hospital_crmj');
define('DB_PORT', 3306);
define('DB_CHARSET', 'utf8mb4');

// ============================================
// CONFIGURAÇÕES DE SESSÃO
// ============================================

define('SESSION_TIMEOUT', 3600); // 1 hora em segundos
define('SESSION_NAME', 'HOSPITAL_CRMJ');

// ============================================
// CONFIGURAÇÕES DE SEGURANÇA
// ============================================

// Habilitar erros apenas em desenvolvimento
define('DEBUG_MODE', true);

// CORS Headers
define('ALLOWED_ORIGINS', [
    'http://localhost',
    'http://127.0.0.1'
]);

// ============================================
// CONFIGURAÇÕES DE EMAIL/SMS
// ============================================

define('FIREBASE_API_KEY', 'SUA_CHAVE_AQUI');
define('SMS_PROVIDER', 'firebase'); // 'firebase', 'twilio', etc

?>
