'use server'

import { createClient } from '@/utils/supabase/server'

export type CaseMatch = {
    id: string
    title: string
    summary: string
    content?: string
    parties_involved: string[]
    case_type: string[]
    sector: string[]
    authority: string
    status: string
    outcome_type: string[]
    fine_amount_eur: number | null
    date_opened: string
    date_decided: string | null
    source_urls: { name: string; url: string }[]
}

export async function getCases(searchQuery?: string, sectorFilters?: string[], authorityFilters?: string[], statusFilters?: string[], caseTypeFilters?: string[]) {
    const supabase = await createClient()

    let query = supabase.from('Cases').select('*').order('date_opened', { ascending: false })

    // Full Text Search on Title or Summary
    if (searchQuery) {
        // using generic .or pattern for partial text search
        query = query.or(`title.ilike.%${searchQuery}%,summary.ilike.%${searchQuery}%`)
    }

    // Array checks
    if (sectorFilters && sectorFilters.length > 0) {
        query = query.overlaps('sector', sectorFilters)
    }

    if (authorityFilters && authorityFilters.length > 0) {
        query = query.in('authority', authorityFilters)
    }

    if (statusFilters && statusFilters.length > 0) {
        query = query.in('status', statusFilters)
    }

    if (caseTypeFilters && caseTypeFilters.length > 0) {
        query = query.overlaps('case_type', caseTypeFilters)
    }

    const { data, error } = await query

    if (error) {
        console.error('Error fetching cases:', error)
        return []
    }

    return data as CaseMatch[]
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
