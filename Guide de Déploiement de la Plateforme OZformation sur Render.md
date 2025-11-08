# Guide de Déploiement de la Plateforme OZformation sur Render

**Auteur** : Manus AI  
**Date** : 23 octobre 2025

---

## 🚀 Introduction

Ce guide vous accompagnera pas à pas pour déployer votre plateforme OZformation (backend Flask et frontend React) sur **Render**, une plateforme d'hébergement cloud qui offre un niveau gratuit généreux pour les projets personnels et de petite taille. Render est choisi pour sa facilité d'utilisation, son support natif pour Python/Flask et les applications statiques (React), et la possibilité d'héberger les deux parties de votre application sous un même domaine.

### Pourquoi Render ?

*   **Déploiement simplifié** : Intégration continue depuis GitHub/GitLab/Bitbucket.
*   **Support complet** : Gère les applications web (Flask), les bases de données (PostgreSQL, Redis), et les sites statiques (React).
*   **Niveau gratuit** : Permet de démarrer sans frais pour tester et héberger de petits projets.
*   **Adresses fixes** : Une fois déployé, votre site aura une URL stable et permanente.

---

## 📦 Préparation des Fichiers du Projet

J'ai préparé deux archives ZIP contenant les fichiers nécessaires au déploiement :

1.  **`ozformation_deploy.zip`** : Contient l'ensemble du projet (backend et frontend compilé), à l'exception des dossiers `node_modules`, `dist`, des logs et de la base de données SQLite. Ce fichier est idéal pour le déploiement du backend.
2.  **`ozformation_frontend_dist.zip`** : Contient uniquement la version compilée (build) du frontend React. Ce fichier peut être utilisé si vous souhaitez héberger le frontend séparément en tant que site statique.

Ces fichiers sont disponibles dans le répertoire `/home/ubuntu/ozformation/`.

---

## ⚙️ Étapes de Déploiement sur Render

Le déploiement sur Render se fera en deux parties : d'abord le **backend Flask** qui servira également le frontend, puis la **base de données PostgreSQL** (recommandé pour la production).

### Étape 1 : Créer un Compte Render

