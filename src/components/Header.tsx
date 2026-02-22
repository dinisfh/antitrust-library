import { createClient } from '@/utils/supabase/server'
import HeaderUI from './HeaderUI'

export default async function Header() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    let isAdmin = false
    let userInitial = '?'
    let userEmail = 'Visitor'

    if (user) {
        userEmail = user.email || 'Visitor'
        userInitial = userEmail.charAt(0).toUpperCase()

        const { data: profile } = await supabase
            .from('Users')
            .select('role')
            .eq('id', user.id)
            .single()

        if (profile?.role === 'Admin') {
            isAdmin = true
        }
    }

    return <HeaderUI isAdmin={isAdmin} userEmail={userEmail} userInitial={userInitial} />
}
