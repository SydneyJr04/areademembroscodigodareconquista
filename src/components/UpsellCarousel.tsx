import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  badge?: string;
  checkoutUrl: string;
}

const products: Product[] = [
  {
    id: 'guia-obediencia',
    title: 'GUIA DA OBEDIÊNCIA - Estratégias Para Manipular Os Homens',
    description: 'Aprende as frases secretas que o fazem dizer "sim" a tudo o que pedes. Faz ele te obedecer... achando que a ideia foi dele.',
    price: 87,
    image: 'https://pub-335435355c6548d7987945a540eca66b.r2.dev/GUIA%20DA%20OBEDI%C3%8ANCIA%20-%20Estrat%C3%A9gias%20Para%20Manipular%20Os%20Homens.webp',
    badge: 'MAIS COMPRADO'
    checkoutUrl: 'https://pay.lojou.app/p/4V8pY',
  },
  {
    id: 'respostas-130',
    title: '130 Respostas Infalíveis – O Que Dizer Quando Ele Falar Qualquer Coisa',
    description: 'Ele reapareceu? Não sabes o que dizer? Assume o controlo de qualquer conversa e tenha sempre a resposta perfeita na ponta da língua.',
    price: 97,
    image: 'https://pub-335435355c6548d7987945a540eca66b.r2.dev/130%20Respostas%20Infal%C3%ADveis%20%E2%80%93%20O%20Que%20Dizer%20Quando%20Ele%20Falar%20Qualquer%20Coisa.webp',
    badge: 'RECOMENDADO'
    checkoutUrl: 'https://pay.lojou.app/p/mx0qC',
  },
  {
    id: 'beijos-17',
    title: '17 Formas de Dar um Beijo Inesquecível',
    description: 'As 17 técnicas que o tornam quimicamente dependente de ti. Descobre os segredos que transformam um beijo comum num momento inesquecível.',
    price: 77,
    image: 'https://pub-335435355c6548d7987945a540eca66b.r2.dev/17%20Formas%20de%20Dar%20um%20Beijo%20Inesquec%C3%ADvel.webp',
    badge: 'NOVO',
    checkoutUrl: 'https://pay.lojou.app/p/L1qgX',
  },
  {
    id: 'frases-101',
    title: '101 Frases Picantes: Que Tal Uma Mensagem Para Provocar?',
    description: 'Transforma o WhatsApp na vossa preliminar. Usa estas 101 frases "proibidas" e vê como ele fica obcecado a imaginar cenários contigo.',
    price: 77,
    image: 'https://pub-335435355c6548d7987945a540eca66b.r2.dev/101%20Frases%20Picantes%20Que%20Tal%20Uma%20Mensagem%20Para%20Provocar.webp',
    badge: 'POPULAR',
    checkoutUrl: 'https://pay.lojou.app/p/CkvqU',
  },
];

export const UpsellCarousel = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="mb-2 text-2xl font-bold text-foreground md:text-3xl">
            Recomendado Para Você
          </h2>
          <p className="text-muted-foreground">Ferramentas extras para acelerar sua reconquista</p>
        </div>

        {/* Botões de navegação */}
        <div className="hidden gap-2 md:flex">
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll('left')}
            className="rounded-full"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll('right')}
            className="rounded-full"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Carrossel Horizontal */}
      <div className="relative">
        <div
          ref={scrollRef}
          className="scrollbar-hide flex snap-x snap-mandatory gap-6 overflow-x-auto pb-6"
        >
          {products.map((product) => (
            <Card
              key={product.id}
              className="group w-[320px] flex-shrink-0 snap-start overflow-hidden transition-all hover:scale-[1.02] hover:shadow-xl"
            >
              {product.badge && (
                <Badge
                  variant={product.badge === 'POPULAR' ? 'default' : 'secondary'}
                  className="absolute right-4 top-4 z-10 shadow-lg"
                >
                  {product.badge}
                </Badge>
              )}

              {/* Imagem da Capa */}
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted">
                <img
                  src={product.image}
                  alt={product.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              {/* Conteúdo do Card */}
              <div className="p-6">
                <h3 className="mb-3 line-clamp-2 min-h-[3rem] font-bold text-foreground text-lg">
                  {product.title}
                </h3>

                <p className="mb-4 line-clamp-3 text-sm text-muted-foreground">
                  {product.description}
                </p>

                <p className="mb-4 text-2xl font-bold text-primary">
                  {product.price} MZN
                </p>

                <Button
                  className="w-full"
                  onClick={() => window.open(product.checkoutUrl, '_blank')}
                >
                  Quero Este Bónus
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
