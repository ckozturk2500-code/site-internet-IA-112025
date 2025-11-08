# OZformation - Plateforme de Formation IA pour Auto-Entrepreneurs

## 📋 Description

OZformation est une plateforme de formation en ligne complète dédiée à l'intelligence artificielle pour les auto-entrepreneurs. Elle propose un parcours structuré en 5 blocs thématiques avec des quiz interactifs sous forme de mini-jeux Pac-Man, un système de suivi de progression, et une interface d'administration complète.

## ✨ Fonctionnalités

### Pour les Apprenants
- ✅ **Inscription sécurisée** avec code d'accès unique
- ✅ **5 blocs de formation** couvrant tous les aspects de l'IA
- ✅ **Quiz interactifs** avec mini-jeu Pac-Man (contrôle au clavier)
- ✅ **Suivi de progression** en temps réel
- ✅ **Attestation de réussite** personnalisée
- ✅ **Interface responsive** (mobile, tablette, desktop)

### Pour les Administrateurs
- ✅ **Tableau de bord complet** avec statistiques
- ✅ **Gestion des apprenants** (liste, détails, activation/désactivation)
- ✅ **Gestion des codes d'accès** (génération, suivi d'utilisation)
- ✅ **Statistiques détaillées** (progression, taux de réussite aux quiz)

## 🏗️ Architecture Technique

### Frontend
- **Framework** : React 18 + Vite
- **UI** : Tailwind CSS + shadcn/ui
- **Icônes** : Lucide React
- **Routing** : React Router v6

### Backend
- **Framework** : Flask (Python 3.11)
- **Base de données** : SQLite (SQLAlchemy ORM)
- **Authentification** : Sessions Flask
- **CORS** : Flask-CORS pour le développement

## 📦 Structure du Projet

```
ozformation/
├── frontend/                 # Application React
│   ├── src/
│   │   ├── pages/           # Pages de l'application
│   │   │   ├── HomePage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── ModulePage.jsx
│   │   │   ├── QuizPage.jsx
│   │   │   ├── CertificatePage.jsx
│   │   │   ├── AdminLoginPage.jsx
│   │   │   └── AdminDashboardPage.jsx
│   │   ├── components/      # Composants réutilisables
│   │   │   ├── ui/          # Composants UI (shadcn)
│   │   │   └── quiz/        # Composant Pac-Man
│   │   ├── App.jsx          # Composant principal
│   │   └── content_modules.json  # Contenu pédagogique
│   └── dist/                # Build de production
│
├── backend_api/             # API Flask
│   ├── src/
│   │   ├── models/          # Modèles de données
│   │   │   └── user.py      # User, AccessCode, Progress, QuizScore, Admin
│   │   ├── routes/          # Routes API
│   │   │   ├── auth.py      # Authentification
│   │   │   ├── progress.py  # Progression et quiz
│   │   │   └── admin.py     # Administration
│   │   ├── static/          # Frontend build (copié depuis frontend/dist)
│   │   ├── database/        # Base de données SQLite
│   │   └── main.py          # Point d'entrée Flask
│   ├── venv/                # Environnement virtuel Python
│   └── requirements.txt     # Dépendances Python
│
├── content_modules.json     # Contenu des modules de formation
└── README.md                # Ce fichier
```

## 🚀 Installation et Démarrage

### Prérequis
- Python 3.11+
- Node.js 22+
- pnpm

### Installation

1. **Cloner le projet** (si nécessaire)
```bash
cd /home/ubuntu/ozformation
```

