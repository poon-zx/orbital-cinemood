import { createClient } from "@supabase/supabase-js";

let supabase = null;

export const getSupabaseInstance = () => {
  if (!supabase) {
    supabase = createClient(
      "https://ccecaffoxnxnahwfcpcy.supabase.co",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjZWNhZmZveG54bmFod2ZjcGN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODQ1NjY1MTAsImV4cCI6MjAwMDE0MjUxMH0.-W7IPp668Pp4uT5ZwzAawRU7fJYj20_6MXGOm06VDgA"
    );
  }

  return supabase;
};
