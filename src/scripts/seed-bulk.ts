// src/scripts/seed-bulk.ts
import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
dotenv.config({ path: '.env.local' });

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Define a estrutura desejada baseada no nosso schema (semelhante ao test-ai.ts)
type CaseExtraction = {
    title: string;
    summary: string; // Used as the Outcome/General overview
    authority: string;
    status: string;
    industry: string;
    tags: string[];
    parties_involved: string[];
    fine_amount: string | null;
    decision_date: string | null;
    links: string[];
    timeline_events: Array<{ date: string; description: string }>;
    // New fields
    outcome?: string;
    market?: string;
    conduct?: string;
    theory_of_harm?: string;
    economics_issues?: string;
    decision?: string;
};

async function processRowWithAI(row: any): Promise<CaseExtraction | null> {
    // Prepara os dados da linha para enviar à IA
    const promptData = JSON.stringify(row);

    const systemPrompt = `
You are an expert antitrust and competition law assistant. 
Your task is to take the raw, messy data from an antitrust dataset row (often CSV format) and transform it into a perfectly structured JSON object matching our database schema.
DO NOT wrap the response in markdown code blocks like \`\`\`json. Just return the raw JSON object.

Fill in the gaps as best as you can based on your knowledge, but prioritize the data provided. 

Expected JSON structure:
{
  "title": "Case Name (e.g., European Commission vs Google Shopping)",
  "authority": "Agency (e.g., EC, FTC, CMA, DOJ, Courts)",
  "status": "Current status (e.g., Open, Closed, Blocked, Fined)",
  "industry": "Broad industry sector (e.g., Technology, Healthcare, Entertainment)",
  "summary": "Must be exactly ONE very short paragraph (3-4 sentences max). This will be used as the preview text for the case card on the home page list. DO NOT generate any Markdown headings or SVG diagrams here.",
  "outcome": "MANDATORY. A single short sentence (max 15 words) describing the ultimate outcome of the case. E.g., 'Google found to have illegal monopoly in search.'",
  "market": "MANDATORY. Describe the relevant markets, exclusions, market share, barriers to entry, and competitors. Use RICH MARKDOWN (bulleted lists, bolding). Example: '- **General search engines**\\n- **Market share**: ~90% desktop'",
  "conduct": "MANDATORY. Detail the specific anti-competitive behavior or agreements. Use RICH MARKDOWN.",
  "theory_of_harm": "MANDATORY. Detail exactly why the conduct is harmful (e.g., exclusion of competitors, reduced innovation, user lock-in). Use RICH MARKDOWN.",
  "economics_issues": "MANDATORY. Describe the structural/economic issues like Network effects, Economies of scale, Switching costs, high entry barriers. Use RICH MARKDOWN.",
  "decision": "MANDATORY. Detail the judicial/agency decision, violation of laws (e.g. Sherman Act Section 2), and remedies natively. Use RICH MARKDOWN.",
  "tags": ["Array", "Of", "Relevant", "Keywords", "like Merger Control, Article 102, Cartel"],
  "parties_involved": ["Array", "Of", "Companies", "Involved"],
  "fine_amount": "Total fine amount as a string (e.g., '€2.42 billion') or null if none.",
  "decision_date": "YYYY-MM-DD or close equivalent. If there isn't a strict 'Judicial Decision', use the date of the Settlement, Fine, or the most significant concluding event of the case. DO NOT leave as null if the text mentions a concluding year.",
  "links": ["MUST INCLUDE the exact 'url' string provided in the row data as the VERY FIRST element, followed by any other legitimate Official or News URLs if you are 100% sure they exist. DO NOT HALLUCINATE LINKS."],
  "timeline_events": [
    { "date": "YYYY-MM-DD", "description": "Short description of event" }
  ]
}
`;

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: "gpt-4o-mini", // ✅ Usando o modelo mais barato e perfeitamente capaz
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: `Please structure this raw dataset row into the required JSON. Row data: ${promptData}` },
                ],
                temperature: 0.1,
            }),
        });

        if (!response.ok) {
            console.error(`\u274c Erro na API (Row: ${row.title || 'Unknown'}):`, await response.text());
            return null;
        }

        const data = await response.json();
        const resultText = data.choices[0].message.content.trim();

        try {
            return JSON.parse(resultText) as CaseExtraction;
        } catch (parseError) {
            console.error(`\u274c JSON Inválido da IA (Row: ${row.title || 'Unknown'}):`, resultText);
            return null;
        }
    } catch (error) {
        console.error(`\u274c Erro de rede/fetch (Row: ${row.title || 'Unknown'}):`, error);
        return null;
    }
}

