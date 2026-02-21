import { getCaseById } from '@/app/actions'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'

export default async function CasePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const caseData = await getCaseById(id)

    if (!caseData) {
        return notFound()
    }

    const dateOpened = new Date(caseData.date_opened).toLocaleDateString('pt-PT', { day: '2-digit', month: 'long', year: 'numeric' })
    const dateDecided = caseData.date_decided ? new Date(caseData.date_decided).toLocaleDateString('pt-PT', { day: '2-digit', month: 'long', year: 'numeric' }) : null

    const formatCurrency = (amount: number) => {
        if (amount >= 1000000) return `${(amount / 1000000).toFixed(1).replace('.0', '')}M€`
        if (amount >= 1000) return `${(amount / 1000).toFixed(0)}k€`
        return `${amount}€`
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-light-gray my-6">
            <Link href="/" className="inline-flex items-center text-sm font-semibold text-primary-blue hover:opacity-80 transition-opacity mb-4">
                &larr; Voltar à Biblioteca de Casos
            </Link>

            <header className="space-y-6 pb-8 border-b border-light-gray">
                <div className="flex flex-wrap items-center gap-3">
                    <span className="text-xs font-bold px-2.5 py-1 bg-slate-100 text-dark-slate rounded uppercase tracking-wider">
                        {caseData.authority}
                    </span>
                    {caseData.sector.map((sec, i) => (
                        <span key={i} className="text-xs font-bold px-2.5 py-1 bg-blue-50 text-primary-blue rounded border border-blue-100 uppercase tracking-wider">
                            {sec}
                        </span>
                    ))}
                    <span className={`text-xs font-bold px-2.5 py-1 rounded border uppercase tracking-wider ${caseData.status === 'Decidido' ? 'bg-green-50 text-green-700 border-green-200' :
                            caseData.status === 'Em Recurso' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                'bg-slate-50 text-dark-slate border-light-gray'
                        }`}>
                        {caseData.status}
                    </span>
                    {caseData.fine_amount_eur && (
                        <span className="text-xs font-bold px-2.5 py-1 bg-red-50 text-red-700 rounded border border-red-200 uppercase tracking-wider">
                            Coima: {formatCurrency(caseData.fine_amount_eur)}
                        </span>
                    )}
                </div>

                <h1 className="font-heading font-bold text-3xl md:text-5xl text-dark-slate leading-tight">
                    {caseData.title}
                </h1>

                <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-dark-slate/70">
                    <div>
                        <span className="font-bold uppercase tracking-wide text-xs">Ponto de Partida:</span> {dateOpened}
                    </div>
                    {dateDecided && (
                        <>
                            <span className="hidden sm:inline">&bull;</span>
                            <div>
                                <span className="font-bold uppercase tracking-wide text-xs">Decisão:</span> {dateDecided}
                            </div>
                        </>
                    )}
                </div>
            </header>

            <section className="py-2">
                <h3 className="text-xs font-bold text-dark-slate uppercase tracking-widest mb-2 border-l-2 border-primary-blue pl-2">Sumário Executivo</h3>
                <p className="text-lg text-dark-slate/80 leading-relaxed font-medium">
                    {caseData.summary}
                </p>
            </section>

            {/* O CONTEÚDO RICO (MARKDOWN) */}
            <article className="prose prose-blue prose-lg max-w-none text-dark-slate/90 prose-headings:font-heading prose-headings:text-dark-slate prose-a:text-primary-blue hover:prose-a:text-blue-700 marker:text-primary-blue">
                {caseData.content ? (
                    <ReactMarkdown>
                        {caseData.content}
                    </ReactMarkdown>
                ) : (
                    <div className="bg-slate-50 p-6 rounded-lg text-center border border-dashed border-light-gray">
                        <p className="text-dark-slate/60 m-0 text-sm">A análise detalhada deste caso estruturada em Markdown ainda não foi disponibilizada.</p>
                    </div>
                )}
            </article>

            {caseData.source_urls.length > 0 && (
                <footer className="pt-8 border-t border-light-gray mt-12">
                    <h3 className="text-xs font-bold text-dark-slate uppercase tracking-widest mb-4">Fontes Documentais</h3>
                    <ul className="space-y-3">
                        {caseData.source_urls.map((source, i) => (
                            <li key={i}>
                                <a
                                    href={source.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary-blue hover:text-blue-700 hover:underline font-semibold flex items-center gap-2 group text-sm"
                                >
                                    <svg className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                    {source.name}
                                </a>
                            </li>
                        ))}
                    </ul>
                </footer>
            )}
        </div>
    )
}
