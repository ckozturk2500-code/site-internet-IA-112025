#!/bin/bash

# Script de déploiement automatisé pour OZformation
# Ce script reconstruit le frontend et redémarre le serveur Flask

set -e

echo "🚀 Déploiement de OZformation..."
echo ""

# Couleurs pour les messages
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Répertoires
BACKEND_DIR="/home/ubuntu/ozformation/backend_api"
FRONTEND_DIR="/home/ubuntu/ozformation/frontend"
STATIC_DIR="$BACKEND_DIR/src/static"

# Étape 1: Arrêter le serveur Flask
echo -e "${BLUE}[1/5]${NC} Arrêt du serveur Flask..."
pkill -f "python.*main.py" 2>/dev/null || true
sleep 2
echo -e "${GREEN}✓${NC} Serveur arrêté"
echo ""

# Étape 2: Construire le frontend
echo -e "${BLUE}[2/5]${NC} Construction du frontend React..."
cd "$FRONTEND_DIR"
pnpm run build
echo -e "${GREEN}✓${NC} Frontend construit"
echo ""

# Étape 3: Copier les fichiers vers static
echo -e "${BLUE}[3/5]${NC} Copie des fichiers vers le dossier static..."
cp -r "$FRONTEND_DIR/dist/"* "$STATIC_DIR/"
echo -e "${GREEN}✓${NC} Fichiers copiés"
echo ""

# Étape 4: Vérifier que les PDFs sont présents
echo -e "${BLUE}[4/5]${NC} Vérification des fichiers PDF..."
if [ -f "$STATIC_DIR/presentation.pdf" ] && [ -f "$STATIC_DIR/attestation_template.pdf" ]; then
    echo -e "${GREEN}✓${NC} Fichiers PDF présents"
else
    echo -e "${RED}⚠${NC} Attention: Certains fichiers PDF sont manquants"
fi
echo ""

# Étape 5: Redémarrer le serveur Flask
echo -e "${BLUE}[5/5]${NC} Redémarrage du serveur Flask..."
cd "$BACKEND_DIR"
nohup python3 src/main.py > flask.log 2>&1 &
sleep 3

# Vérifier que le serveur a démarré
if curl -s http://localhost:5000/ > /dev/null; then
    echo -e "${GREEN}✓${NC} Serveur Flask démarré avec succès"
    echo ""
    echo -e "${GREEN}✅ Déploiement terminé !${NC}"
    echo ""
    echo "📊 Informations:"
    echo "  - URL locale: http://localhost:5000"
    echo "  - Logs Flask: $BACKEND_DIR/flask.log"
    echo "  - Admin: ckozturk / OZTUadmin2024!"
else
    echo -e "${RED}✗${NC} Erreur: Le serveur Flask n'a pas démarré correctement"
    echo "Consultez les logs: tail -50 $BACKEND_DIR/flask.log"
    exit 1
fi

