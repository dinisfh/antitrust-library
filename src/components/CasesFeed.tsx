import { getCases } from '@/app/actions'
import CaseCard from '@/components/CaseCard'
import { NoResultsText } from '@/components/HomeText'

export async function CasesFeed({
    query,
    sectors,
    authorities,
    statuses,
    caseTypes
}: {
    query: string
    sectors: string[]
    authorities: string[]
    statuses: string[]
    caseTypes: string[]
}) {
    const casesMatch = await getCases(query, sectors, authorities, statuses, caseTypes)

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {casesMatch.map((c) => (
                <CaseCard key={c.id} data={c} />
            ))}

            {casesMatch.length === 0 && <NoResultsText />}
        </div>
    )
}

export function CasesFeedSkeleton({ count = 9 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: count }).map((_, i) => (
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
