import { useEffect, useRef, useState } from 'react';
import Plyr from 'plyr';
import 'plyr/dist/plyr.css';

interface VideoPlayerProps {
  youtubeId: string;
  onProgress?: (percentage: number) => void;
  onComplete?: () => void;
}

export function VideoPlayer({ youtubeId, onProgress, onComplete }: VideoPlayerProps) {
  const playerRef = useRef<HTMLDivElement>(null);
  const plyrInstanceRef = useRef<Plyr | null>(null);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!playerRef.current || !youtubeId) {
      setError('ID do vídeo não fornecido');
      return;
    }

    // Limpar instância anterior
    if (plyrInstanceRef.current) {
      plyrInstanceRef.current.destroy();
    }

    console.log('🎬 Inicializando player com ID:', youtubeId);

    try {
      // Criar nova instância do Plyr
      const player = new Plyr(playerRef.current, {
        controls: [
          'play-large',
          'play',
          'progress',
          'current-time',
          'mute',
          'volume',
          'settings',
          'pip',
          'fullscreen'
        ],
        settings: ['quality', 'speed'],
        youtube: {
          noCookie: true,
          rel: 0,
          showinfo: 0,
          iv_load_policy: 3,
          modestbranding: 1,
        },
        ratio: '16:9',
      });

      plyrInstanceRef.current = player;

      // Event Listeners
      player.on('ready', () => {
        console.log('✅ Player pronto');
        setError(null);
      });

      player.on('error', (event) => {
        console.error('❌ Erro no player:', event);
        setError('Erro ao carregar vídeo. Verifique o ID do YouTube.');
      });

      player.on('timeupdate', () => {
        if (player.duration > 0) {
          const percentage = (player.currentTime / player.duration) * 100;
          onProgress?.(Math.round(percentage));

          // Trigger completion ao atingir 90%
          if (percentage >= 90 && !hasCompleted) {
            setHasCompleted(true);
            onComplete?.();
          }
        }
      });

      player.on('playing', () => {
        console.log('▶️ Vídeo reproduzindo');
      });

    } catch (error) {
      console.error('❌ Erro ao criar player:', error);
      setError('Falha ao inicializar player');
    }

    // Cleanup
    return () => {
      if (plyrInstanceRef.current) {
        plyrInstanceRef.current.destroy();
        plyrInstanceRef.current = null;
      }
    };
  }, [youtubeId]);

  // Renderizar fallback se houver erro
  if (error) {
    return (
      <div className="w-full aspect-video bg-gray-900 rounded-xl flex items-center justify-center">
        <div className="text-center p-8">
          <p className="text-red-500 mb-4">❌ {error}</p>
          <p className="text-gray-400 text-sm mb-4">ID do vídeo: {youtubeId}</p>
          <a
            href={`https://www.youtube.com/watch?v=${youtubeId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            Abrir no YouTube
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full aspect-video rounded-xl overflow-hidden bg-black">
      <div
        ref={playerRef}
        data-plyr-provider="youtube"
        data-plyr-embed-id={youtubeId}
      />
      <style>{`
        :root {
          --plyr-color-main: #FFD700;
          --plyr-video-control-background-hover: #E50914;
          --plyr-video-control-color: #ffffff;
        }
      `}</style>
    </div>
  );
}
