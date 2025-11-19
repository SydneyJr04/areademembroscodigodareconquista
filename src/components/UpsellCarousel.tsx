import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ChevronLeft, ChevronRight, Star, ShieldCheck, TrendingUp, Clock } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  badge?: string;
  checkoutUrl: string;
  rating: number;
  totalSales: number;
  conversionPriority: number;
}

const products: Product[] = [
  {
    id: 'beijos-17',
    title: '17 Formas de Dar um Beijo Inesquecível',
    description: 'As 17 técnicas que o tornam quimicamente dependente de ti. Descobre os segredos que transformam um beijo comum num momento inesquecível.',
    price: 77,
    originalPrice: 127,
    image: 'https://pub-335435355c6548d7987945a540eca66b.r2.dev/Gemini_Generated_Image_a2ukdma2ukdma2uk.webp',
    badge: '🔥 OFERTA',
    checkoutUrl: 'https://pay.lojou.app/p/L1qgX',
    rating: 4.9,
    totalSales: 412,
    conversionPriority: 1,
  },
  {
    id: 'frases-101',
    title: '101 Frases Picantes: Que Tal Uma Mensagem Para Provocar?',
    description: 'Transforma o WhatsApp na vossa preliminar. Usa estas 101 frases "proibidas" e vê como ele fica obcecado a imaginar cenários contigo.',
    price: 77,
    originalPrice: 147,
    image: 'https://pub-335435355c6548d7987945a540eca66b.r2.dev/wan2.5-t2i-preview_b_3D_book_mockup%2C_prof_(2).webp',
    badge: '💎 POPULAR',
    checkoutUrl: 'https://pay.lojou.app/p/CkvqU',
    rating: 4.8,
    totalSales: 387,
    conversionPriority: 2,
  },
  {
    id: 'guia-obediencia',
    title: 'GUIA DA OBEDIÊNCIA - Estratégias Para Manipular Os Homens',
    description: 'Aprende as frases secretas que o fazem dizer "sim" a tudo o que pedes. Faz ele te obedecer... achando que a ideia foi dele.',
    price: 87,
    originalPrice: 167,
    image: 'https://pub-335435355c6548d7987945a540eca66b.r2.dev/wan2.5-t2i-preview_b_3D_book_mockup%2C_prof.webp',
    badge: '⭐ MAIS COMPRADO',
    checkoutUrl: 'https://pay.lojou.app/p/4V8pY',
    rating: 5.0,
    totalSales: 589,
    conversionPriority: 3,
  },
  {
    id: 'respostas-130',
    title: '130 Respostas Infalíveis – O Que Dizer Quando Ele Falar Qualquer Coisa',
    description: 'Ele reapareceu? Não sabes o que dizer? Assume o controlo de qualquer conversa e tenha sempre a resposta perfeita na ponta da língua.',
    price: 97,
    originalPrice: 197,
    image: 'https://pub-335435355c6548d7987945a540eca66b.r2.dev/imagen-4.0-ultra-generate-preview-06-06_a_8K_photorealistic_he.webp',
    badge: '✨ RECOMENDADO',
    checkoutUrl: 'https://pay.lojou.app/p/mx0qC',
    rating: 4.9,
    totalSales: 341,
    conversionPriority: 4,
  },
];

