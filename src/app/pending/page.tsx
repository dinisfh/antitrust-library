import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function PendingPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-12 px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center bg-white p-10 rounded-2xl shadow-sm border border-light-gray">
                <div className="w-16 h-16 bg-blue-50 rounded-full mx-auto flex items-center justify-center mb-6">
                    <svg className="w-8 h-8 text-primary-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h2 className="text-2xl font-heading font-bold tracking-tight text-dark-slate mb-3">
                    Pedido em Análise
                </h2>
                <p className="text-sm text-dark-slate/80 mb-6 leading-relaxed">
                    O seu pedido de acesso para o email <strong className="text-dark-slate">{user.email}</strong> foi recebido com sucesso.
                    Encontra-se neste momento a aguardar validação manual por parte de um Administrador.
                </p>
                <div className="bg-gray-50 rounded-lg p-4 border border-dashed border-gray-300">
                    <p className="text-xs text-dark-slate/60 font-medium">Volte a tentar o acesso mais tarde. Se acredita tratar-se de um erro, contacte a equipa responsável.</p>
                </div>
                <div className="mt-8">
                    <form action={async () => {
                        'use server'
                        const supabase = await createClient()
                        await supabase.auth.signOut()
                        redirect('/login')
                    }}>
                        <button type="submit" className="text-sm font-semibold text-primary-blue hover:text-blue-700 hover:underline">
                            &larr; Terminar Sessão / Voltar
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
