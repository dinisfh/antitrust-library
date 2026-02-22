// src/scripts/seed-bulk.ts
import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Define a estrutura desejada baseada no nosso schema (semelhante ao test-ai.ts)
type CaseExtraction = {
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
    timeline_events: Array<{ date: string; description: string }>;
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
  "summary": "Must be AT LEAST 4 to 6 long, comprehensive paragraphs recounting the case formatted in RICH MARKDOWN. You MUST use Markdown Headings (e.g. ### Background, ### Theory of Harm, ### Outcome), bulleted lists, and **bold text** to make it extremely engaging and readable. If the case involves complex timelines, structural market changes, or financial transfers, you MUST include exactly ONE mermaid diagram using standard Markdown syntax (\`\`\`mermaid ... \`\`\`) to visually explain the relationships or timelines. Be extremely thorough, elegant, and legally sound. DO NOT write short summaries.",
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

    console.log(`\n\u25b6 Iniciando Bulk Data Processing (${csvFilePath})...`);
    const fileContent = fs.readFileSync(csvFilePath, 'utf8');

    // Faz o parse do CSV
    Papa.parse(fileContent, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
            const rows = results.data;
            console.log(`\u25b6 Foram encontradas ${rows.length} linhas para processar.`);

            const processedCases: CaseExtraction[] = [];

            // Alteração Pedida: Limitar de forma rígida a um batch experimental de 50 casos.
            const limit = Math.min(rows.length, 50);
            console.log(`\u25b6 Vamos processar apenas as primeiras ${limit} linhas (Controlo de Faturação AI).`);

            // Processa uma linha de cada vez (pode ser iterado com Promise.all para ser mais rápido noutra fase,
            // mas sequencial é mais seguro para não rebentar rate limits com grandes lotes)
            for (let i = 0; i < limit; i++) {
                const row = rows[i] as any;
                console.log(`\n[\u23f3 ${i + 1}/${limit}] A processar: ${row.title || 'Linha ' + i} ...`);

                const extractedData = await processRowWithAI(row);

                if (extractedData) {
                    processedCases.push(extractedData);
                    console.log(`[\u2705 ${i + 1}/${rows.length}] Sucesso! Extraídas ${extractedData.tags.length} tags: ${extractedData.tags.join(', ')}`);
                }

                // Guarda progressivamente (útil se o script falhar a meio de 10 mil linhas)
                fs.writeFileSync(outputJsonPath, JSON.stringify(processedCases, null, 2));
            }

            console.log(`\n\u2728 Bulk Import Concluído! ${processedCases.length}/${rows.length} casos guardados em: ${outputJsonPath}`);
        }
    });
}

// Executar script definindo os caminhos corretos (podem depois vir por argumentos de linha de comandos)
const inputCsv = path.join(process.cwd(), 'data', 'sample-50-real-cases.csv');
const outputJson = path.join(process.cwd(), 'data', 'processed_cases.json');

runBulkImport(inputCsv, outputJson);