export const UpsellCarousel = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);

  useEffect(() => {
    if (!isAutoScrolling) return;

    const interval = setInterval(() => {
      scroll('right');
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoScrolling, currentIndex]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300; // ✅ AJUSTADO para cards menores
      const newScroll =
        direction === 'left'
          ? scrollRef.current.scrollLeft - scrollAmount
          : scrollRef.current.scrollLeft + scrollAmount;

      scrollRef.current.scrollTo({
        left: newScroll,
        behavior: 'smooth',
      });

      const newIndex =
        direction === 'left'
          ? Math.max(0, currentIndex - 1)
          : Math.min(products.length - 1, currentIndex + 1);

      setCurrentIndex(newIndex);
    }
  };

  const scrollToIndex = (index: number) => {
    if (scrollRef.current) {
      const scrollAmount = 300 * index; // ✅ AJUSTADO
      scrollRef.current.scrollTo({
        left: scrollAmount,
        behavior: 'smooth',
      });
      setCurrentIndex(index);
    }
  };

  const trackProductClick = (productId: string, productTitle: string) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'upsell_click', {
        product_id: productId,
        product_name: productTitle,
      });
    }
    console.log(`📊 Upsell clicked: ${productId}`);
  };

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary md:h-6 md:w-6" />
            <h2 className="text-xl font-bold text-foreground md:text-2xl lg:text-3xl">
              Acelere Sua Reconquista
            </h2>
          </div>
          <p className="text-xs text-muted-foreground md:text-sm">
            ⚡ Ferramentas usadas por <span className="font-semibold text-primary">12.847+ alunas</span> com sucesso comprovado
          </p>
        </div>

        {/* Botões de navegação - Desktop */}
        <div className="hidden gap-2 md:flex">
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              scroll('left');
              setIsAutoScrolling(false);
            }}
            disabled={currentIndex === 0}
            className="rounded-full transition-all hover:bg-primary hover:text-primary-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              scroll('right');
              setIsAutoScrolling(false);
            }}
            disabled={currentIndex === products.length - 1}
            className="rounded-full transition-all hover:bg-primary hover:text-primary-foreground"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Carrossel */}
      <div className="relative">
        <div
          ref={scrollRef}
          className="scrollbar-hide flex snap-x snap-mandatory gap-4 overflow-x-auto pb-6 md:gap-6"
          onMouseEnter={() => setIsAutoScrolling(false)}
          onMouseLeave={() => setIsAutoScrolling(true)}
        >
          {products.map((product) => (
            <Card
              key={product.id}
              className="group relative w-[280px] flex-shrink-0 snap-start overflow-hidden border-2 transition-all hover:scale-[1.03] hover:border-primary hover:shadow-2xl sm:w-[300px]"
            >
              {/* Badge */}
              {product.badge && (
                <Badge
                  variant="default"
                  className="absolute right-3 top-3 z-10 animate-pulse bg-gradient-to-r from-primary to-secondary px-2 py-0.5 text-[10px] font-bold shadow-lg sm:px-3 sm:py-1 sm:text-xs"
                >
                  {product.badge}
                </Badge>
              )}

              {/* Desconto % */}
              {product.originalPrice && (
                <div className="absolute left-3 top-3 z-10 rounded-full bg-destructive px-2 py-0.5 text-[10px] font-bold text-destructive-foreground shadow-lg sm:px-3 sm:py-1 sm:text-xs">
                  -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                </div>
              )}

              {/* Imagem - ✅ ASPECT RATIO REDUZIDO */}
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-muted">
                <img
                  src={product.image}
                  alt={product.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                
                {/* Overlay com CTA no hover */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <Button
                    size="sm"
                    className="animate-bounce bg-primary text-sm font-bold sm:text-base"
                    onClick={() => {
                      trackProductClick(product.id, product.title);
                      window.open(product.checkoutUrl, '_blank');
                    }}
                  >
                    Ver Detalhes →
                  </Button>
                </div>
              </div>

              {/* Conteúdo - ✅ PADDING REDUZIDO */}
              <div className="space-y-3 p-4 sm:p-5">
                {/* Rating */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          'h-3 w-3 sm:h-4 sm:w-4',
                          i < Math.floor(product.rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        )}
                      />
                    ))}
                    <span className="ml-1 text-xs font-semibold text-foreground sm:text-sm">
                      {product.rating}
                    </span>
                  </div>
                  
                  {/* Social Proof */}
                  <p className="text-[10px] text-muted-foreground sm:text-xs">
                    <span className="font-semibold text-primary">{product.totalSales}</span> vendidos
                  </p>
                </div>

                {/* Título - ✅ SEM line-clamp */}
                <h3 className="text-base font-bold leading-tight text-foreground sm:text-lg">
                  {product.title}
                </h3>

                {/* Descrição - ✅ SEM line-clamp */}
                <p className="text-xs text-muted-foreground sm:text-sm">
                  {product.description}
                </p>

                {/* Preço */}
                <div className="space-y-1">
                  {product.originalPrice && (
                    <p className="text-xs text-muted-foreground line-through sm:text-sm">
                      De: {product.originalPrice} MZN
                    </p>
                  )}
                  <div className="flex flex-wrap items-baseline gap-2">
                    <p className="text-2xl font-bold text-primary sm:text-3xl">
                      {product.price} MZN
                    </p>
                    {product.originalPrice && (
                      <span className="rounded-md bg-destructive/20 px-1.5 py-0.5 text-[10px] font-bold text-destructive sm:px-2 sm:text-xs">
                        ECONOMIZE {product.originalPrice - product.price} MZN
                      </span>
                    )}
                  </div>
                </div>

                {/* Urgência */}
                <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-2 sm:p-3">
                  <Clock className="h-3 w-3 text-primary sm:h-4 sm:w-4" />
                  <p className="text-[10px] font-medium text-foreground sm:text-xs">
                    ⏰ Desconto expira em <span className="font-bold text-primary">48h</span>
                  </p>
                </div>

                {/* CTA Button */}
                <Button
                  className="w-full bg-gradient-to-r from-primary to-secondary py-5 text-sm font-bold shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl sm:py-6 sm:text-base"
                  onClick={() => {
                    trackProductClick(product.id, product.title);
                    window.open(product.checkoutUrl, '_blank');
                  }}
                >
                  🎁 Quero Este Bónus Agora
                </Button>

                {/* Garantia */}
                <div className="flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground sm:gap-2 sm:text-xs">
                  <ShieldCheck className="h-3 w-3 text-green-500 sm:h-4 sm:w-4" />
                  <span>Garantia de 7 dias ou seu dinheiro de volta</span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Indicadores de navegação (dots) */}
        <div className="mt-4 flex items-center justify-center gap-2 sm:mt-6">
          {products.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                scrollToIndex(index);
                setIsAutoScrolling(false);
              }}
              className={cn(
                'h-2 rounded-full transition-all',
                index === currentIndex
                  ? 'w-8 bg-primary'
                  : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
              )}
              aria-label={`Ir para produto ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Footer - Prova Social Global */}
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-center sm:p-4">
        <p className="text-xs font-medium text-foreground sm:text-sm">
          ✨ <span className="font-bold text-primary">1.729 alunas</span> compraram estes bónus esta semana
        </p>
      </div>
    </section>
  );
};
