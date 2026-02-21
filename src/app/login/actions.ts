'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
    const supabase = await createClient()

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { error } = await supabase.auth.signInWithPassword(data)

    if (error) {
        // Para simplificar, num ambiente real podes repassar os erros para o componente cliente via useFormState
        redirect('/login?error=Invalid%20credentials')
    }

    revalidatePath('/', 'layout')
    redirect('/')
}
