from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    access_code = db.Column(db.String(50), unique=True, nullable=False)
    registration_date = db.Column(db.DateTime, default=datetime.utcnow)
    last_login = db.Column(db.DateTime)
    is_active = db.Column(db.Boolean, default=True)
    
    # Relations
    progress = db.relationship('Progress', backref='user', lazy=True, cascade='all, delete-orphan')
    quiz_scores = db.relationship('QuizScore', backref='user', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        completed_modules = [p.module_id for p in self.progress]
        quiz_scores_list = [q.to_dict() for q in self.quiz_scores]
        
        return {
            'id': self.id,
            'firstName': self.first_name,
            'lastName': self.last_name,
            'email': self.email,
            'accessCode': self.access_code,
            'registrationDate': self.registration_date.isoformat() if self.registration_date else None,
            'lastLogin': self.last_login.isoformat() if self.last_login else None,
            'isActive': self.is_active,
            'progress': {
                'completedModules': completed_modules,
                'quizScores': quiz_scores_list
            }
        }

class AccessCode(db.Model):
    __tablename__ = 'access_codes'
    
    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.String(50), unique=True, nullable=False)
    is_used = db.Column(db.Boolean, default=False)
    used_by_email = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    used_at = db.Column(db.DateTime)
    
    def to_dict(self):
        return {
            'id': self.id,
            'code': self.code,
            'isUsed': self.is_used,
            'usedBy': self.used_by_email,
            'createdAt': self.created_at.isoformat() if self.created_at else None,
            'usedAt': self.used_at.isoformat() if self.used_at else None
        }

class Progress(db.Model):
    __tablename__ = 'progress'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    module_id = db.Column(db.String(50), nullable=False)
    completed_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'userId': self.user_id,
            'moduleId': self.module_id,
            'completedAt': self.completed_at.isoformat() if self.completed_at else None
        }

class QuizScore(db.Model):
    __tablename__ = 'quiz_scores'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    quiz_id = db.Column(db.String(50), nullable=False)
    score = db.Column(db.Integer, nullable=False)
    total = db.Column(db.Integer, nullable=False)
    completed_at = db.Column(db.DateTime, default=datetime.utcnow)
    time_spent = db.Column(db.Integer)  # en secondes
    
    def to_dict(self):
        return {
            'id': self.id,
            'userId': self.user_id,
            'quizId': self.quiz_id,
            'score': self.score,
            'total': self.total,
            'percentage': round((self.score / self.total) * 100, 2) if self.total > 0 else 0,
            'completedAt': self.completed_at.isoformat() if self.completed_at else None,
            'timeSpent': self.time_spent
        }

class Admin(db.Model):
    __tablename__ = 'admins'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'createdAt': self.created_at.isoformat() if self.created_at else None
        }
