Latest content with line numbers:
1	from flask_sqlalchemy import SQLAlchemy
2	from datetime import datetime
3	from werkzeug.security import generate_password_hash, check_password_hash
4	
5	db = SQLAlchemy()
6	
7	class User(db.Model):
8	    __tablename__ = 'users'
9	    
10	    id = db.Column(db.Integer, primary_key=True)
11	    first_name = db.Column(db.String(100), nullable=False)
12	    last_name = db.Column(db.String(100), nullable=False)
13	    email = db.Column(db.String(255), unique=True, nullable=False)
14	    access_code = db.Column(db.String(50), unique=True, nullable=False)
15	    registration_date = db.Column(db.DateTime, default=datetime.utcnow)
16	    last_login = db.Column(db.DateTime)
17	    is_active = db.Column(db.Boolean, default=True)
18	    
19	    # Relations
20	    progress = db.relationship('Progress', backref='user', lazy=True, cascade='all, delete-orphan')
21	    quiz_scores = db.relationship('QuizScore', backref='user', lazy=True, cascade='all, delete-orphan')
22	    
23	    def to_dict(self):
24	        completed_modules = [p.module_id for p in self.progress]
25	        quiz_scores_list = [q.to_dict() for q in self.quiz_scores]
26	        
27	        return {
28	            'id': self.id,
29	            'firstName': self.first_name,
30	            'lastName': self.last_name,
31	            'email': self.email,
32	            'accessCode': self.access_code,
33	            'registrationDate': self.registration_date.isoformat() if self.registration_date else None,
34	            'lastLogin': self.last_login.isoformat() if self.last_login else None,
35	            'isActive': self.is_active,
36	            'progress': {
37	                'completedModules': completed_modules,
38	                'quizScores': quiz_scores_list
39	            }
40	        }
41	
42	class AccessCode(db.Model):
43	    __tablename__ = 'access_codes'
44	    
45	    id = db.Column(db.Integer, primary_key=True)
46	    code = db.Column(db.String(50), unique=True, nullable=False)
47	    is_used = db.Column(db.Boolean, default=False)
48	    used_by_email = db.Column(db.String(255))
49	    created_at = db.Column(db.DateTime, default=datetime.utcnow)
50	    used_at = db.Column(db.DateTime)
51	    
52	    def to_dict(self):
53	        return {
54	            'id': self.id,
55	            'code': self.code,
56	            'isUsed': self.is_used,
57	            'usedBy': self.used_by_email,
58	            'createdAt': self.created_at.isoformat() if self.created_at else None,
59	            'usedAt': self.used_at.isoformat() if self.used_at else None
60	        }
61	
62	class Progress(db.Model):
63	    __tablename__ = 'progress'
64	    
65	    id = db.Column(db.Integer, primary_key=True)
66	    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
67	    module_id = db.Column(db.String(50), nullable=False)
68	    completed_at = db.Column(db.DateTime, default=datetime.utcnow)
69	    
70	    def to_dict(self):
71	        return {
72	            'id': self.id,
73	            'userId': self.user_id,
74	            'moduleId': self.module_id,
75	            'completedAt': self.completed_at.isoformat() if self.completed_at else None
76	        }
77	
78	class QuizScore(db.Model):
79	    __tablename__ = 'quiz_scores'
80	    
81	    id = db.Column(db.Integer, primary_key=True)
82	    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
83	    quiz_id = db.Column(db.String(50), nullable=False)
84	    score = db.Column(db.Integer, nullable=False)
85	    total = db.Column(db.Integer, nullable=False)
86	    completed_at = db.Column(db.DateTime, default=datetime.utcnow)
87	    time_spent = db.Column(db.Integer)  # en secondes
88	    
89	    def to_dict(self):
90	        return {
91	            'id': self.id,
92	            'userId': self.user_id,
93	            'quizId': self.quiz_id,
94	            'score': self.score,
95	            'total': self.total,
96	            'percentage': round((self.score / self.total) * 100, 2) if self.total > 0 else 0,
97	            'completedAt': self.completed_at.isoformat() if self.completed_at else None,
98	            'timeSpent': self.time_spent
99	        }
100	
101	class Admin(db.Model):
102	    __tablename__ = 'admins'
103	    
104	    id = db.Column(db.Integer, primary_key=True)
105	    username = db.Column(db.String(100), unique=True, nullable=False)
106	    password_hash = db.Column(db.String(255), nullable=False)
107	    email = db.Column(db.String(255))
108	    created_at = db.Column(db.DateTime, default=datetime.utcnow)
109	    
110	    def set_password(self, password):
111	        self.password_hash = generate_password_hash(password)
112	    
113	    def check_password(self, password):
114	        return check_password_hash(self.password_hash, password)
115	    
116	    def to_dict(self):
117	        return {
118	            'id': self.id,
119	            'username': self.username,
120	            'email': self.email,
121	            'createdAt': self.created_at.isoformat() if self.created_at else None
122	        }
123	
124	