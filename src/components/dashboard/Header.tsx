import { useState } from 'react';
import { Profile } from '@/types';
import { Button } from '@/components/ui/button';
import { LogOut, User, Menu, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { ProfileModal } from '@/components/profile/ProfileModal';

interface HeaderProps {
  profile: Profile | null;
}

export function Header({ profile }: HeaderProps) {
  const { signOut } = useAuth();
  const [showProfile, setShowProfile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  async function handleSignOut() {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }

  return (
    <>
      <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-yellow-500">Código da Reconquista</h1>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-3">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.name}
                    className="h-10 w-10 rounded-full object-cover border-2 border-yellow-500"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center border-2 border-gray-700">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                )}
                <div className="text-sm">
                  <p className="font-medium text-white">{profile?.name}</p>
                  <p className="text-gray-400 text-xs">{profile?.email}</p>
                </div>
              </div>

              <Button variant="outline" size="sm" onClick={() => setShowProfile(true)}>
                <User className="h-4 w-4 mr-2" />
                Perfil
              </Button>

              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>

            <button
              className="md:hidden text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pt-4 border-t border-gray-800 space-y-3">
              <div className="flex items-center gap-3 pb-3">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.name}
                    className="h-12 w-12 rounded-full object-cover border-2 border-yellow-500"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-gray-800 flex items-center justify-center border-2 border-gray-700">
                    <User className="h-6 w-6 text-gray-400" />
                  </div>
                )}
                <div>
                  <p className="font-medium text-white">{profile?.name}</p>
                  <p className="text-gray-400 text-sm">{profile?.email}</p>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setShowProfile(true);
                  setMobileMenuOpen(false);
                }}
              >
                <User className="h-4 w-4 mr-2" />
                Meu Perfil
              </Button>

              <Button variant="ghost" className="w-full" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          )}
        </div>
      </header>

      {showProfile && profile && (
        <ProfileModal profile={profile} onClose={() => setShowProfile(false)} />
      )}
    </>
  );
}
