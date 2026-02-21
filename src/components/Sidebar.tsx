'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useTransition } from 'react'

const AUTHORITIES = ['AdC', 'Comissão Europeia', 'DOJ', 'FTC', 'CMA']
const SECTORS = ['Tecnologia/Digital', 'Energia', 'Telecomunicações', 'Saúde/Farma', 'Retalho', 'Transportes', 'Financeiro']

export default function Sidebar() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isPending, startTransition] = useTransition()

    // Converte a string url (ex: 'AdC,DOJ') para array de selecionados
    const activeAuthorities = searchParams.get('authority')?.split(',') || []
    const activeSectors = searchParams.get('sector')?.split(',') || []

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
                {(activeAuthorities.length > 0 || activeSectors.length > 0) && (
                    <button
                        onClick={() => {
                            const p = new URLSearchParams(searchParams.toString())
                            p.delete('authority')
                            p.delete('sector')
                            router.replace(`/?${p.toString()}`)
                        }}
                        className="text-[10px] text-primary-blue uppercase font-bold hover:underline"
                    >
                        Limpar
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
            </div>
        </aside>
    )
}
