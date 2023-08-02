export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      messages: {
        Row: {
          author_id: string
          avatar: string
          content: string
          created_at: string | null
          id: number
          room_id: number
          username: string
        }
        Insert: {
          author_id: string
          avatar: string
          content: string
          created_at?: string | null
          id?: number
          room_id: number
          username: string
        }
        Update: {
          author_id?: string
          avatar?: string
          content?: string
          created_at?: string | null
          id?: number
          room_id?: number
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_author_id_fkey"
            columns: ["author_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_room_id_fkey"
            columns: ["room_id"]
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          }
        ]
      }
      rooms: {
        Row: {
          author_id: string
          created_at: string | null
          description: string | null
          id: number
          name: string | null
        }
        Insert: {
          author_id: string
          created_at?: string | null
          description?: string | null
          id?: number
          name?: string | null
        }
        Update: {
          author_id?: string
          created_at?: string | null
          description?: string | null
          id?: number
          name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rooms_author_id_fkey"
            columns: ["author_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
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
