import { getCases } from '@/app/actions'
import CaseCard from '@/components/CaseCard'
import SearchBar from '@/components/SearchBar'
import { Suspense } from 'react'

export default async function Home(props: {
  searchParams?: Promise<{
    query?: string
    sector?: string
    authority?: string
  }>
}) {
  const searchParams = await props.searchParams

  const query = searchParams?.query || ''
  const sectors = searchParams?.sector ? searchParams.sector.split(',') : []
  const authorities = searchParams?.authority ? searchParams.authority.split(',') : []

  const casesMatch = await getCases(query, sectors, authorities)

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h2 className="font-heading font-bold text-2xl text-dark-slate mb-1">Casos Recentes</h2>
          <p className="text-sm text-dark-slate/70">Acompanhe as últimas decisões e investigações.</p>
        </div>

        <Suspense fallback={<div className="w-full md:w-96 h-10 bg-gray-100 animate-pulse rounded-lg"></div>}>
          <SearchBar />
        </Suspense>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {casesMatch.map((c) => (
          <CaseCard key={c.id} data={c} />
        ))}

        {casesMatch.length === 0 && (
          <div className="col-span-full py-16 text-center bg-white rounded-xl border border-light-gray border-dashed">
            <svg className="w-12 h-12 text-dark-slate/20 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
            </svg>
            <h3 className="text-lg font-bold text-dark-slate mb-1">Nenhum resultado encontrado</h3>
            <p className="text-sm text-dark-slate/60">Tente ajustar a sua pesquisa ou limpe os filtros selecionados.</p>
          </div>
        )}
      </div>
    </div>
  )
}
