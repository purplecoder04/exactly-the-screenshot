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
      assets: {
        Row: {
          created_at: string | null
          file_url: string | null
          id: string
          kit_id: string | null
          type: string | null
        }
        Insert: {
          created_at?: string | null
          file_url?: string | null
          id?: string
          kit_id?: string | null
          type?: string | null
        }
        Update: {
          created_at?: string | null
          file_url?: string | null
          id?: string
          kit_id?: string | null
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assets_kit_id_fkey"
            columns: ["kit_id"]
            isOneToOne: false
            referencedRelation: "kits"
            referencedColumns: ["id"]
          },
        ]
      }
      branches: {
        Row: {
          created_at: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      captured_insights: {
        Row: {
          branch: string | null
          content: string
          created_at: string | null
          id: string
          parsed_type: string | null
          raw_text: string | null
          source: string | null
          status: string | null
        }
        Insert: {
          branch?: string | null
          content: string
          created_at?: string | null
          id?: string
          parsed_type?: string | null
          raw_text?: string | null
          source?: string | null
          status?: string | null
        }
        Update: {
          branch?: string | null
          content?: string
          created_at?: string | null
          id?: string
          parsed_type?: string | null
          raw_text?: string | null
          source?: string | null
          status?: string | null
        }
        Relationships: []
      }
      content_to_cash_assets: {
        Row: {
          content: string | null
          created_at: string | null
          id: string
          title: string | null
          type: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: string
          title?: string | null
          type?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: string
          title?: string | null
          type?: string | null
        }
        Relationships: []
      }
      continue_working_state: {
        Row: {
          app: string | null
          branch: string | null
          id: string
          lesson: string | null
          page: string | null
          product: string | null
          task: string | null
          updated_at: string | null
          workbook: string | null
        }
        Insert: {
          app?: string | null
          branch?: string | null
          id?: string
          lesson?: string | null
          page?: string | null
          product?: string | null
          task?: string | null
          updated_at?: string | null
          workbook?: string | null
        }
        Update: {
          app?: string | null
          branch?: string | null
          id?: string
          lesson?: string | null
          page?: string | null
          product?: string | null
          task?: string | null
          updated_at?: string | null
          workbook?: string | null
        }
        Relationships: []
      }
      day3_notes: {
        Row: {
          content: string
          created_at: string | null
          id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
        }
        Relationships: []
      }
      decision_items: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          priority: string | null
          related_branch: string | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          priority?: string | null
          related_branch?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          priority?: string | null
          related_branch?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      design_presets: {
        Row: {
          branch_id: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          branch_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          branch_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "design_presets_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
        ]
      }
      email_flow_steps: {
        Row: {
          body: string | null
          created_at: string | null
          flow_name: string | null
          id: string
          step_order: number | null
          subject: string | null
        }
        Insert: {
          body?: string | null
          created_at?: string | null
          flow_name?: string | null
          id?: string
          step_order?: number | null
          subject?: string | null
        }
        Update: {
          body?: string | null
          created_at?: string | null
          flow_name?: string | null
          id?: string
          step_order?: number | null
          subject?: string | null
        }
        Relationships: []
      }
      export_files: {
        Row: {
          created_at: string | null
          export_job_id: string | null
          file_type: string | null
          file_url: string | null
          id: string
        }
        Insert: {
          created_at?: string | null
          export_job_id?: string | null
          file_type?: string | null
          file_url?: string | null
          id?: string
        }
        Update: {
          created_at?: string | null
          export_job_id?: string | null
          file_type?: string | null
          file_url?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "export_files_export_job_id_fkey"
            columns: ["export_job_id"]
            isOneToOne: false
            referencedRelation: "export_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      export_jobs: {
        Row: {
          completed_at: string | null
          created_at: string | null
          export_type: string | null
          id: string
          kit_id: string | null
          status: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          export_type?: string | null
          id?: string
          kit_id?: string | null
          status?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          export_type?: string | null
          id?: string
          kit_id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "export_jobs_kit_id_fkey"
            columns: ["kit_id"]
            isOneToOne: false
            referencedRelation: "kits"
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
      import_work_sessions: {
        Row: {
          created_at: string | null
          id: string
          parsed_items: Json | null
          raw_content: string | null
          source_type: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          parsed_items?: Json | null
          raw_content?: string | null
          source_type?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          parsed_items?: Json | null
          raw_content?: string | null
          source_type?: string | null
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
      kit_documents: {
        Row: {
          created_at: string | null
          id: string
          kit_id: string | null
          title: string | null
          type: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          kit_id?: string | null
          title?: string | null
          type?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          kit_id?: string | null
          title?: string | null
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "kit_documents_kit_id_fkey"
            columns: ["kit_id"]
            isOneToOne: false
            referencedRelation: "kits"
            referencedColumns: ["id"]
          },
        ]
      }
      kit_pages: {
        Row: {
          content: Json | null
          created_at: string | null
          id: string
          kit_document_id: string | null
          page_number: number | null
          page_type: string | null
        }
        Insert: {
          content?: Json | null
          created_at?: string | null
          id?: string
          kit_document_id?: string | null
          page_number?: number | null
          page_type?: string | null
        }
        Update: {
          content?: Json | null
          created_at?: string | null
          id?: string
          kit_document_id?: string | null
          page_number?: number | null
          page_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "kit_pages_kit_document_id_fkey"
            columns: ["kit_document_id"]
            isOneToOne: false
            referencedRelation: "kit_documents"
            referencedColumns: ["id"]
          },
        ]
      }
      kit_versions: {
        Row: {
          created_at: string | null
          id: string
          kit_id: string | null
          snapshot: Json | null
          version_number: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          kit_id?: string | null
          snapshot?: Json | null
          version_number?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          kit_id?: string | null
          snapshot?: Json | null
          version_number?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "kit_versions_kit_id_fkey"
            columns: ["kit_id"]
            isOneToOne: false
            referencedRelation: "kits"
            referencedColumns: ["id"]
          },
        ]
      }
      kits: {
        Row: {
          branch_id: string | null
          created_at: string | null
          design_preset_id: string | null
          id: string
          name: string
          product_flow_id: string | null
          product_id: string | null
          source_markdown: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          branch_id?: string | null
          created_at?: string | null
          design_preset_id?: string | null
          id?: string
          name: string
          product_flow_id?: string | null
          product_id?: string | null
          source_markdown?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          branch_id?: string | null
          created_at?: string | null
          design_preset_id?: string | null
          id?: string
          name?: string
          product_flow_id?: string | null
          product_id?: string | null
          source_markdown?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "kits_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kits_design_preset_id_fkey"
            columns: ["design_preset_id"]
            isOneToOne: false
            referencedRelation: "design_presets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kits_product_flow_id_fkey"
            columns: ["product_flow_id"]
            isOneToOne: false
            referencedRelation: "product_flows"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kits_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      library_items: {
        Row: {
          branch: string | null
          category: string | null
          content: string | null
          content_body: string | null
          created_at: string | null
          description: string | null
          id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          branch?: string | null
          category?: string | null
          content?: string | null
          content_body?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          branch?: string | null
          category?: string | null
          content?: string | null
          content_body?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
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
      offers: {
        Row: {
          created_at: string | null
          cta: string | null
          id: string
          link: string | null
          name: string
          price: number | null
          product_id: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          cta?: string | null
          id?: string
          link?: string | null
          name: string
          price?: number | null
          product_id?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          cta?: string | null
          id?: string
          link?: string | null
          name?: string
          price?: number | null
          product_id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "offers_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
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
      product_flows: {
        Row: {
          branch_id: string | null
          created_at: string | null
          id: string
          name: string
          structure: Json | null
        }
        Insert: {
          branch_id?: string | null
          created_at?: string | null
          id?: string
          name: string
          structure?: Json | null
        }
        Update: {
          branch_id?: string | null
          created_at?: string | null
          id?: string
          name?: string
          structure?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "product_flows_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
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
      proof_assets: {
        Row: {
          content: string | null
          created_at: string | null
          file_url: string | null
          id: string
          permission_note: string | null
          type: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          file_url?: string | null
          id?: string
          permission_note?: string | null
          type?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          file_url?: string | null
          id?: string
          permission_note?: string | null
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
      voice_lines: {
        Row: {
          branch: string | null
          created_at: string | null
          id: string
          text: string
          type: string | null
        }
        Insert: {
          branch?: string | null
          created_at?: string | null
          id?: string
          text: string
          type?: string | null
        }
        Update: {
          branch?: string | null
          created_at?: string | null
          id?: string
          text?: string
          type?: string | null
        }
        Relationships: []
      }
      weekly_notes: {
        Row: {
          created_at: string | null
          id: string
          note: string | null
          type: string | null
          week_start: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          note?: string | null
          type?: string | null
          week_start?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          note?: string | null
          type?: string | null
          week_start?: string | null
        }
        Relationships: []
      }
      weekly_plans: {
        Row: {
          biggest_risk: string | null
          branch_focus: string | null
          created_at: string | null
          id: string
          success_this_week: string | null
          top_projects: string | null
          updated_at: string | null
          waiting_on: string | null
          week_start_date: string | null
          weekly_focus: string | null
        }
        Insert: {
          biggest_risk?: string | null
          branch_focus?: string | null
          created_at?: string | null
          id?: string
          success_this_week?: string | null
          top_projects?: string | null
          updated_at?: string | null
          waiting_on?: string | null
          week_start_date?: string | null
          weekly_focus?: string | null
        }
        Update: {
          biggest_risk?: string | null
          branch_focus?: string | null
          created_at?: string | null
          id?: string
          success_this_week?: string | null
          top_projects?: string | null
          updated_at?: string | null
          waiting_on?: string | null
          week_start_date?: string | null
          weekly_focus?: string | null
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
