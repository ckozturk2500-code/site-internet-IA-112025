import { Link } from 'react-router-dom'
import { Brain, LogOut, Download, Award, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'

export default function CertificatePage({ user, onLogout }) {
  const currentDate = new Date().toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  const handleDownload = () => {
    // TODO: Générer un vrai PDF avec l'attestation
    alert('Fonctionnalité de téléchargement à implémenter avec le backend')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Brain className="w-8 h-8 text-indigo-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              OZformation
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              <p className="text-sm text-gray-600">Bienvenue,</p>
              <p className="font-semibold text-gray-900">{user.firstName} {user.lastName}</p>
            </div>
            <Button variant="outline" onClick={onLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Success Message */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Félicitations !</h1>
            <p className="text-xl text-gray-600">
              Vous avez terminé avec succès la formation IA pour Auto-Entrepreneurs
            </p>
          </div>

          {/* Certificate Preview */}
          <div className="bg-white rounded-2xl shadow-2xl p-12 mb-8 border-8 border-indigo-100">
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-6">
                <Brain className="w-12 h-12 text-indigo-600" />
                <span className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  OZformation
                </span>
              </div>

              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Attestation de Réussite
              </h2>

              <div className="mb-8">
                <p className="text-gray-600 mb-4">Cette attestation certifie que</p>
                <p className="text-4xl font-bold text-indigo-600 mb-4">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-gray-600 mb-6">a suivi et validé avec succès la formation</p>
                <p className="text-2xl font-semibold text-gray-900 mb-8">
                  Intelligence Artificielle pour Auto-Entrepreneurs
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8 text-left max-w-2xl mx-auto">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">Fondamentaux de l'IA</p>
                    <p className="text-sm text-gray-600">Concepts, enjeux, RGPD</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">Maîtrise des Prompts</p>
                    <p className="text-sm text-gray-600">Techniques avancées</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">Applications Pratiques</p>
                    <p className="text-sm text-gray-600">Texte, images, musique, vidéo</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">Stratégie Business</p>
                    <p className="text-sm text-gray-600">Intégration IA en entreprise</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <p className="text-gray-600">Délivré le {currentDate}</p>
                <p className="text-sm text-gray-500 mt-2">Code d'accès: {user.accessCode}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 justify-center flex-wrap">
            <Button 
              onClick={handleDownload}
              size="lg"
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              <Download className="w-5 h-5 mr-2" />
              Télécharger en PDF
            </Button>
            <Link to="/dashboard">
              <Button size="lg" variant="outline">
                Retour au Tableau de Bord
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

