'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'

export async function login(formData: FormData) {
    const supabase = await createClient()

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { error } = await supabase.auth.signInWithPassword(data)

    if (error) {
        redirect('/login?error=Invalid%20credentials')
    }

    revalidatePath('/', 'layout')
    redirect('/')
}

export async function requestAccess(formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password || password.length < 6) {
        redirect('/login?error=Invalid%20Data')
    }

    // Usamos admin para saltar o Email Confirmation Requirement e criar logo Active no Auth (mas Pending no nosso lado app)
    const adminSupabase = createAdminClient()
    const { data: authData, error: authError } = await adminSupabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true
    })

    if (authError || !authData.user) {
        redirect('/login?error=Email%20already%20exists')
    }

    // Registar o User com status 'Pending'
    const { error: dbError } = await adminSupabase.from('Users').insert({
        id: authData.user.id,
        email: authData.user.email,
        role: 'Reader',
        status: 'Pending'
    })

    if (dbError) {
        console.error('[AUTH DEBUG] DB Insert Error for Users table:', dbError)
        redirect('/login?error=Database%20Error')
    }

    // Auto Login automático para ir logo parar ao ecrã Pending
    const supabaseClient = await createClient()
    await supabaseClient.auth.signInWithPassword({ email, password })

    revalidatePath('/', 'layout')
    redirect('/pending')
}
