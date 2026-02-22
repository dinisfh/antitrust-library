'use server'

import { createClient } from '@/utils/supabase/server'

export type CaseMatch = {
    id: string
    title: string
    summary: string
    authority: string
    status: string
    industry: string
    tags: string[]
    parties_involved: string[]
    fine_amount: string | null
    decision_date: string | null
    links: string[]
    created_at: string
}

export async function getCases(searchQuery?: string, sectorFilters?: string[], authorityFilters?: string[], statusFilters?: string[], caseTypeFilters?: string[]) {
    const supabase = await createClient()

    // Atualizado para usar created_at em vez do obsoleto date_opened
    let query = supabase.from('Cases').select('*').order('created_at', { ascending: false })

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

    if (caseTypeFilters && caseTypeFilters.length > 0) {
        // Neste momento a API guarda como tags
        query = query.overlaps('tags', caseTypeFilters)
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
