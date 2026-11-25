"""Local preview server that behaves like Cloudflare Pages.

- /services serves services.html (clean URLs)
- /services.html redirects to /services
- unknown paths show 404.html with a 404 status

Run from this folder:  python serve.py   then open http://127.0.0.1:8080
"""
import http.server
import os
import socketserver
import sys
from urllib.parse import urlsplit

ROOT = os.path.dirname(os.path.abspath(__file__))
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8080


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def do_GET(self):
        parts = urlsplit(self.path)
        path = parts.path
        query = ("?" + parts.query) if parts.query else ""

        # Mirror Cloudflare: /page.html -> /page, /index.html -> /
        if path.endswith(".html"):
            clean = "/" if path in ("/index.html", "/index") else path[:-5]
            self.send_response(308)
            self.send_header("Location", clean + query)
            self.end_headers()
            return

        local = os.path.join(ROOT, path.lstrip("/").replace("/", os.sep))
        if path != "/" and not os.path.splitext(path)[1] and os.path.isfile(local + ".html"):
            self.path = path + ".html" + query
        elif path != "/" and not os.path.exists(local):
            return self.send_404()
        return super().do_GET()

    def send_404(self):
        with open(os.path.join(ROOT, "404.html"), "rb") as f:
            body = f.read()
        self.send_response(404)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)


if __name__ == "__main__":
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("127.0.0.1", PORT), Handler) as httpd:
        print(f"Preview: http://127.0.0.1:{PORT}  (Ctrl+C to stop)")
        httpd.serve_forever()
