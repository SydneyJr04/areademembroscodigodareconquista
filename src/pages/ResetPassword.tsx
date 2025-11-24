import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, Lock, ArrowLeft, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'email' | 'reset'>('email');
  const [emailSent, setEmailSent] = useState(false);

  // Verificar se tem token na URL (veio do email)
  const token = searchParams.get('token');
  const type = searchParams.get('type');

  useState(() => {
    if (token && type === 'recovery') {
      setStep('reset');
    }
  }, [token, type]);

  // ═══════════════════════════════════════════════════════════
  // STEP 1: ENVIAR EMAIL DE RECUPERAÇÃO
  // ═══════════════════════════════════════════════════════════
  const handleSendResetEmail = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast.error('Digite um email válido');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      setEmailSent(true);
      toast.success('Email enviado!', {
        description: 'Verifique sua caixa de entrada',
      });
    } catch (error: any) {
      toast.error('Erro ao enviar email', {
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  // ═══════════════════════════════════════════════════════════
  // STEP 2: REDEFINIR SENHA
  // ═══════════════════════════════════════════════════════════
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validações
    if (!newPassword || newPassword.length < 8) {
      toast.error('A senha deve ter no mínimo 8 caracteres');
      return;
    }

    if (!/[A-Z]/.test(newPassword)) {
      toast.error('A senha deve conter ao menos 1 letra maiúscula');
      return;
    }

    if (!/[a-z]/.test(newPassword)) {
      toast.error('A senha deve conter ao menos 1 letra minúscula');
      return;
    }

    if (!/[0-9]/.test(newPassword)) {
      toast.error('A senha deve conter ao menos 1 número');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      toast.success('✅ Senha redefinida!', {
        description: 'Você já pode fazer login',
      });

      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error: any) {
      toast.error('Erro ao redefinir senha', {
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  // ═══════════════════════════════════════════════════════════
  // UI: STEP 1 - SOLICITAR EMAIL
  // ═══════════════════════════════════════════════════════════
  if (step === 'email') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 px-4">
        <Card className="w-full max-w-md border-border/50 shadow-2xl">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 shadow-lg">
              <Lock className="h-8 w-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl font-bold">Recuperar Senha</CardTitle>
            <CardDescription>
              Digite seu email e enviaremos um link para redefinir sua senha
            </CardDescription>
          </CardHeader>

          <CardContent>
            {emailSent ? (
              <Alert className="border-green-500/50 bg-green-500/10">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <AlertDescription className="ml-2 text-green-500">
                  <strong>Email enviado!</strong>
                  <p className="mt-1 text-sm">
                    Verifique sua caixa de entrada (e spam) e clique no link para redefinir sua
                    senha.
                  </p>
                </AlertDescription>
              </Alert>
            ) : (
              <form onSubmit={handleSendResetEmail} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Enviar Link de Recuperação
                    </>
                  )}
                </Button>
              </form>
            )}

            <div className="mt-6 text-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/login')}
                className="gap-2 text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar ao Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════
  // UI: STEP 2 - REDEFINIR SENHA
  // ═══════════════════════════════════════════════════════════
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 px-4">
      <Card className="w-full max-w-md border-border/50 shadow-2xl">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 shadow-lg">
            <Lock className="h-8 w-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold">Nova Senha</CardTitle>
          <CardDescription>Digite sua nova senha abaixo</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleResetPassword} className="space-y-4">
            {/* Nova Senha */}
            <div className="space-y-2">
              <Label htmlFor="newPassword">Nova Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="newPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Mínimo 8 caracteres"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Confirmar Senha */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Digite a senha novamente"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Requisitos */}
            <div className="rounded-lg border border-border/50 bg-muted/30 p-3">
              <p className="mb-2 text-xs font-semibold text-muted-foreground">
                Requisitos da senha:
              </p>
              <ul className="space-y-1 text-xs text-muted-foreground">
                <li className={newPassword.length >= 8 ? 'text-green-500' : ''}>
                  • Mínimo 8 caracteres
                </li>
                <li className={/[A-Z]/.test(newPassword) ? 'text-green-500' : ''}>
                  • Ao menos 1 letra maiúscula
                </li>
                <li className={/[a-z]/.test(newPassword) ? 'text-green-500' : ''}>
                  • Ao menos 1 letra minúscula
                </li>
                <li className={/[0-9]/.test(newPassword) ? 'text-green-500' : ''}>
                  • Ao menos 1 número
                </li>
                <li
                  className={
                    newPassword && confirmPassword && newPassword === confirmPassword
                      ? 'text-green-500'
                      : ''
                  }
                >
                  • As senhas devem coincidir
                </li>
              </ul>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white" />
                  Redefinindo...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Redefinir Senha
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/login')}
              className="gap-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar ao Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
