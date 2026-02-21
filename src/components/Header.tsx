import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'

export default async function Header() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    let isAdmin = false
    let userInitial = '?'
    let userEmail = 'Visitante'

    if (user) {
        userEmail = user.email || 'Utilizador'
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

    return (
        <header className="h-16 bg-white border-b border-light-gray flex items-center justify-between px-6 shrink-0">
            <div className="flex items-center gap-4">
                <a href="https://tecnico.ulisboa.pt/" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                    <img src="/Tecnico_ID_Principal_RBG-COR.svg" alt="Instituto Superior Técnico" className="w-auto h-8" />
                </a>
                <Link href="/">
                    <h1 className="font-heading font-bold text-dark-slate text-xl hover:text-primary-blue transition-colors cursor-pointer">
                        Antitrust Library
                    </h1>
                </Link>
            </div>

            <div className="flex items-center gap-4">
                {isAdmin && (
                    <Link href="/admin" className="hidden sm:flex text-[11px] font-bold bg-dark-slate text-white px-3 py-1.5 rounded hover:bg-primary-blue transition-colors uppercase tracking-wider items-center gap-1.5">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Motor Admin
                    </Link>
                )}

                <span className="text-[11px] font-bold text-dark-slate/80 hidden sm:block">
                    {userEmail}
                </span>

                <button className="w-8 h-8 rounded-full bg-primary-blue text-white flex items-center justify-center text-sm font-bold shadow-sm cursor-default">
                    {userInitial}
                </button>
            </div>
        </header>
    );
}
