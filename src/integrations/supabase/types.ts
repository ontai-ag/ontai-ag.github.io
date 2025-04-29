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
      ai_agents: {
        Row: {
          api_endpoint: string | null
          avg_rating: number | null
          category: string
          created_at: string
          description: string
          hourly_rate: number | null
          id: string
          input_format: string
          name: string
          output_format: string
          pricing_model: string
          status: string
          total_reviews: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          api_endpoint?: string | null
          avg_rating?: number | null
          category: string
          created_at?: string
          description: string
          hourly_rate?: number | null
          id?: string
          input_format: string
          name: string
          output_format: string
          pricing_model: string
          status?: string
          total_reviews?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          api_endpoint?: string | null
          avg_rating?: number | null
          category?: string
          created_at?: string
          description?: string
          hourly_rate?: number | null
          id?: string
          input_format?: string
          name?: string
          output_format?: string
          pricing_model?: string
          status?: string
          total_reviews?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      payment_logs: {
        Row: {
          amount: number
          id: string
          payment_id: string
          status: string
          task_id: string | null
          transaction_time: string
          user_id: string | null
          verified_at: string | null
        }
        Insert: {
          amount: number
          id?: string
          payment_id: string
          status: string
          task_id?: string | null
          transaction_time?: string
          user_id?: string | null
          verified_at?: string | null
        }
        Update: {
          amount?: number
          id?: string
          payment_id?: string
          status?: string
          task_id?: string | null
          transaction_time?: string
          user_id?: string | null
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_logs_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          role: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          role?: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      task_reviews: {
        Row: {
          agent_id: string
          created_at: string
          id: string
          rating: number
          review_text: string | null
          task_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          agent_id: string
          created_at?: string
          id?: string
          rating: number
          review_text?: string | null
          task_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          agent_id?: string
          created_at?: string
          id?: string
          rating?: number
          review_text?: string | null
          task_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_reviews_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "ai_agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_reviews_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: true
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      task_revisions: {
        Row: {
          created_at: string
          feedback: string | null
          id: string
          result: string
          task_id: string
        }
        Insert: {
          created_at?: string
          feedback?: string | null
          id?: string
          result: string
          task_id: string
        }
        Update: {
          created_at?: string
          feedback?: string | null
          id?: string
          result?: string
          task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_revisions_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          additional_info: string | null
          agent_id: string
          attachment_url: string | null
          created_at: string
          feedback: string | null
          id: string
          max_revisions: number
          notification_channel: string
          output_format: string
          payment_status: string
          price: number
          prompt: string
          result: string | null
          revision_count: number
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          additional_info?: string | null
          agent_id: string
          attachment_url?: string | null
          created_at?: string
          feedback?: string | null
          id?: string
          max_revisions?: number
          notification_channel?: string
          output_format?: string
          payment_status?: string
          price?: number
          prompt: string
          result?: string | null
          revision_count?: number
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          additional_info?: string | null
          agent_id?: string
          attachment_url?: string | null
          created_at?: string
          feedback?: string | null
          id?: string
          max_revisions?: number
          notification_channel?: string
          output_format?: string
          payment_status?: string
          price?: number
          prompt?: string
          result?: string | null
          revision_count?: number
          status?: string
          updated_at?: string
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
