import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_WAREHOUSE_URL;
const supabaseKey = import.meta.env.VITE_WAREHOUSE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function WarehousePush(event_name, user, data) {
  const { error } = await supabase
    .from("event_track")
    .insert({ event_name: event_name, user: user, data: data });
  if (error != null) console.log(error.message);
}
