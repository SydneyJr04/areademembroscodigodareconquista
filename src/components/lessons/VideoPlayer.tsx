import { useEffect, useRef } from 'react';

interface VideoPlayerProps {
  youtubeId: string;
  onProgress?: (percentage: number) => void;
  onComplete?: () => void;
}

export function VideoPlayer({ youtubeId, onProgress, onComplete }: VideoPlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const progressIntervalRef = useRef<number>();
  const hasCompletedRef = useRef(false);

  useEffect(() => {
    hasCompletedRef.current = false;

    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== 'https://www.youtube.com') return;

      try {
        const data = JSON.parse(event.data);

        if (data.event === 'infoDelivery' && data.info) {
          const { currentTime, duration } = data.info;

          if (currentTime && duration) {
            const percentage = Math.round((currentTime / duration) * 100);
            onProgress?.(percentage);

            if (percentage >= 90 && !hasCompletedRef.current) {
              hasCompletedRef.current = true;
              onComplete?.();
            }
          }
        }
      } catch (error) {
        console.error('Error parsing YouTube message:', error);
      }
    };

    window.addEventListener('message', handleMessage);

    progressIntervalRef.current = window.setInterval(() => {
      if (iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          '{"event":"command","func":"getVideoData","args":""}',
          '*'
        );
      }
    }, 1000);

    return () => {
      window.removeEventListener('message', handleMessage);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [youtubeId, onProgress, onComplete]);

  return (
    <div className="relative aspect-video w-full max-w-5xl mx-auto rounded-xl overflow-hidden bg-black shadow-2xl">
      <iframe
        ref={iframeRef}
        src={`https://www.youtube.com/embed/${youtubeId}?enablejsapi=1&rel=0&modestbranding=1&playsinline=1`}
        title="Video Player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
}
