'use server'

import { createAdminClient } from '@/utils/supabase/admin'
import { revalidatePath } from 'next/cache'
import Papa from 'papaparse'

// Ajudante para definir a password (utiliza a definida ou a universal)
function getGlobalPassword(provided?: string) {
    return provided && provided.trim().length >= 6 ? provided.trim() : 'megie2025'
}

export async function addUserManually(formData: FormData) {
    const email = formData.get('email') as string
    const role = formData.get('role') as string
    const inputPassword = formData.get('password') as string

    if (!email || !role) return; // Silent return

    const supabase = createAdminClient()
    const passwordToUse = getGlobalPassword(inputPassword)

    console.log(`Creating user ${email} with password: ${passwordToUse}`)

    // 1. Criar o utilizador no lado da Autenticação do Supabase
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: email,
        password: passwordToUse,
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
    const parsed = Papa.parse<{ email: string; role: string; password?: string }>(text, {
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
        const passwordToUse = getGlobalPassword(row.password)

        try {
            const { data: authData, error: authErr } = await supabase.auth.admin.createUser({
                email: row.email,
                password: passwordToUse,
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

export async function addCaseManually(formData: FormData) {
    const title = formData.get('title') as string
    const summary = formData.get('summary') as string
    const authority = formData.get('authority') as string
    const status = formData.get('status') as string
    const rawIndustry = formData.get('industry') as string
    const rawSources = formData.get('sources') as string

    if (!title || !authority) return; // Silent return

    const supabase = createAdminClient()
    const industryValue = rawIndustry ? rawIndustry.trim() : 'Genérico'

    let parsedLinks: string[] = []
    if (rawSources) {
        parsedLinks = rawSources
            .split('\n')
            .map(s => s.trim())
            .filter(s => s.startsWith('http'))
    }

    const { error: dbError } = await supabase.from('Cases').insert({
        title,
        summary,
        authority,
        status,
        industry: industryValue,
        tags: ['Submissão Manual'],
        parties_involved: [],
        decision_date: null,
        links: parsedLinks,
        fine_amount: null
    })

    if (dbError) {
        console.error('Error inserting case manual data:', dbError)
        return;
    }

    revalidatePath('/')
    revalidatePath('/admin')
}

export async function approveUser(formData: FormData) {
    const userId = formData.get('userId') as string
    if (!userId) return

    const admin = createAdminClient()
    await admin.from('Users').update({ status: 'Active' }).eq('id', userId)

    revalidatePath('/admin')
}

export async function rejectUser(formData: FormData) {
    const userId = formData.get('userId') as string
    if (!userId) return

    const admin = createAdminClient()
    await admin.from('Users').delete().eq('id', userId)
    await admin.auth.admin.deleteUser(userId)

    revalidatePath('/admin')
}

export async function updateUserRole(formData: FormData) {
    const userId = formData.get('userId') as string
    const role = formData.get('role') as string

    if (!userId || !role) return

    const admin = createAdminClient()
    await admin.from('Users').update({ role }).eq('id', userId)

    revalidatePath('/admin')
}

export async function deleteActiveUser(formData: FormData) {
    const userId = formData.get('userId') as string
    if (!userId) return

    const admin = createAdminClient()
    await admin.from('Users').delete().eq('id', userId)
    await admin.auth.admin.deleteUser(userId)

    revalidatePath('/admin')
}

export async function deleteCaseAction(formData: FormData) {
    const caseId = formData.get('caseId') as string
    if (!caseId) return

    const admin = createAdminClient()
    await admin.from('Cases').delete().eq('id', caseId)

    revalidatePath('/')
    revalidatePath('/admin')
}

export async function editCaseAction(formData: FormData) {
    const caseId = formData.get('caseId') as string
    if (!caseId) return;

    const title = formData.get('title') as string
    const summary = formData.get('summary') as string
    const authority = formData.get('authority') as string
    const status = formData.get('status') as string
    const rawIndustry = formData.get('industry') as string
    const rawSources = formData.get('sources') as string
    const geography = formData.get('geography') as string
    const decision_date = formData.get('decision_date') as string
    const start_date = formData.get('start_date') as string
    const fine_amount = formData.get('fine_amount') as string
    const rawTags = formData.get('tags') as string

    const supabase = createAdminClient()
    const industryValue = rawIndustry ? rawIndustry.trim() : 'Genérico'

    let parsedLinks: string[] = []
    if (rawSources) {
        parsedLinks = rawSources
            .split('\n')
            .map(s => s.trim())
            .filter(s => s.startsWith('http'))
    }

    let parsedTags: string[] = []
    if (rawTags) {
        parsedTags = rawTags.split(',').map(t => t.trim()).filter(Boolean)
    }

    const { error: dbError } = await supabase.from('Cases').update({
        title,
        summary,
        authority,
        status,
        industry: industryValue,
        tags: parsedTags,
        decision_date: decision_date || null,
        start_date: start_date || null,
        links: parsedLinks,
        fine_amount: fine_amount || null,
        geography: geography || null
    }).eq('id', caseId)

    if (dbError) {
        console.error('Error updating case data:', dbError)
        return;
    }

    revalidatePath('/')
    revalidatePath('/admin')
}

export async function toggleFavoriteCase(formData: FormData) {
    const caseId = formData.get('caseId') as string
    const currentStatus = formData.get('currentStatus') === 'true'

    if (!caseId) return;

    const admin = createAdminClient()
    const { error: dbError } = await admin.from('Cases').update({
        is_favorite: !currentStatus
    }).eq('id', caseId)

    if (dbError) {
        console.error('Error toggling case favorite status:', dbError)
        return;
    }

    revalidatePath('/')
    revalidatePath('/admin')
}

