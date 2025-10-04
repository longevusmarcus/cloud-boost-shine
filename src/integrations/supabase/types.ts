export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      daily_logs: {
        Row: {
          created_at: string | null
          date: string
          diet_quality: string | null
          electrolytes: boolean | null
          exercise_minutes: number | null
          food_photos: string[] | null
          id: string
          masturbation_count: number | null
          notes: string | null
          sleep_hours: number | null
          sleep_quality: string | null
          stress_level: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          date: string
          diet_quality?: string | null
          electrolytes?: boolean | null
          exercise_minutes?: number | null
          food_photos?: string[] | null
          id?: string
          masturbation_count?: number | null
          notes?: string | null
          sleep_hours?: number | null
          sleep_quality?: string | null
          stress_level?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          date?: string
          diet_quality?: string | null
          electrolytes?: boolean | null
          exercise_minutes?: number | null
          food_photos?: string[] | null
          id?: string
          masturbation_count?: number | null
          notes?: string | null
          sleep_hours?: number | null
          sleep_quality?: string | null
          stress_level?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      test_results: {
        Row: {
          concentration: number | null
          created_at: string | null
          file_url: string | null
          id: string
          morphology: number | null
          motile_sperm_concentration: number | null
          motility: number | null
          notes: string | null
          progressive_motile_sperm_concentration: number | null
          progressive_motility: number | null
          provider: string | null
          test_date: string
          updated_at: string | null
          user_id: string
          volume: number | null
        }
        Insert: {
          concentration?: number | null
          created_at?: string | null
          file_url?: string | null
          id?: string
          morphology?: number | null
          motile_sperm_concentration?: number | null
          motility?: number | null
          notes?: string | null
          progressive_motile_sperm_concentration?: number | null
          progressive_motility?: number | null
          provider?: string | null
          test_date: string
          updated_at?: string | null
          user_id: string
          volume?: number | null
        }
        Update: {
          concentration?: number | null
          created_at?: string | null
          file_url?: string | null
          id?: string
          morphology?: number | null
          motile_sperm_concentration?: number | null
          motility?: number | null
          notes?: string | null
          progressive_motile_sperm_concentration?: number | null
          progressive_motility?: number | null
          provider?: string | null
          test_date?: string
          updated_at?: string | null
          user_id?: string
          volume?: number | null
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          age: number | null
          created_at: string | null
          current_streak: number | null
          full_name: string | null
          goal: string | null
          id: string
          longest_streak: number | null
          onboarding_completed: boolean | null
          profile_image_url: string | null
          sperm_level: number | null
          sperm_value: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          age?: number | null
          created_at?: string | null
          current_streak?: number | null
          full_name?: string | null
          goal?: string | null
          id?: string
          longest_streak?: number | null
          onboarding_completed?: boolean | null
          profile_image_url?: string | null
          sperm_level?: number | null
          sperm_value?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          age?: number | null
          created_at?: string | null
          current_streak?: number | null
          full_name?: string | null
          goal?: string | null
          id?: string
          longest_streak?: number | null
          onboarding_completed?: boolean | null
          profile_image_url?: string | null
          sperm_level?: number | null
          sperm_value?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
