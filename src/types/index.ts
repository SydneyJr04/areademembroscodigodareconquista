export interface Profile {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  avatar_url?: string;
  subscription_tier: 'free' | 'semanal' | 'mensal' | 'vitalicio';
  subscription_expires_at?: string;
  stripe_customer_id?: string;
  first_login: boolean;
  created_at: string;
  updated_at: string;
}

export interface Module {
  id: number;
  module_number: number;
  title: string;
  slug: string;
  description?: string;
  thumbnail_url?: string;
  duration_text?: string;
  total_lessons: number;
  badge_text?: string;
  order_index?: number;
  is_active: boolean;
  created_at: string;
}

export interface Lesson {
  id: string;
  module_id: number;
  lesson_number: number;
  title: string;
  slug: string;
  description?: string;
  youtube_id: string;
  duration_seconds?: number;
  is_bonus: boolean;
  order_index?: number;
  created_at: string;
}

export interface UserModule {
  id: string;
  user_id: string;
  module_id: number;
  release_date: string;
  is_completed: boolean;
  completed_at?: string;
  created_at: string;
  module?: Module;
}

export interface UserLesson {
  id: string;
  user_id: string;
  lesson_id: string;
  is_completed: boolean;
  watch_percentage: number;
  last_watched_at?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface UserStats {
  user_id: string;
  total_watch_time_seconds: number;
  lessons_completed: number;
  modules_completed: number;
  current_streak_days: number;
  longest_streak_days: number;
  last_activity_date?: string;
  total_logins: number;
  badges: string[];
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  user_id: string;
  stripe_payment_intent_id?: string;
  stripe_subscription_id?: string;
  amount_cents: number;
  currency: string;
  status: 'pending' | 'succeeded' | 'failed' | 'refunded';
  subscription_tier?: string;
  payment_method?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}
