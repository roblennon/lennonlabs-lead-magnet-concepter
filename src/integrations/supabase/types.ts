export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      agent_settings: {
        Row: {
          agent_name: string
          base_prompt: string
          chat_model: string
          created_at: string | null
          id: string
          temperature: number
          updated_at: string | null
          voice_id: string
          voice_model: string
        }
        Insert: {
          agent_name?: string
          base_prompt?: string
          chat_model?: string
          created_at?: string | null
          id?: string
          temperature?: number
          updated_at?: string | null
          voice_id?: string
          voice_model?: string
        }
        Update: {
          agent_name?: string
          base_prompt?: string
          chat_model?: string
          created_at?: string | null
          id?: string
          temperature?: number
          updated_at?: string | null
          voice_id?: string
          voice_model?: string
        }
        Relationships: []
      }
      ai_configs: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          model: string
          name: string
          prompt: string
          temperature: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          model?: string
          name: string
          prompt: string
          temperature?: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          model?: string
          name?: string
          prompt?: string
          temperature?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      content_angles: {
        Row: {
          created_at: string | null
          description: string
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      content_types: {
        Row: {
          created_at: string | null
          description: string
          id: string
          is_active: boolean | null
          name: string
          structure: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          is_active?: boolean | null
          name: string
          structure: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          is_active?: boolean | null
          name?: string
          structure?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      form_configs: {
        Row: {
          button_config: Json
          created_at: string | null
          description: string
          fields: Json
          id: string
          is_active: boolean | null
          prompt_id: string | null
          slug: string
          title: string
          updated_at: string | null
        }
        Insert: {
          button_config: Json
          created_at?: string | null
          description: string
          fields: Json
          id?: string
          is_active?: boolean | null
          prompt_id?: string | null
          slug: string
          title: string
          updated_at?: string | null
        }
        Update: {
          button_config?: Json
          created_at?: string | null
          description?: string
          fields?: Json
          id?: string
          is_active?: boolean | null
          prompt_id?: string | null
          slug?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "form_configs_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "prompts"
            referencedColumns: ["id"]
          },
        ]
      }
      heartbeat_config: {
        Row: {
          api_key: string
          base_url: string
          created_at: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          api_key: string
          base_url?: string
          created_at?: string | null
          id?: string
          updated_at?: string | null
        }
        Update: {
          api_key?: string
          base_url?: string
          created_at?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      invoice_requests: {
        Row: {
          business_address: string | null
          business_name: string | null
          completed_at: string | null
          created_at: string | null
          email: string
          format: string
          id: string
          metadata: Json | null
          status: string
          vat_number: string | null
          verification_token: string
          verified_at: string | null
        }
        Insert: {
          business_address?: string | null
          business_name?: string | null
          completed_at?: string | null
          created_at?: string | null
          email: string
          format: string
          id?: string
          metadata?: Json | null
          status?: string
          vat_number?: string | null
          verification_token: string
          verified_at?: string | null
        }
        Update: {
          business_address?: string | null
          business_name?: string | null
          completed_at?: string | null
          created_at?: string | null
          email?: string
          format?: string
          id?: string
          metadata?: Json | null
          status?: string
          vat_number?: string | null
          verification_token?: string
          verified_at?: string | null
        }
        Relationships: []
      }
      knowledge_base: {
        Row: {
          content: string
          created_at: string | null
          embedding: string | null
          id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          embedding?: string | null
          id?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          embedding?: string | null
          id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      monitored_posts: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          lead_magnet_url: string
          platform: string
          post_url: string
          trigger_word: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          lead_magnet_url: string
          platform: string
          post_url: string
          trigger_word?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          lead_magnet_url?: string
          platform?: string
          post_url?: string
          trigger_word?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      page_configs: {
        Row: {
          convertkit_fields: Json | null
          convertkit_form_id: string | null
          created_at: string | null
          cta_body: string
          cta_button_text: string
          cta_heading: string
          cta_text: string | null
          cta_url: string | null
          deliverable_empty_state: string | null
          form_fields: Json | null
          header_image_url: string
          id: string
          page_slug: string
          sales_benefits: Json
          sales_closing: string
          sales_heading: string
          sales_image_url: string
          sales_intro: string
          subtitle: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          convertkit_fields?: Json | null
          convertkit_form_id?: string | null
          created_at?: string | null
          cta_body: string
          cta_button_text: string
          cta_heading: string
          cta_text?: string | null
          cta_url?: string | null
          deliverable_empty_state?: string | null
          form_fields?: Json | null
          header_image_url: string
          id?: string
          page_slug: string
          sales_benefits: Json
          sales_closing: string
          sales_heading: string
          sales_image_url: string
          sales_intro: string
          subtitle?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          convertkit_fields?: Json | null
          convertkit_form_id?: string | null
          created_at?: string | null
          cta_body?: string
          cta_button_text?: string
          cta_heading?: string
          cta_text?: string | null
          cta_url?: string | null
          deliverable_empty_state?: string | null
          form_fields?: Json | null
          header_image_url?: string
          id?: string
          page_slug?: string
          sales_benefits?: Json
          sales_closing?: string
          sales_heading?: string
          sales_image_url?: string
          sales_intro?: string
          subtitle?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      platform_connections: {
        Row: {
          access_token: string
          created_at: string | null
          expires_at: string | null
          id: string
          is_connected: boolean | null
          message_count: number | null
          platform: string
          refresh_token: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          access_token: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_connected?: boolean | null
          message_count?: number | null
          platform: string
          refresh_token?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          access_token?: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_connected?: boolean | null
          message_count?: number | null
          platform?: string
          refresh_token?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      playground_settings: {
        Row: {
          created_at: string | null
          default_max_tokens: number
          default_model: string
          default_system_prompt: string | null
          default_temperature: number
          id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          default_max_tokens?: number
          default_model?: string
          default_system_prompt?: string | null
          default_temperature?: number
          id?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          default_max_tokens?: number
          default_model?: string
          default_system_prompt?: string | null
          default_temperature?: number
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          id: string
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      prompts: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
        }
        Relationships: []
      }
      revenue_analyses: {
        Row: {
          analysis: string | null
          created_at: string | null
          email: string
          help_requests: string
          id: string
          offer: string
          prompt_id: string | null
          revenue_source: string
          successful_model: string | null
        }
        Insert: {
          analysis?: string | null
          created_at?: string | null
          email: string
          help_requests: string
          id?: string
          offer: string
          prompt_id?: string | null
          revenue_source: string
          successful_model?: string | null
        }
        Update: {
          analysis?: string | null
          created_at?: string | null
          email?: string
          help_requests?: string
          id?: string
          offer?: string
          prompt_id?: string | null
          revenue_source?: string
          successful_model?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "revenue_analyses_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "prompts"
            referencedColumns: ["id"]
          },
        ]
      }
      stripe_charges: {
        Row: {
          amount: number
          billing_details: Json | null
          created_at: string | null
          currency: string
          customer_email: string | null
          id: string
          metadata: Json | null
          payment_intent_id: string | null
          payment_method_details: Json | null
          status: string
          stripe_account_id: string
          stripe_created_at: number
          stripe_id: string
        }
        Insert: {
          amount: number
          billing_details?: Json | null
          created_at?: string | null
          currency: string
          customer_email?: string | null
          id?: string
          metadata?: Json | null
          payment_intent_id?: string | null
          payment_method_details?: Json | null
          status: string
          stripe_account_id: string
          stripe_created_at: number
          stripe_id: string
        }
        Update: {
          amount?: number
          billing_details?: Json | null
          created_at?: string | null
          currency?: string
          customer_email?: string | null
          id?: string
          metadata?: Json | null
          payment_intent_id?: string | null
          payment_method_details?: Json | null
          status?: string
          stripe_account_id?: string
          stripe_created_at?: number
          stripe_id?: string
        }
        Relationships: []
      }
      variable_settings: {
        Row: {
          audience: string | null
          created_at: string | null
          id: string
          style: string | null
          updated_at: string | null
        }
        Insert: {
          audience?: string | null
          created_at?: string | null
          id?: string
          style?: string | null
          updated_at?: string | null
        }
        Update: {
          audience?: string | null
          created_at?: string | null
          id?: string
          style?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      workflow_variables: {
        Row: {
          audience: string | null
          created_at: string | null
          id: string
          style: string | null
          updated_at: string | null
          workflow_id: string
        }
        Insert: {
          audience?: string | null
          created_at?: string | null
          id?: string
          style?: string | null
          updated_at?: string | null
          workflow_id: string
        }
        Update: {
          audience?: string | null
          created_at?: string | null
          id?: string
          style?: string | null
          updated_at?: string | null
          workflow_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workflow_variables_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "workflows"
            referencedColumns: ["id"]
          },
        ]
      }
      workflows: {
        Row: {
          created_at: string | null
          description: string | null
          edges: Json
          id: string
          is_active: boolean | null
          name: string
          nodes: Json
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          edges: Json
          id?: string
          is_active?: boolean | null
          name: string
          nodes: Json
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          edges?: Json
          id?: string
          is_active?: boolean | null
          name?: string
          nodes?: Json
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      binary_quantize:
        | {
            Args: {
              "": string
            }
            Returns: unknown
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
      get_secret: {
        Args: {
          name: string
        }
        Returns: string
      }
      halfvec_avg: {
        Args: {
          "": number[]
        }
        Returns: unknown
      }
      halfvec_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      halfvec_send: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
      }
      hnsw_bit_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      hnswhandler: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ivfflat_bit_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ivfflathandler: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      l2_norm:
        | {
            Args: {
              "": unknown
            }
            Returns: number
          }
        | {
            Args: {
              "": unknown
            }
            Returns: number
          }
      l2_normalize:
        | {
            Args: {
              "": string
            }
            Returns: string
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
      sparsevec_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      sparsevec_send: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
      }
      vector_avg: {
        Args: {
          "": number[]
        }
        Returns: string
      }
      vector_dims:
        | {
            Args: {
              "": string
            }
            Returns: number
          }
        | {
            Args: {
              "": unknown
            }
            Returns: number
          }
      vector_norm: {
        Args: {
          "": string
        }
        Returns: number
      }
      vector_out: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      vector_send: {
        Args: {
          "": string
        }
        Returns: string
      }
      vector_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
