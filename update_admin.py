import os
import sys
from werkzeug.security import generate_password_hash

# Ajouter le répertoire parent au PYTHONPATH pour les imports relatifs
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.main import app, db
from src.models.user import Admin

with app.app_context():
    new_username = "ckozturk"
    new_password_raw = "Cko29824344"

    # Tenter de trouver l'administrateur par le nouveau nom d'utilisateur
    admin_by_new_username = Admin.query.filter_by(username=new_username).first()

    if admin_by_new_username:
        # Si l'administrateur avec le nouveau nom d'utilisateur existe déjà, le mettre à jour
        admin_by_new_username.set_password(new_password_raw)
        db.session.commit()
        print(f"Identifiants administrateur mis à jour pour {new_username}.")
    else:
        # Si l'administrateur avec le nouveau nom d'utilisateur n'existe pas,
        # tenter de trouver l'administrateur par l'ancien nom d'utilisateur ('admin')
        admin_by_old_username = Admin.query.filter_by(username='admin').first()
        if admin_by_old_username:
            # Si l'administrateur 'admin' existe, le renommer et mettre à jour le mot de passe
            admin_by_old_username.username = new_username
            admin_by_old_username.set_password(new_password_raw)
            db.session.commit()
            print(f"Administrateur 'admin' renommé en {new_username} et mot de passe mis à jour.")
        else:
            # Si aucun administrateur n'existe, en créer un nouveau
            print("Aucun administrateur existant trouvé. Création d'un nouvel administrateur.")
            new_admin = Admin(username=new_username, email="admin@ozformation.com") # Ajouter un email par défaut
            new_admin.set_password(new_password_raw)
            db.session.add(new_admin)
            db.session.commit()
            print(f"Nouvel administrateur créé : username={new_username}, password={new_password_raw}")

