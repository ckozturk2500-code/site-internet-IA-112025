# Guide d'Administration - OZformation

## 🔐 Accès à l'Interface d'Administration

### Connexion
1. Accédez à l'URL : `https://votre-domaine.com/admin/login`
2. Identifiants par défaut :
   - **Username** : `admin`
   - **Password** : `admin`
   - ⚠️ **IMPORTANT** : Changez ce mot de passe immédiatement après le premier déploiement

### Changer le Mot de Passe Admin

**Méthode 1 : Via Python (recommandé)**
```bash
cd backend_api
source venv/bin/activate
python3
```

```python
from src.models.user import db, Admin
from src.main import app

with app.app_context():
    admin = Admin.query.filter_by(username='admin').first()
    admin.set_password('nouveau_mot_de_passe_sécurisé')
    db.session.commit()
    print("Mot de passe changé avec succès")
```

**Méthode 2 : Modifier le code source**
Dans `backend_api/src/main.py`, ligne où l'admin est créé :
```python
admin.set_password('votre_nouveau_mot_de_passe')
```

## 📊 Tableau de Bord

Le tableau de bord administrateur affiche :

### Statistiques Globales
- **Nombre total d'utilisateurs inscrits**
- **Nombre de codes d'accès générés**
- **Nombre de codes utilisés**
- **Progression moyenne** (nombre moyen de modules complétés)
- **Statistiques des quiz** (taux de réussite par quiz)

### Graphiques
- Évolution des inscriptions
- Taux de complétion des modules
- Performance aux quiz

## 👥 Gestion des Apprenants

### Liste des Apprenants
- **Affichage** : Nom, prénom, email, date d'inscription, statut
- **Recherche** : Par nom, prénom ou email
- **Filtres** : Actifs/Inactifs, Date d'inscription
- **Tri** : Par nom, date, progression

### Actions sur un Apprenant

#### Voir les Détails
Cliquez sur un apprenant pour voir :
- Informations personnelles
- Code d'accès utilisé
- Date d'inscription et dernière connexion
- Liste des modules complétés
- Scores aux quiz
- Progression globale (%)

#### Activer/Désactiver un Compte
- **Désactiver** : L'apprenant ne peut plus se connecter
- **Activer** : Réactiver un compte désactivé
- Utile pour gérer les suspensions ou les fins d'accès

#### Réinitialiser la Progression (à implémenter)
Pour permettre à un apprenant de recommencer :
```python
# Dans backend_api/src/routes/admin.py, ajouter :
@admin_bp.route('/users/<int:user_id>/reset', methods=['POST'])
@require_admin
def reset_user_progress(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'Utilisateur non trouvé'}), 404
    
    # Supprimer la progression et les scores
    Progress.query.filter_by(user_id=user_id).delete()
    QuizScore.query.filter_by(user_id=user_id).delete()
    db.session.commit()
    
    return jsonify({'message': 'Progression réinitialisée'}), 200
```

## 🎫 Gestion des Codes d'Accès

### Vue d'Ensemble
- **Liste complète** des codes générés
- **Statut** : Utilisé / Non utilisé
- **Utilisateur** : Email de l'utilisateur si le code est utilisé
- **Dates** : Création et utilisation

### Générer un Nouveau Code

**Via l'Interface Admin**
1. Cliquez sur "Générer un Code"
2. Le code est automatiquement créé au format `OZLIAXXXXXX`
3. Copiez le code pour l'envoyer à l'apprenant

**Via l'API**
```bash
curl -X POST http://localhost:5000/api/admin/codes/generate \
  -H "Content-Type: application/json" \
  --cookie "session=votre_session"
```

**Via Python (génération en masse)**
```python
from src.models.user import db, AccessCode
from src.main import app
import random
import string

with app.app_context():
    # Générer 10 codes
    for i in range(10):
        code = 'OZLIA' + ''.join(random.choices(string.digits, k=6))
        new_code = AccessCode(code=code)
        db.session.add(new_code)
    db.session.commit()
    print("10 codes générés")
```

