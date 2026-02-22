import { NextResponse } from 'next/server'
import { createAdminClient } from '@/utils/supabase/admin'

// Chave da API (definida no .env.local)
const INGEST_API_KEY = process.env.INGEST_API_KEY || 'development_key_only'

// Tipo do Payload Esperado
type IngestPayload = {
    title: string
    summary: string
    authority: string
    status?: string // Ex: Em Investigação, Decidido
    industry?: string
    tags?: string[]
    parties_involved?: string[]
    fine_amount?: string | null
    decision_date?: string | null
    link: string // Será adicionado ao array de links
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
        if (!body.title || !body.authority || !body.link) {
            return NextResponse.json({ error: 'Missing required fields: title, authority, link' }, { status: 400 })
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
            // 4a. O Caso existe -> Fazer Append do Link (se não existir já lá)
            const existingCase = existingCases[0]
            const currentUrls = existingCase.links || []

            const isDuplicateUrl = currentUrls.includes(body.link)

            if (!isDuplicateUrl) {
                const updatedUrls = [...currentUrls, body.link]

                const { error: updateError } = await supabase
                    .from('Cases')
                    .update({ links: updatedUrls })
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
                    authority: body.authority,
                    status: body.status || 'Em Investigação',
                    industry: body.industry || 'Genérico',
                    tags: body.tags || [],
                    parties_involved: body.parties_involved || [],
                    fine_amount: body.fine_amount || null,
                    decision_date: body.decision_date || null,
                    links: [body.link]
                })
                .select('id')
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
