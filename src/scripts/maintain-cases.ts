// src/scripts/maintain-cases.ts
import fs from 'fs';
import path from 'path';

const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;

type TimelineEvent = {
    date: string;
    description: string;
};

// Estrutura que reflete a nossa BD
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

type CaseUpdateInfo = {
    has_updates: boolean;
    new_status: string | null;
    new_fine_amount: string | null;
    new_timeline_events: TimelineEvent[];
    new_links: string[];
};

/**
 * Consulta o Perplexity para saber se houve novidades sobre um caso específico.
 * Usa o modelo sonar que tem acesso à web em tempo real.
 */
async function checkCaseUpdates(caseData: CaseData): Promise<CaseUpdateInfo | null> {
    const lastEventDate = caseData.timeline_events.length > 0
        ? caseData.timeline_events[caseData.timeline_events.length - 1].date
        : "o início do caso";

    const prompt = `
You are an expert antitrust legal researcher.
Check for any recent news, court rulings, appeals, or fine updates regarding the following antitrust case:
Title: ${caseData.title}
Parties: ${caseData.parties_involved.join(', ')}
Authority: ${caseData.authority}
Current Known Status: ${caseData.status}
Last Known Event Date: ${lastEventDate}

Search the web for any developments that occurred AFTER ${lastEventDate}.
If there are completely new developments, status changes (e.g., from Open to Closed, or Appealed), or new fines applied, return them.

OUTPUT FORMAT:
You MUST return ONLY a valid JSON object. Do NOT wrap it in markdown block quotes. Use this exact structure:
{
  "has_updates": true or false,
  "new_status": "Updated status if changed, or null if it remains ${caseData.status}",
  "new_fine_amount": "New fine amount if newly applied/changed, or null",
  "new_timeline_events": [
    { "date": "YYYY-MM-DD", "description": "Short description of the new event" }
  ],
  "new_links": ["Array of new URLs (news/official) confirming the updates. Empty array if none."]
}
`;

    try {
        const response = await fetch("https://api.perplexity.ai/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${PERPLEXITY_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "sonar", // Modelo focado em web search
                messages: [
                    { role: "system", content: "You are a helpful assistant that outputs strictly valid JSON." },
                    { role: "user", content: prompt }
                ],
                temperature: 0.1
            })
        });

        if (!response.ok) {
            console.error(`\u274c Erro na API do Perplexity para ${caseData.title}:`, await response.text());
            return null;
        }

        const data = await response.json();
        let resultText = data.choices[0].message.content.trim();

        // Ocasionalmente as IAs ignoram a instrução e enviam validação markdown. Vamos limpar por segurança:
        resultText = resultText.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();

        try {
            return JSON.parse(resultText) as CaseUpdateInfo;
        } catch (parseError) {
            console.error(`\u274c JSON Inválido da Perplexity para ${caseData.title}:`, resultText);
            return null;
        }

    } catch (error) {
        console.error(`\u274c Erro de rede/fetch:`, error);
        return null;
    }
}

async function runMaintenance() {
    if (!PERPLEXITY_API_KEY) {
        console.error("❌ ERRO: A variável de ambiente PERPLEXITY_API_KEY não está definida.");
        process.exit(1);
    }

    const inputJsonPath = path.join(process.cwd(), 'data', 'processed_cases.json');
    if (!fs.existsSync(inputJsonPath)) {
        console.error(`❌ Ficheiro ${inputJsonPath} não encontrado!`);
        process.exit(1);
    }

    console.log(`\n\u25b6 Iniciando Manutenção de Casos (via Perplexity)...`);
    const cases: CaseData[] = JSON.parse(fs.readFileSync(inputJsonPath, 'utf8'));

    let updatedCount = 0;

    for (let i = 0; i < cases.length; i++) {
        const c = cases[i];

        // Regra de negócio: Só procurar updates em casos que não estejam fechados há mais de X anos, 
        // ou simplesmente procurar sempre para os casos que têm status "Open" / "Under Appeal".
        // Para simplificar, neste teste, limitamos a verificar todos:
        console.log(`\n[\u23f3 ${i + 1}/${cases.length}] Verificando atualizações para: ${c.title} (Status Atual: ${c.status})`);

        const updates = await checkCaseUpdates(c);

        if (updates && updates.has_updates) {
            console.log(`\u2705 Foram encontradas novidades!`);

            if (updates.new_status) {
                console.log(`   - Status mudou de ${c.status} para ${updates.new_status}`);
                c.status = updates.new_status;
            }
            if (updates.new_fine_amount) {
                console.log(`   - Nova multa reportada: ${updates.new_fine_amount}`);
                c.fine_amount = updates.new_fine_amount;
            }
            if (updates.new_timeline_events && updates.new_timeline_events.length > 0) {
                console.log(`   - Adicionados ${updates.new_timeline_events.length} novos eventos à timeline.`);
                c.timeline_events.push(...updates.new_timeline_events);
            }
            if (updates.new_links && updates.new_links.length > 0) {
                c.links.push(...updates.new_links);
            }

            updatedCount++;
            // Guardar progressivamente
            fs.writeFileSync(inputJsonPath, JSON.stringify(cases, null, 2));
        } else if (updates && !updates.has_updates) {
            console.log(`\u25ab Sem novidades relevantes desde o último check.`);
        }
    }

    console.log(`\n\u2728 Manutenção Concluída! ${updatedCount} caso(s) receberam atualizações de factos.`);
}

runMaintenance();
