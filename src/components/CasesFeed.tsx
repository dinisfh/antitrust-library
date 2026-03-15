import { getCases } from '@/app/actions'
import CaseCard from '@/components/CaseCard'
import { NoResultsText } from '@/components/HomeText'
import SortDropdown from './SortDropdown'
import PaginationControls from './PaginationControls'

export async function CasesFeed({
    query,
    sectors,
    authorities,
    statuses,
    caseTypes,
    geographies,
    companies,
    decades,
    sortBy,
    page = 1,
    limit = 20
}: {
    query: string
    sectors: string[]
    authorities: string[]
    statuses: string[]
    caseTypes: string[]
    geographies: string[]
    companies: string[]
    decades: string[]
    sortBy: string
    page?: number
    limit?: number
}) {
    const { data: casesMatch, count } = await getCases(query, sectors, authorities, statuses, caseTypes, geographies, companies, decades, sortBy, page, limit)

    const startItem = count === 0 ? 0 : (page - 1) * limit + 1;
    const endItem = count === 0 ? 0 : startItem + casesMatch.length - 1;

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center text-sm">
                <p className="font-medium text-dark-slate/60">
                    {count > 0 ? `Showing ${startItem} to ${endItem} of ${count} cases` : 'Showing 0 cases'}
                </p>
                
                {/* O SortUI dropdown que interage com a navegação do cliente e manipula searchParams será incluído do lado do cliente via um componente de Sorting, ou podemos usar Next.js Link / Select form.
                    Como é um server component, vamos colocar aqui uma versão simples se houver um client wrapper ou usar um componente separado */}
                <SortDropdown currentSort={sortBy} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {casesMatch.map((c) => (
                    <CaseCard key={c.id} data={c} />
                ))}

                {casesMatch.length === 0 && <NoResultsText />}
            </div>
            
            {count > 0 && (
                <div className="mt-8">
                    <PaginationControls totalCount={count} currentPage={page} itemsPerPage={limit} />
                </div>
            )}
        </div>
    )
}

export function CasesFeedSkeleton({ limit = 20 }: { limit?: number }) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: limit }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-light-gray p-6 h-[250px] animate-pulse flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4 gap-2">
                        <div className="h-5 bg-slate-200 rounded w-16" />
                        <div className="h-4 bg-slate-200 rounded w-24" />
                    </div>
                    <div className="space-y-3 mb-5">
                        <div className="h-6 bg-slate-200 rounded w-full" />
                        <div className="h-6 bg-slate-200 rounded w-3/4" />
                    </div>
                    <div className="space-y-2 mb-5 flex-1">
                        <div className="h-4 bg-slate-200 rounded w-full" />
                        <div className="h-4 bg-slate-200 rounded w-5/6" />
                    </div>
                    <div className="flex gap-2">
                        <div className="h-5 bg-slate-200 rounded w-20" />
                        <div className="h-5 bg-slate-200 rounded w-24" />
                    </div>
                </div>
            ))}
        </div>
    )
}
