# Identifiants d'Accès - Plateforme OZformation

**Date de mise à jour** : 18 octobre 2025  
**Statut** : ✅ Plateforme fonctionnelle

---

## 🌐 URL d'Accès

### Site Web Principal
**URL** : https://5000-id96zut2jqd192ypqc0sl-c20eb4d0.manusvm.computer

⚠️ **Important** : Cette URL est temporaire et liée à la session sandbox actuelle. Pour un accès permanent, il faudra déployer sur un serveur de production.

---

## 🔐 Accès Administrateur

### Connexion Admin

**Page de connexion** : https://5000-id96zut2jqd192ypqc0sl-c20eb4d0.manusvm.computer/admin/login

**Identifiants** :
- **Nom d'utilisateur** : `ckozturk`
- **Mot de passe** : `Cko29824344`

### Fonctionnalités Admin

Une fois connecté, vous aurez accès au dashboard administrateur avec :
- 📊 Statistiques globales (apprenants, codes, progression, emails)
- 👥 Liste des apprenants inscrits
- 🔑 Gestion des codes d'accès
- 📈 Statistiques détaillées

**Améliorations apportées** :
- ✅ Bouton œil pour afficher/masquer le mot de passe
- ✅ Suppression du texte "admin/admin" de démonstration
- ✅ Connexion fonctionnelle avec l'API backend

---

## 👤 Accès Utilisateur

### Inscription

**Page d'inscription** : https://5000-id96zut2jqd192ypqc0sl-c20eb4d0.manusvm.computer/register

**Codes d'accès disponibles** :
- `OZLIA123456` (Disponible)
- `OZLIA789012` (Disponible)
- `OZLIA345678` (Disponible)

**Processus d'inscription** :
1. Remplir le formulaire avec prénom, nom, email
2. Entrer un des codes d'accès ci-dessus
3. Cliquer sur "S'inscrire"
4. Vous serez automatiquement connecté et redirigé vers votre espace de formation

### Connexion

**Page de connexion** : https://5000-id96zut2jqd192ypqc0sl-c20eb4d0.manusvm.computer/login

**Identifiants** :
- **Email** : L'email utilisé lors de l'inscription
- **Code d'accès** : Le code utilisé lors de l'inscription

**Note** : Actuellement, aucun utilisateur n'est enregistré dans la base de données. Vous devez d'abord vous inscrire avec un des codes d'accès disponibles.

---

## 🗄️ Base de Données

### Informations Techniques

**Type** : SQLite  
**Emplacement** : `/home/ubuntu/ozformation/backend_api/src/database/app.db`

### Contenu Actuel

**Administrateurs** :
- 1 admin : `ckozturk` (email: admin@ozformation.com)

**Utilisateurs** :
- Aucun utilisateur enregistré pour le moment

**Codes d'accès** :
- 3 codes disponibles (voir section "Accès Utilisateur")

---

## 🔧 API Backend

### URL de Base
`https://5000-id96zut2jqd192ypqc0sl-c20eb4d0.manusvm.computer/api`

### Endpoints Principaux

#### Authentification Utilisateur
- **POST** `/api/auth/register` - Inscription d'un nouvel utilisateur
- **POST** `/api/auth/login` - Connexion utilisateur
- **GET** `/api/auth/me` - Vérifier le statut d'authentification
- **POST** `/api/auth/logout` - Déconnexion

#### Authentification Admin
- **POST** `/api/auth/admin/login` - Connexion administrateur

#### Progression
- **GET** `/api/user/progress` - Récupérer la progression de l'utilisateur
- **POST** `/api/user/progress` - Mettre à jour la progression

#### Administration
- **GET** `/api/admin/users` - Liste des utilisateurs (admin uniquement)
- **GET** `/api/admin/stats` - Statistiques globales (admin uniquement)

### Test API avec curl

**Connexion admin** :
```bash
curl -X POST https://5000-id96zut2jqd192ypqc0sl-c20eb4d0.manusvm.computer/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"ckozturk","password":"Cko29824344"}'
```

**Inscription utilisateur** :
```bash
curl -X POST https://5000-id96zut2jqd192ypqc0sl-c20eb4d0.manusvm.computer/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jean",
    "lastName": "Dupont",
    "email": "jean.dupont@example.com",
    "accessCode": "OZLIA123456"
  }'
```

---

## 📁 Fichiers Importants

