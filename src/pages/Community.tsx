import { MessageCircle, Video, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';

const testimonials = [
  {
    name: 'Maria Silva',
    story: 'Em 2 semanas ele voltou! Segui tudo à risca e funcionou. Obrigada! ❤️',
    avatar: '👩🏽',
  },
  {
    name: 'Ana Costa',
    story: 'Não acreditava que ia funcionar, mas ele me procurou pedindo uma segunda chance!',
    avatar: '👩🏾',
  },
  {
    name: 'Joana Santos',
    story: 'Aprendi a me valorizar e agora ele não me larga mais. Valeu cada minuto!',
    avatar: '👩🏻',
  },
];

const Community = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="animate-pulse text-foreground">A carregar...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-lg">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Button variant="ghost" onClick={() => navigate('/dashboard')} className="gap-2">
              ← Voltar ao Dashboard
            </Button>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl space-y-12 px-4 py-12 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold text-foreground md:text-5xl">
            Comunidade Código da Reconquista
          </h1>
          <p className="text-xl text-muted-foreground">
            Junte-se a centenas de mulheres transformando suas vidas amorosas
          </p>
        </div>

        {/* WhatsApp Community Card */}
        <Card className="border-green-500/30 bg-gradient-to-br from-green-500/20 to-background p-8">
          <div className="flex flex-col items-center gap-6 md:flex-row">
            <div className="rounded-full bg-green-500/20 p-6">
              <MessageCircle className="h-16 w-16 text-green-500" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="mb-3 text-2xl font-bold text-foreground">
                💬 Comunidade Exclusiva no WhatsApp
              </h2>
              <p className="mb-6 text-muted-foreground">
                Entre no nosso grupo secreto com centenas de alunas transformando suas vidas
                amorosas! Compartilhe experiências, tire dúvidas e receba suporte diário.
              </p>
              <Button
                size="lg"
                className="gap-2 bg-green-500 text-white hover:bg-green-600"
                onClick={() => window.open('https://wa.me/258834569225', '_blank')}
              >
                <MessageCircle className="h-5 w-5" />
                Entrar Agora no WhatsApp
              </Button>
            </div>
          </div>
        </Card>

        {/* Success Stories */}
        <div>
          <h2 className="mb-8 text-center text-3xl font-bold text-foreground">
            <Award className="mr-2 inline-block h-8 w-8 text-primary" />
            Destaques de Sucesso
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-primary/20 p-6">
                <div className="mb-4 text-center text-5xl">{testimonial.avatar}</div>
                <h3 className="mb-2 text-center font-bold text-foreground">{testimonial.name}</h3>
                <p className="text-center italic text-muted-foreground">"{testimonial.story}"</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
