import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validação
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const navigate = useNavigate();
  const { signIn, signUp, user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // ═══════════════════════════════════════════════════════════
  // VALIDAÇÃO DE EMAIL
  // ═══════════════════════════════════════════════════════════
  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
      setEmailError('Email inválido');
      return false;
    }
    setEmailError('');
    return true;
  };

  // ═══════════════════════════════════════════════════════════
  // VALIDAÇÃO DE SENHA
  // ═══════════════════════════════════════════════════════════
  const validatePassword = (password: string): {
    isValid: boolean;
    message: string;
  } => {
    if (password.length < 8) {
      return {
        isValid: false,
        message: 'Senha deve ter no mínimo 8 caracteres',
      };
    }

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    if (!hasUpperCase || !hasLowerCase || !hasNumber) {
      return {
        isValid: false,
        message: 'Senha deve conter maiúsculas, minúsculas e números',
      };
    }

    return { isValid: true, message: '' };
  };

  // ═══════════════════════════════════════════════════════════
  // HANDLER: LOGIN
  // ═══════════════════════════════════════════════════════════
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) return;

    setIsLoading(true);

    const { error } = await signIn(email, password);

    if (!error) {
      toast.success('Bem-vinda de volta! 🎉');
      navigate('/dashboard');
    } else {
      toast.error('Credenciais inválidas. Verifica o teu e-mail e senha.');
      setIsLoading(false);
    }
  };

  // ═══════════════════════════════════════════════════════════
  // HANDLER: CADASTRO
  // ═══════════════════════════════════════════════════════════
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar email
    if (!validateEmail(email)) return;

    // Validar senha
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      setPasswordError(passwordValidation.message);
      toast.error(passwordValidation.message);
      return;
    }
    setPasswordError('');

    // Confirmar senha
    if (password !== confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }

    // Validar nome completo
    if (fullName.trim().length < 3) {
      toast.error('Nome deve ter no mínimo 3 caracteres');
      return;
    }

    // Validar WhatsApp
    if (whatsapp.trim().length < 9) {
      toast.error('Número de WhatsApp inválido');
      return;
    }

    setIsLoading(true);

    const { error } = await signUp(email, password, fullName, whatsapp);

    if (!error) {
      toast.success('Conta criada! Agora faça login com suas credenciais', {
        duration: 5000,
      });
      // Limpar campos
      setPassword('');
      setConfirmPassword('');
    } else {
      toast.error(error.message || 'Erro ao criar conta. Tenta novamente.');
      setIsLoading(false);
    }
  };

  // ═══════════════════════════════════════════════════════════
  // HANDLER: ESQUECI MINHA SENHA
  // ═══════════════════════════════════════════════════════════
  const handleForgotPassword = () => {
    if (!email) {
      toast.error('Digite seu email primeiro');
      return;
    }

    if (!validateEmail(email)) return;

    navigate('/reset-password', { state: { email } });
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

            {/* ═══════════════════════════════════════════════════════════
                TAB: LOGIN
                ═══════════════════════════════════════════════════════════ */}
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
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) validateEmail(e.target.value);
                    }}
                    required
                    className={`border-border bg-background/50 text-foreground transition-all placeholder:text-muted-foreground focus:border-primary ${
                      emailError ? 'border-destructive' : ''
                    }`}
                  />
                  {emailError && (
                    <p className="text-xs text-destructive">{emailError}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password-signin" className="text-foreground">
                    Senha
                  </Label>
                  <div className="relative">
                    <Input
                      id="password-signin"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="border-border bg-background/50 pr-10 text-foreground transition-all placeholder:text-muted-foreground focus:border-primary"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="link"
                    className="px-0 text-sm text-primary hover:text-primary/80"
                    onClick={handleForgotPassword}
                  >
                    Esqueceu a senha?
                  </Button>
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

            {/* ═══════════════════════════════════════════════════════════
                TAB: CADASTRO
                ═══════════════════════════════════════════════════════════ */}
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
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) validateEmail(e.target.value);
                    }}
                    required
                    className={`border-border bg-background/50 text-foreground transition-all placeholder:text-muted-foreground focus:border-primary ${
                      emailError ? 'border-destructive' : ''
                    }`}
                  />
                  {emailError && (
                    <p className="text-xs text-destructive">{emailError}</p>
                  )}
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

                <div className="space-y-2">
                  <Label htmlFor="password-signup" className="text-foreground">
                    Senha
                  </Label>
                  <div className="relative">
                    <Input
                      id="password-signup"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Mínimo 8 caracteres"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (passwordError) {
                          const validation = validatePassword(e.target.value);
                          setPasswordError(
                            validation.isValid ? '' : validation.message
                          );
                        }
                      }}
                      required
                      className={`border-border bg-background/50 pr-10 text-foreground transition-all placeholder:text-muted-foreground focus:border-primary ${
                        passwordError ? 'border-destructive' : ''
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {passwordError && (
                    <p className="text-xs text-destructive">{passwordError}</p>
                  )}
                  {password && !passwordError && (
                    <p className="text-xs text-green-500">✓ Senha válida</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-foreground">
                    Confirmar Senha
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Digite a senha novamente"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="border-border bg-background/50 pr-10 text-foreground transition-all placeholder:text-muted-foreground focus:border-primary"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {confirmPassword &&
                    password &&
                    password === confirmPassword && (
                      <p className="text-xs text-green-500">✓ Senhas coincidem</p>
                    )}
                  {confirmPassword &&
                    password &&
                    password !== confirmPassword && (
                      <p className="text-xs text-destructive">
                        As senhas não coincidem
                      </p>
                    )}
                </div>

                <div className="rounded-lg bg-muted/30 p-4">
                  <p className="text-xs text-muted-foreground">
                    <strong>Requisitos da senha:</strong>
                    <br />• Mínimo de 8 caracteres
                    <br />• Pelo menos uma letra maiúscula
                    <br />• Pelo menos uma letra minúscula
                    <br />• Pelo menos um número
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
