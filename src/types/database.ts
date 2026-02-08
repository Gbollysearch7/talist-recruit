export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          company: string | null;
          role: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          company?: string | null;
          role?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          company?: string | null;
          role?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      searches: {
        Row: {
          id: string;
          user_id: string;
          query: string;
          filters: Json | null;
          results_count: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          query: string;
          filters?: Json | null;
          results_count?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          query?: string;
          filters?: Json | null;
          results_count?: number | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "searches_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      candidates: {
        Row: {
          id: string;
          user_id: string;
          exa_id: string;
          name: string;
          title: string | null;
          company: string | null;
          location: string | null;
          linkedin_url: string | null;
          email: string | null;
          phone: string | null;
          skills: string[];
          experience_years: number | null;
          summary: string | null;
          source: string | null;
          raw_data: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          exa_id: string;
          name: string;
          title?: string | null;
          company?: string | null;
          location?: string | null;
          linkedin_url?: string | null;
          email?: string | null;
          phone?: string | null;
          skills?: string[];
          experience_years?: number | null;
          summary?: string | null;
          source?: string | null;
          raw_data?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          exa_id?: string;
          name?: string;
          title?: string | null;
          company?: string | null;
          location?: string | null;
          linkedin_url?: string | null;
          email?: string | null;
          phone?: string | null;
          skills?: string[];
          experience_years?: number | null;
          summary?: string | null;
          source?: string | null;
          raw_data?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "candidates_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      pipeline_stages: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          position: number;
          color: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          position: number;
          color?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          position?: number;
          color?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "pipeline_stages_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      pipeline_candidates: {
        Row: {
          id: string;
          candidate_id: string;
          stage_id: string;
          user_id: string;
          notes: string | null;
          moved_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          candidate_id: string;
          stage_id: string;
          user_id: string;
          notes?: string | null;
          moved_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          candidate_id?: string;
          stage_id?: string;
          user_id?: string;
          notes?: string | null;
          moved_at?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "pipeline_candidates_candidate_id_fkey";
            columns: ["candidate_id"];
            isOneToOne: false;
            referencedRelation: "candidates";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "pipeline_candidates_stage_id_fkey";
            columns: ["stage_id"];
            isOneToOne: false;
            referencedRelation: "pipeline_stages";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "pipeline_candidates_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      saved_searches: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          query: string;
          filters: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          query: string;
          filters?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          query?: string;
          filters?: Json | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "saved_searches_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      exports: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          filters: Json | null;
          file_url: string | null;
          row_count: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: string;
          filters?: Json | null;
          file_url?: string | null;
          row_count?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: string;
          filters?: Json | null;
          file_url?: string | null;
          row_count?: number | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "exports_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

// ─── Convenience type helpers ───────────────────────────────────────────────

type PublicTables = Database["public"]["Tables"];

/** Extract the Row type for a given table name */
export type Tables<T extends keyof PublicTables> = PublicTables[T]["Row"];

/** Extract the Insert type for a given table name */
export type TablesInsert<T extends keyof PublicTables> =
  PublicTables[T]["Insert"];

/** Extract the Update type for a given table name */
export type TablesUpdate<T extends keyof PublicTables> =
  PublicTables[T]["Update"];

// ─── Named row aliases for ergonomic imports ────────────────────────────────

export type Profile = Tables<"profiles">;
export type Search = Tables<"searches">;
export type Candidate = Tables<"candidates">;
export type PipelineStage = Tables<"pipeline_stages">;
export type PipelineCandidate = Tables<"pipeline_candidates">;
export type SavedSearch = Tables<"saved_searches">;
export type Export = Tables<"exports">;
