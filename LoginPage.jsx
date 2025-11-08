import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Brain, ArrowLeft, LogIn, Mail, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'

export default function LoginPage({ onLogin }) {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    accessCode: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!formData.email || !formData.accessCode) {
      setError('Tous les champs sont obligatoires')
      setLoading(false)
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError('Adresse email invalide')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          accessCode: formData.accessCode
        })
      })

      const data = await response.json()

      if (response.ok) {
        onLogin(data.user, false)
        navigate('/dashboard')
      } else {
        setError(data.message || 'Email ou code d\'accès incorrect')
      }
    } catch (err) {
      console.error('Erreur de connexion:', err)
      setError('Une erreur est survenue lors de la connexion. Veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#0A1428' }}>
      <div className="w-full max-w-md">
        {/* Back Button */}
        <Link to="/" className="inline-flex items-center mb-6 transition-colors" style={{ color: '#00D9FF' }}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour à l'accueil
        </Link>

        {/* Card */}
        <div className="rounded-2xl shadow-xl p-8" style={{ backgroundColor: '#0F1F35' }}>
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <img src="/logo-ozformation.jpg" alt="OZformation" style={{ height: '50px', width: 'auto' }} />
              <span className="text-2xl font-bold" style={{ color: '#FFFFFF', fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                OZformation
              </span>
            </div>
            <h1 className="text-2xl font-bold mb-2" style={{ color: '#FFFFFF', fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>Connexion</h1>
            <p style={{ color: '#E8E8E8', fontFamily: 'Inter, sans-serif' }}>Accédez à votre espace de formation</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="px-4 py-3 rounded-lg mb-6" style={{ backgroundColor: 'rgba(255, 71, 87, 0.1)', border: '1px solid #FF4757', color: '#FF4757', fontFamily: 'Inter, sans-serif' }}>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" style={{ color: '#FFFFFF', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="votre@email.com"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                className="mt-1"
                style={{
                  backgroundColor: '#0A1428',
                  borderColor: '#4A5568',
                  color: '#FFFFFF',
                  fontFamily: 'Inter, sans-serif'
                }}
              />
            </div>

            <div>
              <Label htmlFor="accessCode" style={{ color: '#FFFFFF', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>Code d'Accès</Label>
              <div className="relative mt-1">
                <Input
                  id="accessCode"
                  name="accessCode"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Votre code d'accès"
                  value={formData.accessCode}
                  onChange={handleChange}
                  disabled={loading}
                  style={{
                    backgroundColor: '#0A1428',
                    borderColor: '#4A5568',
                    color: '#FFFFFF',
                    fontFamily: 'JetBrains Mono, monospace'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  style={{ color: '#00D9FF' }}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full btn-cta-primary"
              size="lg"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                  Connexion en cours...
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4 mr-2" />
                  Se connecter
                </>
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p style={{ color: '#E8E8E8', fontFamily: 'Inter, sans-serif' }}>
              Pas encore de compte?{' '}
              <Link to="/register" className="font-medium" style={{ color: '#00D9FF', textDecoration: 'none' }}>
                S'inscrire
              </Link>
            </p>
          </div>

          {/* Problème de connexion Button */}
          <div className="mt-4 text-center">
            <a href="mailto:OZTUformation@gmail.com" className="inline-flex items-center text-sm" style={{ color: '#4A5568', textDecoration: 'none' }}>
              <Mail className="w-4 h-4 mr-2" />
              Problème de connexion ?
            </a>
          </div>

          {/* Admin Link */}
          <div className="mt-6 text-center">
            <Link to="/admin/login" className="text-sm" style={{ color: '#4A5568', textDecoration: 'none' }}>
              Accès Administrateur
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

