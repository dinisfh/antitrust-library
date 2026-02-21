import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { addUserManually, importUsersCSV } from './actions'

// Função auxiliar para re-buscar dados
async function getUsers() {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('Users')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching users:', error)
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

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div>
                <h2 className="font-heading font-bold text-2xl text-dark-slate mb-1">Painel de Administração</h2>
                <p className="text-sm text-dark-slate/70">Gerir e convidar utilizadores autorizados da plataforma.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Painel Adicionar Manual */}
                <div className="bg-white border border-light-gray rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-bold text-dark-slate mb-4 font-heading">Adicionar Utilizador</h3>
                    <form action={addUserManually} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-dark-slate mb-1">Email</label>
                            <input
                                name="email"
                                type="email"
                                required
                                className="w-full px-3 py-2 border border-light-gray rounded-md focus:ring-1 focus:ring-primary-blue focus:outline-none"
                                placeholder="nome@empresa.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-dark-slate mb-1">Atribuição (Role)</label>
                            <select name="role" className="w-full px-3 py-2 border border-light-gray rounded-md focus:ring-1 focus:ring-primary-blue focus:outline-none">
                                <option value="Reader">Reader (Investigador/Leitor)</option>
                                <option value="Admin">Administrador</option>
                            </select>
                        </div>
                        <button type="submit" className="w-full bg-primary-blue text-white py-2 rounded-md font-semibold text-sm hover:opacity-90 transition-opacity">
                            Adicionar Utilizador
                        </button>
                    </form>
                </div>

                {/* Painel de CSV Bulk Update */}
                <div className="bg-white border border-light-gray rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-bold text-dark-slate mb-2 font-heading">Importar em Massa (CSV)</h3>
                    <p className="text-xs text-dark-slate/70 mb-4 mb-4">
                        O ficheiro CSV deve conter um cabeçalho e ser separado por vírgulas. Colunas esperadas: <strong>email</strong>, <strong>role</strong> (Admin ou Reader).
                    </p>
                    <form action={importUsersCSV} className="space-y-6">
                        <div className="flex items-center justify-center w-full">
                            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-light-gray border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <svg className="w-8 h-8 mb-3 text-dark-slate/50" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                    </svg>
                                    <p className="mb-2 text-sm text-dark-slate/70"><span className="font-semibold text-primary-blue">Clique para submeter</span> ou arraste o ficheiro</p>
                                    <p className="text-xs text-dark-slate/50">Arquivo *.csv</p>
                                </div>
                                <input id="dropzone-file" name="csv_file" type="file" accept=".csv" className="hidden" required />
                            </label>
                        </div>
                        <button type="submit" className="w-full bg-dark-slate text-white py-2 rounded-md font-semibold text-sm hover:opacity-90 transition-opacity">
                            Iniciar Importação
                        </button>
                    </form>
                </div>
            </div>

            {/* Lista de Utilizadores Existentes */}
            <div className="bg-white border border-light-gray rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-light-gray">
                    <h3 className="font-heading font-bold text-dark-slate">Lista de Utilizadores ({usersList.length})</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-light-gray text-sm">
                        <thead className="bg-gray-50 text-dark-slate/70">
                            <tr>
                                <th className="px-6 py-3 text-left font-semibold uppercase tracking-wider text-xs">Email</th>
                                <th className="px-6 py-3 text-left font-semibold uppercase tracking-wider text-xs">Permissões</th>
                                <th className="px-6 py-3 text-left font-semibold uppercase tracking-wider text-xs">Estado</th>
                                <th className="px-6 py-3 text-right font-semibold uppercase tracking-wider text-xs">Criado em</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-light-gray bg-white">
                            {usersList.map((usr) => (
                                <tr key={usr.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-primary-blue">{usr.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 rounded text-[11px] font-bold uppercase ${usr.role === 'Admin' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-dark-slate'}`}>
                                            {usr.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 rounded-full text-[10px] uppercase font-bold ${usr.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {usr.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-dark-slate/60 text-xs">
                                        {new Date(usr.created_at).toLocaleDateString('pt-PT')}
                                    </td>
                                </tr>
                            ))}

                            {usersList.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-dark-slate/50">
                                        Não existem utilizadores registados na plataforma.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    )
}