### Exporter les Codes (à implémenter)
Pour exporter les codes non utilisés en CSV :
```python
import csv
from src.models.user import AccessCode

with app.app_context():
    codes = AccessCode.query.filter_by(is_used=False).all()
    with open('codes_disponibles.csv', 'w', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(['Code', 'Date de création'])
        for code in codes:
            writer.writerow([code.code, code.created_at])
```

## 📧 Notifications par Email (à configurer)

### Configuration SMTP

Dans `backend_api/src/main.py`, ajoutez :
```python
from flask_mail import Mail, Message

app.config['MAIL_SERVER'] = 'smtp.gmail.com'  # Ou votre serveur SMTP
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'votre@email.com'
app.config['MAIL_PASSWORD'] = 'votre_mot_de_passe_application'
app.config['MAIL_DEFAULT_SENDER'] = 'noreply@ozformation.com'

mail = Mail(app)
```

### Notifications à Implémenter

#### 1. Notification d'Inscription
Quand un apprenant s'inscrit, envoyez-vous un email :

Dans `backend_api/src/routes/auth.py`, après la création de l'utilisateur :
```python
# Envoyer un email à l'admin
msg = Message(
    subject=f"Nouvelle inscription - {new_user.first_name} {new_user.last_name}",
    recipients=['admin@ozformation.com'],
    body=f"""
    Un nouvel apprenant s'est inscrit :
    
    Nom : {new_user.first_name} {new_user.last_name}
    Email : {new_user.email}
    Code d'accès : {new_user.access_code}
    Date : {new_user.registration_date}
    """
)
mail.send(msg)
```

#### 2. Notification de Connexion
À chaque connexion d'un apprenant :
```python
msg = Message(
    subject=f"Connexion - {user.first_name} {user.last_name}",
    recipients=['admin@ozformation.com'],
    body=f"{user.first_name} {user.last_name} s'est connecté le {datetime.now()}"
)
mail.send(msg)
```

#### 3. Notification de Quiz Final
Après le quiz final, avec les résultats détaillés :
```python
msg = Message(
    subject=f"Quiz Final Complété - {user.first_name} {user.last_name}",
    recipients=['admin@ozformation.com'],
    body=f"""
    {user.first_name} {user.last_name} a complété le quiz final.
    
    Score : {quiz_score.score}/{quiz_score.total} ({quiz_score.percentage}%)
    Temps passé : {quiz_score.time_spent} secondes
    Résultat : {"RÉUSSI" if quiz_score.percentage >= 70 else "ÉCHOUÉ"}
    """
)
mail.send(msg)
```

## 📊 Rapports et Statistiques

### Exporter les Données

#### Liste des Apprenants (CSV)
```python
import csv
from src.models.user import User

with app.app_context():
    users = User.query.all()
    with open('apprenants.csv', 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(['ID', 'Prénom', 'Nom', 'Email', 'Code', 'Inscription', 'Dernière connexion', 'Actif'])
        for user in users:
            writer.writerow([
                user.id,
                user.first_name,
                user.last_name,
                user.email,
                user.access_code,
                user.registration_date,
                user.last_login,
                user.is_active
            ])
```

#### Résultats des Quiz (CSV)
```python
from src.models.user import QuizScore, User

with app.app_context():
    scores = QuizScore.query.all()
    with open('resultats_quiz.csv', 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(['Apprenant', 'Email', 'Quiz', 'Score', 'Total', 'Pourcentage', 'Date'])
        for score in scores:
            user = User.query.get(score.user_id)
            writer.writerow([
                f"{user.first_name} {user.last_name}",
                user.email,
                score.quiz_id,
                score.score,
                score.total,
                f"{score.percentage}%",
                score.completed_at
            ])
```

### Statistiques Avancées

#### Taux de Complétion par Module
```python
from src.models.user import User, Progress

with app.app_context():
    total_users = User.query.count()
    modules = ['bloc0-intro', 'bloc1-fondamentaux', 'bloc2-prompts', 'bloc3-applications', 'bloc4-business']
    
    for module in modules:
        completed = Progress.query.filter_by(module_id=module).count()
        percentage = (completed / total_users * 100) if total_users > 0 else 0
        print(f"{module}: {completed}/{total_users} ({percentage:.1f}%)")
```

