'use client'

import { type CaseMatch } from '@/app/actions'
import Link from 'next/link'

export default function CaseCard({ data }: { data: CaseMatch }) {
    const dateOpened = new Date(data.date_opened).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' })

    // Format Euros (e.g. 15000000 -> 15M€)
    const formatCurrency = (amount: number) => {
        if (amount >= 1000000) return `${(amount / 1000000).toFixed(1).replace('.0', '')}M€`
        if (amount >= 1000) return `${(amount / 1000).toFixed(0)}k€`
        return `${amount}€`
    }

    return (
        <Link href={`/cases/${data.id}`} className="block h-full outline-none focus-visible:ring-2 focus-visible:ring-primary-blue rounded-xl">
            <div className="bg-white rounded-xl border border-light-gray p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full group">
                <div className="flex justify-between items-start mb-4 gap-2">
                    <span className="text-[11px] font-bold px-2 py-1 bg-slate-100 text-dark-slate rounded tracking-wide truncate">
                        {data.authority}
                    </span>
                    <span className="text-[11px] font-semibold text-dark-slate/60 whitespace-nowrap">
                        {dateOpened}
                    </span>
                </div>

                <h3 className="font-heading font-bold text-lg text-primary-blue mb-3 leading-snug group-hover:text-blue-700 transition-colors line-clamp-2" title={data.title}>
                    {data.title}
                </h3>

                <p className="text-sm text-dark-slate/80 line-clamp-3 mb-5 flex-1 leading-relaxed">
                    {data.summary}
                </p>

                <div className="flex flex-wrap gap-2 mb-5">
                    {data.sector.map((sec, i) => (
                        <span key={`sec-${i}`} className="text-[10px] uppercase font-bold px-2 py-0.5 bg-blue-50 text-primary-blue rounded border border-blue-100 truncate max-w-[120px]">
                            {sec}
                        </span>
                    ))}
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${data.status === 'Decidido' ? 'bg-green-50 text-green-700 border-green-200' :
                        data.status === 'Em Recurso' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                            'bg-slate-50 text-dark-slate border-light-gray'
                        }`}>
                        {data.status}
                    </span>
                    {data.fine_amount_eur ? (
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-red-50 text-red-700 rounded border border-red-200">
                            {formatCurrency(data.fine_amount_eur)}
                        </span>
                    ) : null}
                </div>

                <div className="pt-4 border-t border-light-gray flex flex-wrap items-center gap-4">
                    {data.source_urls.length > 0 ? (
                        data.source_urls.map((source, index) => (
                            <button
                                key={index}
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    window.open(source.url, '_blank', 'noopener,noreferrer')
                                }}
                                className="text-[11px] font-semibold text-primary-blue hover:text-blue-700 hover:underline flex items-center gap-1 transition-colors uppercase tracking-wide appearance-none bg-transparent p-0 m-0 border-none"
                            >
                                {source.name} &rarr;
                            </button>
                        ))
                    ) : (
                        <span className="text-[11px] font-semibold text-dark-slate/50 uppercase tracking-wide">
                            Sem fontes associadas
                        </span>
                    )}
                </div>
            </div>
        </Link>
    )
}
