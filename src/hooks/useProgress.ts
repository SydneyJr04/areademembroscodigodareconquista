import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { UserLesson, UserStats } from '@/types';

export function useProgress(userId: string | undefined) {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      loadStats();
    }
  }, [userId]);

  async function loadStats() {
    try {
      const { data, error } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  }

  async function updateLessonProgress(
    lessonId: string,
    watchPercentage: number,
    isCompleted: boolean = false
  ) {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('user_lessons')
        .upsert({
          user_id: userId,
          lesson_id: lessonId,
          watch_percentage: watchPercentage,
          is_completed: isCompleted,
          last_watched_at: new Date().toISOString(),
          ...(isCompleted && { completed_at: new Date().toISOString() }),
        });

      if (error) throw error;

      if (isCompleted) {
        await loadStats();
      }
    } catch (error) {
      console.error('Error updating lesson progress:', error);
    }
  }

  async function getLessonProgress(lessonId: string): Promise<UserLesson | null> {
    if (!userId) return null;

    try {
      const { data, error } = await supabase
        .from('user_lessons')
        .select('*')
        .eq('user_id', userId)
        .eq('lesson_id', lessonId)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting lesson progress:', error);
      return null;
    }
  }

  return {
    stats,
    loading,
    updateLessonProgress,
    getLessonProgress,
    refreshStats: loadStats,
  };
}
