import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { redirect } from 'next/navigation'
import { addUserManually, importUsersCSV, approveUser, rejectUser } from './actions'

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
                            <label className="block text-sm font-medium text-dark-slate mb-1">Palavra-passe (Opcional)</label>
                            <input
                                name="password"
                                type="text"
                                className="w-full px-3 py-2 border border-light-gray rounded-md focus:ring-1 focus:ring-primary-blue focus:outline-none"
                                placeholder="Padrão: megie2025"
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
                    <p className="text-xs text-dark-slate/70 mb-4">
                        O ficheiro CSV deve conter cabeçalho. Colunas: <strong>email</strong>, <strong>role</strong> (Admin/Reader) e <strong>password</strong> (opcional). Contas sem password definida usarão <strong>megie2025</strong> por defeito.
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

            {pendingUsers.length > 0 && (
                <div className="bg-white border border-yellow-300 rounded-xl shadow-sm overflow-hidden mt-8 ring-1 ring-yellow-400">
                    <div className="bg-yellow-50 px-6 py-4 border-b border-yellow-200">
                        <h3 className="font-heading font-bold text-yellow-800">Pedidos de Acesso Pendentes ({pendingUsers.length})</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-light-gray text-sm">
                            <thead className="bg-yellow-50">
                                <tr>
                                    <th className="px-6 py-3 text-left font-semibold text-dark-slate">Email</th>
                                    <th className="px-6 py-3 text-left font-semibold text-dark-slate">Data de Pedido</th>
                                    <th className="px-6 py-3 text-right font-semibold text-dark-slate">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-light-gray bg-white">
                                {pendingUsers.map((user: any) => (
                                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-dark-slate">{user.email}</td>
                                        <td className="px-6 py-4 text-dark-slate/70">{new Date(user.created_at).toLocaleDateString('pt-PT')}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <form action={approveUser}>
                                                    <input type="hidden" name="userId" value={user.id} />
                                                    <button type="submit" className="text-xs bg-green-600 text-white px-3 py-1.5 rounded hover:bg-green-700 font-bold transition-opacity">Aprovar</button>
                                                </form>
                                                <form action={rejectUser}>
                                                    <input type="hidden" name="userId" value={user.id} />
                                                    <button type="submit" className="text-xs bg-red-600 text-white px-3 py-1.5 rounded hover:bg-red-700 font-bold transition-opacity">Rejeitar</button>
                                                </form>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <div className="bg-white border border-light-gray rounded-xl shadow-sm overflow-hidden mt-8">
                <div className="px-6 py-4 border-b border-light-gray">
                    <h3 className="font-heading font-bold text-dark-slate">Utilizadores Ativos ({activeUsers.length})</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-light-gray text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left font-semibold text-dark-slate">Email</th>
                                <th className="px-6 py-3 text-left font-semibold text-dark-slate">Atribuição</th>
                                <th className="px-6 py-3 text-left font-semibold text-dark-slate">Data Registo</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-light-gray bg-white">
                            {activeUsers.map((user: any) => (
                                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-dark-slate flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-light-gray flex items-center justify-center text-[10px] font-bold text-dark-slate">
                                            {user.email.charAt(0).toUpperCase()}
                                        </div>
                                        {user.email}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${user.role === 'Admin' ? 'bg-primary-blue/10 text-primary-blue' : 'bg-gray-100 text-dark-slate'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-dark-slate/70">
                                        {new Date(user.created_at).toLocaleDateString('pt-PT')}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Nova Secção: Gestão de Casos */}
            <div className="bg-white border border-light-gray rounded-xl shadow-sm p-6 mt-8">
                <h3 className="text-lg font-bold text-dark-slate mb-4 font-heading">Adicionar Novo Caso de Estudo (Manual)</h3>
                <p className="text-sm text-dark-slate/70 mb-6">Utilize este formulário para forçar a criação de um processo na biblioteca (e.g. quando as integrações web erram). Detalhes como o Markdown avançado devem ser ajustados via Supabase após a criação deste esqueleto básico.</p>

                <form action={async (formData) => {
                    'use server'
                    const { addCaseManually } = await import('./actions')
                    await addCaseManually(formData)
                }} className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-dark-slate mb-1">Título do Caso</label>
                        <input name="title" type="text" required className="w-full px-3 py-2 border border-light-gray rounded-md focus:ring-1 focus:ring-primary-blue focus:outline-none" placeholder="Ex: Cartel das Seguradoras" />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-dark-slate mb-1">Sumário (Resumo Curto)</label>
                        <textarea name="summary" rows={3} className="w-full px-3 py-2 border border-light-gray rounded-md focus:ring-1 focus:ring-primary-blue focus:outline-none" placeholder="Breve introdução aos factos..."></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-dark-slate mb-1">Autoridade Envolvida</label>
                        <select name="authority" className="w-full px-3 py-2 border border-light-gray rounded-md focus:ring-1 focus:ring-primary-blue focus:outline-none">
                            <option value="AdC">AdC (Portugal)</option>
                            <option value="Comissão Europeia">Comissão Europeia</option>
                            <option value="DOJ">DOJ (EUA)</option>
                            <option value="FTC">FTC (EUA)</option>
                            <option value="CMA">CMA (Reino Unido)</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-dark-slate mb-1">Estado do Processo</label>
                        <select name="status" className="w-full px-3 py-2 border border-light-gray rounded-md focus:ring-1 focus:ring-primary-blue focus:outline-none">
                            <option value="Em Investigação">Em Investigação</option>
                            <option value="Decidido">Decidido (Concluído)</option>
                            <option value="Em Recurso">Em Recurso</option>
                        </select>
                    </div>

                    <div className="md:col-span-2 border-t border-light-gray pt-6 mt-2">
                        <button type="submit" className="px-6 py-2.5 bg-primary-blue text-white rounded-md font-semibold text-sm hover:opacity-90 transition-opacity float-right">
                            Criar e Publicar Caso
                        </button>
                        <div className="clear-both"></div>
                    </div>
                </form>
            </div>

        </div>
    )
}
