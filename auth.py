Text file: auth.py
Latest content with line numbers:
1	from flask import Blueprint, request, jsonify, session
2	from datetime import datetime
3	from src.models.user import db, User, AccessCode, Admin
4	
5	auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')
6	
7	@auth_bp.route('/register', methods=['POST'])
8	def register():
9	    """Inscription d'un nouvel utilisateur"""
10	    try:
11	        data = request.get_json()
12	        
13	        # Validation des données
14	        required_fields = ['firstName', 'lastName', 'email', 'accessCode']
15	        for field in required_fields:
16	            if not data.get(field):
17	                return jsonify({'error': f'Le champ {field} est obligatoire'}), 400
18	        
19	        # Vérifier si l'email existe déjà
20	        existing_user = User.query.filter_by(email=data['email']).first()
21	        if existing_user:
22	            return jsonify({'error': 'Cet email est déjà utilisé'}), 400
23	        
24	        # Vérifier le code d'accès
25	        access_code = AccessCode.query.filter_by(code=data['accessCode'].upper()).first()
26	        if not access_code:
27	            return jsonify({'error': 'Code d\'accès invalide'}), 400
28	        
29	        if access_code.is_used:
30	            return jsonify({'error': 'Ce code d\'accès a déjà été utilisé'}), 400
31	        
32	        # Créer l'utilisateur
33	        new_user = User(
34	            first_name=data['firstName'],
35	            last_name=data['lastName'],
36	            email=data['email'],
37	            access_code=data['accessCode'].upper()
38	        )
39	        
40	        # Marquer le code comme utilisé
41	        access_code.is_used = True
42	        access_code.used_by_email = data['email']
43	        access_code.used_at = datetime.utcnow()
44	        
45	        db.session.add(new_user)
46	        db.session.commit()
47	        
48	        # Créer la session
49	        session['user_id'] = new_user.id
50	        session['is_admin'] = False
51	        
52	        return jsonify({
53	            'message': 'Inscription réussie',
54	            'user': new_user.to_dict()
55	        }), 201
56	        
57	    except Exception as e:
58	        db.session.rollback()
59	        return jsonify({'error': str(e)}), 500
60	
61	@auth_bp.route('/login', methods=['POST'])
62	def login():
63	    """Connexion d'un utilisateur"""
64	    try:
65	        data = request.get_json()
66	        
67	        if not data.get('email') or not data.get('accessCode'):
68	            return jsonify({'error': 'Email et code d\'accès requis'}), 400
69	        
70	        # Rechercher l'utilisateur
71	        user = User.query.filter_by(
72	            email=data['email'],
73	            access_code=data['accessCode'].upper()
74	        ).first()
75	        
76	        if not user:
77	            return jsonify({'error': 'Email ou code d\'accès incorrect'}), 401
78	        
79	        if not user.is_active:
80	            return jsonify({'error': 'Compte désactivé'}), 403
81	        
82	        # Mettre à jour la dernière connexion
83	        user.last_login = datetime.utcnow()
84	        db.session.commit()
85	        
86	        # Créer la session
87	        session['user_id'] = user.id
88	        session['is_admin'] = False
89	        
90	        return jsonify({
91	            'message': 'Connexion réussie',
92	            'user': user.to_dict()
93	        }), 200
94	        
95	    except Exception as e:
96	        return jsonify({'error': str(e)}), 500
97	
98	@auth_bp.route('/admin/login', methods=['POST'])
99	def admin_login():
100	    """Connexion administrateur"""
101	    try:
102	        data = request.get_json()
103	        
104	        if not data.get('username') or not data.get('password'):
105	            return jsonify({'error': 'Nom d\'utilisateur et mot de passe requis'}), 400
106	        
107	        # Rechercher l'admin
108	        admin = Admin.query.filter_by(username=data['username']).first()
109	        
110	        if not admin or not admin.check_password(data['password']):
111	            return jsonify({'error': 'Identifiants incorrects'}), 401
112	        
113	        # Créer la session
114	        session['admin_id'] = admin.id
115	        session['is_admin'] = True
116	        
117	        return jsonify({
118	            'message': 'Connexion administrateur réussie',
119	            'admin': admin.to_dict()
120	        }), 200
121	        
122	    except Exception as e:
123	        return jsonify({'error': str(e)}), 500
124	
125	@auth_bp.route('/logout', methods=['POST'])
126	def logout():
127	    """Déconnexion"""
128	    session.clear()
129	    return jsonify({'message': 'Déconnexion réussie'}), 200
130	
131	@auth_bp.route('/me', methods=['GET'])
132	def get_current_user():
133	    """Récupérer l'utilisateur connecté"""
134	    try:
135	        if session.get('is_admin'):
136	            admin = Admin.query.get(session.get('admin_id'))
137	            if admin:
138	                return jsonify({
139	                    'isAdmin': True,
140	                    'user': admin.to_dict()
141	                }), 200
142	        
143	        user_id = session.get('user_id')
144	        if not user_id:
145	            return jsonify({'error': 'Non authentifié'}), 401
146	        
147	        user = User.query.get(user_id)
148	        if not user:
149	            return jsonify({'error': 'Utilisateur non trouvé'}), 404
150	        
151	        return jsonify({
152	            'isAdmin': False,
153	            'user': user.to_dict()
154	        }), 200
155	        
156	    except Exception as e:
157	        return jsonify({'error': str(e)}), 500
158	
159	