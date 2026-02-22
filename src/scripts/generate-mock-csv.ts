import fs from 'fs';

const baseRow = {
    id: '',
    title: 'Dummy Case',
    authority: 'EC',
    industry: 'Tech',
    status: 'Open',
    summary: 'In depth antitrust investigation regarding alleged anti-competitive practices.'
};

const rows = [];
for (let i = 0; i < 50; i++) {
    rows.push({
        ...baseRow,
        title: `Antitrust Investigation of Tech Corp ${i + 1}`,
        authority: i % 2 === 0 ? 'European Commission' : 'FTC',
        industry: i % 3 === 0 ? 'Digital Markets' : 'Telecommunications',
        status: i % 4 === 0 ? 'Fined' : 'In Progress',
    });
}

const csvHeader = Object.keys(rows[0]).join(',');
const csvRows = rows.map(r => Object.values(r).map(v => `"${v}"`).join(','));
const csvData = [csvHeader, ...csvRows].join('\n');

fs.writeFileSync('data/sample-50-cases.csv', csvData);
console.log('50 Mock Cases CSV Generated!');
