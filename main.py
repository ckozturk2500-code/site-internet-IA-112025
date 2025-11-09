import os
import sys
# DON'T CHANGE THIS !!!
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from flask import Flask, send_from_directory
from flask_cors import CORS
from user import db
from auth import auth_bp
from progress import progress_bp
from admin import admin_bp

app = Flask(__name__, static_folder=os.path.join(os.path.dirname(__file__), 'static'))

# Configuration
app.config['SECRET_KEY'] = 'ozformation_secret_key_2024_change_in_production'
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(os.path.dirname(__file__), 'database', 'app.db')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'

# Enable CORS for all origins (needed for deployment)
CORS(app, supports_credentials=True, origins='*')

# Initialize database
db.init_app(app)

# Register blueprints BEFORE the catch-all route
app.register_blueprint(auth_bp)
app.register_blueprint(progress_bp)
app.register_blueprint(admin_bp)

# Create tables and initialize data
with app.app_context():
    # Créer le répertoire de la base de données s'il n'existe pas
    db_dir = os.path.join(os.path.dirname(__file__), 'database')
    if not os.path.exists(db_dir):
        os.makedirs(db_dir)
    db.create_all()
    
    # Créer un admin par défaut si aucun n'existe
    from user import Admin, AccessCode
    if Admin.query.count() == 0:
        admin = Admin(username='ckozturk', email='admin@ozformation.com')
        admin.set_password('Cko29824344')
        db.session.add(admin)
        db.session.commit()
        print("Admin créé : username=ckozturk, password=Cko29824344")
    
    # Créer quelques codes d'accès de démonstration
    if AccessCode.query.count() == 0:
        demo_codes = ['OZLIA123456', 'OZLIA789012', 'OZLIA345678']
        for code in demo_codes:
            access_code = AccessCode(code=code)
            db.session.add(access_code)
        db.session.commit()
        print(f"Codes d'accès créés : {', '.join(demo_codes)}")

# Serve static files from /static route
@app.route('/static/<path:filename>')
def serve_static(filename):
    return send_from_directory(app.static_folder, filename)

# Serve React frontend - THIS MUST BE THE LAST ROUTE
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    static_folder_path = app.static_folder
    if static_folder_path is None:
        return "Static folder not configured", 404

    # If path starts with 'api/', don't serve static files
    if path.startswith('api/'):
        return "Not found", 404

    if path != "" and os.path.exists(os.path.join(static_folder_path, path)):
        return send_from_directory(static_folder_path, path)
    else:
        index_path = os.path.join(static_folder_path, 'index.html')
        if os.path.exists(index_path):
            return send_from_directory(static_folder_path, 'index.html')
        else:
            return "index.html not found", 404

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
