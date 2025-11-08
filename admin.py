Text file: admin.py
Latest content with line numbers:
1	from flask import Blueprint, request, jsonify, session
2	from datetime import datetime
3	import random
4	import string
5	from src.models.user import db, User, AccessCode, Admin, QuizScore
6	
7	admin_bp = Blueprint('admin', __name__, url_prefix='/api/admin')
8	
9	def require_admin(f):
10	    """Décorateur pour vérifier l'authentification admin"""
11	    def decorated_function(*args, **kwargs):
12	        if not session.get('is_admin') or not session.get('admin_id'):
13	            return jsonify({'error': 'Accès non autorisé'}), 403
14	        return f(*args, **kwargs)
15	    decorated_function.__name__ = f.__name__
16	    return decorated_function
17	
18	@admin_bp.route('/users', methods=['GET'])
19	@require_admin
20	def get_all_users():
21	    """Récupérer tous les utilisateurs"""
22	    try:
23	        users = User.query.all()
24	        return jsonify({
25	            'users': [user.to_dict() for user in users]
26	        }), 200
27	    except Exception as e:
28	        return jsonify({'error': str(e)}), 500
29	
30	@admin_bp.route('/users/<int:user_id>', methods=['GET'])
31	@require_admin
32	def get_user(user_id):
33	    """Récupérer un utilisateur spécifique"""
34	    try:
35	        user = User.query.get(user_id)
36	        if not user:
37	            return jsonify({'error': 'Utilisateur non trouvé'}), 404
38	        
39	        return jsonify({'user': user.to_dict()}), 200
40	    except Exception as e:
41	        return jsonify({'error': str(e)}), 500
42	
43	@admin_bp.route('/codes', methods=['GET'])
44	@require_admin
45	def get_all_codes():
46	    """Récupérer tous les codes d'accès"""
47	    try:
48	        codes = AccessCode.query.all()
49	        return jsonify({
50	            'codes': [code.to_dict() for code in codes]
51	        }), 200
52	    except Exception as e:
53	        return jsonify({'error': str(e)}), 500
54	
55	@admin_bp.route('/codes/generate', methods=['POST'])
56	@require_admin
57	def generate_code():
58	    """Générer un nouveau code d'accès"""
59	    try:
60	        # Générer un code unique
61	        while True:
62	            code = 'OZLIA' + ''.join(random.choices(string.digits, k=6))
63	            existing = AccessCode.query.filter_by(code=code).first()
64	            if not existing:
65	                break
66	        
67	        new_code = AccessCode(code=code)
68	        db.session.add(new_code)
69	        db.session.commit()
70	        
71	        return jsonify({
72	            'message': 'Code généré avec succès',
73	            'code': new_code.to_dict()
74	        }), 201
75	        
76	    except Exception as e:
77	        db.session.rollback()
78	        return jsonify({'error': str(e)}), 500
79	
80	@admin_bp.route('/stats', methods=['GET'])
81	@require_admin
82	def get_stats():
83	    """Récupérer les statistiques globales"""
84	    try:
85	        total_users = User.query.count()
86	        total_codes = AccessCode.query.count()
87	        used_codes = AccessCode.query.filter_by(is_used=True).count()
88	        
89	        # Progression moyenne
90	        users = User.query.all()
91	        if users:
92	            total_progress = sum(len(user.progress) for user in users)
93	            avg_progress = total_progress / len(users) if len(users) > 0 else 0
94	        else:
95	            avg_progress = 0
96	        
97	        # Taux de réussite aux quiz
98	        quiz_scores = QuizScore.query.all()
99	        quiz_stats = {}
100	        for quiz in quiz_scores:
101	            if quiz.quiz_id not in quiz_stats:
102	                quiz_stats[quiz.quiz_id] = {'total': 0, 'passed': 0}
103	            quiz_stats[quiz.quiz_id]['total'] += 1
104	            if quiz.score >= (quiz.total * 0.6):
105	                quiz_stats[quiz.quiz_id]['passed'] += 1
106	        
107	        return jsonify({
108	            'totalUsers': total_users,
109	            'totalCodes': total_codes,
110	            'usedCodes': used_codes,
111	            'avgProgress': round(avg_progress, 2),
112	            'quizStats': quiz_stats
113	        }), 200
114	        
115	    except Exception as e:
116	        return jsonify({'error': str(e)}), 500
117	
118	@admin_bp.route('/users/<int:user_id>/toggle', methods=['POST'])
119	@require_admin
120	def toggle_user_status(user_id):
121	    """Activer/désactiver un utilisateur"""
122	    try:
123	        user = User.query.get(user_id)
124	        if not user:
125	            return jsonify({'error': 'Utilisateur non trouvé'}), 404
126	        
127	        user.is_active = not user.is_active
128	        db.session.commit()
129	        
130	        return jsonify({
131	            'message': f'Utilisateur {"activé" if user.is_active else "désactivé"}',
132	            'user': user.to_dict()
133	        }), 200
134	        
135	    except Exception as e:
136	        db.session.rollback()
137	        return jsonify({'error': str(e)}), 500
138	
139	