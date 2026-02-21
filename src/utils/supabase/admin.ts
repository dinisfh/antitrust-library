import { createClient } from '@supabase/supabase-js'

// Cria um cliente com privilégios de administrador (bypassa RLS)
// IMPORTANTE: Este ficheiro NUNCA deve ser importado em Client Components, apenas em Server Actions ou API Routes.
export function createAdminClient() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        }
    )
}
