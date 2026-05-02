import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://mbskqlaivgoubyflogpp.supabase.co";
const supabaseKey = "sb_publishable_4dE4GBBzb3_THEYccig34w_0Z1q2N58";

export const supabase = createClient(supabaseUrl, supabaseKey);