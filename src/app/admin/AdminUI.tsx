'use client'

import { useLanguage } from '@/i18n/LanguageContext'
import { addUserManually, importUsersCSV, approveUser, rejectUser, updateUserRole, deleteActiveUser, addCaseManually, editCaseAction, deleteCaseAction, toggleFavoriteCase } from './actions'
import CustomSelect from '@/components/ui/CustomSelect'
import EditCaseModal from '@/components/EditCaseModal'
import { useState } from 'react'

type UserData = {
    id: string;
    email: string;
    role: string;
    status: string;
    created_at: string;
    last_sign_in_at?: string;
}

type CompactCase = {
    id: string;
    title: string;
    authority: string;
    status: string;
    created_at: string;
    is_favorite: boolean;
}

export default function AdminUI({
    activeUsers,
    pendingUsers,
    casesList
}: {
    activeUsers: UserData[],
    pendingUsers: UserData[],
    casesList: CompactCase[]
}) {
    const { t } = useLanguage()
    const tAdmin = t.admin_panel
    const [editingCaseId, setEditingCaseId] = useState<string | null>(null)

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div>
                <h2 className="font-heading font-bold text-2xl text-dark-slate mb-1">{tAdmin.title}</h2>
                <p className="text-sm text-dark-slate/70">{tAdmin.subtitle}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Painel Adicionar Manual */}
                <div className="bg-white border border-light-gray rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-bold text-dark-slate mb-4 font-heading">{tAdmin.add_user_title}</h3>
                    <form action={addUserManually} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-dark-slate mb-1">{tAdmin.email_label}</label>
                            <input
                                name="email"
                                type="email"
                                required
                                className="w-full px-3 py-2 border border-light-gray rounded-md focus:ring-1 focus:ring-primary-blue focus:outline-none"
                                placeholder={t.login_page.email_placeholder}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-dark-slate mb-1">{tAdmin.password_label}</label>
                            <input
                                name="password"
                                type="text"
                                className="w-full px-3 py-2 border border-light-gray rounded-md focus:ring-1 focus:ring-primary-blue focus:outline-none"
                                placeholder={tAdmin.password_placeholder}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-dark-slate mb-1">{tAdmin.role_label}</label>
                            <CustomSelect
                                name="role"
                                defaultValue="Reader"
                                options={[
                                    { value: 'Reader', label: tAdmin.role_reader },
                                    { value: 'Admin', label: tAdmin.role_admin }
                                ]}
                            />
                        </div>
                        <button type="submit" className="w-full bg-primary-blue text-white py-2 rounded-md font-semibold text-sm hover:opacity-90 transition-opacity">
                            {tAdmin.btn_add_user}
                        </button>
                    </form>
                </div>

                {/* Painel de CSV Bulk Update */}
                <div className="bg-white border border-light-gray rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-bold text-dark-slate mb-2 font-heading">{tAdmin.import_csv_title}</h3>
                    <p className="text-xs text-dark-slate/70 mb-4" dangerouslySetInnerHTML={{ __html: tAdmin.import_csv_desc }} />
                    <form action={importUsersCSV} className="space-y-6">
                        <div className="flex items-center justify-center w-full">
                            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-light-gray border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <svg className="w-8 h-8 mb-3 text-dark-slate/50" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                    </svg>
                                    <p className="mb-2 text-sm text-dark-slate/70"><span className="font-semibold text-primary-blue">{tAdmin.click_to_submit}</span> {tAdmin.or_drag_file}</p>
                                    <p className="text-xs text-dark-slate/50">{tAdmin.file_type}</p>
                                </div>
                                <input id="dropzone-file" name="csv_file" type="file" accept=".csv" className="hidden" required />
                            </label>
                        </div>
                        <button type="submit" className="w-full bg-dark-slate text-white py-2 rounded-md font-semibold text-sm hover:opacity-90 transition-opacity">
                            {tAdmin.btn_start_import}
                        </button>
                    </form>
                </div>
            </div>

            {pendingUsers.length > 0 && (
                <div className="bg-white border border-yellow-300 rounded-xl shadow-sm overflow-hidden mt-8 ring-1 ring-yellow-400">
                    <div className="bg-yellow-50 px-6 py-4 border-b border-yellow-200">
                        <h3 className="font-heading font-bold text-yellow-800">{tAdmin.pending_requests_title.replace('{{count}}', pendingUsers.length.toString())}</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-light-gray text-sm">
                            <thead className="bg-yellow-50">
                                <tr>
                                    <th className="px-6 py-3 text-left font-semibold text-dark-slate">{tAdmin.table_email}</th>
                                    <th className="px-6 py-3 text-left font-semibold text-dark-slate">{tAdmin.table_request_date}</th>
                                    <th className="px-6 py-3 text-right font-semibold text-dark-slate">{tAdmin.table_actions}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-light-gray bg-white">
                                {pendingUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-dark-slate">{user.email}</td>
                                        <td className="px-6 py-4 text-dark-slate/70">{new Date(user.created_at).toLocaleDateString('pt-PT')}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <form action={approveUser}>
                                                    <input type="hidden" name="userId" value={user.id} />
                                                    <button type="submit" className="text-xs bg-green-600 text-white px-3 py-1.5 rounded hover:bg-green-700 font-bold transition-opacity">{tAdmin.btn_approve}</button>
                                                </form>
                                                <form action={rejectUser}>
                                                    <input type="hidden" name="userId" value={user.id} />
                                                    <button type="submit" className="text-xs bg-red-600 text-white px-3 py-1.5 rounded hover:bg-red-700 font-bold transition-opacity">{tAdmin.btn_reject}</button>
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
                    <h3 className="font-heading font-bold text-dark-slate">{tAdmin.active_users_title.replace('{{count}}', activeUsers.length.toString())}</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-light-gray text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left font-semibold text-dark-slate">{tAdmin.table_email}</th>
                                <th className="px-6 py-3 text-left font-semibold text-dark-slate">{tAdmin.table_role}</th>
                                <th className="px-6 py-3 text-left font-semibold text-dark-slate">{tAdmin.table_reg_date}</th>
                                <th className="px-6 py-3 text-left font-semibold text-dark-slate">{tAdmin.table_last_visit}</th>
                                <th className="px-6 py-3 text-right font-semibold text-dark-slate">{tAdmin.table_actions}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-light-gray bg-white">
                            {activeUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-dark-slate flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-light-gray flex items-center justify-center text-[10px] font-bold text-dark-slate">
                                            {user.email.charAt(0).toUpperCase()}
                                        </div>
                                        {user.email}
                                    </td>
                                    <td className="px-6 py-4">
                                        <form action={updateUserRole} className="flex items-center gap-2">
                                            <input type="hidden" name="userId" value={user.id} />
                                            <div className="w-28">
                                                <CustomSelect
                                                    name="role"
                                                    defaultValue={user.role}
                                                    options={[
                                                        { value: 'Reader', label: 'Reader' },
                                                        { value: 'Admin', label: 'Admin' }
                                                    ]}
                                                    className={user.role === 'Admin' ? '[&>button]:bg-primary-blue/10 [&>button]:text-primary-blue [&>button]:border-primary-blue/20' : '[&>button]:bg-gray-100 [&>button]:border-gray-200'}
                                                />
                                            </div>
                                            <button type="submit" className="text-xs bg-dark-slate text-white px-3 py-1.5 rounded hover:opacity-90 font-semibold transition-opacity tracking-wide h-[42px]">
                                                {tAdmin.btn_save}
                                            </button>
                                        </form>
                                    </td>
                                    <td className="px-6 py-4 text-dark-slate/70">
                                        {new Date(user.created_at).toLocaleDateString('pt-PT')}
                                    </td>
                                    <td className="px-6 py-4 text-dark-slate/70 text-xs">
                                        {user.last_sign_in_at ? (
                                            <>
                                                <div>{new Date(user.last_sign_in_at).toLocaleDateString('pt-PT')}</div>
                                                <div className="text-dark-slate/50">{new Date(user.last_sign_in_at).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}</div>
                                            </>
                                        ) : tAdmin.never}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <form action={deleteActiveUser}>
                                            <input type="hidden" name="userId" value={user.id} />
                                            <button type="submit" className="text-xs text-red-600 hover:text-red-800 font-semibold transition-colors bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded">
                                                {tAdmin.btn_delete}
                                            </button>
                                        </form>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Nova Tabela de Casos */}
            <div className="bg-white border border-light-gray rounded-xl shadow-sm overflow-hidden mt-8">
                <div className="px-6 py-4 border-b border-light-gray flex justify-between items-center">
                    <h3 className="font-heading font-bold text-dark-slate">Gerir Casos Registados ({casesList.length})</h3>
                </div>
                <div className="overflow-x-auto max-h-[500px]">
                    <table className="min-w-full divide-y divide-light-gray text-sm">
                        <thead className="bg-gray-50 sticky top-0 z-10">
                            <tr>
                                <th className="px-6 py-3 text-left font-semibold text-dark-slate">Título do Caso</th>
                                <th className="px-6 py-3 text-left font-semibold text-dark-slate">Autoridade</th>
                                <th className="px-6 py-3 text-left font-semibold text-dark-slate">Status</th>
                                <th className="px-6 py-3 text-right font-semibold text-dark-slate">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-light-gray bg-white">
                            {casesList.map((c) => (
                                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-3 font-medium text-dark-slate max-w-[300px] truncate" title={c.title}>
                                        {c.title}
                                    </td>
                                    <td className="px-6 py-3 text-dark-slate/70">
                                        {c.authority}
                                    </td>
                                    <td className="px-6 py-3">
                                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border inline-block ${c.status.toLowerCase().includes('closed') || c.status.toLowerCase().includes('decidido')
                                            ? 'bg-green-50 text-green-700 border-green-200'
                                            : c.status.toLowerCase().includes('appeal') || c.status.toLowerCase().includes('investigation')
                                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                                : 'bg-slate-50 text-dark-slate border-light-gray'
                                            }`}>
                                            {c.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <form action={toggleFavoriteCase}>
                                                <input type="hidden" name="caseId" value={c.id} />
                                                <input type="hidden" name="currentStatus" value={c.is_favorite ? 'true' : 'false'} />
                                                <button type="submit" title={c.is_favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'} className="p-1 rounded-full transition-colors hover:bg-gray-100 group">
                                                    {c.is_favorite ? (
                                                        <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                                        </svg>
                                                    ) : (
                                                        <svg className="w-5 h-5 text-gray-400 group-hover:text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                                                        </svg>
                                                    )}
                                                </button>
                                            </form>
                                            <button 
                                                onClick={() => setEditingCaseId(c.id)}
                                                className="text-xs text-primary-blue hover:text-blue-800 font-semibold transition-colors bg-blue-50/50 hover:bg-blue-100 px-3 py-1.5 rounded"
                                            >
                                                Editar
                                            </button>
                                            <form action={deleteCaseAction} onSubmit={(e) => { if (!confirm('Tens a certeza que queres eliminar este caso? Não pode ser revertido.')) e.preventDefault() }}>
                                                <input type="hidden" name="caseId" value={c.id} />
                                                <button type="submit" className="text-xs text-red-600 hover:text-red-800 font-semibold transition-colors bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded">
                                                    Apagar
                                                </button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal de Edição */}
            {editingCaseId && (
                <EditCaseModal 
                    caseId={editingCaseId} 
                    onClose={() => setEditingCaseId(null)} 
                />
            )}

            {/* O formulário de "Novo Caso de Estudo" chama funções on-server mas usa ações no Client. Nós simplificamos. */}
            {/* NOTE: To keep server actions working inside client components properly, NextJS handles forms with \`action={ServerAction}\` natively now. */}
            <div className="bg-white border border-light-gray rounded-xl shadow-sm p-6 mt-8">
                <h3 className="text-lg font-bold text-dark-slate mb-4 font-heading">{tAdmin.add_case_title}</h3>
                <p className="text-sm text-dark-slate/70 mb-6">{tAdmin.add_case_desc}</p>

                <form action={async (formData) => {
                    const { addCaseManually } = await import('./actions')
                    await addCaseManually(formData)
                }} className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-dark-slate mb-1">{tAdmin.case_title_label}</label>
                        <input name="title" type="text" required className="w-full px-3 py-2 border border-light-gray rounded-md focus:ring-1 focus:ring-primary-blue focus:outline-none" placeholder={tAdmin.case_title_placeholder} />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-dark-slate mb-1">{tAdmin.case_content_label}</label>
                        <textarea
                            name="summary"
                            rows={12}
                            className="w-full px-3 py-2 border border-light-gray rounded-md focus:ring-1 focus:ring-primary-blue focus:outline-none font-mono text-sm"
                            defaultValue={`## Resumo dos Factos\n\n## Mercado Relevante\n\n## Decisão e Sanções`}
                        ></textarea>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-dark-slate mb-1">{tAdmin.case_sources_label}</label>
                        <textarea name="sources" rows={3} className="w-full px-3 py-2 border border-light-gray rounded-md focus:ring-1 focus:ring-primary-blue focus:outline-none" placeholder="https://..."></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-dark-slate mb-1">{tAdmin.authority_label}</label>
                        <CustomSelect
                            name="authority"
                            defaultValue="AdC"
                            options={[
                                { value: 'AdC', label: 'AdC (Portugal)' },
                                { value: 'Comissão Europeia', label: 'Comissão Europeia' },
                                { value: 'DOJ', label: 'DOJ (EUA)' },
                                { value: 'FTC', label: 'FTC (EUA)' },
                                { value: 'CMA', label: 'CMA (Reino Unido)' }
                            ]}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-dark-slate mb-1">{tAdmin.status_label}</label>
                        <CustomSelect
                            name="status"
                            defaultValue="Em Investigação"
                            options={[
                                { value: 'Em Investigação', label: tAdmin.status_investigation },
                                { value: 'Decidido', label: tAdmin.status_decided },
                                { value: 'Em Recurso', label: tAdmin.status_appeal }
                            ]}
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-dark-slate mb-1">{tAdmin.industry_label || 'Industry'}</label>
                        <input name="industry" type="text" className="w-full px-3 py-2 border border-light-gray rounded-md focus:ring-1 focus:ring-primary-blue focus:outline-none" placeholder={tAdmin.industry_placeholder || 'Tecnologia'} />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-dark-slate mb-1">Geography</label>
                        <input name="geography" type="text" className="w-full px-3 py-2 border border-light-gray rounded-md focus:ring-1 focus:ring-primary-blue focus:outline-none" placeholder="e.g. EU, US" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-dark-slate mb-1">Tags (Case Types)</label>
                        <input name="tags" type="text" className="w-full px-3 py-2 border border-light-gray rounded-md focus:ring-1 focus:ring-primary-blue focus:outline-none" placeholder="Cartel, Dominance" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-dark-slate mb-1">Decision Date</label>
                        <input name="decision_date" type="text" className="w-full px-3 py-2 border border-light-gray rounded-md focus:ring-1 focus:ring-primary-blue focus:outline-none" placeholder="e.g. 2026-03 or Sept 2023" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-dark-slate mb-1">Start Date</label>
                        <input name="start_date" type="text" className="w-full px-3 py-2 border border-light-gray rounded-md focus:ring-1 focus:ring-primary-blue focus:outline-none" placeholder="e.g. 2020" />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-dark-slate mb-1">Fine Amount</label>
                        <input name="fine_amount" type="text" className="w-full px-3 py-2 border border-light-gray rounded-md focus:ring-1 focus:ring-primary-blue focus:outline-none" placeholder="Ex: €2.4B" />
                    </div>

                    <div className="md:col-span-2 border-t border-light-gray pt-6 mt-2">
                        <button type="submit" className="px-6 py-2.5 bg-primary-blue text-white rounded-md font-semibold text-sm hover:opacity-90 transition-opacity float-right">
                            {tAdmin.btn_create_case}
                        </button>
                        <div className="clear-both"></div>
                    </div>
                </form>
            </div>
        </div>
    )
}