2. **Installer les dépendances backend**
```bash
cd backend_api
python3.11 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

3. **Installer les dépendances frontend** (pour le développement)
```bash
cd ../frontend
pnpm install
```

### Démarrage en Mode Développement

**Option 1 : Frontend et Backend séparés**

Terminal 1 - Backend :
```bash
cd backend_api
source venv/bin/activate
python src/main.py
# Serveur sur http://localhost:5000
```

Terminal 2 - Frontend :
```bash
cd frontend
pnpm run dev
# Serveur sur http://localhost:5173
```

**Option 2 : Application Full-Stack unifiée**

```bash
cd backend_api
source venv/bin/activate
python src/main.py
# Application complète sur http://localhost:5000
```

## 📚 Contenu de la Formation

### Bloc 0 : Introduction et Orientation
- Vidéos d'introduction
- Quiz diagnostic
- Document récapitulatif

### Bloc 1 : Fondamentaux de l'IA
- Module 1 : Introduction à l'IA et enjeux
- Module 2 : Propriété intellectuelle et RGPD
- Quiz Pac-Man

### Bloc 2 : Maîtriser les Prompts
- Module 3 : Rédaction de prompts efficaces
- Quiz Pac-Man

### Bloc 3 : Applications Pratiques
- Module 4 : IA pour le texte (ChatGPT)
- Module 5 : IA pour les images
- Module 6 : IA pour la musique
- Module 7 : IA pour la vidéo
- Quiz Pac-Man par module

### Bloc 4 : Business et Stratégie
- Modules spécialisés business
- Quiz final global

## 🎮 Quiz Pac-Man

Les quiz sont présentés sous forme de mini-jeu Pac-Man interactif :
- **Contrôles** : Flèches directionnelles du clavier
- **Objectif** : Guider Pac-Man pour gober le numéro de la bonne réponse (1, 2 ou 3)
- **Difficulté** : Un fantôme rôde et peut attraper Pac-Man
- **Score de passage** : 60% minimum (70% pour le quiz final)

## 🔐 Authentification

### Utilisateurs
- **Inscription** : Prénom, Nom, Email, Code d'accès
- **Connexion** : Email + Code d'accès
- **Codes de démonstration** : 
  - OZLIA123456
  - OZLIA789012
  - OZLIA345678

### Administrateurs
- **Connexion** : Username + Password
- **Compte par défaut** :
  - Username: `admin`
  - Password: `admin`
  - ⚠️ **À CHANGER EN PRODUCTION**

## 🗄️ Base de Données

### Tables
- **users** : Informations des apprenants
- **access_codes** : Codes d'accès et leur utilisation
- **progress** : Modules complétés par utilisateur
- **quiz_scores** : Scores aux quiz
- **admins** : Comptes administrateurs

### Initialisation
La base de données est automatiquement créée au premier lancement avec :
- 1 compte administrateur (admin/admin)
- 3 codes d'accès de démonstration

## 📡 API Endpoints

### Authentification (`/api/auth`)
- `POST /register` - Inscription
- `POST /login` - Connexion utilisateur
- `POST /admin/login` - Connexion admin
- `POST /logout` - Déconnexion
- `GET /me` - Utilisateur connecté

### Progression (`/api/progress`)
- `POST /module/<module_id>` - Marquer un module comme complété
- `POST /quiz` - Soumettre un score de quiz
- `GET /user` - Récupérer la progression

### Administration (`/api/admin`)
- `GET /users` - Liste des utilisateurs
- `GET /users/<id>` - Détails d'un utilisateur
- `GET /codes` - Liste des codes d'accès
- `POST /codes/generate` - Générer un code
- `GET /stats` - Statistiques globales
- `POST /users/<id>/toggle` - Activer/désactiver un utilisateur

## 🚀 Déploiement

### Build de Production

1. **Construire le frontend**
```bash
cd frontend
pnpm run build
```

2. **Copier le build dans le backend**
```bash
cd ..
rm -rf backend_api/src/static/*
cp -r frontend/dist/* backend_api/src/static/
```

3. **Mettre à jour requirements.txt**
```bash
cd backend_api
source venv/bin/activate
pip freeze > requirements.txt
```

### Déploiement avec Manus

```bash
cd backend_api
# Utiliser l'outil de déploiement Manus
# Le serveur sera accessible via un nom de domaine fourni
```

### Configuration pour la Production

**⚠️ IMPORTANT : Modifier dans `src/main.py`**

```python
# Changer la clé secrète
app.config['SECRET_KEY'] = 'votre_clé_secrète_sécurisée'

# Désactiver CORS ou configurer les origines autorisées
CORS(app, supports_credentials=True, origins=['https://ozformation.com'])

# Désactiver le mode debug
app.run(host='0.0.0.0', port=5000, debug=False)
```

**Changer le mot de passe admin**
```python
# Dans src/main.py, modifier :
admin.set_password('mot_de_passe_sécurisé')
```

## 📝 Personnalisation

### Ajouter des Vidéos YouTube

Modifier `frontend/src/content_modules.json` :
```json
{
  "videoUrl": "https://www.youtube.com/watch?v=VOTRE_VIDEO_ID"
}
```

### Ajouter des Questions de Quiz

Modifier `frontend/src/pages/QuizPage.jsx` dans l'objet `quizQuestions`.

### Modifier le Design

Les couleurs et styles sont configurés dans :
- `frontend/tailwind.config.js` - Configuration Tailwind
- `frontend/src/index.css` - Styles globaux

## 🔒 Sécurité et RGPD

### Données Collectées
- Nom, prénom, email (nécessaires à la formation)
- Progression et scores (suivi pédagogique)
- Dates de connexion (statistiques)

### Mesures de Sécurité
- Authentification par session
- Codes d'accès uniques
- Validation des données côté serveur
- Protection CSRF (sessions HTTP-only)

### Conformité RGPD
- ✅ Collecte minimale de données
- ✅ Finalité claire (formation)
- ✅ Sécurisation des données
- ⚠️ À ajouter : Politique de confidentialité
- ⚠️ À ajouter : Droit d'accès et de suppression

## 📧 Fonctionnalités à Implémenter

### Emails Automatiques
Pour implémenter l'envoi d'emails :

1. Installer Flask-Mail
```bash
pip install Flask-Mail
```

2. Configurer dans `main.py`
```python
from flask_mail import Mail, Message

app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'votre@email.com'
app.config['MAIL_PASSWORD'] = 'votre_mot_de_passe'

mail = Mail(app)
```

3. Envoyer des emails lors de :
   - Inscription d'un apprenant
   - Connexion d'un apprenant
   - Complétion du quiz final

### Génération d'Attestations PDF
Pour générer des attestations :

1. Installer ReportLab
```bash
pip install reportlab
```

2. Créer un module `src/utils/certificate.py`
3. Générer le PDF avec les informations de l'apprenant

## 🆘 Support et Maintenance

### Logs
Les logs de l'application Flask sont affichés dans la console.

### Backup de la Base de Données
```bash
cp backend_api/src/database/app.db backend_api/src/database/app.db.backup
```

### Réinitialiser la Base de Données
```bash
rm backend_api/src/database/app.db
# Redémarrer l'application pour recréer la base
```

## 📄 Licence

Ce projet est développé pour OZformation. Tous droits réservés.

## 👨‍💻 Développement

Développé par Manus AI - 2025

---

**Note** : Ce projet est une base fonctionnelle complète. Pour une mise en production, pensez à :
1. Changer tous les mots de passe par défaut
2. Configurer un serveur de production (Gunicorn, Nginx)
3. Utiliser une base de données PostgreSQL pour la production
4. Implémenter le système d'envoi d'emails
5. Ajouter la génération d'attestations PDF
6. Configurer un nom de domaine personnalisé
7. Mettre en place des sauvegardes automatiques
8. Ajouter des tests unitaires et d'intégration

