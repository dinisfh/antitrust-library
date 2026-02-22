// src/scripts/test-ai.ts
// Script de teste para extrair dados de um caso antitrust usando uma API de LLM (OpenAI)

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

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

async function testExtraction(query: string) {
    if (!OPENAI_API_KEY) {
        console.error("❌ ERRO: A variável de ambiente OPENAI_API_KEY não está definida.");
        console.error("Adiciona-a ao .env.local e corre o comando incluindo: --env-file=.env.local");
        process.exit(1);
    }

    console.log(`\u25b6 Iniciando extração para a query: "${query}"...`);

    // System Prompt que diz ao modelo EXATAMENTE como estruturar os dados JSON
    const systemPrompt = `
You are an expert antitrust and competition law assistant. 
Your task is to extract information regarding a specific antitrust case and output ONLY a valid JSON object matching the following structure.
DO NOT wrap the response in markdown code blocks like \`\`\`json. Just return the raw JSON object.

{
  "title": "Case Name (e.g., European Commission vs Google Shopping)",
  "summary": "2-3 paragraphs summarizing the case, the core theory of harm, and the outcome.",
  "authority": "Agencia (e.g., EC, FTC, CMA, AdC)",
  "status": "Current status (e.g., Open, Closed, Under Appeal, Fined)",
  "industry": "Broad industry sector (e.g., Technology, Pharmaceuticals)",
  "tags": ["Array", "Of", "Relevant", "Keywords", "like Cartel, Abuse of Dominance"],
  "parties_involved": ["Array", "Of", "Companies", "Involved"],
  "fine_amount": "Total fine amount as a string (e.g., '€2.42 billion') or null if none.",
  "decision_date": "YYYY-MM-DD or close equivalent, or null.",
  "links": ["Array", "Of", "Relevant", "Official", "Or", "News", "URLs", "about", "the case"],
  "timeline_events": [
    { "date": "YYYY-MM-DD", "description": "Short description of event" }
  ]
}

If you cannot find exact dates or links, use your best knowledge. Return ONLY the JSON object.
`;

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: "gpt-4o", // Usa gpt-4o ou gpt-4o-mini
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: `Please extract details for the following antitrust case: ${query}` },
                ],
                temperature: 0.1, // temperatura baixa para dados mais determinísticos e fiáveis
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("❌ ERRO da API da OpenAI:", errorText);
            return;
        }

        const data = await response.json();
        const resultText = data.choices[0].message.content.trim();

        try {
            // Tenta fazer o parse do output gerado pela IA (esperando que seja um JSON válido)
            const parsedCase: CaseExtraction = JSON.parse(resultText);
            console.log("\u2705 Extração Concluída com Sucesso!");
            console.log(JSON.stringify(parsedCase, null, 2));
        } catch (parseError) {
            console.error("❌ A IA não retornou um JSON válido:", resultText);
        }
    } catch (error) {
        console.error("❌ Erro fatal ao ligar à API:", error);
    }
}

// Execução de teste
const testQuery = "Microsoft Activision merger UK CMA FTC";
testExtraction(testQuery);
