import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserPlus, AlertCircle, CheckCircle2 } from 'lucide-react';
import { formatWhatsApp } from '@/lib/utils';

export function RegisterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const DEFAULT_PASSWORD = 'Reconquista@2026';

  function handleWhatsAppChange(value: string) {
    const formatted = formatWhatsApp(value);
    setWhatsapp(formatted);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (name.length < 3) {
      setError('Nome deve ter pelo menos 3 caracteres');
      return;
    }

    if (!whatsapp.startsWith('+258')) {
      setError('WhatsApp deve começar com +258');
      return;
    }

    if (!acceptTerms) {
      setError('Você precisa aceitar os Termos de Uso');
      return;
    }

    setLoading(true);

    try {
      await signUp(email, DEFAULT_PASSWORD, name, whatsapp);
      setSuccess(true);

      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar conta';
      if (errorMessage.includes('already registered')) {
        setError('Este email já está cadastrado. Faça login.');
      } else {
        setError('Erro ao criar conta. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-gray-900 border border-green-500/50 rounded-xl p-8 shadow-2xl text-center">
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Conta criada com sucesso!</h2>
            <p className="text-gray-400 mb-4">
              Faça login com a senha: <span className="font-mono text-yellow-500">{DEFAULT_PASSWORD}</span>
            </p>
            <p className="text-sm text-gray-500">Redirecionando para o login...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Código da Reconquista</h1>
          <p className="text-gray-400">Crie sua conta grátis</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 shadow-2xl">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Nome Completo
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Seu nome completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                minLength={3}
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-300 mb-2">
                WhatsApp
              </label>
              <Input
                id="whatsapp"
                type="tel"
                placeholder="+258 XX XXX XXXX"
                value={whatsapp}
                onChange={(e) => handleWhatsAppChange(e.target.value)}
                required
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-1">Formato: +258XXXXXXXXX</p>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Senha (automática)
              </label>
              <Input
                id="password"
                type="text"
                value={DEFAULT_PASSWORD}
                readOnly
                disabled
                className="bg-gray-800/50 cursor-not-allowed"
              />
              <p className="text-xs text-yellow-500 mt-1">
                Use esta senha para fazer login. Você pode alterá-la depois.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="terms"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-gray-700 bg-gray-800 text-yellow-500 focus:ring-yellow-500"
                disabled={loading}
              />
              <label htmlFor="terms" className="text-sm text-gray-400">
                Aceito os Termos de Uso e Política de Privacidade
              </label>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={loading || !acceptTerms}>
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-black border-t-transparent" />
                  Criando conta...
                </div>
              ) : (
                <>
                  <UserPlus className="mr-2 h-5 w-5" />
                  Criar Conta Grátis
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center pt-4 border-t border-gray-800">
            <p className="text-gray-400 text-sm">
              Já tem uma conta?{' '}
              <Link
                to="/login"
                className="text-yellow-500 hover:text-yellow-400 font-semibold transition-colors"
              >
                Faça login aqui
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
