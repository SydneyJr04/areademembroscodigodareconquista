import { Card } from './ui/card';
import { Button } from './ui/button';
import { Video, CheckCircle, Users, Calendar, Sparkles } from 'lucide-react';

export const MentoriaLivesCard = () => {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="mb-2 text-2xl font-bold text-foreground md:text-3xl">
          Mentoria Individual & Lives Exclusivas
        </h2>
        <p className="text-muted-foreground">Acelere sua reconquista com suporte direto e ao vivo</p>
      </div>

      <Card className="relative overflow-hidden border-purple-500/30 bg-gradient-to-br from-purple-500/20 via-purple-600/10 to-background p-6 shadow-2xl md:p-8">
        {/* Efeito de brilho */}
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-purple-500/10 to-transparent" />

        <div className="relative flex flex-col items-center gap-6 lg:flex-row">
          {/* Ícone */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 animate-ping rounded-full bg-purple-500/50 blur-xl" />
              <div className="relative rounded-2xl bg-gradient-to-br from-purple-500 to-purple-700 p-6 shadow-2xl">
                <Video className="h-16 w-16 text-white" />
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-purple-400/50 bg-purple-500/20 px-4 py-2 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-purple-400" />
              <span className="text-sm font-bold text-purple-400">ACESSO PREMIUM</span>
            </div>
          </div>

          {/* Conteúdo */}
          <div className="flex-1 text-center lg:text-left">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-purple-500/30 px-4 py-1.5 text-sm font-semibold text-purple-300">
              <Video className="h-4 w-4" />
              3X POR SEMANA
            </div>

            <h3 className="mb-3 text-3xl font-bold text-foreground md:text-4xl">
              Lives de Mentoria Exclusivas
            </h3>

            <p className="mb-6 text-lg text-muted-foreground">
              Participe das lives ao vivo comigo, tire suas dúvidas em tempo real, receba análise de casos
              reais e acelere sua reconquista com mentoria individual personalizada.
            </p>

            {/* Benefícios */}
            <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex items-start gap-2 text-left">
                <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-green-400" />
                <span className="text-sm text-muted-foreground">
                  <strong className="text-foreground">3 Lives por semana</strong> com perguntas ao vivo
                </span>
              </div>
              <div className="flex items-start gap-2 text-left">
                <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-green-400" />
                <span className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Análise de casos reais</strong> e situações práticas
                </span>
              </div>
              <div className="flex items-start gap-2 text-left">
                <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-green-400" />
                <span className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Sessões Q&A</strong> para tirar todas suas dúvidas
                </span>
              </div>
              <div className="flex items-start gap-2 text-left">
                <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-green-400" />
                <span className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Gravações disponíveis</strong> para assistir depois
                </span>
              </div>
              <div className="flex items-start gap-2 text-left">
                <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-green-400" />
                <span className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Comunidade exclusiva</strong> de alunas premium
                </span>
              </div>
              <div className="flex items-start gap-2 text-left">
                <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-green-400" />
                <span className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Suporte prioritário</strong> via WhatsApp
                </span>
              </div>
            </div>

            {/* Próxima Live */}
            <div className="mb-6 rounded-lg border border-purple-500/30 bg-purple-500/10 p-4 backdrop-blur-sm">
              <div className="mb-2 flex items-center justify-center gap-2 text-sm font-bold text-purple-300 lg:justify-start">
                <Calendar className="h-5 w-5" />
                PRÓXIMA LIVE
              </div>
              <p className="text-center text-purple-200 lg:text-left">
                <strong>Segunda-feira às 20:00</strong> - "Como Fazer Ele Sentir Sua Falta"
              </p>
            </div>

            {/* Preço e CTA */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              <div className="flex-1">
                <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground line-through">
                  <span>De: 997 MZN/mês</span>
                </div>
                <div className="mb-1 flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-purple-400">647 MZN</span>
                  <span className="text-sm text-muted-foreground">por mês</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-green-500/20 px-3 py-1 text-sm font-semibold text-green-400">
                    Economize 350 MZN/mês
                  </div>
                </div>
              </div>

              <Button
                size="lg"
                onClick={() => window.open('https://wa.me/258834569225?text=Quero%20participar%20das%20Lives%20de%20Mentoria', '_blank')}
                className="gap-2 bg-gradient-to-r from-purple-500 to-purple-700 text-lg font-bold text-white shadow-lg shadow-purple-500/50 transition-all hover:scale-105 hover:from-purple-600 hover:to-purple-800"
              >
                <Video className="h-5 w-5" />
                Garantir Meu Acesso
              </Button>
            </div>

            {/* Stats */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-6 lg:justify-start">
              <div className="flex items-center gap-2 text-sm text-purple-300">
                <Users className="h-5 w-5" />
                <span><strong>200+</strong> alunas ativas</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-purple-300">
                <Video className="h-5 w-5" />
                <span><strong>3x</strong> por semana</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-purple-300">
                <CheckCircle className="h-5 w-5" />
                <span><strong>Cancele</strong> quando quiser</span>
              </div>
            </div>
          </div>
        </div>

        {/* Garantia */}
        <div className="relative mt-6 rounded-lg border border-green-500/30 bg-green-500/10 p-4 text-center backdrop-blur-sm">
          <div className="mb-2 flex items-center justify-center gap-2 text-sm font-bold text-green-400">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            GARANTIA DE SATISFAÇÃO
          </div>
          <p className="text-sm text-green-300">
            Se não gostar da primeira live, devolvemos 100% do seu dinheiro. Sem perguntas!
          </p>
        </div>
      </Card>
    </section>
  );
};
