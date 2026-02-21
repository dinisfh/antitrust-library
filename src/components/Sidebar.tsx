'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useTransition } from 'react'

const AUTHORITIES = ['AdC', 'Comissão Europeia', 'DOJ', 'FTC', 'CMA']
const SECTORS = ['Tecnologia/Digital', 'Energia', 'Telecomunicações', 'Saúde', 'Retalho', 'Transportes', 'Financeiro']
const STATUSES = ['Em Investigação', 'Decidido', 'Em Recurso']
const CASE_TYPES = ['Cartel', 'Abuso de Posição Dominante', 'Controlo de Concentrações', 'Acordos Restritivos']

export default function Sidebar() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const [isPending, startTransition] = useTransition()

    // Ocultar a Sidebar se não estivermos na Homepage (e.g. login, admin, detalhes do caso)
    if (pathname !== '/') {
        return null;
    }

    // Converte a string url (ex: 'AdC,DOJ') para array de selecionados
    const activeAuthorities = searchParams.get('authority')?.split(',') || []
    const activeSectors = searchParams.get('sector')?.split(',') || []
    const activeStatuses = searchParams.get('status')?.split(',') || []
    const activeCaseTypes = searchParams.get('caseType')?.split(',') || []

    // Manipulador genérico
    const handleFilterChange = (key: string, value: string, checked: boolean, currentList: string[]) => {
        let newList = [...currentList]
        if (checked) {
            if (!newList.includes(value)) newList.push(value)
        } else {
            newList = newList.filter((v) => v !== value)
        }

        startTransition(() => {
            const params = new URLSearchParams(searchParams.toString())
            if (newList.length > 0) {
                params.set(key, newList.join(','))
            } else {
                params.delete(key)
            }
            router.replace(`/?${params.toString()}`, { scroll: false })
        })
    }

    return (
        <aside className={`w-64 bg-white border-r border-light-gray h-full hidden md:flex flex-col transition-opacity ${isPending ? 'opacity-70 pointer-events-none' : 'opacity-100'}`}>
            <div className="p-4 border-b border-light-gray flex items-center justify-between">
                <h2 className="font-heading font-bold text-dark-slate text-sm uppercase tracking-wider">Filtros</h2>
                {(activeAuthorities.length > 0 || activeSectors.length > 0 || activeStatuses.length > 0 || activeCaseTypes.length > 0) && (
                    <button
                        onClick={() => {
                            const p = new URLSearchParams(searchParams.toString())
                            p.delete('authority')
                            p.delete('sector')
                            p.delete('status')
                            p.delete('caseType')
                            router.replace(`/?${p.toString()}`)
                        }}
                        className="text-[10px] text-primary-blue uppercase font-bold hover:underline"
                    >
                        Limpar Todos
                    </button>
                )}
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-8">
                <div>
                    <h3 className="text-xs font-bold text-dark-slate mb-3 uppercase tracking-wide">Autoridade</h3>
                    <div className="space-y-2.5 text-sm text-dark-slate/80">
                        {AUTHORITIES.map((auth) => (
                            <label key={auth} className="flex items-center gap-2.5 cursor-pointer hover:text-primary-blue transition-colors group">
                                <input
                                    type="checkbox"
                                    checked={activeAuthorities.includes(auth)}
                                    onChange={(e) => handleFilterChange('authority', auth, e.target.checked, activeAuthorities)}
                                    className="w-4 h-4 rounded border-gray-300 text-primary-blue focus:ring-primary-blue bg-gray-50 cursor-pointer"
                                />
                                <span className="group-hover:translate-x-0.5 transition-transform">{auth}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="text-xs font-bold text-dark-slate mb-3 uppercase tracking-wide">Setor</h3>
                    <div className="space-y-2.5 text-sm text-dark-slate/80">
                        {SECTORS.map((sector) => (
                            <label key={sector} className="flex items-center gap-2.5 cursor-pointer hover:text-primary-blue transition-colors group">
                                <input
                                    type="checkbox"
                                    checked={activeSectors.includes(sector)}
                                    onChange={(e) => handleFilterChange('sector', sector, e.target.checked, activeSectors)}
                                    className="w-4 h-4 rounded border-gray-300 text-primary-blue focus:ring-primary-blue bg-gray-50 cursor-pointer"
                                />
                                <span className="group-hover:translate-x-0.5 transition-transform">{sector}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="text-xs font-bold text-dark-slate mb-3 uppercase tracking-wide">Estado</h3>
                    <div className="space-y-2.5 text-sm text-dark-slate/80">
                        {STATUSES.map((status) => (
                            <label key={status} className="flex items-center gap-2.5 cursor-pointer hover:text-primary-blue transition-colors group">
                                <input
                                    type="checkbox"
                                    checked={activeStatuses.includes(status)}
                                    onChange={(e) => handleFilterChange('status', status, e.target.checked, activeStatuses)}
                                    className="w-4 h-4 rounded border-gray-300 text-primary-blue focus:ring-primary-blue bg-gray-50 cursor-pointer"
                                />
                                <span className="group-hover:translate-x-0.5 transition-transform">{status}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="text-xs font-bold text-dark-slate mb-3 uppercase tracking-wide">Tipo de Caso</h3>
                    <div className="space-y-2.5 text-sm text-dark-slate/80">
                        {CASE_TYPES.map((type) => (
                            <label key={type} className="flex items-center gap-2.5 cursor-pointer hover:text-primary-blue transition-colors group">
                                <input
                                    type="checkbox"
                                    checked={activeCaseTypes.includes(type)}
                                    onChange={(e) => handleFilterChange('caseType', type, e.target.checked, activeCaseTypes)}
                                    className="w-4 h-4 rounded border-gray-300 text-primary-blue focus:ring-primary-blue bg-gray-50 cursor-pointer"
                                />
                                <span className="group-hover:translate-x-0.5 transition-transform">{type}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>
        </aside>
    )
}
