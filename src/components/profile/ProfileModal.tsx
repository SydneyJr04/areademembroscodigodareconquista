import { useState } from 'react';
import { Profile } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { User, Camera, Save, Key, AlertCircle, CheckCircle2 } from 'lucide-react';
import { formatWhatsApp } from '@/lib/utils';
import { supabase } from '@/lib/supabase';

interface ProfileModalProps {
  profile: Profile;
  onClose: () => void;
}

export function ProfileModal({ profile, onClose }: ProfileModalProps) {
  const { updateProfile, updatePassword } = useAuth();
  const [name, setName] = useState(profile.name);
  const [whatsapp, setWhatsapp] = useState(profile.whatsapp);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [uploading, setUploading] = useState(false);

  async function handleSave() {
    setLoading(true);
    setMessage(null);

    try {
      await updateProfile({ name, whatsapp });
      setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao atualizar perfil' });
    } finally {
      setLoading(false);
    }
  }

  async function handlePasswordChange() {
    setMessage(null);

    if (newPassword.length < 8) {
      setMessage({ type: 'error', text: 'Senha deve ter pelo menos 8 caracteres' });
      return;
    }

    if (!/[A-Z]/.test(newPassword)) {
      setMessage({ type: 'error', text: 'Senha deve ter pelo menos 1 letra maiúscula' });
      return;
    }

    if (!/[0-9]/.test(newPassword)) {
      setMessage({ type: 'error', text: 'Senha deve ter pelo menos 1 número' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'As senhas não coincidem' });
      return;
    }

    setLoading(true);

    try {
      await updatePassword(newPassword);
      setMessage({ type: 'success', text: 'Senha alterada com sucesso!' });
      setShowPasswordChange(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      await updateProfile({ first_login: false });
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao alterar senha' });
    } finally {
      setLoading(false);
    }
  }

  async function handleAvatarUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Imagem deve ter no máximo 2MB' });
      return;
    }

    setUploading(true);
    setMessage(null);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${profile.id}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      await updateProfile({ avatar_url: publicUrl });
      setMessage({ type: 'success', text: 'Avatar atualizado!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao fazer upload da imagem' });
    } finally {
      setUploading(false);
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Meu Perfil</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {message && (
            <div
              className={`p-4 rounded-lg flex items-start gap-3 ${
                message.type === 'success'
                  ? 'bg-green-500/10 border border-green-500/50'
                  : 'bg-red-500/10 border border-red-500/50'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              )}
              <p className={`text-sm ${message.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                {message.text}
              </p>
            </div>
          )}

          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.name}
                  className="h-32 w-32 rounded-full object-cover border-4 border-yellow-500"
                />
              ) : (
                <div className="h-32 w-32 rounded-full bg-gray-800 flex items-center justify-center border-4 border-gray-700">
                  <User className="h-16 w-16 text-gray-400" />
                </div>
              )}

              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 bg-yellow-500 hover:bg-yellow-600 text-black rounded-full p-3 cursor-pointer transition-colors"
              >
                {uploading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-black border-t-transparent" />
                ) : (
                  <Camera className="h-5 w-5" />
                )}
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                  disabled={uploading}
                />
              </label>
            </div>
            <p className="text-sm text-gray-400">Clique no ícone da câmera para alterar</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Nome Completo</label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <Input type="email" value={profile.email} disabled className="bg-gray-800/50" />
              <p className="text-xs text-gray-500 mt-1">O email não pode ser alterado</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">WhatsApp</label>
              <Input
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(formatWhatsApp(e.target.value))}
                disabled={loading}
              />
            </div>

            <Button onClick={handleSave} className="w-full" disabled={loading}>
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-black border-t-transparent" />
                  Salvando...
                </div>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Alterações
                </>
              )}
            </Button>
          </div>

          <div className="border-t border-gray-800 pt-6">
            {!showPasswordChange ? (
              <Button
                variant="outline"
                onClick={() => setShowPasswordChange(true)}
                className="w-full"
              >
                <Key className="h-4 w-4 mr-2" />
                Alterar Senha
              </Button>
            ) : (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Alterar Senha</h3>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nova Senha
                  </label>
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Digite a nova senha"
                    disabled={loading}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Mínimo 8 caracteres, 1 maiúscula e 1 número
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Confirmar Nova Senha
                  </label>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Digite novamente"
                    disabled={loading}
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowPasswordChange(false);
                      setNewPassword('');
                      setConfirmPassword('');
                    }}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button onClick={handlePasswordChange} className="flex-1" disabled={loading}>
                    {loading ? 'Alterando...' : 'Alterar Senha'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
