import { NextResponse } from 'next/server'
import { createAdminClient } from '@/utils/supabase/admin'

// Chave da API (definida no .env.local)
const INGEST_API_KEY = process.env.INGEST_API_KEY || 'development_key_only'

// Tipo do Payload Esperado
type IngestPayload = {
    title: string
    summary: string
    parties_involved: string[]
    case_type: string[]
    sector: string[]
    authority: string
    status: string
    outcome_type: string[]
    fine_amount_eur?: number | null
    date_opened: string
    date_decided?: string | null
    source_url: { name: string; url: string }
}

export async function POST(request: Request) {
    // 1. Validar Bearer Token
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json({ error: 'Missing or invalid Authorization header' }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]
    if (token !== INGEST_API_KEY) {
        return NextResponse.json({ error: 'Unauthorized API Key' }, { status: 401 })
    }

    try {
        const body: IngestPayload = await request.json()

        // 2. Validar payload base (Opcionalmente Zod pode ser usado aqui)
        if (!body.title || !body.authority || !body.source_url) {
            return NextResponse.json({ error: 'Missing required fields: title, authority, source_url' }, { status: 400 })
        }

        const supabase = createAdminClient() // Usar Admin Client porque rotas server-to-server não têm Auth Context

        // 3. Lógica de Deduplicação
        // Vamos procurar por uma entrada exata (por título e autoridade) - dependendo da flexibilidade podes usar ILIKE
        const { data: existingCases, error: searchError } = await supabase
            .from('Cases')
            .select('*')
            .eq('authority', body.authority)
            .ilike('title', `%${body.title}%`)
            .limit(1)

        if (searchError) {
            console.error(searchError)
            return NextResponse.json({ error: 'Database error finding case' }, { status: 500 })
        }

        if (existingCases && existingCases.length > 0) {
            // 4a. O Caso existe -> Fazer Append da source_url (se não existir já lá)
            const existingCase = existingCases[0]
            const currentUrls = existingCase.source_urls || []

            const isDuplicateUrl = currentUrls.some((s: any) => s.url === body.source_url.url)

            if (!isDuplicateUrl) {
                const updatedUrls = [...currentUrls, body.source_url]

                const { error: updateError } = await supabase
                    .from('Cases')
                    .update({ source_urls: updatedUrls })
                    .eq('id', existingCase.id)

                if (updateError) throw updateError

                return NextResponse.json({
                    message: 'Case appended successfully.',
                    action: 'APPEND',
                    case_id: existingCase.id
                })
            }

            return NextResponse.json({
                message: 'Case exists and URL already ingested.',
                action: 'SKIPPED',
                case_id: existingCase.id
            })

        } else {
            // 4b. O Caso é Novo -> Inserir
            const { data: insertData, error: insertError } = await supabase
                .from('Cases')
                .insert({
                    title: body.title,
                    summary: body.summary,
                    parties_involved: body.parties_involved || [],
                    case_type: body.case_type || [],
                    sector: body.sector || [],
                    authority: body.authority,
                    status: body.status || 'Em Investigação',
                    outcome_type: body.outcome_type || [],
                    fine_amount_eur: body.fine_amount_eur || null,
                    date_opened: body.date_opened || new Date().toISOString().split('T')[0],
                    date_decided: body.date_decided || null,
                    source_urls: [body.source_url]
                })
                .select()
                .single()

            if (insertError) throw insertError

            return NextResponse.json({
                message: 'Case created successfully.',
                action: 'CREATED',
                case_id: insertData.id
            }, { status: 201 })
        }

    } catch (error: any) {
        console.error('Ingest API Error:', error)
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 })
    }
}
