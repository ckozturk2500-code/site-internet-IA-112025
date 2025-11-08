# Conception de l'Architecture Technique et de la Base de Données pour OZformation

## 1. Technologies Choisies

*   **Frontend** : HTML5, CSS3, JavaScript (avec React pour les composants interactifs et la gestion d'état des quiz et de l'interface d'administration).
*   **Backend** : Python 3.11 avec le framework Flask pour l'API RESTful, la logique métier (authentification, gestion des apprenants, suivi des scores, envoi d'emails, génération d'attestations).
*   **Base de Données** : SQLite pour la simplicité et la facilité de déploiement. Elle stockera les informations sur les utilisateurs, les codes d'accès, les progressions, les résultats des quiz.
*   **Hébergement** : Serveur Linux géré par Manus.

## 2. Structure de la Base de Données (SQLite)

Nous aurons plusieurs tables pour gérer les différentes entités de la plateforme.

### Table `users` (Apprenants)

| Champ           | Type      | Contraintes         | Description                               |
| :-------------- | :-------- | :------------------- | :---------------------------------------- |
| `id`            | INTEGER   | PRIMARY KEY AUTOINC. | Identifiant unique de l'apprenant.        |
| `first_name`    | TEXT      | NOT NULL             | Prénom de l'apprenant.                    |
| `last_name`     | TEXT      | NOT NULL             | Nom de l'apprenant.                       |
| `email`         | TEXT      | NOT NULL UNIQUE      | Adresse email de l'apprenant.             |
| `access_code`   | TEXT      | NOT NULL             | Code d'accès unique fourni.               |
| `registration_date` | DATETIME  | NOT NULL             | Date et heure d'inscription.              |
| `last_login`    | DATETIME  | NULL                 | Dernière connexion de l'apprenant.        |

### Table `access_codes` (Codes d'accès)

| Champ           | Type      | Contraintes         | Description                               |
| :-------------- | :-------- | :------------------- | :---------------------------------------- |
| `id`            | INTEGER   | PRIMARY KEY AUTOINC. | Identifiant unique du code.               |
| `code`          | TEXT      | NOT NULL UNIQUE      | Le code d'accès réel (ex: OZLIA310576).   |
| `is_used`       | BOOLEAN   | NOT NULL DEFAULT 0   | Indique si le code a été utilisé.         |
| `used_by_user_id` | INTEGER   | FOREIGN KEY          | Référence à l'utilisateur qui l'a utilisé. |
| `created_at`    | DATETIME  | NOT NULL             | Date de création du code.                 |

### Table `modules` (Modules de formation)

| Champ           | Type      | Contraintes         | Description                               |
| :-------------- | :-------- | :------------------- | :---------------------------------------- |
| `id`            | INTEGER   | PRIMARY KEY AUTOINC. | Identifiant unique du module.             |
| `title`         | TEXT      | NOT NULL             | Titre du module (ex: Introduction à l'IA).|
| `description`   | TEXT      | NULL                 | Description du module.                    |
| `video_url`     | TEXT      | NULL                 | URL de la vidéo YouTube.                  |
| `order_index`   | INTEGER   | NOT NULL UNIQUE      | Ordre d'affichage du module.              |

### Table `quizzes` (Quiz)

| Champ           | Type      | Contraintes         | Description                               |
| :-------------- | :-------- | :------------------- | :---------------------------------------- |
| `id`            | INTEGER   | PRIMARY KEY AUTOINC. | Identifiant unique du quiz.               |
| `module_id`     | INTEGER   | FOREIGN KEY          | Module auquel le quiz est associé.        |
| `title`         | TEXT      | NOT NULL             | Titre du quiz (ex: Quiz Bloc 1).          |
| `type`          | TEXT      | NOT NULL             | Type de quiz (ex: 'diagnostic', 'module', 'final'). |

### Table `questions` (Questions de quiz)

| Champ           | Type      | Contraintes         | Description                               |
| :-------------- | :-------- | :------------------- | :---------------------------------------- |
| `id`            | INTEGER   | PRIMARY KEY AUTOINC. | Identifiant unique de la question.        |
| `quiz_id`       | INTEGER   | FOREIGN KEY          | Quiz auquel la question est associée.     |
| `text`          | TEXT      | NOT NULL             | Texte de la question.                     |
| `correct_answer_index` | INTEGER   | NOT NULL             | Index de la bonne réponse (1, 2 ou 3).    |

### Table `answers` (Réponses possibles)

| Champ           | Type      | Contraintes         | Description                               |
| :-------------- | :-------- | :------------------- | :---------------------------------------- |
| `id`            | INTEGER   | PRIMARY KEY AUTOINC. | Identifiant unique de la réponse.         |
| `question_id`   | INTEGER   | FOREIGN KEY          | Question à laquelle la réponse est associée. |
| `text`          | TEXT      | NOT NULL             | Texte de la réponse.                      |
| `answer_index`  | INTEGER   | NOT NULL             | Index de la réponse (1, 2 ou 3).          |

### Table `user_progress` (Progression des apprenants)

| Champ           | Type      | Contraintes         | Description                               |
| :-------------- | :-------- | :------------------- | :---------------------------------------- |
| `id`            | INTEGER   | PRIMARY KEY AUTOINC. | Identifiant unique de la progression.     |
| `user_id`       | INTEGER   | FOREIGN KEY          | Apprenant concerné.                       |
| `module_id`     | INTEGER   | FOREIGN KEY          | Module complété.                          |
| `completed_at`  | DATETIME  | NOT NULL             | Date et heure de complétion.              |

### Table `quiz_attempts` (Tentatives de quiz)

| Champ           | Type      | Contraintes         | Description                               |
| :-------------- | :-------- | :------------------- | :---------------------------------------- |
| `id`            | INTEGER   | PRIMARY KEY AUTOINC. | Identifiant unique de la tentative.       |
| `user_id`       | INTEGER   | FOREIGN KEY          | Apprenant concerné.                       |
| `quiz_id`       | INTEGER   | FOREIGN KEY          | Quiz tenté.                               |
| `score`         | INTEGER   | NOT NULL             | Score obtenu (ex: nombre de bonnes réponses). |
| `total_questions` | INTEGER   | NOT NULL             | Nombre total de questions dans le quiz.   |
| `attempt_date`  | DATETIME  | NOT NULL             | Date et heure de la tentative.            |
| `time_spent`    | INTEGER   | NULL                 | Temps passé sur le quiz (en secondes).    |
| `passed`        | BOOLEAN   | NOT NULL             | Indique si le quiz a été réussi.          |

### Table `admin_users` (Utilisateurs administrateurs)

| Champ           | Type      | Contraintes         | Description                               |
| :-------------- | :-------- | :------------------- | :---------------------------------------- |
| `id`            | INTEGER   | PRIMARY KEY AUTOINC. | Identifiant unique de l'administrateur.   |
| `username`      | TEXT      | NOT NULL UNIQUE      | Nom d'utilisateur pour la connexion.      |
| `password_hash` | TEXT      | NOT NULL             | Hash du mot de passe.                     |
| `email`         | TEXT      | NOT NULL UNIQUE      | Adresse email de l'administrateur.        |

## 3. Architecture Frontend

*   **Page d'accueil/Inscription** : Formulaire d'inscription avec code d'accès.
*   **Tableau de bord apprenant** : Affichage des modules, progression, accès aux quiz.
*   **Pages de modules** : Intégration des vidéos YouTube, contenu textuel.
*   **Interface de quiz Pac-Man** : Zone de jeu interactive.
*   **Page d'attestation** : Affichage et téléchargement de l'attestation.
*   **Page HTML imprimable** : Contenu statique pour le récapitulatif.

## 4. Architecture Backend (API RESTful Flask)

### Endpoints Principaux

*   `POST /api/register` : Inscription d'un nouvel apprenant avec code d'accès.
*   `POST /api/login` : Connexion des apprenants et administrateurs.
*   `GET /api/modules` : Récupérer la liste des modules de formation.
*   `GET /api/modules/<id>` : Récupérer les détails d'un module spécifique.
*   `GET /api/quizzes/<module_id>` : Récupérer les quiz pour un module.
*   `GET /api/quiz/<id>/questions` : Récupérer les questions et réponses d'un quiz.
*   `POST /api/quiz/<id>/submit` : Soumettre les réponses d'un quiz et enregistrer le score.
*   `GET /api/user/progress` : Récupérer la progression de l'utilisateur.
*   `GET /api/user/certificate` : Générer et récupérer l'attestation de réussite.

### Endpoints Admin

*   `GET /api/admin/users` : Gérer les apprenants.
*   `GET /api/admin/access_codes` : Gérer les codes d'accès.
*   `POST /api/admin/access_codes` : Créer de nouveaux codes d'accès.
*   `GET /api/admin/quiz_attempts` : Suivre les tentatives de quiz.
*   `GET /api/admin/user_scores/<user_id>` : Détail des scores d'un apprenant.

## 5. Flux d'emails

*   **Inscription** : Email de bienvenue (optionnel).
*   **Connexion apprenant** : Email automatique au client.
*   **Quiz final complété** : Email automatique au client avec détails des résultats.
*   **Attestation générée** : Email à l'apprenant avec l'attestation (PDF).

## 6. Sécurité

*   **Authentification** : JWT (JSON Web Tokens) pour les apprenants et les administrateurs.
*   **Mots de passe** : Hachage sécurisé (ex: bcrypt).
*   **RGPD** : Gestion des données personnelles conforme, politique de confidentialité.

Cette architecture fournit une base solide pour le développement de la plateforme. Les prochaines étapes consisteront à mettre en place l'environnement de développement et à commencer l'implémentation du backend Flask et de la base de données.
