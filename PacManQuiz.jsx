import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button.jsx'
import { CheckCircle, XCircle } from 'lucide-react'

const CELL_SIZE = 30
const GRID_SIZE = 15

const generateRandomPosition = (exclude = []) => {
  let pos
  do {
    pos = { x: Math.floor(Math.random() * GRID_SIZE), y: Math.floor(Math.random() * GRID_SIZE) }
  } while (exclude.some(p => p.x === pos.x && p.y === pos.y))
  return pos
}

const arePositionsEqual = (pos1, pos2) => pos1.x === pos2.x && pos1.y === pos2.y

export default function PacManQuiz({ quizId, onQuizComplete }) {
  const navigate = useNavigate()
  const [questions, setQuestions] = useState([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [pacmanPos, setPacmanPos] = useState({ x: 0, y: 0 })
  const [robotsPos, setRobotsPos] = useState([])
  const [answerPositions, setAnswerPositions] = useState([])
  const [correctAnswerId, setCorrectAnswerId] = useState(null)
  const [quizStarted, setQuizStarted] = useState(false)
  const [quizFinished, setQuizFinished] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const [startTime, setStartTime] = useState(null)
  const [timeTaken, setTimeTaken] = useState(0)
  const gameAreaRef = useRef(null)

  const allQuestions = {
    '0-3': [
      { id: 1, question: "Qu'est-ce que l'intelligence artificielle ?", answers: [{ id: 1, text: "Un programme informatique simple" }, { id: 2, text: "La capacité d'une machine à imiter les fonctions cognitives humaines" }, { id: 3, text: "Un robot physique" }], correctAnswer: 2 },
      { id: 2, question: "Quel est l'avantage principal de l'IA pour les entrepreneurs ?", answers: [{ id: 1, text: "Remplacer tous les employés" }, { id: 2, text: "Automatiser les tâches répétitives et gagner du temps" }, { id: 3, text: "Créer des produits sans intervention humaine" }], correctAnswer: 2 }
    ],
    '1-3': [
      { id: 1, question: "Quel type d'IA est le plus répandu aujourd'hui ?", answers: [{ id: 1, text: "IA étroite (faible)" }, { id: 2, text: "IA générale (forte)" }, { id: 3, text: "IA superintelligente" }], correctAnswer: 1 },
      { id: 2, question: "Le RGPD s'applique-t-il aux systèmes d'IA ?", answers: [{ id: 1, text: "Non, l'IA est exemptée" }, { id: 2, text: "Oui, pleinement" }, { id: 3, text: "Seulement pour les grandes entreprises" }], correctAnswer: 2 },
      { id: 3, question: "Une IA peut-elle être titulaire de droits de propriété intellectuelle ?", answers: [{ id: 1, text: "Oui, automatiquement" }, { id: 2, text: "Non, seules les personnes physiques ou morales le peuvent" }, { id: 3, text: "Seulement si elle est très avancée" }], correctAnswer: 2 }
    ],
    '2-2': [
      { id: 1, question: "Qu'est-ce qu'un prompt ?", answers: [{ id: 1, text: "Un type d'IA" }, { id: 2, text: "Une instruction donnée à un système d'IA" }, { id: 3, text: "Un logiciel de programmation" }], correctAnswer: 2 },
      { id: 2, question: "Quel est le principe fondamental d'un bon prompt ?", answers: [{ id: 1, text: "Être le plus court possible" }, { id: 2, text: "Être clair, spécifique et contextuel" }, { id: 3, text: "Utiliser un langage technique complexe" }], correctAnswer: 2 },
      { id: 3, question: "Qu'est-ce que le 'few-shot prompting' ?", answers: [{ id: 1, text: "Poser plusieurs questions à la fois" }, { id: 2, text: "Fournir quelques exemples avant la question principale" }, { id: 3, text: "Utiliser des prompts très courts" }], correctAnswer: 2 }
    ],
    '3-5': [
      { id: 1, question: "Quel outil est le leader pour la génération de texte par IA ?", answers: [{ id: 1, text: "Photoshop" }, { id: 2, text: "ChatGPT" }, { id: 3, text: "Excel" }], correctAnswer: 2 },
      { id: 2, question: "Pour générer des images de qualité, que doit inclure un bon prompt ?", answers: [{ id: 1, text: "Seulement le sujet principal" }, { id: 2, text: "Le sujet, le style, l'ambiance, les couleurs et la composition" }, { id: 3, text: "Juste quelques mots-clés" }], correctAnswer: 2 },
      { id: 3, question: "Quelle plateforme permet de créer des vidéos avec des avatars IA parlants ?", answers: [{ id: 1, text: "Word" }, { id: 2, text: "Synthesia" }, { id: 3, text: "PowerPoint" }], correctAnswer: 2 }
    ],
    '4-2': [
      { id: 1, question: "Quelle est la première étape pour intégrer l'IA dans son entreprise ?", answers: [{ id: 1, text: "Acheter tous les outils disponibles" }, { id: 2, text: "Évaluer ses besoins et définir des objectifs clairs" }, { id: 3, text: "Licencier ses employés" }], correctAnswer: 2 },
      { id: 2, question: "Quelle approche est recommandée pour adopter l'IA ?", answers: [{ id: 1, text: "Tout changer d'un coup" }, { id: 2, text: "Commencer petit et évoluer progressivement" }, { id: 3, text: "Attendre que tout soit parfait" }], correctAnswer: 2 },
      { id: 3, question: "Le RGPD impose-t-il des obligations sur l'utilisation de l'IA ?", answers: [{ id: 1, text: "Non, aucune" }, { id: 2, text: "Oui, notamment sur la transparence et les droits des personnes" }, { id: 3, text: "Seulement pour les grandes entreprises" }], correctAnswer: 2 },
      { id: 4, question: "Quel est l'avantage principal des outils d'IA pour le texte ?", answers: [{ id: 1, text: "Remplacer complètement l'humain" }, { id: 2, text: "Gagner du temps sur les tâches rédactionnelles tout en maintenant la qualité" }, { id: 3, text: "Créer du contenu sans relecture" }], correctAnswer: 2 },
      { id: 5, question: "Pourquoi est-il important de mesurer les résultats de l'IA ?", answers: [{ id: 1, text: "Ce n'est pas important" }, { id: 2, text: "Pour évaluer l'efficacité et optimiser en continu" }, { id: 3, text: "Juste pour faire des rapports" }], correctAnswer: 2 }
    ]
  }

  const initializeGame = useCallback((reset = false) => {
    const currentQuestions = allQuestions[quizId] || []
    if (currentQuestions.length === 0) {
      setFeedback({ type: 'error', message: 'Aucune question trouvée pour ce quiz.' })
      return
    }

    const shuffledQuestions = [...currentQuestions].sort(() => Math.random() - 0.5)
    setQuestions(shuffledQuestions)
    setCurrentQuestionIndex(0)
    setScore(0)
    setPacmanPos(generateRandomPosition())
    setRobotsPos([
      generateRandomPosition([{ x: 0, y: 0 }]),
      generateRandomPosition([{ x: 0, y: 0 }])
    ])
    setQuizFinished(false)
    setFeedback(null)
    setStartTime(Date.now())
    setTimeTaken(0)
    setQuizStarted(false) // Reset quizStarted

    const currentQ = shuffledQuestions[0]
    const shuffledAnswers = [...currentQ.answers].sort(() => Math.random() - 0.5)
    const newAnswerPositions = shuffledAnswers.map(ans => generateRandomPosition([pacmanPos, ...robotsPos]))
    setAnswerPositions(newAnswerPositions)
    setCorrectAnswerId(currentQ.correctAnswer)
  }, [quizId, pacmanPos, robotsPos])

  useEffect(() => {
    initializeGame()
  }, [initializeGame])

  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
      setPacmanPos(generateRandomPosition())
      setRobotsPos([
        generateRandomPosition([{ x: 0, y: 0 }]),
        generateRandomPosition([{ x: 0, y: 0 }])
      ])
      setFeedback(null)

      const currentQ = questions[currentQuestionIndex + 1]
      const shuffledAnswers = [...currentQ.answers].sort(() => Math.random() - 0.5)
      const newAnswerPositions = shuffledAnswers.map(ans => generateRandomPosition([pacmanPos, ...robotsPos]))
      setAnswerPositions(newAnswerPositions)
      setCorrectAnswerId(currentQ.correctAnswer)
    } else {
      const finalTime = Math.floor((Date.now() - startTime) / 1000)
      setTimeTaken(finalTime)
      setQuizFinished(true)
      onQuizComplete(score, questions.length, finalTime)
    }
  }, [currentQuestionIndex, questions, score, startTime, onQuizComplete, pacmanPos, robotsPos])

  const moveRobots = useCallback(() => {
    if (!quizStarted || quizFinished) return

    setRobotsPos(prevRobotsPos =>
      prevRobotsPos.map(robot => {
        const dx = pacmanPos.x - robot.x
        const dy = pacmanPos.y - robot.y

        let newRobotX = robot.x
        let newRobotY = robot.y

        if (Math.abs(dx) > Math.abs(dy)) {
          newRobotX += dx > 0 ? 1 : -1
        } else {
          newRobotY += dy > 0 ? 1 : -1
        }

        // Ensure robot stays within bounds
        newRobotX = Math.max(0, Math.min(GRID_SIZE - 1, newRobotX))
        newRobotY = Math.max(0, Math.min(GRID_SIZE - 1, newRobotY))

        return { x: newRobotX, y: newRobotY }
      })
    )
  }, [pacmanPos, quizStarted, quizFinished])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (quizFinished || feedback) return

      let newPos = { ...pacmanPos }
      let moved = false

      if (!quizStarted) {
        setQuizStarted(true)
      }

      switch (e.key) {
        case 'ArrowUp':
          newPos.y = Math.max(0, pacmanPos.y - 1)
          moved = true
          break
        case 'ArrowDown':
          newPos.y = Math.min(GRID_SIZE - 1, pacmanPos.y + 1)
          moved = true
          break
        case 'ArrowLeft':
          newPos.x = Math.max(0, pacmanPos.x - 1)
          moved = true
          break
        case 'ArrowRight':
          newPos.x = Math.min(GRID_SIZE - 1, pacmanPos.x + 1)
          moved = true
          break
        default:
          break
      }

      if (moved) {
        setPacmanPos(newPos)
        e.preventDefault()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [pacmanPos, quizStarted, quizFinished, feedback])

  useEffect(() => {
    const robotInterval = setInterval(moveRobots, 500) // Robots move every 500ms
    return () => clearInterval(robotInterval)
  }, [moveRobots])

  useEffect(() => {
    // Check for collisions with answers
    answerPositions.forEach(ans => {
      if (arePositionsEqual(pacmanPos, ans)) {
        const currentQ = questions[currentQuestionIndex]
        const isCorrect = ans.id === currentQ.correctAnswer

        if (isCorrect) {
          setScore(prev => prev + 1)
          setFeedback({ type: 'success', message: 'Bonne réponse !' })
        } else {
          setFeedback({ type: 'error', message: 'Mauvaise réponse. La bonne réponse était ' + currentQ.answers.find(a => a.id === currentQ.correctAnswer).text })
        }
        setTimeout(handleNextQuestion, 1500) // Wait a bit before next question
      }
    })

    // Check for collisions with robots
    robotsPos.forEach(robot => {
      if (arePositionsEqual(pacmanPos, robot)) {
        setFeedback({ type: 'error', message: 'Vous avez été attrapé par un robot !' })
        setTimeout(handleNextQuestion, 1500) // Move to next question
      }
    })
  }, [pacmanPos, answerPositions, robotsPos, questions, currentQuestionIndex, handleNextQuestion])

  if (questions.length === 0) {
    return <div className="text-center text-red-500">Chargement des questions ou aucune question disponible.</div>
  }

  const currentQuestion = questions[currentQuestionIndex]

  return (
    <div className="flex flex-col items-center">
      {!quizStarted && (
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">Prêt à jouer ?</h2>
          <p className="text-gray-600">Utilisez les flèches pour déplacer Pac-Man et gober la bonne réponse.</p>
          <p className="text-gray-600">Les robots commenceront à bouger dès votre premier mouvement.</p>
          <Button onClick={() => setQuizStarted(true)} className="mt-4">Commencer le Quiz</Button>
        </div>
      )}

      {quizStarted && !quizFinished && (
        <div className="mb-6 text-center">
          <h2 className="text-xl font-semibold mb-2">Question {currentQuestionIndex + 1} / {questions.length}</h2>
          <p className="text-lg text-gray-800">{currentQuestion.question}</p>
        </div>
      )}

      {feedback && (
        <div className={`mb-4 p-3 rounded-lg text-white ${feedback.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
          {feedback.message}
        </div>
      )}

      {!quizFinished ? (
        <div
          ref={gameAreaRef}
          className="relative border-2 border-blue-500 bg-gray-800"
          style={{
            width: GRID_SIZE * CELL_SIZE,
            height: GRID_SIZE * CELL_SIZE,
          }}
        >
          {/* Pac-Man */}
          <div
            className="absolute bg-yellow-400 rounded-full"
            style={{
              width: CELL_SIZE,
              height: CELL_SIZE,
              left: pacmanPos.x * CELL_SIZE,
              top: pacmanPos.y * CELL_SIZE,
            }}
          ></div>

          {/* Robots */}
          {robotsPos.map((robot, index) => (
            <div
              key={index}
              className="absolute bg-red-600 rounded-full"
              style={{
                width: CELL_SIZE,
                height: CELL_SIZE,
                left: robot.x * CELL_SIZE,
                top: robot.y * CELL_SIZE,
              }}
            ></div>
          ))}

          {/* Answers */}
          {answerPositions.map((ans, index) => (
            <div
              key={index}
              className={`absolute flex items-center justify-center rounded-full font-bold text-white ${ans.id === currentQuestion.correctAnswer ? 'bg-green-500' : 'bg-blue-500'}`}
              style={{
                width: CELL_SIZE,
                height: CELL_SIZE,
                left: ans.x * CELL_SIZE,
                top: ans.y * CELL_SIZE,
              }}
            >
              {ans.id}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center mt-8">
          <h2 className="text-2xl font-bold mb-4">Quiz Terminé !</h2>
          <p className="text-xl text-gray-700">Votre score final : {score} / {questions.length}</p>
          <p className="text-gray-600">Temps écoulé : {Math.floor(timeTaken / 60)} min {timeTaken % 60} sec</p>
          <Button onClick={() => navigate('/dashboard')} className="mt-6">Retour au Tableau de Bord</Button>
        </div>
      )}
    </div>
  )
}

