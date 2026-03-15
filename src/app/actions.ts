'use server'

import { createClient } from '@/utils/supabase/server'

export type CaseMatch = {
    id: string
    title: string
    summary: string
    authority: string
    geography: string | null
    status: string
    industry: string
    tags: string[]
    parties_involved: string[]
    fine_amount: string | null
    decision_date: string | null
    start_date: string | null
    citations_count: number | null
    links: string[]
    created_at: string
}

export async function getCases(
    searchQuery?: string, 
    sectorFilters?: string[], 
    authorityFilters?: string[], 
    statusFilters?: string[], 
    caseTypeFilters?: string[],
    geographyFilters?: string[],
    companyFilters?: string[],
    decadeFilters?: string[],
    sortBy?: string,
    page: number = 1,
    limit: number = 20
) {
    const supabase = await createClient()

    // Atualizado para buscar os novos campos e respeitar o limite, e pedir a contagem otimizada
    let query = supabase.from('Cases').select('id, title, summary, authority, geography, status, industry, tags, parties_involved, fine_amount, decision_date, start_date, citations_count, links, created_at', { count: 'exact' })
    
    // Configurar o Sorting principal
    if (sortBy === 'cited') {
        query = query.order('citations_count', { ascending: false, nullsFirst: false }).order('created_at', { ascending: false })
    } else if (sortBy === 'alphabetical') {
        query = query.order('title', { ascending: true })
    } else {
        // Most recent (default)
        query = query.order('created_at', { ascending: false })
    }

    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    // Full Text Search on Title or Summary
    if (searchQuery) {
        // using generic .or pattern for partial text search
        query = query.or(`title.ilike.%${searchQuery}%,summary.ilike.%${searchQuery}%`)
    }

    // Array checks - Atualizado para coincidir com as colunas da Fase 5
    if (sectorFilters && sectorFilters.length > 0) {
        query = query.in('industry', sectorFilters)
    }

    if (authorityFilters && authorityFilters.length > 0) {
        query = query.in('authority', authorityFilters)
    }

    if (statusFilters && statusFilters.length > 0) {
        query = query.in('status', statusFilters)
    }

    if (geographyFilters && geographyFilters.length > 0) {
        query = query.in('geography', geographyFilters)
    }

    if (companyFilters && companyFilters.length > 0) {
        query = query.overlaps('parties_involved', companyFilters)
    }

    if (decadeFilters && decadeFilters.length > 0) {
        // Implementar lógica de décadas de forma simplificada: verificando se o decision_date contém um dos anos da década
        // Como o decision_date é texto (Ex: '2023-09-01' ou 'Sept 2023' ou '2020-2023'), vamos verificar se contém os anos específicos com `or`
        // Dado a complexidade disto num campo texto livre, a forma mais segura no Supabase é filtrar por correspondência das strings do ano.
        const yearConditions = decadeFilters.flatMap(decade => {
            const startYear = parseInt(decade.split('-')[0], 10);
            return Array.from({ length: 10 }, (_, i) => `decision_date.ilike.%${startYear + i}%`);
        });
        if (yearConditions.length > 0) {
            query = query.or(yearConditions.join(','));
        }
    }

    if (caseTypeFilters && caseTypeFilters.length > 0) {
        // Neste momento a API guarda como tags
        query = query.overlaps('tags', caseTypeFilters)
    }

    const { data, error, count } = await query

    if (error) {
        console.error('Error fetching cases:', error)
        return { data: [], count: 0 }
    }

    return { 
        data: data as CaseMatch[], 
        count: count || 0 
    }
}

export async function getCaseById(id: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('Cases')
        .select('*')
        .eq('id', id)
        .single()

    if (error || !data) {
        console.error('Error fetching case by ID:', error)
        return null
    }

    return data as CaseMatch
}

export async function getUniqueFilters() {
    const supabase = await createClient()

    // Query apenas as colunas necessárias para extrair os filtros únicos
    const { data, error } = await supabase
        .from('Cases')
        .select('authority, industry, status, geography, parties_involved, decision_date')

    if (error || !data) {
        console.error('Error fetching unique filters:', error)
        return { authorities: [], industries: [], statuses: [], tags: [], geographies: [], companies: [], decades: [] }
    }

    const authorities = new Set<string>()
    const industries = new Set<string>()
    const statuses = new Set<string>()
    const tags = new Set<string>()
    const geographies = new Set<string>()
    const companies = new Set<string>()
    const decades = new Set<string>()

    data.forEach(c => {
        if (c.authority && c.authority !== 'N/A') authorities.add(c.authority)
        if (c.industry && c.industry !== 'N/A') industries.add(c.industry)
        if (c.status && c.status !== 'N/A') statuses.add(c.status)
        if (c.geography && c.geography !== 'N/A') geographies.add(c.geography)
        if (c.parties_involved && Array.isArray(c.parties_involved)) {
            c.parties_involved.forEach((p: string) => { if (p) companies.add(p) })
        }
        
        // Infer decade from decision_date
        if (c.decision_date) {
            const match = c.decision_date.match(/\b(19|20)\d{2}\b/);
            if (match) {
                const year = parseInt(match[0], 10);
                const startDecade = Math.floor(year / 10) * 10;
                decades.add(`${startDecade}-${startDecade + 9}`);
            }
        }
    })

    // Hardcode case types as requested
    const caseTypes = [
        'Abuse of dominance', 
        'Merger control', 
        'Cartel', 
        'Market investigation', 
        'Platform regulation'
    ];

    return {
        authorities: Array.from(authorities).sort(),
        industries: Array.from(industries).sort(),
        statuses: Array.from(statuses).sort(),
        geographies: Array.from(geographies).sort(),
        companies: Array.from(companies).sort(),
        decades: Array.from(decades).sort().reverse(),
        tags: caseTypes
    }
}

export async function signOutAction() {
    const supabase = await createClient()
    await supabase.auth.signOut()
}
