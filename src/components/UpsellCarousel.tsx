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
  originalPrice?: number; // Preço antes do desconto
  image: string;
  badge?: string;
  checkoutUrl: string;
  rating: number; // 0-5
  totalSales: number; // Quantas pessoas compraram
  conversionPriority: number; // 1 = mais prioritário
}

const products: Product[] = [
  // ═══════════════════════════════════════════════════════════
  // ORDENAÇÃO POR CONVERSÃO (menor preço primeiro)
  // ═══════════════════════════════════════════════════════════
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
    conversionPriority: 1, // MAIS PRIORITÁRIO (menor preço)
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

  // Auto-scroll a cada 5 segundos
  useEffect(() => {
    if (!isAutoScrolling) return;

    const interval = setInterval(() => {
      scroll('right');
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoScrolling, currentIndex]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 350;
      const newScroll =
        direction === 'left'
          ? scrollRef.current.scrollLeft - scrollAmount
          : scrollRef.current.scrollLeft + scrollAmount;

      scrollRef.current.scrollTo({
        left: newScroll,
        behavior: 'smooth',
      });

      // Calcular novo índice
      const newIndex =
        direction === 'left'
          ? Math.max(0, currentIndex - 1)
          : Math.min(products.length - 1, currentIndex + 1);

      setCurrentIndex(newIndex);
    }
  };

  const scrollToIndex = (index: number) => {
    if (scrollRef.current) {
      const scrollAmount = 350 * index;
      scrollRef.current.scrollTo({
        left: scrollAmount,
        behavior: 'smooth',
      });
      setCurrentIndex(index);
    }
  };

  // Track click (analytics)
  const trackProductClick = (productId: string, productTitle: string) => {
    // Google Analytics ou similar
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
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold text-foreground md:text-3xl">
              Acelere Sua Reconquista
            </h2>
          </div>
          <p className="text-sm text-muted-foreground md:text-base">
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
          className="scrollbar-hide flex snap-x snap-mandatory gap-6 overflow-x-auto pb-6"
          onMouseEnter={() => setIsAutoScrolling(false)}
          onMouseLeave={() => setIsAutoScrolling(true)}
        >
          {products.map((product) => (
            <Card
              key={product.id}
              className="group relative w-[320px] flex-shrink-0 snap-start overflow-hidden border-2 transition-all hover:scale-[1.03] hover:border-primary hover:shadow-2xl md:w-[350px]"
            >
              {/* Badge */}
              {product.badge && (
                <Badge
                  variant="default"
                  className="absolute right-4 top-4 z-10 animate-pulse bg-gradient-to-r from-primary to-secondary px-3 py-1 text-xs font-bold shadow-lg"
                >
                  {product.badge}
                </Badge>
              )}

              {/* Desconto % */}
              {product.originalPrice && (
                <div className="absolute left-4 top-4 z-10 rounded-full bg-destructive px-3 py-1 text-xs font-bold text-destructive-foreground shadow-lg">
                  -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                </div>
              )}

              {/* Imagem */}
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted">
                <img
                  src={product.image}
                  alt={product.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                
                {/* Overlay com CTA no hover */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <Button
                    size="lg"
                    className="animate-bounce bg-primary text-lg font-bold"
                    onClick={() => {
                      trackProductClick(product.id, product.title);
                      window.open(product.checkoutUrl, '_blank');
                    }}
                  >
                    Ver Detalhes →
                  </Button>
                </div>
              </div>

              {/* Conteúdo */}
              <div className="space-y-4 p-6">
                {/* Rating */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          'h-4 w-4',
                          i < Math.floor(product.rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        )}
                      />
                    ))}
                    <span className="ml-2 text-sm font-semibold text-foreground">
                      {product.rating}
                    </span>
                  </div>
                  
                  {/* Social Proof */}
                  <p className="text-xs text-muted-foreground">
                    <span className="font-semibold text-primary">{product.totalSales}</span> vendidos
                  </p>
                </div>

                {/* Título */}
                <h3 className="line-clamp-2 min-h-[3rem] text-lg font-bold leading-tight text-foreground">
                  {product.title}
                </h3>

                {/* Descrição */}
                <p className="line-clamp-3 text-sm text-muted-foreground">
                  {product.description}
                </p>

                {/* Preço */}
                <div className="space-y-1">
                  {product.originalPrice && (
                    <p className="text-sm text-muted-foreground line-through">
                      De: {product.originalPrice} MZN
                    </p>
                  )}
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-bold text-primary">
                      {product.price} MZN
                    </p>
                    {product.originalPrice && (
                      <span className="rounded-md bg-destructive/20 px-2 py-0.5 text-xs font-bold text-destructive">
                        ECONOMIZE {product.originalPrice - product.price} MZN
                      </span>
                    )}
                  </div>
                </div>

                {/* Urgência */}
                <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-3">
                  <Clock className="h-4 w-4 text-primary" />
                  <p className="text-xs font-medium text-foreground">
                    ⏰ Desconto expira em <span className="font-bold text-primary">48h</span>
                  </p>
                </div>

                {/* CTA Button */}
                <Button
                  className="w-full bg-gradient-to-r from-primary to-secondary py-6 text-base font-bold shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl"
                  onClick={() => {
                    trackProductClick(product.id, product.title);
                    window.open(product.checkoutUrl, '_blank');
                  }}
                >
                  🎁 Quero Este Bónus Agora
                </Button>

                {/* Garantia */}
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 text-green-500" />
                  <span>Garantia de 7 dias ou seu dinheiro de volta</span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Indicadores de navegação (dots) */}
        <div className="mt-6 flex items-center justify-center gap-2">
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
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 text-center">
        <p className="text-sm font-medium text-foreground">
          ✨ <span className="font-bold text-primary">1.729 alunas</span> compraram estes bónus esta semana
        </p>
      </div>
    </section>
  );
};
