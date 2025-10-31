<?php
class Router {
    private $routes = [
        'GET' => [],
        'POST' => [],
        'PUT' => [],
        'DELETE' => []
    ];

    public function addRoute($method, $path, $callback) {
        $this->routes[$method][$path] = $callback;
    }

    public function get($path, $callback) {
        $this->addRoute('GET', $path, $callback);
    }

    public function post($path, $callback) {
        $this->addRoute('POST', $path, $callback);
    }

    public function put($path, $callback) {
        $this->addRoute('PUT', $path, $callback);
    }

    public function delete($path, $callback) {
        $this->addRoute('DELETE', $path, $callback);
    }

    public function resolve($method, $path) {
        // Remove query string if exists (only if path contains query string)
        if (strpos($path, '?') !== false) {
            $path = parse_url($path, PHP_URL_PATH);
        }
        
        // Match exact routes first
        if (isset($this->routes[$method][$path])) {
            return $this->routes[$method][$path];
        }
        
        // Match dynamic routes
        foreach ($this->routes[$method] as $route => $callback) {
            $pattern = preg_replace('/\{([^}]+)\}/', '([^/]+)', $route);
            $pattern = '#^' . $pattern . '$#';
            
            if (preg_match($pattern, $path, $matches)) {
                array_shift($matches); // Remove full match
                return [$callback, $matches];
            }
        }
        
        return null;
    }
}
?>