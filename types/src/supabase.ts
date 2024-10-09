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
      churnpredictions: {
        Row: {
          churn_date: string | null
          churn_probability: number
          client_id: number
        }
        Insert: {
          churn_date?: string | null
          churn_probability: number
          client_id: number
        }
        Update: {
          churn_date?: string | null
          churn_probability?: number
          client_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "churnpredictions_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["client_id"]
          },
        ]
      }
      clients: {
        Row: {
          address: string | null
          client_id: number
          client_name: string
          company_id: number
          contact_person: string | null
          email: string | null
          industry: string | null
          last_invoice_date: string | null
          last_payment_date: string | null
          notes: string | null
          payment_history: Json | null
          phone: string | null
          vat_number: string | null
        }
        Insert: {
          address?: string | null
          client_id?: number
          client_name: string
          company_id: number
          contact_person?: string | null
          email?: string | null
          industry?: string | null
          last_invoice_date?: string | null
          last_payment_date?: string | null
          notes?: string | null
          payment_history?: Json | null
          phone?: string | null
          vat_number?: string | null
        }
        Update: {
          address?: string | null
          client_id?: number
          client_name?: string
          company_id?: number
          contact_person?: string | null
          email?: string | null
          industry?: string | null
          last_invoice_date?: string | null
          last_payment_date?: string | null
          notes?: string | null
          payment_history?: Json | null
          phone?: string | null
          vat_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clients_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["company_id"]
          },
        ]
      }
      clientsegments: {
        Row: {
          client_id: number
          segment_name: string
        }
        Insert: {
          client_id: number
          segment_name: string
        }
        Update: {
          client_id?: number
          segment_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "clientsegments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["client_id"]
          },
        ]
      }
      companies: {
        Row: {
          address: string | null
          company_id: number
          company_name: string
          created_at: string | null
          created_by_id: string | null
          email: string | null
          logo: string | null
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          company_id?: number
          company_name: string
          created_at?: string | null
          created_by_id?: string | null
          email?: string | null
          logo?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          company_id?: number
          company_name?: string
          created_at?: string | null
          created_by_id?: string | null
          email?: string | null
          logo?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "companies_created_by_id_fkey"
            columns: ["created_by_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      invoicehistory: {
        Row: {
          event_timestamp: string | null
          event_type: string
          history_id: number
          invoice_id: number
          user_id: string | null
        }
        Insert: {
          event_timestamp?: string | null
          event_type: string
          history_id?: number
          invoice_id: number
          user_id?: string | null
        }
        Update: {
          event_timestamp?: string | null
          event_type?: string
          history_id?: number
          invoice_id?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoicehistory_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["invoice_id"]
          },
          {
            foreignKeyName: "invoicehistory_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      invoiceinsights: {
        Row: {
          insight_type: string
          insight_value: string | null
          invoice_id: number
        }
        Insert: {
          insight_type: string
          insight_value?: string | null
          invoice_id: number
        }
        Update: {
          insight_type?: string
          insight_value?: string | null
          invoice_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoiceinsights_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["invoice_id"]
          },
        ]
      }
      invoiceitems: {
        Row: {
          description: string
          invoice_id: number
          item_id: number
          price: number
          quantity: number
          tax_rate: number | null
        }
        Insert: {
          description: string
          invoice_id: number
          item_id?: number
          price: number
          quantity: number
          tax_rate?: number | null
        }
        Update: {
          description?: string
          invoice_id?: number
          item_id?: number
          price?: number
          quantity?: number
          tax_rate?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "invoiceitems_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["invoice_id"]
          },
        ]
      }
      invoices: {
        Row: {
          client_id: number
          company_id: number
          created_at: string | null
          created_by_id: string | null
          currency: string
          discount_percentage: number | null
          due_date: string | null
          invoice_date: string
          invoice_id: number
          invoice_number: string
          notes: string | null
          payment_terms: string | null
          status: string
          template_id: number | null
          total_amount: number | null
          total_paid: number | null
          updated_at: string | null
        }
        Insert: {
          client_id: number
          company_id: number
          created_at?: string | null
          created_by_id?: string | null
          currency?: string
          discount_percentage?: number | null
          due_date?: string | null
          invoice_date: string
          invoice_id?: number
          invoice_number: string
          notes?: string | null
          payment_terms?: string | null
          status?: string
          template_id?: number | null
          total_amount?: number | null
          total_paid?: number | null
          updated_at?: string | null
        }
        Update: {
          client_id?: number
          company_id?: number
          created_at?: string | null
          created_by_id?: string | null
          currency?: string
          discount_percentage?: number | null
          due_date?: string | null
          invoice_date?: string
          invoice_id?: number
          invoice_number?: string
          notes?: string | null
          payment_terms?: string | null
          status?: string
          template_id?: number | null
          total_amount?: number | null
          total_paid?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "invoices_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "invoices_created_by_id_fkey"
            columns: ["created_by_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "invoicetemplates"
            referencedColumns: ["template_id"]
          },
        ]
      }
      invoicetemplates: {
        Row: {
          company_id: number
          name: string
          template_content: string | null
          template_id: number
        }
        Insert: {
          company_id: number
          name: string
          template_content?: string | null
          template_id?: number
        }
        Update: {
          company_id?: number
          name?: string
          template_content?: string | null
          template_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoicetemplates_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["company_id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          invoice_id: number
          payment_date: string
          payment_id: number
          payment_method: string | null
          reference: string | null
        }
        Insert: {
          amount: number
          invoice_id: number
          payment_date: string
          payment_id?: number
          payment_method?: string | null
          reference?: string | null
        }
        Update: {
          amount?: number
          invoice_id?: number
          payment_date?: string
          payment_id?: number
          payment_method?: string | null
          reference?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["invoice_id"]
          },
        ]
      }
      taxrates: {
        Row: {
          name: string
          rate: number
          tax_id: number
        }
        Insert: {
          name: string
          rate: number
          tax_id?: number
        }
        Update: {
          name?: string
          rate?: number
          tax_id?: number
        }
        Relationships: []
      }
      userpreferences: {
        Row: {
          currency: string
          default_template: number | null
          payment_terms: string | null
          user_id: string
        }
        Insert: {
          currency?: string
          default_template?: number | null
          payment_terms?: string | null
          user_id: string
        }
        Update: {
          currency?: string
          default_template?: number | null
          payment_terms?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "userpreferences_default_template_fkey"
            columns: ["default_template"]
            isOneToOne: false
            referencedRelation: "invoicetemplates"
            referencedColumns: ["template_id"]
          },
          {
            foreignKeyName: "userpreferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
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
