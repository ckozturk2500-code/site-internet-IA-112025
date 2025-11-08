import { useState, useEffect, useCallback } from 'react'
import { Shield, LogOut, Users, Key, BarChart, Mail, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { toast } from 'sonner'

export default function AdminDashboardPage({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('users')
  const [newCode, setNewCode] = useState('')
  const [users, setUsers] = useState([])
  const [accessCodes, setAccessCodes] = useState([])
  const [stats, setStats] = useState({ totalUsers: 0, totalCodes: 0, usedCodes: 0, avgProgress: 0, quizStats: {} })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchDashboardData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [usersRes, codesRes, statsRes] = await Promise.all([
        fetch('/api/admin/users').then(res => res.json()),
        fetch('/api/admin/codes').then(res => res.json()),
        fetch('/api/admin/stats').then(res => res.json())
      ])

      if (usersRes.error) throw new Error(usersRes.error)
      if (codesRes.error) throw new Error(codesRes.error)
      if (statsRes.error) throw new Error(statsRes.error)

      setUsers(usersRes.users)
      setAccessCodes(codesRes.codes)
      setStats(statsRes)
    } catch (err) {
      console.error("Erreur lors du chargement des données du tableau de bord:", err)
      setError(err.message)
      toast.error("Erreur lors du chargement des données du tableau de bord: " + err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDashboardData()
  }, [fetchDashboardData])

  const handleGenerateCode = async () => {
    try {
      const res = await fetch('/api/admin/codes/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      const data = await res.json()

      if (data.error) {
        throw new Error(data.error)
      }
      setNewCode(data.code.code)
      toast.success("Code généré avec succès !")
      fetchDashboardData() // Rafraîchir les données
    } catch (err) {
      console.error("Erreur lors de la génération du code:", err)
      toast.error("Erreur lors de la génération du code: " + err.message)
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Chargement du tableau de bord...</div>
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">Erreur: {error}</div>
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0A1428' }}>
      {/* Header */}
      <header className="shadow-sm sticky top-0 z-50" style={{ backgroundColor: '#0F1F35', borderBottom: '1px solid #4A5568' }}>
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src="/logo-ozformation.jpg" alt="OZformation" style={{ height: '40px', width: 'auto' }} />
            <span className="text-2xl font-bold" style={{ color: '#FFFFFF', fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>Administration OZformation</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm" style={{ color: '#E8E8E8', fontFamily: 'Inter, sans-serif' }}>Administrateur</p>
              <p className="font-semibold" style={{ color: '#FFFFFF', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>{user.username}</p>
            </div>
            <Button className="btn-secondary" onClick={onLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveTab('users')}>
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 text-blue-600" />
              <span className="text-3xl font-bold text-gray-900">{stats.totalUsers}</span>
            </div>
            <p className="text-gray-600 font-medium">Apprenants Inscrits</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveTab('codes')}>
            <div className="flex items-center justify-between mb-2">
              <Key className="w-8 h-8 text-green-600" />
              <span className="text-3xl font-bold text-gray-900">{stats.totalCodes}</span>
            </div>
            <p className="text-gray-600 font-medium">Codes d'Accès</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveTab('stats')}>
            <div className="flex items-center justify-between mb-2">
              <BarChart className="w-8 h-8 text-purple-600" />
              <span className="text-3xl font-bold text-gray-900">
                {Math.round(stats.avgProgress)}%
              </span>
            </div>
            <p className="text-gray-600 font-medium">Progression Moyenne</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <Mail className="w-8 h-8 text-orange-600" />
              <span className="text-3xl font-bold text-gray-900">12</span> {/* Placeholder, as no API for this */} 
            </div>
            <p className="text-gray-600 font-medium">Emails Envoyés</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md">
          <div className="border-b">
            <div className="flex">
              <button
                onClick={() => setActiveTab('users')}
                className={`px-6 py-4 font-medium transition-colors ${
                  activeTab === 'users'
                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Users className="w-4 h-4 inline mr-2" />
                Apprenants
              </button>
              <button
                onClick={() => setActiveTab('codes')}
                className={`px-6 py-4 font-medium transition-colors ${
                  activeTab === 'codes'
                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Key className="w-4 h-4 inline mr-2" />
                Codes d'Accès
              </button>
              <button
                onClick={() => setActiveTab('stats')}
                className={`px-6 py-4 font-medium transition-colors ${
                  activeTab === 'stats'
                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <BarChart className="w-4 h-4 inline mr-2" />
                Statistiques
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Users Tab */}
            {activeTab === 'users' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Liste des Apprenants</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Nom</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Email</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Code d'Accès</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Inscription</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Progression</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Dernière Connexion</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {users.length > 0 ? (
                        users.map((u) => (
                          <tr key={u.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm text-gray-900">
                              {u.firstName} {u.lastName}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">{u.email}</td>
                            <td className="px-4 py-3 text-sm font-mono text-gray-900">{u.accessCode}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{u.registrationDate}</td>
                            <td className="px-4 py-3 text-sm">
                              <div className="flex items-center gap-2">
                                <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                                  <div
                                    className="bg-indigo-600 h-2 rounded-full"
                                    style={{ width: `${u.progress}%` }}
                                  ></div>
                                </div>
                                <span className="text-gray-900 font-medium">{u.progress}%</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">{u.lastLogin}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="px-4 py-3 text-center text-sm text-gray-500">Aucun apprenant inscrit pour le moment.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Access Codes Tab */}
            {activeTab === 'codes' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Gestion des Codes d'Accès</h2>
                  <Button onClick={handleGenerateCode} className="bg-indigo-600 hover:bg-indigo-700">
                    <Key className="w-4 h-4 mr-2" />
                    Générer un Code
                  </Button>
                </div>

                {newCode && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <p className="text-green-800 font-medium mb-2">Nouveau code généré :</p>
                    <p className="text-2xl font-mono font-bold text-green-900">{newCode}</p>
                  </div>
                )}

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Code</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Statut</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Utilisé Par</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Date de Création</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {accessCodes.length > 0 ? (
                        accessCodes.map((code, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-mono font-bold text-gray-900">{code.code}</td>
                            <td className="px-4 py-3 text-sm">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  code.isUsed
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-yellow-100 text-yellow-700'
                                }`}
                              >
                                {code.isUsed ? 'Utilisé' : 'Disponible'}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {code.usedBy || '-'}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">{code.createdAt}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="px-4 py-3 text-center text-sm text-gray-500">Aucun code d'accès disponible.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Stats Tab */}
            {activeTab === 'stats' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Statistiques Globales</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Progression par Bloc</h3>
                    <div className="space-y-3">
                      {/* Placeholder for actual progress data */}
                      {Object.entries(stats.quizStats).length > 0 ? (
                        Object.entries(stats.quizStats).map(([quizId, quizData]) => (
                          <div key={quizId}>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="font-medium">Quiz {quizId}</span>
                              <span>{Math.round((quizData.passed / quizData.total) * 100)}% de réussite</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-indigo-600 h-2 rounded-full"
                                style={{ width: `${Math.round((quizData.passed / quizData.total) * 100)}%` }}
                              ></div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500">Aucune donnée de quiz disponible pour le moment.</p>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Détail des Apprenants</h3>
                    <ul className="space-y-2">
                      {users.length > 0 ? (
                        users.map(u => (
                          <li key={u.id} className="flex justify-between items-center text-sm text-gray-700">
                            <span>{u.firstName} {u.lastName} ({u.email})</span>
                            <span className="font-medium">{u.progress}%</span>
                          </li>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500">Aucun apprenant inscrit.</p>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
