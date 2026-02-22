import { getCaseById } from '../../actions'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function CasePage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params
    const caseData = await getCaseById(resolvedParams.id)

    if (!caseData) {
        notFound()
    }

    let displayDate = 'Sem Data';
    if (caseData.decision_date) {
        displayDate = caseData.decision_date;
    } else if (caseData.created_at) {
        displayDate = new Date(caseData.created_at).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' })
    }

    return (
        <main className="max-w-4xl mx-auto py-12 px-6">
            <Link href="/" className="text-primary-blue hover:text-blue-700 hover:underline mb-8 inline-flex items-center gap-2 font-medium">
                &larr; Voltar à biblioteca
            </Link>

            <article className="bg-white rounded-2xl shadow-sm border border-light-gray p-8 md:p-12">
                <header className="mb-10">
                    <div className="flex flex-wrap items-center gap-3 mb-6">
                        <span className="text-xs font-bold px-3 py-1.5 bg-slate-100 text-dark-slate rounded-md tracking-wider uppercase">
                            {caseData.authority}
                        </span>
                        <span className="text-xs font-semibold text-dark-slate/60">
                            {displayDate}
                        </span>
                    </div>

                    <h1 className="text-3xl md:text-4xl font-heading font-bold text-primary-blue leading-tight mb-6">
                        {caseData.title}
                    </h1>

                    <div className="flex flex-wrap gap-2">
                        <span className="text-xs uppercase font-bold px-3 py-1.5 bg-blue-50 text-primary-blue rounded border border-blue-100">
                            {caseData.industry}
                        </span>

                        {caseData.tags?.map((tag, i) => (
                            <span key={`tag-${i}`} className="text-xs uppercase font-bold px-3 py-1.5 bg-slate-50 text-gray-600 rounded border border-slate-200">
                                {tag}
                            </span>
                        ))}
                    </div>
                </header>

                <div className="prose prose-slate max-w-none mb-12 prose-headings:font-heading prose-headings:text-primary-blue prose-a:text-blue-600 hover:prose-a:text-blue-800">
                    <h2 className="text-xl font-bold mb-4 border-b border-light-gray pb-2">Resumo da Decisão</h2>
                    <p className="text-lg leading-relaxed text-dark-slate/90 whitespace-pre-line">
                        {caseData.summary}
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 border-t border-light-gray pt-8">
                    <div>
                        <h3 className="text-sm font-bold text-dark-slate/50 uppercase tracking-widest mb-3">Partes Envolvidas</h3>
                        <ul className="space-y-2">
                            {caseData.parties_involved?.map((p, i) => (
                                <li key={i} className="font-medium text-dark-slate flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary-blue/30 scale-up"></span>
                                    {p}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-bold text-dark-slate/50 uppercase tracking-widest mb-3">Status e Multas</h3>
                        <div className="flex flex-col gap-3 items-start">
                            <span className="text-sm font-bold px-3 py-1 bg-slate-100 rounded text-dark-slate border border-light-gray">
                                {caseData.status}
                            </span>
                            {caseData.fine_amount && (
                                <span className="text-sm font-bold px-3 py-1 bg-red-50 text-red-700 rounded border border-red-200 shadow-sm animate-pulse-soft">
                                    Multa: {caseData.fine_amount}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-light-gray">
                    <h3 className="text-sm font-bold text-dark-slate/50 uppercase tracking-widest mb-4">Fontes Oficiais</h3>
                    <div className="flex flex-col gap-3">
                        {caseData.links && caseData.links.length > 0 ? (
                            caseData.links.map((link, index) => (
                                <a
                                    key={index}
                                    href={link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary-blue hover:text-blue-700 font-medium inline-flex items-center gap-2 transition-colors w-fit group"
                                >
                                    <svg className="w-4 h-4 text-blue-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                                    Fonte #{index + 1}: {new URL(link).hostname.replace('www.', '')}
                                </a>
                            ))
                        ) : (
                            <p className="text-dark-slate/60 text-sm italic">Nenhum documento público associado.</p>
                        )}
                    </div>
                </div>
            </article>
        </main>
    )
}
