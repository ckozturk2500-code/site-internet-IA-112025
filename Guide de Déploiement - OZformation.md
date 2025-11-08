# Guide de Déploiement - OZformation

## Vue d'ensemble

Ce guide vous accompagne dans le déploiement de la plateforme OZformation, une formation en ligne sur l'IA pour auto-entrepreneurs.

## Architecture du Projet

Le projet est composé de deux parties principales :

1. **Frontend** : Application React (Vite) située dans `/frontend`
2. **Backend** : API Flask avec base de données SQLite située dans `/backend_api`

## Prérequis

- Node.js 22.x ou supérieur
- Python 3.11 ou supérieur
- pnpm (gestionnaire de paquets Node.js)
- pip3 (gestionnaire de paquets Python)

## Installation Locale

### 1. Installation du Frontend

```bash
cd frontend
pnpm install
```

### 2. Installation du Backend

```bash
cd backend_api
pip3 install -r requirements.txt
```

### 3. Configuration de la Base de Données

La base de données SQLite est déjà initialisée avec :
- Un compte administrateur : `ckozturk` / `Cko29824344`
- Des codes d'accès de démonstration

Si vous souhaitez réinitialiser la base de données :

```bash
cd backend_api
python3 -c "from src.main import app, db; app.app_context().push(); db.create_all()"
```

### 4. Lancement en Mode Développement

**Backend** :
```bash
cd backend_api
python3 src/main.py
# Le serveur démarre sur http://localhost:5000
```

**Frontend** :
```bash
cd frontend
pnpm run dev
# Le serveur démarre sur http://localhost:5173
```

## Déploiement en Production

### Option 1 : Déploiement Full-Stack (Recommandé)

Le frontend est déjà compilé et copié dans le dossier `backend_api/src/static/`. Vous pouvez déployer uniquement le backend Flask qui servira également le frontend.

#### Sur un serveur Linux (Ubuntu/Debian)

1. **Installer les dépendances système** :
```bash
sudo apt update
sudo apt install python3 python3-pip python3-venv nginx
```

2. **Créer un environnement virtuel** :
```bash
cd backend_api
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

3. **Configurer Gunicorn** :
```bash
pip install gunicorn
```

4. **Créer un service systemd** (`/etc/systemd/system/ozformation.service`) :
```ini
[Unit]
Description=OZformation Flask Application
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/chemin/vers/backend_api
Environment="PATH=/chemin/vers/backend_api/venv/bin"
ExecStart=/chemin/vers/backend_api/venv/bin/gunicorn --workers 3 --bind 0.0.0.0:5000 src.main:app

[Install]
WantedBy=multi-user.target
```

5. **Démarrer le service** :
```bash
sudo systemctl start ozformation
sudo systemctl enable ozformation
```

6. **Configurer Nginx** (`/etc/nginx/sites-available/ozformation`) :
```nginx
server {
    listen 80;
    server_name votre-domaine.com;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

7. **Activer le site** :
```bash
sudo ln -s /etc/nginx/sites-available/ozformation /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Option 2 : Déploiement sur Heroku

1. **Installer Heroku CLI** :
```bash
curl https://cli-assets.heroku.com/install.sh | sh
```

2. **Créer une application Heroku** :
```bash
cd backend_api
heroku create nom-de-votre-app
```

3. **Créer un Procfile** :
```
web: gunicorn src.main:app
```

4. **Déployer** :
```bash
git init
git add .
git commit -m "Initial commit"
git push heroku master
```

### Option 3 : Déploiement sur Vercel (Frontend uniquement)

Si vous souhaitez déployer le frontend séparément :

1. **Installer Vercel CLI** :
```bash
npm install -g vercel
```

2. **Déployer** :
```bash
cd frontend
vercel
```

## Configuration du Nom de Domaine

### Avec Cloudflare (Recommandé)

1. Achetez un nom de domaine (ex: `ozformation.com`)
2. Ajoutez-le à Cloudflare
3. Créez un enregistrement DNS de type A pointant vers l'IP de votre serveur
4. Activez le SSL/TLS automatique de Cloudflare

### Avec Let's Encrypt (Certificat SSL gratuit)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d votre-domaine.com
```

## Personnalisation

### Modifier les Identifiants Administrateur

Exécutez le script `update_admin.py` :

```bash
cd backend_api
python3 update_admin.py
```

Modifiez les valeurs dans le script avant de l'exécuter.

### Ajouter des Vidéos YouTube

Consultez le fichier `GUIDE_VIDEOS.md` pour les instructions détaillées.

### Modifier le Contenu des Modules

Éditez le fichier `frontend/src/content_modules.json` et reconstruisez le frontend :

```bash
cd frontend
pnpm run build
cp -r dist/* ../backend_api/src/static/
```

## Maintenance

### Sauvegardes

Sauvegardez régulièrement :
- La base de données : `backend_api/database/ozformation.db`
- Les fichiers statiques : `backend_api/src/static/`

### Mises à Jour

Pour mettre à jour le contenu ou les fonctionnalités :

1. Modifiez les fichiers sources
2. Reconstruisez le frontend si nécessaire
3. Redémarrez le service backend

```bash
sudo systemctl restart ozformation
```

## Dépannage

### Le site ne s'affiche pas

- Vérifiez que le service Flask est démarré : `sudo systemctl status ozformation`
- Vérifiez les logs : `sudo journalctl -u ozformation -f`
- Vérifiez que Nginx est actif : `sudo systemctl status nginx`

### Erreurs de base de données

- Vérifiez que le fichier `database/ozformation.db` existe et a les bonnes permissions
- Réinitialisez la base de données si nécessaire (voir section Installation)

### Les vidéos ne s'affichent pas

- Vérifiez que les liens YouTube sont corrects dans `content_modules.json`
- Assurez-vous que les vidéos ne sont pas privées

## Support

Pour toute question ou problème :
- Email : OZTUformation@gmail.com
- Documentation complète : `README.md`, `GUIDE_ADMIN.md`, `GUIDE_VIDEOS.md`

## Sécurité

⚠️ **Important** :
- Changez immédiatement le mot de passe administrateur par défaut
- Utilisez HTTPS en production (Let's Encrypt ou Cloudflare)
- Sauvegardez régulièrement la base de données
- Ne partagez jamais vos identifiants administrateur

## Licence

Ce projet a été créé pour OZformation. Tous droits réservés.

---

**Créé avec Manus** : [https://manus.im/invitation/AZ838GSTUYBWQ4](https://manus.im/invitation/AZ838GSTUYBWQ4)

