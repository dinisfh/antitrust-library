'use server'

import { createAdminClient } from '@/utils/supabase/admin'
import { revalidatePath } from 'next/cache'
import Papa from 'papaparse'

// Ajudante para gerar password temporária
function generateTempPassword() {
    return Math.random().toString(36).slice(-8) + 'A1!'
}

export async function addUserManually(formData: FormData) {
    const email = formData.get('email') as string
    const role = formData.get('role') as string

    if (!email || !role) return; // Silent return

    const supabase = createAdminClient()
    const tempPassword = generateTempPassword()

    console.log(`Creating user ${email} with temporary password: ${tempPassword}`)

    // 1. Criar o utilizador no lado da Autenticação do Supabase
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: email,
        password: tempPassword,
        email_confirm: true, // Já confirmado, assim o utilizador pode fazer login direto
    })

    if (authError || !authData.user) {
        console.error('Error creating user auth:', authError)
        return;
    }

    // 2. Inserir na tabela custom `Users`
    const { error: dbError } = await supabase.from('Users').insert({
        id: authData.user.id,
        email: authData.user.email,
        role: role,
        status: 'Active',
    })

    if (dbError) {
        console.error('Error inserting user data:', dbError)
        return;
    }

    revalidatePath('/admin')
}

export async function importUsersCSV(formData: FormData) {
    const file = formData.get('csv_file') as File
    if (!file) return;

    const text = await file.text()

    // Fazer parser usando PapaParse
    const parsed = Papa.parse<{ email: string; role: string }>(text, {
        header: true,
        skipEmptyLines: true,
    })

    if (parsed.errors.length > 0) {
        console.error('O ficheiro CSV tem um formato inválido ou erros.')
        return;
    }

    const supabase = createAdminClient()

    for (const row of parsed.data) {
        if (!row.email) continue
        const role = (row.role === 'Admin' || row.role === 'Reader') ? row.role : 'Reader'

        try {
            const { data: authData, error: authErr } = await supabase.auth.admin.createUser({
                email: row.email,
                password: generateTempPassword(),
                email_confirm: true,
            })

            if (authErr || !authData.user) {
                continue
            }

            await supabase.from('Users').insert({
                id: authData.user.id,
                email: authData.user.email,
                role: role,
                status: 'Active',
            })
        } catch (e) {
            console.error(e)
        }
    }

    revalidatePath('/admin')
}
