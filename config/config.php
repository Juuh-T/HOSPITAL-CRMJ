<?php
/**
 * Arquivo de Configuração Global
 * Define constantes e configurações que serão usadas em toda a aplicação
 * Carrega as variáveis do arquivo .env
 */

// ============================================
// CARREGAMENTO DO ARQUIVO .ENV
// ============================================

$envFile = dirname(__DIR__) . '/.env';

function loadEnv($filePath) {
    if (!file_exists($filePath)) {
        throw new Exception("Arquivo .env não encontrado em: {$filePath}");
    }
    
    $lines = file($filePath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    
    foreach ($lines as $line) {
        // Ignorar linhas de comentário
        if (strpos(trim($line), '#') === 0) {
            continue;
        }
        
        if (strpos($line, '=') !== false) {
            list($key, $value) = explode('=', $line, 2);
            $key = trim($key);
            $value = trim($value);
            
            // Remover aspas se houver
            if ((strpos($value, '"') === 0 && strrpos($value, '"') === strlen($value) - 1) ||
                (strpos($value, "'") === 0 && strrpos($value, "'") === strlen($value) - 1)) {
                $value = substr($value, 1, -1);
            }
            
            if (!empty($key)) {
                $_ENV[$key] = $value;
                putenv("{$key}={$value}");
            }
        }
    }
}

// Carregar variáveis do .env
loadEnv($envFile);

// Função auxiliar para obter variável do .env com valor padrão
function getEnv($key, $default = null) {
    return $_ENV[$key] ?? getenv($key) ?: $default;
}

// ============================================
// CONFIGURAÇÕES DE DIRETÓRIOS
// ============================================

define('ROOT_PATH', dirname(__DIR__));
define('API_PATH', ROOT_PATH . '/api');
define('DATABASE_PATH', ROOT_PATH . '/database');
define('CONFIG_PATH', ROOT_PATH . '/config');

// ============================================
// CONFIGURAÇÕES DE BANCO DE DADOS
// ============================================

define('DB_HOST', getEnv('DB_HOST', 'localhost'));
define('DB_USER', getEnv('DB_USER', 'root'));
define('DB_PASSWORD', getEnv('DB_PASSWORD', ''));
define('DB_NAME', getEnv('DB_NAME', 'hospital_crmj'));
define('DB_PORT', (int)getEnv('DB_PORT', 3306));
define('DB_CHARSET', getEnv('DB_CHARSET', 'utf8mb4'));

// ============================================
// CONFIGURAÇÕES DE APLICAÇÃO
// ============================================

define('BASE_URL', getEnv('BASE_URL', 'http://localhost'));
define('BASE_PATH', getEnv('BASE_PATH', '/HOSPITAL-CRMJ'));

// ============================================
// CONFIGURAÇÕES DE SESSÃO
// ============================================

define('SESSION_TIMEOUT', (int)getEnv('SESSION_TIMEOUT', 3600));
define('SESSION_NAME', getEnv('SESSION_NAME', 'HOSPITAL_CRMJ'));

// ============================================
// CONFIGURAÇÕES DE SEGURANÇA
// ============================================

define('DEBUG_MODE', getEnv('DEBUG_MODE', 'true') === 'true');

// CORS Headers - parse de variável separada por vírgula
$allowedOriginsStr = getEnv('ALLOWED_ORIGINS', 'http://localhost,http://127.0.0.1');
define('ALLOWED_ORIGINS', array_map('trim', explode(',', $allowedOriginsStr)));

?>
