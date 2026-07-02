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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      analytics: {
        Row: {
          clicks: number | null
          comments: number | null
          created_at: string | null
          id: string
          leads: number | null
          likes: number | null
          notes: string | null
          post_id: string | null
          revenue: number | null
          sales: number | null
          saves: number | null
          shares: number | null
          views: number | null
        }
        Insert: {
          clicks?: number | null
          comments?: number | null
          created_at?: string | null
          id?: string
          leads?: number | null
          likes?: number | null
          notes?: string | null
          post_id?: string | null
          revenue?: number | null
          sales?: number | null
          saves?: number | null
          shares?: number | null
          views?: number | null
        }
        Update: {
          clicks?: number | null
          comments?: number | null
          created_at?: string | null
          id?: string
          leads?: number | null
          likes?: number | null
          notes?: string | null
          post_id?: string | null
          revenue?: number | null
          sales?: number | null
          saves?: number | null
          shares?: number | null
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      filming_lines: {
        Row: {
          b_roll: string | null
          created_at: string | null
          delivery_notes: string | null
          filmed: boolean | null
          id: string
          line_order: number | null
          line_text: string | null
          post_id: string | null
          text_overlay: string | null
        }
        Insert: {
          b_roll?: string | null
          created_at?: string | null
          delivery_notes?: string | null
          filmed?: boolean | null
          id?: string
          line_order?: number | null
          line_text?: string | null
          post_id?: string | null
          text_overlay?: string | null
        }
        Update: {
          b_roll?: string | null
          created_at?: string | null
          delivery_notes?: string | null
          filmed?: boolean | null
          id?: string
          line_order?: number | null
          line_text?: string | null
          post_id?: string | null
          text_overlay?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "filming_lines_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      frameworks: {
        Row: {
          branch: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          status: string | null
        }
        Insert: {
          branch?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          status?: string | null
        }
        Update: {
          branch?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          status?: string | null
        }
        Relationships: []
      }
      funnels: {
        Row: {
          branch: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string | null
          product_id: string | null
        }
        Insert: {
          branch?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string | null
          product_id?: string | null
        }
        Update: {
          branch?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string | null
          product_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "funnels_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      hooks: {
        Row: {
          created_at: string | null
          hook_type: string | null
          id: string
          is_favorite: boolean | null
          post_id: string | null
          rating: number | null
          text: string
        }
        Insert: {
          created_at?: string | null
          hook_type?: string | null
          id?: string
          is_favorite?: boolean | null
          post_id?: string | null
          rating?: number | null
          text: string
        }
        Update: {
          created_at?: string | null
          hook_type?: string | null
          id?: string
          is_favorite?: boolean | null
          post_id?: string | null
          rating?: number | null
          text?: string
        }
        Relationships: [
          {
            foreignKeyName: "hooks_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      ideas: {
        Row: {
          branch: string | null
          content: string
          created_at: string | null
          id: string
          source_app: string | null
          status: string | null
          type: string | null
        }
        Insert: {
          branch?: string | null
          content: string
          created_at?: string | null
          id?: string
          source_app?: string | null
          status?: string | null
          type?: string | null
        }
        Update: {
          branch?: string | null
          content?: string
          created_at?: string | null
          id?: string
          source_app?: string | null
          status?: string | null
          type?: string | null
        }
        Relationships: []
      }
      keyword_paths: {
        Row: {
          created_at: string | null
          dm_draft: string | null
          id: string
          keyword: string | null
          lead_magnet: string | null
          next_offer_id: string | null
          post_id: string | null
        }
        Insert: {
          created_at?: string | null
          dm_draft?: string | null
          id?: string
          keyword?: string | null
          lead_magnet?: string | null
          next_offer_id?: string | null
          post_id?: string | null
        }
        Update: {
          created_at?: string | null
          dm_draft?: string | null
          id?: string
          keyword?: string | null
          lead_magnet?: string | null
          next_offer_id?: string | null
          post_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "keyword_paths_next_offer_id_fkey"
            columns: ["next_offer_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "keyword_paths_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      media_assets: {
        Row: {
          created_at: string | null
          file_type: string | null
          file_url: string | null
          id: string
          post_id: string | null
        }
        Insert: {
          created_at?: string | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          post_id?: string | null
        }
        Update: {
          created_at?: string | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          post_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "media_assets_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          body: string | null
          branch: string | null
          created_at: string | null
          cta: string | null
          funnel_stage: string | null
          hook: string | null
          id: string
          mission: string | null
          product_id: string | null
          published_url: string | null
          scheduled_date: string | null
          status: string | null
          title: string | null
          visual_idea: string | null
        }
        Insert: {
          body?: string | null
          branch?: string | null
          created_at?: string | null
          cta?: string | null
          funnel_stage?: string | null
          hook?: string | null
          id?: string
          mission?: string | null
          product_id?: string | null
          published_url?: string | null
          scheduled_date?: string | null
          status?: string | null
          title?: string | null
          visual_idea?: string | null
        }
        Update: {
          body?: string | null
          branch?: string | null
          created_at?: string | null
          cta?: string | null
          funnel_stage?: string | null
          hook?: string | null
          id?: string
          mission?: string | null
          product_id?: string | null
          published_url?: string | null
          scheduled_date?: string | null
          status?: string | null
          title?: string | null
          visual_idea?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "posts_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          branch: string | null
          created_at: string | null
          created_from: string | null
          design_preset: string | null
          export_url: string | null
          id: string
          name: string
          status: string | null
          type: string | null
        }
        Insert: {
          branch?: string | null
          created_at?: string | null
          created_from?: string | null
          design_preset?: string | null
          export_url?: string | null
          id?: string
          name: string
          status?: string | null
          type?: string | null
        }
        Update: {
          branch?: string | null
          created_at?: string | null
          created_from?: string | null
          design_preset?: string | null
          export_url?: string | null
          id?: string
          name?: string
          status?: string | null
          type?: string | null
        }
        Relationships: []
      }
      remixes: {
        Row: {
          created_at: string | null
          id: string
          name: string | null
          new_format: string | null
          new_post_id: string | null
          original_post_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name?: string | null
          new_format?: string | null
          new_post_id?: string | null
          original_post_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string | null
          new_format?: string | null
          new_post_id?: string | null
          original_post_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "remixes_new_post_id_fkey"
            columns: ["new_post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "remixes_original_post_id_fkey"
            columns: ["original_post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      stories: {
        Row: {
          created_at: string | null
          cta: string | null
          id: string
          payoff: string | null
          post_id: string | null
          problem: string | null
          pursuit: string | null
          stakes: string | null
          value: string | null
        }
        Insert: {
          created_at?: string | null
          cta?: string | null
          id?: string
          payoff?: string | null
          post_id?: string | null
          problem?: string | null
          pursuit?: string | null
          stakes?: string | null
          value?: string | null
        }
        Update: {
          created_at?: string | null
          cta?: string | null
          id?: string
          payoff?: string | null
          post_id?: string | null
          problem?: string | null
          pursuit?: string | null
          stakes?: string | null
          value?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stories_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          branch: string | null
          created_at: string | null
          due_date: string | null
          id: string
          is_today: boolean | null
          priority: string | null
          status: string | null
          title: string
          workstream: string | null
        }
        Insert: {
          branch?: string | null
          created_at?: string | null
          due_date?: string | null
          id?: string
          is_today?: boolean | null
          priority?: string | null
          status?: string | null
          title: string
          workstream?: string | null
        }
        Update: {
          branch?: string | null
          created_at?: string | null
          due_date?: string | null
          id?: string
          is_today?: boolean | null
          priority?: string | null
          status?: string | null
          title?: string
          workstream?: string | null
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
