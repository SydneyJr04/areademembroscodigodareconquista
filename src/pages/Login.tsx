import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn, signUp, user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await signIn(email, password);

    if (!error) {
      toast.success('Bem-vinda de volta! 🎉');
      navigate('/dashboard');
    } else {
      toast.error('Credenciais inválidas. Verifica o teu e-mail e palavra-passe.');
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Fixed password for all signups
    const fixedPassword = 'Reconquista@2026';

    const { error } = await signUp(email, fixedPassword, fullName, whatsapp);

    if (!error) {
      toast.success('Conta criada! Agora faça login com seu e-mail e a senha Reconquista@2026');
      navigate('/login');
    } else {
      toast.error(error.message || 'Erro ao criar conta. Tenta novamente.');
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-background/95">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute left-10 top-20 h-72 w-72 animate-pulse rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute bottom-20 right-10 h-96 w-96 animate-pulse rounded-full bg-secondary/20 blur-3xl delay-1000" />
      </div>

      <div className="relative z-10 w-full max-w-md animate-fade-in px-6">
        <div className="rounded-2xl border border-border/50 bg-card/80 p-8 shadow-2xl backdrop-blur-xl md:p-12">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <img
              src="https://pub-335435355c6548d7987945a540eca66b.r2.dev/LOGO%20DA%20PAGINA%20DE%20LOGIN.webp"
              alt="Código da Reconquista"
              className="h-auto w-full max-w-[280px] animate-scale-in"
            />
          </div>

          {/* Title */}
          <h1 className="mb-2 text-center text-2xl font-bold text-foreground md:text-3xl">
            Acesso à Área de Membros
          </h1>
          <p className="mb-8 text-center text-muted-foreground">
            Inicia a tua jornada de reconquista
          </p>

          {/* Tabs for Login/Signup */}
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="mb-6 grid w-full grid-cols-2">
              <TabsTrigger value="signin">Entrar</TabsTrigger>
              <TabsTrigger value="signup">Criar Conta</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email-signin" className="text-foreground">
                    E-mail
                  </Label>
                  <Input
                    id="email-signin"
                    type="email"
                    placeholder="teu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="border-border bg-background/50 text-foreground transition-all placeholder:text-muted-foreground focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password-signin" className="text-foreground">
                    Palavra-passe
                  </Label>
                  <Input
                    id="password-signin"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="border-border bg-background/50 text-foreground transition-all placeholder:text-muted-foreground focus:border-primary"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="hover:shadow-red w-full rounded-xl bg-secondary py-6 text-lg font-semibold text-secondary-foreground shadow-lg transition-all hover:scale-[1.02] hover:bg-secondary/90"
                >
                  {isLoading ? 'A entrar...' : 'ENTRAR NA JORNADA'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="fullname" className="text-foreground">
                    Nome Completo
                  </Label>
                  <Input
                    id="fullname"
                    type="text"
                    placeholder="O teu nome"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="border-border bg-background/50 text-foreground transition-all placeholder:text-muted-foreground focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email-signup" className="text-foreground">
                    E-mail
                  </Label>
                  <Input
                    id="email-signup"
                    type="email"
                    placeholder="teu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="border-border bg-background/50 text-foreground transition-all placeholder:text-muted-foreground focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="whatsapp-signup" className="text-foreground">
                    Número de WhatsApp
                  </Label>
                  <Input
                    id="whatsapp-signup"
                    type="tel"
                    placeholder="+258..."
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    required
                    className="border-border bg-background/50 text-foreground transition-all placeholder:text-muted-foreground focus:border-primary"
                  />
                </div>

                <div className="rounded-lg bg-muted/30 p-4">
                  <p className="text-center text-sm text-muted-foreground">
                    A senha inicial será:{' '}
                    <span className="font-semibold text-foreground">Reconquista@2026</span>
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="hover:shadow-red w-full rounded-xl bg-secondary py-6 text-lg font-semibold text-secondary-foreground shadow-lg transition-all hover:scale-[1.02] hover:bg-secondary/90"
                >
                  {isLoading ? 'A criar conta...' : 'COMEÇAR A JORNADA'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          {/* Footer hint */}
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              💡 Cria a tua conta para aceder a todos os módulos do curso
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
