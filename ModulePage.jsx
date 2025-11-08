import { useState, useEffect, useContext } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { UserContext } from '../App.jsx'
import { Brain, ArrowLeft, CheckCircle, Play, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'
import contentModules from '../content_modules.json'

export default function ModulePage() {
  const { moduleId } = useParams()
  const navigate = useNavigate()
  const { user, setUser } = useContext(UserContext)
  const [moduleData, setModuleData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isCompleted, setIsCompleted] = useState(false)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    // Trouver le module correspondant
    let foundModule = null
    for (const bloc of contentModules.blocs) {
      foundModule = bloc.modules.find(m => m.id === moduleId)
      if (foundModule) break
    }

    if (foundModule) {
      setModuleData(foundModule)
      setIsCompleted(user.progress.completedModules.includes(moduleId))
    } else {
      setError('Module non trouvé.')
    }
    setLoading(false)
  }, [moduleId, user, navigate])

  const markModuleAsCompleted = async () => {
    if (!user || isCompleted) return

    try {
      const response = await fetch(`/api/progress/${user.id}/complete-module`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ module_id: moduleId })
      })

      const data = await response.json()

      if (response.ok) {
        setIsCompleted(true)
        // Mettre à jour le contexte utilisateur
        setUser(prevUser => ({
          ...prevUser,
          progress: {
            ...prevUser.progress,
            completedModules: [...prevUser.progress.completedModules, moduleId]
          }
        }))
        // Optionnel: naviguer vers le prochain module ou le tableau de bord
        // navigate('/dashboard')
      } else {
        setError(data.message || 'Erreur lors de la mise à jour de la progression.')
      }
    } catch (err) {
      console.error('Erreur de complétion de module:', err)
      setError('Impossible de marquer le module comme complété. Veuillez réessayer.')
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Chargement du module...</div>
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">Erreur: {error}</div>
  }

  if (!moduleData) {
    return <div className="min-h-screen flex items-center justify-center">Module introuvable.</div>
  }

  const renderContent = () => {
    if (moduleData.type === 'video') {
      const getVideoId = (url) => {
        if (!url) return ''
        const match = url.match(/[?&]v=([^&]+)/)
        return match ? match[1] : url.split('/').pop()
      }
      return (
        <div className="aspect-video w-full mb-6">
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${getVideoId(moduleData.videoUrl)}`}
            title={moduleData.titre}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="rounded-lg"
          ></iframe>
          <div className="mt-4 text-gray-700">
            <h3 className="text-xl font-semibold mb-2">Introduction</h3>
            <p>{moduleData.content.introduction}</p>
            {moduleData.content.sections.map((section, index) => (
              <div key={index} className="mt-4">
                <h4 className="text-lg font-semibold mb-1">{section.titre}</h4>
                <p>{section.contenu}</p>
              </div>
            ))}
          </div>
        </div>
      )
    } else if (moduleData.type === 'document') {
      return (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">{moduleData.titre}</h3>
          <p className="text-gray-700 mb-4">{moduleData.description}</p>
          <Button onClick={() => window.open('/path/to/your/document.pdf', '_blank')} className="bg-indigo-600 hover:bg-indigo-700">
            <FileText className="w-4 h-4 mr-2" />
            Télécharger le document
          </Button>
        </div>
      )
    }
    return <p>Type de module non supporté.</p>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-6 sm:p-8">
        {/* Back Button */}
        <Link to="/dashboard" className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour au tableau de bord
        </Link>

        {/* Module Header */}
        <div className="flex items-center gap-4 mb-6">
          <Brain className="w-10 h-10 text-indigo-600" />
          <h1 className="text-3xl font-bold text-gray-900">{moduleData.titre}</h1>
        </div>

        {/* Module Content */}
        {renderContent()}

        {/* Mark as Completed Button */}
        {!isCompleted && moduleData.type !== 'quiz' && (
          <Button onClick={markModuleAsCompleted} className="w-full bg-green-600 hover:bg-green-700 mt-6">
            <CheckCircle className="w-4 h-4 mr-2" />
            Marquer comme complété
          </Button>
        )}
        {isCompleted && moduleData.type !== 'quiz' && (
          <div className="bg-green-100 text-green-800 p-3 rounded-lg text-center mt-6">
            <CheckCircle className="inline-block w-4 h-4 mr-2" />
            Module complété !
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mt-6">
            {error}
          </div>
        )}
      </div>
    </div>
  )
}

