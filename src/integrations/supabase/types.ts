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
