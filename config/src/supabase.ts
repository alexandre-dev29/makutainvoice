import { createClient } from '@supabase/supabase-js';
import { Database } from '@makutainv/types';

const supabaseUrl = 'https://knijpzahrmaddkazjrjm.supabase.co';

// @ts-ignore
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
export const supabase = createClient<Database>(supabaseUrl, supabaseKey);
