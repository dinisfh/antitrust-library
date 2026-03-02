import SearchBar from '@/components/SearchBar'
import { HeroText } from '@/components/HomeText'
import { Suspense } from 'react'
import { CasesFeed, CasesFeedSkeleton } from '@/components/CasesFeed'

export default async function Home(props: {
  searchParams?: Promise<{
    query?: string
    sector?: string
    authority?: string
    status?: string
    caseType?: string
  }>
}) {
  const searchParams = await props.searchParams

  const query = searchParams?.query || ''
  const sectors = searchParams?.sector ? searchParams.sector.split(',') : []
  const authorities = searchParams?.authority ? searchParams.authority.split(',') : []
  const statuses = searchParams?.status ? searchParams.status.split(',') : []
  const caseTypes = searchParams?.caseType ? searchParams.caseType.split(',') : []

  const suspenseKey = JSON.stringify({ query, sectors, authorities, statuses, caseTypes })

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <HeroText />

        <Suspense fallback={<div className="w-full md:w-96 h-10 bg-gray-100 animate-pulse rounded-lg"></div>}>
          <SearchBar />
        </Suspense>
      </div>

      <Suspense key={suspenseKey} fallback={<CasesFeedSkeleton />}>
        <CasesFeed
          query={query}
          sectors={sectors}
          authorities={authorities}
          statuses={statuses}
          caseTypes={caseTypes}
        />
      </Suspense>
    </div>
  )
}
