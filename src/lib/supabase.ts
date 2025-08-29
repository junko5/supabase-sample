import { createClient } from "@supabase/supabase-js";

// ★ Supabaseクライアント作成 - .env.localから接続情報を読み込み
export const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL, 
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
);

