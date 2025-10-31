<?php
class Logger {
    private static $logFile = __DIR__ . '/../../logs/app.log';
    
    public static function info($message, $context = []) {
        self::log('INFO', $message, $context);
    }
    
    public static function error($message, $context = []) {
        self::log('ERROR', $message, $context);
    }
    
    public static function warning($message, $context = []) {
        self::log('WARNING', $message, $context);
    }
    
    private static function log($level, $message, $context = []) {
        // Create logs directory if it doesn't exist
        $logDir = dirname(self::$logFile);
        if (!is_dir($logDir)) {
            mkdir($logDir, 0755, true);
        }
        
        $timestamp = date('Y-m-d H:i:s');
        $contextString = !empty($context) ? json_encode($context) : '';
        $logMessage = "[{$timestamp}] {$level}: {$message} {$contextString}" . PHP_EOL;
        
        file_put_contents(self::$logFile, $logMessage, FILE_APPEND | LOCK_EX);
    }
    
    public static function getLogFile() {
        return self::$logFile;
    }
}
?>