import { createClient } from "@supabase/supabase-js";

const config = {
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  SUPABASE_KEY: import.meta.env.VITE_SUPABASE_KEY,
};

const supabase = createClient(config.SUPABASE_URL, config.SUPABASE_KEY);

export default supabase;
