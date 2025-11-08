Text file: progress.py
Latest content with line numbers:
1	from flask import Blueprint, request, jsonify, session
2	from datetime import datetime
3	from src.models.user import db, User, Progress, QuizScore
4	
5	progress_bp = Blueprint('progress', __name__, url_prefix='/api/progress')
6	
7	def require_auth(f):
8	    """Décorateur pour vérifier l'authentification"""
9	    def decorated_function(*args, **kwargs):
10	        if not session.get('user_id'):
11	            return jsonify({'error': 'Non authentifié'}), 401
12	        return f(*args, **kwargs)
13	    decorated_function.__name__ = f.__name__
14	    return decorated_function
15	
16	@progress_bp.route('/module/<module_id>', methods=['POST'])
17	@require_auth
18	def complete_module(module_id):
19	    """Marquer un module comme complété"""
20	    try:
21	        user_id = session.get('user_id')
22	        
23	        # Vérifier si déjà complété
24	        existing = Progress.query.filter_by(
25	            user_id=user_id,
26	            module_id=module_id
27	        ).first()
28	        
29	        if existing:
30	            return jsonify({'message': 'Module déjà complété'}), 200
31	        
32	        # Créer la progression
33	        progress = Progress(
34	            user_id=user_id,
35	            module_id=module_id
36	        )
37	        
38	        db.session.add(progress)
39	        db.session.commit()
40	        
41	        return jsonify({
42	            'message': 'Module complété',
43	            'progress': progress.to_dict()
44	        }), 201
45	        
46	    except Exception as e:
47	        db.session.rollback()
48	        return jsonify({'error': str(e)}), 500
49	
50	@progress_bp.route('/quiz', methods=['POST'])
51	@require_auth
52	def submit_quiz():
53	    """Soumettre un score de quiz"""
54	    try:
55	        user_id = session.get('user_id')
56	        data = request.get_json()
57	        
58	        required_fields = ['quizId', 'score', 'total']
59	        for field in required_fields:
60	            if field not in data:
61	                return jsonify({'error': f'Le champ {field} est obligatoire'}), 400
62	        
63	        # Créer le score
64	        quiz_score = QuizScore(
65	            user_id=user_id,
66	            quiz_id=data['quizId'],
67	            score=data['score'],
68	            total=data['total'],
69	            time_spent=data.get('timeSpent')
70	        )
71	        
72	        db.session.add(quiz_score)
73	        
74	        # Marquer le quiz comme complété dans la progression
75	        existing_progress = Progress.query.filter_by(
76	            user_id=user_id,
77	            module_id=data['quizId']
78	        ).first()
79	        
80	        if not existing_progress:
81	            progress = Progress(
82	                user_id=user_id,
83	                module_id=data['quizId']
84	            )
85	            db.session.add(progress)
86	        
87	        db.session.commit()
88	        
89	        return jsonify({
90	            'message': 'Score enregistré',
91	            'quizScore': quiz_score.to_dict()
92	        }), 201
93	        
94	    except Exception as e:
95	        db.session.rollback()
96	        return jsonify({'error': str(e)}), 500
97	
98	@progress_bp.route('/user', methods=['GET'])
99	@require_auth
100	def get_user_progress():
101	    """Récupérer la progression de l'utilisateur connecté"""
102	    try:
103	        user_id = session.get('user_id')
104	        user = User.query.get(user_id)
105	        
106	        if not user:
107	            return jsonify({'error': 'Utilisateur non trouvé'}), 404
108	        
109	        completed_modules = [p.module_id for p in user.progress]
110	        quiz_scores = [q.to_dict() for q in user.quiz_scores]
111	        
112	        return jsonify({
113	            'completedModules': completed_modules,
114	            'quizScores': quiz_scores
115	        }), 200
116	        
117	    except Exception as e:
118	        return jsonify({'error': str(e)}), 500
119	
120	