async function runBulkImport(csvFilePath: string, outputJsonPath: string) {
    if (!OPENAI_API_KEY) {
        console.error("❌ ERRO: A variável de ambiente OPENAI_API_KEY não está definida.");
        process.exit(1);
    }

    if (!fs.existsSync(csvFilePath)) {
        console.error(`❌ Ficheiro CSV não encontrado em: ${csvFilePath}`);
        process.exit(1);
    }

    // --- 1. Fetch existing titles from Supabase ---
    console.log('\n🔍 A verificar títulos já existentes no Supabase...');
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { data: existingCases, error: fetchError } = await supabase
        .from('Cases')
        .select('title');
    if (fetchError) {
        console.error('❌ Erro ao buscar casos existentes:', fetchError);
        process.exit(1);
    }
    const existingTitles = new Set(
        (existingCases || []).map((c: any) => c.title.trim().toLowerCase())
    );
    console.log(`   ✅ ${existingTitles.size} títulos já existem na base de dados.`);

    console.log(`\n\u25b6 Iniciando Bulk Data Processing (${csvFilePath})...`);
    const fileContent = fs.readFileSync(csvFilePath, 'utf8');

    // Faz o parse do CSV
    Papa.parse(fileContent, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
            const rows = results.data as any[];
            console.log(`\u25b6 Foram encontradas ${rows.length} linhas no CSV.`);

            // --- 2. Filter to only rows NOT already in Supabase ---
            const newRows = rows.filter(row => {
                const t = (row.title || '').trim().toLowerCase();
                return t && !existingTitles.has(t);
            });

            console.log(`\u25b6 ${newRows.length} linhas novas encontradas para processar.`);

            if (newRows.length === 0) {
                console.log('\n✅ Nenhum caso novo para adicionar. O CSV está totalmente importado.');
                return;
            }

            // Limit batch to 10 at a time to control AI costs
            const targetRows = newRows.slice(0, 10);
            const limit = targetRows.length;
            console.log(`\u25b6 Vamos processar ${limit} novos casos nesta corrida.`);

            const processedCases: CaseExtraction[] = [];

            for (let i = 0; i < limit; i++) {
                const row = targetRows[i] as any;
                console.log(`\n[\u23f3 ${i + 1}/${limit}] A processar: ${row.title || 'Linha ' + i} ...`);

                const extractedData = await processRowWithAI(row);

                if (extractedData) {
                    processedCases.push(extractedData);
                    console.log(`[\u2705 ${i + 1}/${limit}] Sucesso! Extraídas ${extractedData.tags.length} tags: ${extractedData.tags.join(', ')}`);
                }

                // Guarda progressivamente
                fs.writeFileSync(outputJsonPath, JSON.stringify(processedCases, null, 2));
            }

            console.log(`\n\u2728 Bulk Import Concluído! ${processedCases.length}/${limit} casos guardados em: ${outputJsonPath}`);
        }
    });
}

// Executar script definindo os caminhos corretos
const inputCsv = path.join(process.cwd(), 'data', 'sample-50-real-cases.csv');
const outputJson = path.join(process.cwd(), 'data', 'processed_cases.json');

runBulkImport(inputCsv, outputJson);
