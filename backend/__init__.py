from flask import Flask, send_from_directory, request
from flask_cors import CORS

def create_app():
    # disable Flask built-in static routing and use explicit routes instead
    app = Flask(__name__, static_folder=None)

    # enable CORS for API routes so frontend served from other ports can call it
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    # register blueprints lazily to keep organization clear
    from .calc import bp as calc_bp
    from .history import bp as history_bp
    from .notes import bp as notes_bp
    from .currency import bp as currency_bp
    from .measure import bp as measure_bp
    from .settings import bp as settings_bp

    app.register_blueprint(calc_bp, url_prefix='/api')
    app.register_blueprint(history_bp, url_prefix='/api')
    app.register_blueprint(notes_bp, url_prefix='/api')
    app.register_blueprint(currency_bp, url_prefix='/api')
    app.register_blueprint(measure_bp, url_prefix='/api')
    app.register_blueprint(settings_bp, url_prefix='/api')


    import os
    root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))

    @app.route('/')
    def index():
        return send_from_directory(root_dir, 'index.html')

    @app.route('/index.html')
    def index_html():
        return send_from_directory(root_dir, 'index.html')

    @app.route('/styles.css')
    def styles_css():
        return send_from_directory(root_dir, 'styles.css')

    @app.route('/js/<path:filename>')
    def js_files(filename):
        return send_from_directory(os.path.join(root_dir, 'js'), filename)


    @app.after_request
    def add_cors_headers(response):
        if request.path.startswith('/api/'):
            response.headers.setdefault('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
            response.headers.setdefault('Access-Control-Allow-Headers', 'Content-Type')
        return response

    return app