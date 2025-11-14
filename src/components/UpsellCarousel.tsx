import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

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
    id: 'frases-130',
    title: '130 Frases Para Deixar O Gajo Caidinho Por Ti',
    description: 'Scripts prontos para cada situação',
    price: 87,
    image: '📝',
    badge: 'POPULAR',
    checkoutUrl: '#',
  },
  {
    id: 'guia-obediencia',
    title: 'Guia da Obediência',
    description: 'Como fazer ele te dar atenção total',
    price: 97,
    image: '👑',
    checkoutUrl: '#',
  },
  {
    id: 'respostas-130',
    title: '130 Respostas Infalíveis',
    description: 'Nunca mais fique sem saber o que responder',
    price: 67,
    image: '💬',
    checkoutUrl: '#',
  },
  {
    id: 'deusa-cama',
    title: 'A Deusa na Cama',
    description: 'Módulo premium de sedução avançada',
    price: 597,
    image: '💋',
    badge: 'PREMIUM',
    checkoutUrl: '#',
  },
];

export const UpsellCarousel = () => {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="mb-2 text-2xl font-bold text-foreground md:text-3xl">
          Recomendado Para Você
        </h2>
        <p className="text-muted-foreground">Ferramentas extras para acelerar sua reconquista</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <Card
            key={product.id}
            className={`cursor-pointer p-6 transition-all hover:scale-105 ${
              product.badge === 'PREMIUM'
                ? 'border-purple-500/30 bg-gradient-to-br from-purple-500/20 to-background'
                : 'hover:border-primary/50'
            }`}
          >
            {product.badge && (
              <Badge
                variant={product.badge === 'PREMIUM' ? 'default' : 'secondary'}
                className="mb-3"
              >
                {product.badge}
              </Badge>
            )}

            <div className="mb-4 text-center text-5xl">{product.image}</div>

            <h3 className="mb-2 min-h-[3rem] text-center font-bold text-foreground">
              {product.title}
            </h3>

            <p className="mb-4 text-center text-sm text-muted-foreground">{product.description}</p>

            <p className="mb-4 text-center text-2xl font-bold text-primary">{product.price} MZN</p>

            <Button className="w-full" variant="outline">
              Quero Este Bônus
            </Button>
          </Card>
        ))}
      </div>
    </section>
  );
};
