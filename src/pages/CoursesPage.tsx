import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Lock, CheckCircle2, ExternalLink } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  cover_image: string | null;
  checkout_url: string | null;
  has_access: boolean;
}

export default function CoursesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);

      // Verificar se o usuário está autenticado
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        navigate('/login');
        return;
      }

      // Buscar todos os produtos
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (productsError) {
        console.error('Erro ao carregar produtos:', productsError);
        throw productsError;
      }

      // Buscar acessos do usuário
      const { data: accessData } = await supabase
        .from('user_product_access')
        .select('product_id')
        .eq('user_id', user.id)
        .eq('is_active', true);

      const accessedProductIds = new Set(accessData?.map((a) => a.product_id) || []);

      // Mapear produtos com informação de acesso
      const productsWithAccess: Product[] = (productsData || []).map((product) => ({
        ...product,
        has_access: accessedProductIds.has(product.id),
      }));

      setProducts(productsWithAccess);
    } catch (error) {
      console.error('Erro ao carregar cursos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductClick = (product: Product) => {
    if (product.has_access) {
      navigate(`/cursos/${product.slug}`);
    } else if (product.checkout_url) {
      window.open(product.checkout_url, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
            <p className="text-muted-foreground">Carregando cursos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-foreground md:text-4xl">
          Meus Cursos
        </h1>
        <p className="text-muted-foreground">
          Acesse seus cursos ou adquira novos conteúdos exclusivos
        </p>
      </div>

      {/* Lista de Produtos */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Card
            key={product.id}
            className={`relative overflow-hidden transition-all hover:shadow-lg ${
              product.has_access
                ? 'border-primary/50 bg-primary/5'
                : 'border-border hover:border-primary/30'
            }`}
          >
            {/* Imagem de capa */}
            {product.cover_image && (
              <div className="relative h-48 overflow-hidden">
                <img
                  src={product.cover_image}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />

                {/* Badge de status */}
                <div className="absolute top-4 right-4">
                  {product.has_access ? (
                    <Badge className="gap-1 bg-green-500/90 text-white backdrop-blur-sm">
                      <CheckCircle2 className="h-3 w-3" />
                      Adquirido
                    </Badge>
                  ) : (
                    <Badge className="gap-1 bg-purple-500/90 text-white backdrop-blur-sm">
                      <Lock className="h-3 w-3" />
                      Bloqueado
                    </Badge>
                  )}
                </div>
              </div>
            )}

            <CardHeader>
              <CardTitle className="flex items-start gap-2">
                <BookOpen className="h-5 w-5 mt-1 flex-shrink-0 text-primary" />
                <span>{product.name}</span>
              </CardTitle>
              {product.description && (
                <CardDescription className="line-clamp-3">
                  {product.description}
                </CardDescription>
              )}
            </CardHeader>

            <CardFooter className="flex flex-col gap-3">
              {/* Preço */}
              {!product.has_access && (
                <div className="w-full rounded-lg bg-muted p-3 text-center">
                  <div className="text-2xl font-bold text-primary">
                    {product.price.toLocaleString('pt-MZ', {
                      style: 'currency',
                      currency: 'MZN',
                    })}
                  </div>
                  <div className="text-xs text-muted-foreground">Acesso vitalício</div>
                </div>
              )}

              {/* Botão de ação */}
              <Button
                className="w-full gap-2"
                variant={product.has_access ? 'default' : 'outline'}
                onClick={() => handleProductClick(product)}
              >
                {product.has_access ? (
                  <>
                    <BookOpen className="h-4 w-4" />
                    Acessar Curso
                  </>
                ) : (
                  <>
                    <ExternalLink className="h-4 w-4" />
                    Adquirir Agora
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Empty state */}
      {products.length === 0 && (
        <div className="flex min-h-[40vh] items-center justify-center">
          <div className="text-center">
            <BookOpen className="mx-auto mb-4 h-16 w-16 text-muted-foreground/50" />
            <h3 className="mb-2 text-xl font-semibold text-foreground">
              Nenhum curso disponível
            </h3>
            <p className="text-muted-foreground">
              Novos cursos serão adicionados em breve!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
