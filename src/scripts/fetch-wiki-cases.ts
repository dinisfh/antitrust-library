import fs from 'fs';
import path from 'path';

async function fetchWikiCategory(category: string, limit: number) {
    const url = `https://en.wikipedia.org/w/api.php?action=query&list=categorymembers&cmtitle=${category}&cmlimit=${limit}&format=json`;
    const res = await fetch(url);
    const data = await res.json();
    if (!data.query || !data.query.categorymembers) return [];
    return data.query.categorymembers.map((m: any) => m.pageid);
}

async function fetchPageExtracts(pageIds: number[]) {
    const ids = pageIds.join('|');
    const url = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exchars=2000&explaintext=1&pageids=${ids}&format=json`;
    const res = await fetch(url);
    const data = await res.json();
    return Object.values(data.query.pages).map((p: any) => ({
        title: p.title,
        url: `https://en.wikipedia.org/?curid=${p.pageid}`,
        summary: p.extract ? p.extract.replace(/\n/g, ' ').replace(/"/g, '""') : 'No summary provided.'
    }));
}

async function main() {
    console.log("📥 Fetching 25 US Supreme Court / Circuit Antitrust cases...");
    const usIds = await fetchWikiCategory("Category:United_States_antitrust_case_law", 25);

    console.log("📥 Fetching 25 European Commission Antitrust cases...");
    const euIds = await fetchWikiCategory("Category:European_Union_competition_case_law", 25);

    const allIds = [...usIds, ...euIds];
    const cases = [];

    console.log(`\n⏳ Fetching comprehensive descriptions for ${allIds.length} real cases from Wikipedia...`);
    for (let i = 0; i < allIds.length; i += 20) {
        const chunk = allIds.slice(i, i + 20);
        const extracts = await fetchPageExtracts(chunk);
        cases.push(...extracts);
    }

    const csvHeader = 'title,url,summary';
    const csvRows = cases.map(c => `"${c.title}","${c.url}","${c.summary}"`);
    const csvData = [csvHeader, ...csvRows].join('\n');

    const outputPath = path.join(process.cwd(), 'data', 'sample-50-real-cases.csv');
    fs.writeFileSync(outputPath, csvData);
    console.log(`\n✅ Saved ${cases.length} REAL world cases to ${outputPath}`);
}

main().catch(console.error);
