import { createClient } from "@supabase/supabase-js";

let supabase = null;

export const getSupabaseInstance = () => {
  if (!supabase) {
    supabase = createClient(
      process.env.REACT_APP_SUPABASE_URL,
      process.env.REACT_APP_SUPABASE_KEY
    );
  }

  return supabase;
};