### Backend
- **Serveur Flask** : `/home/ubuntu/ozformation/backend_api/src/main.py`
- **Base de données** : `/home/ubuntu/ozformation/backend_api/src/database/app.db`
- **Logs** : `/home/ubuntu/ozformation/backend_api/flask.log`
- **Fichiers statiques** : `/home/ubuntu/ozformation/backend_api/src/static/`

### Frontend
- **Code source** : `/home/ubuntu/ozformation/frontend/src/`
- **Build** : `/home/ubuntu/ozformation/frontend/dist/`

### Scripts
- **Déploiement** : `/home/ubuntu/ozformation/deploy.sh`

---

## 🚀 Déploiement

### Redémarrer le Serveur

**Méthode 1 : Script automatisé**
```bash
cd /home/ubuntu/ozformation
./deploy.sh
```

**Méthode 2 : Manuellement**
```bash
# Arrêter le serveur
ps aux | grep "python.*main.py" | grep -v grep | awk '{print $2}' | xargs kill -9

# Redémarrer
cd /home/ubuntu/ozformation/backend_api
nohup python3 src/main.py > flask.log 2>&1 &
```

### Reconstruire le Frontend

```bash
cd /home/ubuntu/ozformation/frontend
pnpm run build
cp -r dist/* /home/ubuntu/ozformation/backend_api/src/static/
```

---

## ✅ Fonctionnalités Testées

### Page d'Accueil
- ✅ Affichage correct de tous les éléments visuels
- ✅ Navigation fonctionnelle
- ✅ Boutons "Connexion" et "S'inscrire" actifs
- ✅ Téléchargement PDF de la présentation

### Connexion Administrateur
- ✅ Authentification avec identifiants corrects
- ✅ Bouton œil pour afficher/masquer le mot de passe
- ✅ Redirection vers le dashboard
- ✅ Affichage des statistiques
- ✅ Liste des apprenants
- ✅ Navigation entre onglets

### API Backend
- ✅ Routes API retournent du JSON
- ✅ Authentification admin fonctionnelle
- ✅ Pas de conflit de routage

---

## 🔒 Sécurité

### Recommandations pour la Production

**Priorité Haute** :
1. Changer la clé secrète Flask (actuellement : `ozformation_secret_key_2024_change_in_production`)
2. Désactiver le mode debug Flask
3. Utiliser HTTPS avec un certificat SSL
4. Stocker les secrets dans des variables d'environnement
5. Utiliser un serveur WSGI (Gunicorn) au lieu du serveur Flask de développement

**Priorité Moyenne** :
6. Migrer vers PostgreSQL ou MySQL
7. Mettre en place des sauvegardes automatiques
8. Configurer un système de logs structurés
9. Ajouter un rate limiting sur les endpoints d'authentification

---

## 📞 Support

### Contact
**Email** : OZTUformation@gmail.com

### Code Partenaire Manus
**Lien** : https://manus.im/invitation/AZ838GSTUYBWQ4

---

## 📝 Notes Techniques

### Commandes Utiles

**Vérifier le statut du serveur** :
```bash
ps aux | grep "python.*main.py" | grep -v grep
```

**Consulter les logs en temps réel** :
```bash
tail -f /home/ubuntu/ozformation/backend_api/flask.log
```

**Vérifier la base de données** :
```bash
cd /home/ubuntu/ozformation/backend_api
python3 << 'EOF'
import sqlite3
conn = sqlite3.connect('src/database/app.db')
cursor = conn.cursor()
cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
print(cursor.fetchall())
conn.close()
EOF
```

**Tester l'API** :
```bash
# Vérifier que le serveur répond
curl -I https://5000-id96zut2jqd192ypqc0sl-c20eb4d0.manusvm.computer/

# Tester l'authentification
curl https://5000-id96zut2jqd192ypqc0sl-c20eb4d0.manusvm.computer/api/auth/me
```

---

## 🎯 Résumé Rapide

**Pour vous connecter en tant qu'administrateur** :
1. Allez sur : https://5000-id96zut2jqd192ypqc0sl-c20eb4d0.manusvm.computer/admin/login
2. Username : `ckozturk`
3. Password : `Cko29824344`
4. Cliquez sur l'icône œil pour vérifier votre mot de passe avant de vous connecter

**Pour vous inscrire en tant qu'utilisateur** :
1. Allez sur : https://5000-id96zut2jqd192ypqc0sl-c20eb4d0.manusvm.computer/register
2. Remplissez le formulaire
3. Utilisez un des codes : `OZLIA123456`, `OZLIA789012`, ou `OZLIA345678`

---

*Document généré le 18 octobre 2025*

