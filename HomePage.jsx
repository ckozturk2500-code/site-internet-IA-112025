import { Link } from 'react-router-dom'
import { Brain, Sparkles, Target, Award, ArrowRight, BookOpen, Users, TrendingUp, Download } from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'

export default function HomePage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0A1428' }}>
      {/* Header */}
      <header className="sticky top-0 z-50 border-b" style={{ backgroundColor: '#0F1F35', borderColor: '#4A5568' }}>
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src="/logo-ozformation.jpg" alt="OZformation" style={{ height: '40px', width: 'auto' }} />
            <span className="text-2xl font-bold" style={{ color: '#FFFFFF', fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
              OZformation
            </span>
          </div>
          <nav className="flex gap-4">
            <Link to="/login">
              <Button variant="ghost" style={{ color: '#FFFFFF' }}>Connexion</Button>
            </Link>
            <Link to="/register">
              <Button className="btn-cta-primary">S'inscrire</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 animate-fade-in" style={{ backgroundColor: 'rgba(0, 217, 255, 0.1)', color: '#00D9FF' }}>
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>Formation IA pour Auto-Entrepreneurs</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight" style={{ color: '#FFFFFF', fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
            Maîtrisez l'Intelligence Artificielle pour
            <span style={{ color: '#00D9FF' }}> Propulser Votre Business</span>
          </h1>
          
          <p className="text-xl mb-8 leading-relaxed" style={{ color: '#E8E8E8', fontFamily: 'Inter, sans-serif' }}>
            Découvrez comment l'IA peut transformer votre activité d'auto-entrepreneur. Cette formation complète et interactive vous guide pas à pas pour intégrer les outils d'IA les plus performants : ChatGPT, générateurs d'images, de vidéos, et bien plus encore. Optimisez votre temps, innovez et gagnez en compétitivité sans effort.
          </p>
          
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/register">
              <Button size="lg" className="btn-cta-primary text-lg px-8 py-6">
                Commencer la Formation
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <a href="/static/bloc0_presentation.html" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="btn-secondary text-lg px-8 py-6">
                <Download className="mr-2 w-5 h-5" />
                Voir la Présentation
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Funding Section */}
      <section className="container mx-auto px-4 py-16 text-center rounded-2xl shadow-lg mb-16" style={{ backgroundColor: '#0F1F35', borderColor: '#4A5568' }}>
        <h2 className="text-3xl font-bold mb-4" style={{ color: '#FFFFFF', fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>Financement de Votre Formation</h2>
        <p className="text-lg max-w-2xl mx-auto mb-6" style={{ color: '#E8E8E8', fontFamily: 'Inter, sans-serif' }}>
          Bonne nouvelle pour les auto-entrepreneurs ! Cette formation peut être intégralement financée par l'OPCO (Opérateur de Compétences) de votre branche professionnelle. Cela signifie que vous pouvez développer vos compétences en IA sans toucher à votre Compte Personnel de Formation (CPF).
        </p>
        <p className="text-md" style={{ color: '#4A5568', fontFamily: 'Inter, sans-serif' }}>
          Renseignez-vous auprès de votre OPCO pour connaître les modalités de prise en charge.
        </p>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow" style={{ backgroundColor: '#0F1F35' }}>
            <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: 'rgba(0, 217, 255, 0.1)' }}>
              <BookOpen className="w-6 h-6" style={{ color: '#00D9FF' }} />
            </div>
            <h3 className="text-xl font-bold mb-3" style={{ color: '#FFFFFF', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>Formation Complète</h3>
            <p style={{ color: '#E8E8E8', fontFamily: 'Inter, sans-serif' }}>
              5 blocs thématiques couvrant tous les aspects de l'IA : fondamentaux, prompts, applications pratiques et stratégie business.
            </p>
          </div>

          <div className="rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow" style={{ backgroundColor: '#0F1F35' }}>
            <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: 'rgba(0, 200, 120, 0.1)' }}>
              <Target className="w-6 h-6" style={{ color: '#00C878' }} />
            </div>
            <h3 className="text-xl font-bold mb-3" style={{ color: '#FFFFFF', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>Quiz Interactifs</h3>
            <p style={{ color: '#E8E8E8', fontFamily: 'Inter, sans-serif' }}>
              Testez vos connaissances avec des mini-jeux Pac-Man IA ludiques et engageants à chaque étape de votre parcours.
            </p>
          </div>

          <div className="rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow" style={{ backgroundColor: '#0F1F35' }}>
            <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: 'rgba(255, 149, 0, 0.1)' }}>
              <Award className="w-6 h-6" style={{ color: '#FF9500' }} />
            </div>
            <h3 className="text-xl font-bold mb-3" style={{ color: '#FFFFFF', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>Attestation Officielle</h3>
            <p style={{ color: '#E8E8E8', fontFamily: 'Inter, sans-serif' }}>
              Obtenez une attestation de réussite personnalisée à l'issue de la formation pour valoriser vos compétences.
            </p>
          </div>
        </div>
      </section>

      {/* Program Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center mb-12" style={{ color: '#FFFFFF', fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>Programme de Formation</h2>
        <p className="text-center mb-12" style={{ color: '#E8E8E8', fontFamily: 'Inter, sans-serif' }}>Un parcours structuré et progressif</p>
        
        <div className="grid md:grid-cols-5 gap-4">
          {[
            { title: 'Bloc 0', subtitle: 'Introduction et Orientation', desc: 'Vidéos d\'introduction, quiz diagnostic et cahier des charges' },
            { title: 'Bloc 1', subtitle: 'Fondamentaux de l\'IA', desc: 'Introduction à l\'IA, propriété intellectuelle et RGPD' },
            { title: 'Bloc 2', subtitle: 'Maîtriser les Prompts', desc: 'Techniques de rédaction de prompts efficaces' },
            { title: 'Bloc 3', subtitle: 'Applications Pratiques', desc: 'IA pour le texte, images, musique et vidéo' },
            { title: 'Bloc 4', subtitle: 'Business et Stratégie', desc: 'Intégrer l\'IA dans votre stratégie d\'entreprise' }
          ].map((bloc, idx) => (
            <div key={idx} className="rounded-lg p-6 text-center transition-all hover:shadow-lg" style={{ backgroundColor: '#0F1F35', border: '2px solid #4A5568' }}>
              <h3 className="text-lg font-bold mb-2" style={{ color: '#00D9FF', fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>{bloc.title}</h3>
              <h4 className="text-sm font-semibold mb-3" style={{ color: '#FFFFFF', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>{bloc.subtitle}</h4>
              <p className="text-xs" style={{ color: '#E8E8E8', fontFamily: 'Inter, sans-serif' }}>{bloc.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-4xl font-bold mb-6" style={{ color: '#FFFFFF', fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>Prêt à Commencer ?</h2>
        <p className="text-xl mb-8" style={{ color: '#E8E8E8', fontFamily: 'Inter, sans-serif' }}>Rejoignez la formation et transformez votre approche de l'intelligence artificielle</p>
        <Link to="/register">
          <Button size="lg" className="btn-cta-primary text-lg px-8 py-6">
            S'inscrire Maintenant
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t mt-16" style={{ backgroundColor: '#0F1F35', borderColor: '#4A5568' }}>
        <div className="container mx-auto px-4 py-8 text-center">
          <p style={{ color: '#E8E8E8', fontFamily: 'Inter, sans-serif' }}>© 2025 OZformation. Tous droits réservés.</p>
          <p className="mt-4">
            <a href="https://manus.im/invitation/AZ838GSTUYBWQ4" target="_blank" rel="noopener noreferrer" style={{ color: '#00D9FF', textDecoration: 'none', fontFamily: 'Inter, sans-serif' }}>
              Créé avec Manus
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}
