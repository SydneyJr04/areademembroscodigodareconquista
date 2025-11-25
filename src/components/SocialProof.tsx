import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Star, Users, TrendingUp, Award, Clock, CheckCircle } from 'lucide-react';

export const SocialProof = () => {
  const stats = [
    {
      icon: Users,
      value: '2.500+',
      label: 'Alunas Transformadas',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
    },
    {
      icon: TrendingUp,
      value: '94%',
      label: 'Taxa de Sucesso',
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
    },
    {
      icon: Clock,
      value: '21 dias',
      label: 'Tempo Médio',
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20',
    },
    {
      icon: Star,
      value: '4.9/5',
      label: 'Avaliação Média',
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20',
    },
  ];

  const testimonials = [
    {
      name: 'Maria Silva',
      location: 'Maputo',
      avatar: '👩🏽',
      rating: 5,
      text: 'Achava que tinha perdido ele para sempre, mas com as técnicas do curso consegui reconquistá-lo em apenas 14 dias! Ele está mais apaixonado do que nunca. Obrigada! ❤️',
      result: 'Reconquistou em 14 dias',
      verified: true,
    },
    {
      name: 'Ana Costa',
      location: 'Matola',
      avatar: '👩🏾',
      rating: 5,
      text: 'Estava desesperada após 3 meses de término. Apliquei o método e em 1 semana ele me procurou dizendo que cometeu um erro. Hoje estamos mais felizes que nunca!',
      result: 'Ele voltou em 1 semana',
      verified: true,
    },
    {
      name: 'Joana Santos',
      location: 'Beira',
      avatar: '👩🏻',
      rating: 5,
      text: 'O curso não só me ajudou a reconquistar meu ex, mas também me ensinou a me valorizar. Agora ele me trata como uma rainha e nosso relacionamento está incrível!',
      result: 'Relacionamento transformado',
      verified: true,
    },
    {
      name: 'Carla Macamo',
      location: 'Nampula',
      avatar: '👩🏿',
      rating: 5,
      text: 'Depois de 6 meses separados, usei as estratégias e em menos de 1 mês ele voltou pedindo uma segunda chance. Hoje estamos noivos! Este curso mudou minha vida! 💍',
      result: 'Noivos após 1 mês',
      verified: true,
    },
  ];

  return (
    <section className="space-y-8">
      <div className="text-center">
        <h2 className="mb-2 text-2xl font-bold text-foreground md:text-3xl">
          Resultados Reais de Mulheres Como Você
        </h2>
        <p className="text-muted-foreground">
          Mais de 2.500 mulheres já transformaram suas vidas amorosas
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="border-border/50 p-6 text-center">
              <div className={`mx-auto mb-3 w-fit rounded-lg ${stat.bgColor} p-3`}>
                <Icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className={`mb-1 text-3xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </Card>
          );
        })}
      </div>

      {/* Testimonials Carousel */}
      <div className="relative">
        <div className="scrollbar-hide flex snap-x snap-mandatory gap-6 overflow-x-auto pb-6">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="min-w-[320px] flex-shrink-0 snap-center border-border/50 p-6 sm:min-w-[400px]"
            >
              {/* Header */}
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-4xl">{testimonial.avatar}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-foreground">{testimonial.name}</h4>
                      {testimonial.verified && (
                        <Badge variant="secondary" className="gap-1 text-xs">
                          <CheckCircle className="h-3 w-3" />
                          Verificado
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div className="mb-3 flex gap-1">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="mb-4 text-sm text-foreground">{testimonial.text}</p>

              {/* Result Badge */}
              <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-3 text-center">
                <div className="flex items-center justify-center gap-2 text-sm font-bold text-green-400">
                  <Award className="h-4 w-4" />
                  {testimonial.result}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Scroll Indicators */}
        <div className="mt-4 flex justify-center gap-2 lg:hidden">
          {testimonials.map((_, index) => (
            <div
              key={index}
              className="h-2 w-2 rounded-full bg-muted-foreground/30"
            />
          ))}
        </div>
      </div>

      {/* Trust Badge */}
      <div className="rounded-lg border border-primary/30 bg-gradient-to-r from-primary/10 to-transparent p-6 text-center">
        <div className="mb-3 flex items-center justify-center gap-2 text-primary">
          <CheckCircle className="h-6 w-6" />
          <h3 className="text-xl font-bold">Garantia de Satisfação</h3>
        </div>
        <p className="text-muted-foreground">
          Milhares de mulheres já transformaram suas vidas. Se não funcionar para você em 7 dias,
          devolvemos 100% do seu dinheiro. Sem perguntas!
        </p>
      </div>
    </section>
  );
};
