import { useState, useEffect, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserContext } from '../App.jsx'
import { Brain, LogOut, BookOpen, Award, Settings, ChevronRight, CheckCircle, Lock, Play, FileText, Trophy } from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import contentModules from '../content_modules.json'

export default function DashboardPage() {
  const { user, logout } = useContext(UserContext)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [userProgress, setUserProgress] = useState(null)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    const fetchUserProgress = async () => {
      try {
        const response = await fetch(`/api/progress/user`)
        const data = await response.json()
        if (response.ok) {
          setUserProgress(data.progress || data)
        } else {
          setError(data.message || 'Erreur lors de la récupération de la progression.')
        }
      } catch (err) {
        console.error('Erreur de récupération de la progression:', err)
        setError('Impossible de charger la progression. Veuillez réessayer.')
      } finally {
        setLoading(false)
      }
    }

    fetchUserProgress()
  }, [user, navigate])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Chargement du tableau de bord...</div>
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">Erreur: {error}</div>
  }

  if (!userProgress) {
    return <div className="min-h-screen flex items-center justify-center">Aucune progression trouvée.</div>
  }

  const totalModules = contentModules.blocs.reduce((acc, bloc) => acc + bloc.modules.length, 0)
  const completedModulesCount = userProgress.completedModules.length
  const overallProgress = totalModules > 0 ? Math.round((completedModulesCount / totalModules) * 100) : 0

  const isModuleCompleted = (moduleId) => {
    return userProgress.completedModules.includes(moduleId)
  }

  const isModuleUnlocked = (blocIndex, moduleIndex) => {
    // Le premier module de chaque bloc est toujours débloqué
    if (blocIndex === 0 && moduleIndex === 0) return true

    // Vérifier si le module précédent est complété
    let previousModuleId = null
    if (moduleIndex > 0) {
      previousModuleId = contentModules.blocs[blocIndex].modules[moduleIndex - 1].id
    } else if (blocIndex > 0) {
      const prevBloc = contentModules.blocs[blocIndex - 1]
      previousModuleId = prevBloc.modules[prevBloc.modules.length - 1].id
    }

    return previousModuleId ? isModuleCompleted(previousModuleId) : false
  }

  const getModuleIcon = (type) => {
    switch (type) {
      case 'video':
        return Play
      case 'quiz':
        return Trophy
      case 'document':
        return FileText
      default:
        return BookOpen
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl p-6 sm:p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Brain className="w-10 h-10 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord</h1>
          </div>
          <Button onClick={logout} variant="outline" className="text-indigo-600 hover:text-indigo-700">
            <LogOut className="w-4 h-4 mr-2" />
            Déconnexion
          </Button>
        </div>

        {/* Welcome Section */}
        <div className="bg-indigo-600 text-white p-6 rounded-xl mb-8 shadow-lg">
          <h2 className="text-2xl font-semibold mb-2">Bienvenue, {user.firstName} {user.lastName} !</h2>
          <p className="text-indigo-100">Continuez votre parcours pour maîtriser l'IA.</p>
        </div>

        {/* Overall Progress */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Votre Progression Globale</h3>
          <div className="flex items-center gap-4">
            <Progress value={overallProgress} className="w-full h-3 bg-indigo-200" indicatorClassName="bg-indigo-600" />
            <span className="text-lg font-bold text-indigo-600">{overallProgress}%</span>
          </div>
          <p className="text-gray-600 mt-2">{completedModulesCount} modules complétés sur {totalModules}</p>
        </div>

        {/* Modules Section */}
        <div className="space-y-8">
          {contentModules.blocs.map((bloc, blocIndex) => (
            <div key={bloc.id} className="bg-white rounded-2xl shadow-lg p-6">
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                    Bloc {bloc.id}
                  </span>
                  <h2 className="text-2xl font-bold text-gray-900">{bloc.titre}</h2>
                </div>
                <p className="text-gray-600">{bloc.description}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {bloc.modules.map((module, moduleIndex) => {
                  const Icon = getModuleIcon(module.type)
                  const completed = isModuleCompleted(module.id)
                  const unlocked = isModuleUnlocked(blocIndex, moduleIndex)

                  return (
                    <div
                      key={module.id}
                      className={`border-2 rounded-xl p-4 transition-all ${
                        completed
                          ? 'border-green-300 bg-green-50'
                          : unlocked
                          ? 'border-indigo-200 bg-white hover:border-indigo-400 hover:shadow-md'
                          : 'border-gray-200 bg-gray-50 opacity-60'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          completed
                            ? 'bg-green-200'
                            : unlocked
                            ? 'bg-indigo-100'
                            : 'bg-gray-200'
                        }`}>
                          {completed ? (
                            <CheckCircle className="w-5 h-5 text-green-700" />
                          ) : unlocked ? (
                            <Icon className="w-5 h-5 text-indigo-600" />
                          ) : (
                            <Lock className="w-5 h-5 text-gray-500" />
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">{module.titre}</h3>
                          <p className="text-sm text-gray-600 mb-3">{module.description}</p>
                          
                          {unlocked ? (
                            <Link to={module.type === 'quiz' ? `/quiz/${module.id}` : `/module/${module.id}`}>
                              <Button size="sm" className={completed ? 'bg-green-600 hover:bg-green-700' : 'bg-indigo-600 hover:bg-indigo-700'}>
                                {completed ? 'Revoir' : 'Commencer'}
                              </Button>
                            </Link>
                          ) : (
                            <Button size="sm" disabled>
                              <Lock className="w-3 h-3 mr-1" />
                              Verrouillé
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Certificate Section */}
        {overallProgress === 100 && (
          <div className="mt-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-center text-white shadow-2xl">
            <Award className="w-16 h-16 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-2">Félicitations !</h2>
            <p className="text-xl mb-6 opacity-90">
              Vous avez terminé la formation avec succès
            </p>
            <Link to="/certificate">
              <Button size="lg" className="bg-white text-indigo-600 hover:bg-gray-100">
                Télécharger mon Attestation
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

