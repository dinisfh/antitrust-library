import SearchBar from '@/components/SearchBar'
import { HeroText } from '@/components/HomeText'
import { Suspense } from 'react'
import { CasesFeed, CasesFeedSkeleton } from '@/components/CasesFeed'
import { createClient } from '@/utils/supabase/server'

export default async function Home(props: {
  searchParams?: Promise<{
    query?: string
    sector?: string
    authority?: string
    status?: string
    caseType?: string
    geography?: string
    company?: string
    decade?: string
    sortBy?: string
  }>
}) {
  const searchParams = await props.searchParams

  const query = searchParams?.query || ''
  const sectors = searchParams?.sector ? searchParams.sector.split(',') : []
  const authorities = searchParams?.authority ? searchParams.authority.split(',') : []
  const statuses = searchParams?.status ? searchParams.status.split(',') : []
  const caseTypes = searchParams?.caseType ? searchParams.caseType.split(',') : []
  const geographies = searchParams?.geography ? searchParams.geography.split(',') : []
  const companies = searchParams?.company ? searchParams.company.split(',') : []
  const decades = searchParams?.decade ? searchParams.decade.split(',') : []
  const sortBy = searchParams?.sortBy || 'recent'

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  let isAdmin = false
  if (user) {
    const { data: profile } = await supabase.from('Users').select('role').eq('id', user.id).single()
    if (profile?.role === 'Admin') {
      isAdmin = true
    }
  }

  const suspenseKey = JSON.stringify({ query, sectors, authorities, statuses, caseTypes, geographies, companies, decades, sortBy })

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
          geographies={geographies}
          companies={companies}
          decades={decades}
          sortBy={sortBy}
        />
      </Suspense>
    </div>
  )
}