#### Temps Moyen par Quiz
```python
from src.models.user import QuizScore
from sqlalchemy import func

with app.app_context():
    avg_times = db.session.query(
        QuizScore.quiz_id,
        func.avg(QuizScore.time_spent).label('avg_time')
    ).group_by(QuizScore.quiz_id).all()
    
    for quiz_id, avg_time in avg_times:
        minutes = int(avg_time // 60)
        seconds = int(avg_time % 60)
        print(f"{quiz_id}: {minutes}m {seconds}s en moyenne")
```

## 🔧 Maintenance

### Sauvegarde de la Base de Données

**Sauvegarde Manuelle**
```bash
cd backend_api/src/database
cp app.db app.db.backup_$(date +%Y%m%d_%H%M%S)
```

**Script de Sauvegarde Automatique** (à ajouter au cron)
```bash
#!/bin/bash
# backup_db.sh
BACKUP_DIR="/home/ubuntu/ozformation/backups"
mkdir -p $BACKUP_DIR
cp /home/ubuntu/ozformation/backend_api/src/database/app.db \
   $BACKUP_DIR/app.db.backup_$(date +%Y%m%d_%H%M%S)

# Garder seulement les 7 dernières sauvegardes
ls -t $BACKUP_DIR/app.db.backup_* | tail -n +8 | xargs rm -f
```

Ajouter au crontab (sauvegarde quotidienne à 3h du matin) :
```bash
crontab -e
# Ajouter la ligne :
0 3 * * * /home/ubuntu/ozformation/backup_db.sh
```

### Restauration
```bash
cd backend_api/src/database
cp app.db.backup_YYYYMMDD_HHMMSS app.db
# Redémarrer l'application
```

### Nettoyage des Données

#### Supprimer les Comptes Inactifs (non connectés depuis 6 mois)
```python
from datetime import datetime, timedelta
from src.models.user import User, db

with app.app_context():
    six_months_ago = datetime.utcnow() - timedelta(days=180)
    inactive_users = User.query.filter(
        User.last_login < six_months_ago
    ).all()
    
    for user in inactive_users:
        print(f"Suppression de {user.email}")
        db.session.delete(user)
    
    db.session.commit()
```

#### Supprimer les Codes Expirés (non utilisés après 1 an)
```python
from datetime import datetime, timedelta
from src.models.user import AccessCode, db

with app.app_context():
    one_year_ago = datetime.utcnow() - timedelta(days=365)
    expired_codes = AccessCode.query.filter(
        AccessCode.is_used == False,
        AccessCode.created_at < one_year_ago
    ).all()
    
    for code in expired_codes:
        db.session.delete(code)
    
    db.session.commit()
    print(f"{len(expired_codes)} codes expirés supprimés")
```

## 🚨 Résolution de Problèmes

### Un apprenant ne peut pas se connecter
1. Vérifier que le compte est actif : `user.is_active = True`
2. Vérifier que l'email et le code correspondent
3. Vérifier les logs de l'application

### Les statistiques ne s'affichent pas
1. Vérifier que la base de données contient des données
2. Vérifier les logs du backend
3. Vérifier la connexion entre frontend et backend

### L'application ne démarre pas
1. Vérifier que le port 5000 n'est pas déjà utilisé : `lsof -i :5000`
2. Vérifier les logs d'erreur
3. Vérifier que la base de données existe et est accessible

### Erreur "Database is locked"
SQLite ne supporte qu'une seule écriture à la fois. Solutions :
1. Utiliser PostgreSQL pour la production
2. Réduire les écritures simultanées
3. Augmenter le timeout de la base de données

## 📞 Support

Pour toute question ou problème :
- Consulter la documentation complète : `README.md`
- Vérifier les logs de l'application
- Contacter le support technique

---

**Dernière mise à jour** : 

