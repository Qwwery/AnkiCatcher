import http.server
import socketserver
import os

PORT = 8000

# Переходим в папку с проектом
os.chdir(os.path.dirname(os.path.abspath(__file__)))

Handler = http.server.SimpleHTTPRequestHandler

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"🚀 Сервер запущен!")
    httpd.serve_forever()
