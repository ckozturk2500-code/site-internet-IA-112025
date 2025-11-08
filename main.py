Text file: main.py
Latest content with line numbers:
2	import sys
3	# DON'T CHANGE THIS !!!
4	sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
5	
6	from flask import Flask, send_from_directory
7	from flask_cors import CORS
8	from src.models.user import db
9	from src.routes.auth import auth_bp
10	from src.routes.progress import progress_bp
11	from src.routes.admin import admin_bp
12	
13	app = Flask(__name__, static_folder=os.path.join(os.path.dirname(__file__), 'static'))
14	
15	# Configuration
16	app.config['SECRET_KEY'] = 'ozformation_secret_key_2024_change_in_production'
17	app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(os.path.dirname(__file__), 'database', 'app.db')}"
18	app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
19	app.config['SESSION_COOKIE_HTTPONLY'] = True
20	app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
21	
22	# Enable CORS for all origins (needed for deployment)
23	CORS(app, supports_credentials=True, origins='*')
24	
25	# Initialize database
26	db.init_app(app)
27	
28	# Register blueprints BEFORE the catch-all route
29	app.register_blueprint(auth_bp)
30	app.register_blueprint(progress_bp)
31	app.register_blueprint(admin_bp)
32	
33	# Create tables and initialize data
34	with app.app_context():
35	    # Créer le répertoire de la base de données si il n'existe pas
36	    db_dir = os.path.join(os.path.dirname(__file__), 'database')
37	    if not os.path.exists(db_dir):
38	        os.makedirs(db_dir)
39	    db.create_all()
40	    
41	    # Créer un admin par défaut si aucun n'existe
42	    from src.models.user import Admin, AccessCode
43	    if Admin.query.count() == 0:
44	        admin = Admin(username='ckozturk', email='admin@ozformation.com')
45	        admin.set_password('Cko29824344')
46	        db.session.add(admin)
47	        db.session.commit()
48	        print("Admin créé : username=ckozturk, password=Cko29824344")
49	    
50	    # Créer quelques codes d'accès de démonstration