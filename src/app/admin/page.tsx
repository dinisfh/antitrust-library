import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { redirect } from 'next/navigation'
import AdminUI from './AdminUI'

// Função auxiliar para re-buscar dados
async function getUsers() {
    const supabase = createAdminClient()
    const { data, error } = await supabase
        .from('Users')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching users:', error)
        return []
    }

    const { data: authData, error: authError } = await supabase.auth.admin.listUsers()
    if (authError) {
        console.error('Error fetching auth users:', authError)
    }

    const authMap = new Map()
    if (authData && authData.users) {
        authData.users.forEach(u => {
            authMap.set(u.id, u.last_sign_in_at)
        })
    }

    return (data || []).map(u => ({
        ...u,
        last_sign_in_at: authMap.get(u.id) || null
    }))
}

async function getCasesForAdmin() {
    const supabase = createAdminClient()
    const { data, error } = await supabase
        .from('Cases')
        .select('id, title, authority, status, created_at, is_favorite')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching cases for admin:', error)
        return []
    }
    return data || []
}

export default async function AdminPage() {
    const supabase = await createClient()

    // 1. Obter o utilizador atual (garantido de existir pelo middleware)
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // 2. Verificar se o utilizador é realmente 'Admin' na tabela `Users`
    const { data: currentUserData } = await supabase
        .from('Users')
        .select('role')
        .eq('id', user.id)
        .single()

    if (!currentUserData || currentUserData.role !== 'Admin') {
        redirect('/') // Bloqueado, não é Admin
    }

    const usersList = await getUsers()
    const activeUsers = usersList.filter((u: any) => u.status === 'Active')
    const pendingUsers = usersList.filter((u: any) => u.status === 'Pending')

    const casesList = await getCasesForAdmin()

    return (
        <AdminUI activeUsers={activeUsers} pendingUsers={pendingUsers} casesList={casesList} />
    )
}
