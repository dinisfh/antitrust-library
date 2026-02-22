// src/scripts/import-to-supabase.ts
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

type TimelineEvent = {
    date: string;
    description: string;
};

type CaseData = {
    title: string;
    summary: string;
    authority: string;
    status: string;
    industry: string;
    tags: string[];
    parties_involved: string[];
    fine_amount: string | null;
    decision_date: string | null;
    links: string[];
    timeline_events: TimelineEvent[];
};

async function runImport() {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
        console.error("❌ ERRO: Faltam variáveis de ambiente (URL ou Service Role Key do Supabase).");
        process.exit(1);
    }

    // Cria cliente Supabase bypassando RLS e autenticação usando o Service Role
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const inputJsonPath = path.join(process.cwd(), 'data', 'processed_cases.json');
    if (!fs.existsSync(inputJsonPath)) {
        console.error(`❌ Ficheiro ${inputJsonPath} não encontrado!`);
        process.exit(1);
    }

    console.log(`\n\u25b6 Carregando dados do JSON para o Supabase...`);
    const cases: CaseData[] = JSON.parse(fs.readFileSync(inputJsonPath, 'utf8'));

    let successCount = 0;

    for (let i = 0; i < cases.length; i++) {
        const c = cases[i];
        console.log(`[\u23f3 ${i + 1}/${cases.length}] Inserindo: ${c.title}...`);

        // 1. Inserir o documento Mestre (O Caso)
        const { data: insertedCase, error: caseError } = await supabase
            .from("Cases")
            .insert({
                title: c.title,
                summary: c.summary,
                authority: c.authority,
                status: c.status,
                industry: c.industry,
                tags: c.tags,
                parties_involved: c.parties_involved,
                fine_amount: c.fine_amount,
                decision_date: c.decision_date || null,
                links: c.links
            })
            .select('id')
            .single();

        if (caseError || !insertedCase) {
            console.error(`\u274c Erro ao inserir caso (${c.title}):`, caseError);
            continue;
        }

        // 2. Inserir Timeline Events ligados ao Caso Mestre caso existam
        if (c.timeline_events && c.timeline_events.length > 0) {
            const eventsToInsert = c.timeline_events.map(event => ({
                case_id: insertedCase.id,
                event_date: event.date,
                description: event.description
            }));

            const { error: timelineError } = await supabase
                .from("CaseTimelineEvents")
                .insert(eventsToInsert);

            if (timelineError) {
                console.error(`\u274c Erro ao inserir timeline para (${c.title}):`, timelineError);
            } else {
                console.log(`   \u2705 +${eventsToInsert.length} eventos históricos inseridos com sucesso!`);
            }
        }

        successCount++;
        console.log(`   \u2705 O caso Master foi guardado com o UUID: ${insertedCase.id}`);
    }

    console.log(`\n\u2728 Importação concluída! Guardados ${successCount} de ${cases.length} casos com sucesso no Supabase.`);
}

runImport();