1.  Rendez-vous sur [render.com](https://render.com/).
2.  Cliquez sur 

3.  Inscrivez-vous en utilisant votre compte GitHub/GitLab/Bitbucket pour une intégration facile.

### Étape 2 : Déployer le Backend Flask (avec le Frontend Intégré)

Nous allons déployer le backend Flask qui servira également les fichiers statiques du frontend React.

1.  **Créez un nouveau service Web** :
    *   Dans votre tableau de bord Render, cliquez sur `New` puis `Web Service`.
    *   Connectez votre dépôt Git (où vous pousserez votre code).
    *   **Alternative (si vous ne voulez pas utiliser Git)** : Vous pouvez uploader le fichier `ozformation_deploy.zip` manuellement, mais l'intégration Git est fortement recommandée.

2.  **Configurez le service Web** :
    *   **Name** : `ozformation-backend` (ou un nom de votre choix)
    *   **Region** : Choisissez la région la plus proche de vos utilisateurs.
    *   **Branch** : `main` (ou la branche que vous utilisez)
    *   **Root Directory** : Laissez vide si votre projet est à la racine du dépôt, sinon spécifiez `backend_api`.
    *   **Runtime** : `Python 3`
    *   **Build Command** : `pip install -r requirements.txt && cd frontend && pnpm install && pnpm run build && cp -r dist/* ../backend_api/src/static/`
        *   **Explication** : Cette commande installera les dépendances Python, puis naviguera dans le dossier `frontend`, installera les dépendances Node.js (pnpm), construira le frontend React, et enfin copiera les fichiers statiques générés (`dist`) dans le dossier `src/static` du backend Flask.
    *   **Start Command** : `gunicorn --bind 0.0.0.0:$PORT src.main:app`
        *   **Explication** : Gunicorn est un serveur WSGI de production recommandé pour Flask. `$PORT` est une variable d'environnement fournie par Render.

3.  **Variables d'Environnement (Environment Variables)** :
    *   Ajoutez les variables d'environnement suivantes dans la section `Environment` de Render :
        *   `FLASK_ENV` : `production`
        *   `SECRET_KEY` : Générez une clé secrète forte (ex: `openssl rand -hex 32`). **Ne laissez pas la clé par défaut du projet !**
        *   `DATABASE_URL` : Cette variable sera renseignée automatiquement par Render si vous utilisez une base de données PostgreSQL gérée par Render (voir Étape 3).

4.  **Plan de Service** : Sélectionnez `Free` pour commencer.

5.  Cliquez sur `Create Web Service`.

Render va maintenant déployer votre application. Vous pourrez suivre la progression dans les logs.

### Étape 3 : Configurer la Base de Données PostgreSQL (Recommandé)

Bien que votre application utilise SQLite en développement, pour la production, une base de données PostgreSQL est fortement recommandée. Render propose des bases de données PostgreSQL gérées.

1.  **Créez une nouvelle base de données PostgreSQL** :
    *   Dans votre tableau de bord Render, cliquez sur `New` puis `PostgreSQL`.
    *   **Name** : `ozformation-db` (ou un nom de votre choix)
    *   **Region** : Choisissez la même région que votre service Web.
    *   **Plan** : Sélectionnez `Free` pour commencer.

2.  Cliquez sur `Create Database`.

3.  **Connectez la base de données à votre service Web** :
    *   Une fois la base de données créée, Render générera une `Internal Database URL`.
    *   Render injectera automatiquement cette URL dans votre service Web Flask via la variable d'environnement `DATABASE_URL`.
    *   **Mettez à jour votre code Flask** : Dans votre `main.py`, vous devrez modifier la configuration de la base de données pour utiliser `os.environ.get("DATABASE_URL")` au lieu de `sqlite:///src/database/app.db`.

### Étape 4 : Initialiser la Base de Données sur Render

Après le premier déploiement, votre base de données PostgreSQL sera vide. Vous devrez l'initialiser et y créer l'utilisateur admin.

1.  **Accédez au Shell de votre service Web** :
    *   Dans le tableau de bord Render, allez sur votre service Web `ozformation-backend`.
    *   Cliquez sur l'onglet `Shell`.

2.  **Exécutez les commandes d'initialisation** :
    *   Connectez-vous au shell.
    *   Exécutez les commandes Python pour créer les tables et l'utilisateur admin. Vous devrez adapter le script `update_admin.py` ou exécuter les commandes manuellement via un shell Python :

    ```bash
    python3 -c "from src.main import app, db; from src.models.user import Admin; with app.app_context(): db.create_all(); admin = Admin.query.filter_by(username=\'ckozturk\').first(); if not admin: admin = Admin(username=\'ckozturk\', email=\'admin@ozformation.com\'); admin.set_password(\'Cko29824344\'); db.session.add(admin); db.session.commit(); print(\'Admin créé ou mis à jour\')"
    ```
    *   **Note** : Assurez-vous que le mot de passe correspond à celui que vous souhaitez utiliser.

### Étape 5 : Tester le Déploiement

1.  Une fois le déploiement terminé et la base de données initialisée, Render vous fournira une URL publique pour votre service Web.
2.  Ouvrez cette URL dans votre navigateur.
3.  Vérifiez que la page d'accueil s'affiche correctement.
4.  Tentez de vous connecter en tant qu'administrateur à `/admin/login` avec les identifiants que vous avez définis.
5.  Testez le processus d'inscription utilisateur avec un code d'accès.

---

## 💡 Conseils et Bonnes Pratiques

*   **Versionner votre code** : Assurez-vous que votre projet est bien versionné avec Git et poussé sur un dépôt (GitHub, GitLab, etc.). Render s'intègre parfaitement avec ces services.
*   **Variables d'environnement** : N'incluez jamais d'informations sensibles (clés secrètes, mots de passe de base de données) directement dans votre code. Utilisez toujours les variables d'environnement de Render.
*   **Logs** : Render fournit des logs détaillés pour votre application, ce qui est très utile pour le débogage.
*   **Mises à jour** : Chaque fois que vous poussez des modifications sur votre branche Git configurée, Render redéploiera automatiquement votre application.

---

## 📁 Fichiers du Projet pour le Déploiement

J'ai généré les fichiers suivants pour vous :

*   **`ozformation_deploy.zip`** : Archive complète du projet (backend + frontend compilé) prête pour le déploiement sur Render. Contient le `requirements.txt` pour les dépendances Python.
*   **`ozformation_frontend_dist.zip`** : Archive du frontend React compilé (`dist`). Utile si vous souhaitez héberger le frontend séparément (par exemple sur Vercel ou Netlify pour un site statique, et le backend Flask sur Render).

Vous trouverez ces fichiers dans le répertoire `/home/ubuntu/ozformation/`.

**Note importante** : Pour que Render puisse utiliser la base de données PostgreSQL, vous devrez modifier le fichier `main.py` de votre backend Flask pour qu'il utilise la variable d'environnement `DATABASE_URL` fournie par Render. Par exemple, remplacez la ligne de configuration de la base de données par :

```python
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DATABASE_URL", "sqlite:///src/database/app.db")
```

Ceci permettra à votre application de se connecter à PostgreSQL en production et de continuer à utiliser SQLite en développement local si `DATABASE_URL` n'est pas définie.

---

**Ce guide, combiné aux fichiers du projet, devrait vous permettre de déployer votre plateforme OZformation sur Render avec succès.**

