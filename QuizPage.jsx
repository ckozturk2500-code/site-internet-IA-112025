import { useState, useEffect, useContext } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { UserContext } from '../App.jsx'
import { Brain, ArrowLeft, CheckCircle, XCircle, Trophy } from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'
import PacManQuiz from '@/components/quiz/PacManQuiz.jsx'
import contentModules from '../content_modules.json'

export default function QuizPage() {
  const { quizId } = useParams()
  const navigate = useNavigate()
  const { user, setUser } = useContext(UserContext)
  const [quizData, setQuizData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [score, setScore] = useState(0)
  const [totalQuestions, setTotalQuestions] = useState(0)
  const [timeSpent, setTimeSpent] = useState(0)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    let foundQuiz = null
    for (const bloc of contentModules.blocs) {
      foundQuiz = bloc.modules.find(m => m.id === quizId && m.type === 'quiz')
      if (foundQuiz) break
    }

    if (foundQuiz) {
      setQuizData(foundQuiz)
      // Vérifier si le quiz est déjà complété par l'utilisateur
      const userQuizScore = user.progress.quizScores.find(qs => qs.quizId === quizId)
      if (userQuizScore) {
        setQuizCompleted(true)
        setScore(userQuizScore.score)
        setTotalQuestions(userQuizScore.total)
        setTimeSpent(userQuizScore.timeSpent)
      }
    } else {
      setError('Quiz non trouvé.')
    }
    setLoading(false)
  }, [quizId, user, navigate])

  const handleQuizSubmit = async (finalScore, totalQ, time) => {
    if (!user) return

    try {
      const response = await fetch(`/api/progress/${user.id}/submit-quiz`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          quiz_id: quizId,
          score: finalScore,
          total: totalQ,
          time_spent: time
        })
      })

      const data = await response.json()

      if (response.ok) {
        setQuizCompleted(true)
        setScore(finalScore)
        setTotalQuestions(totalQ)
        setTimeSpent(time)
        // Mettre à jour le contexte utilisateur avec le nouveau score
        setUser(prevUser => ({
          ...prevUser,
          progress: {
            ...prevUser.progress,
            quizScores: [...prevUser.progress.quizScores.filter(qs => qs.quizId !== quizId), data.quizScore]
          }
        }))
      } else {
        setError(data.message || 'Erreur lors de la soumission du quiz.')
      }
    } catch (err) {
      console.error('Erreur de soumission de quiz:', err)
      setError('Impossible de soumettre le quiz. Veuillez réessayer.')
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Chargement du quiz...</div>
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">Erreur: {error}</div>
  }

  if (!quizData) {
    return <div className="min-h-screen flex items-center justify-center">Quiz introuvable.</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-6 sm:p-8">
        {/* Back Button */}
        <Link to="/dashboard" className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour au tableau de bord
        </Link>

        {/* Quiz Header */}
        <div className="flex items-center gap-4 mb-6">
          <Brain className="w-10 h-10 text-indigo-600" />
          <h1 className="text-3xl font-bold text-gray-900">{quizData.titre}</h1>
        </div>

        {/* Quiz Content */}
        {!quizCompleted ? (
          <PacManQuiz quizId={quizId} onQuizComplete={handleQuizSubmit} />
        ) : (
          <div className="text-center">
            <Trophy className="w-16 h-16 mx-auto text-yellow-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Quiz Terminé !</h2>
            <p className="text-xl text-gray-700 mb-4">Votre score : {score} / {totalQuestions}</p>
            <p className="text-gray-600 mb-6">Temps passé : {Math.floor(timeSpent / 60)} min {timeSpent % 60} sec</p>
            <Link to="/dashboard">
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                Retour au Tableau de Bord
              </Button>
            </Link>
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

