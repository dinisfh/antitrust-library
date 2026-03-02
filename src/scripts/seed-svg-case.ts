import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY // Use service role for bypassing RLS if needed

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials. Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const svgCase = {
    title: "CMA Market Study into Mobile Ecosystems (SVG Example)",
    summary: `
### Background
The Competition and Markets Authority (CMA) conducted a comprehensive market study into mobile ecosystems. They identified several areas of concern, notably the effective duopoly of Apple and Google.

### Structural Market Overview
Here is a visual representation of how the mobile ecosystem operates, using a custom SVG:

\`\`\`svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400" width="100%" height="100%">
  <!-- Background -->
  <rect width="100%" height="100%" fill="#f8fafc" rx="12" ry="12"></rect>
  
  <!-- Central Concept: Mobile Devices -->
  <rect x="300" y="150" width="200" height="100" rx="10" ry="10" fill="#3b82f6" stroke="#2563eb" stroke-width="3"></rect>
  <text x="400" y="200" font-family="sans-serif" font-size="20" font-weight="bold" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">Mobile Ecosystems</text>
  
  <!-- Player 1: Apple -->
  <circle cx="200" cy="150" r="60" fill="#ef4444" stroke="#dc2626" stroke-width="3"></circle>
  <text x="200" y="150" font-family="sans-serif" font-size="18" font-weight="bold" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">Apple</text>
  
  <!-- Player 2: Google -->
  <circle cx="200" cy="250" r="60" fill="#10b981" stroke="#059669" stroke-width="3"></circle>
  <text x="200" y="250" font-family="sans-serif" font-size="18" font-weight="bold" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">Google</text>
  
  <!-- Component: App Stores -->
  <rect x="550" y="100" width="150" height="60" rx="8" ry="8" fill="#8b5cf6" stroke="#7c3aed" stroke-width="2"></rect>
  <text x="625" y="130" font-family="sans-serif" font-size="16" font-weight="bold" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">App Stores</text>
  
  <!-- Component: Browsers -->
  <rect x="550" y="240" width="150" height="60" rx="8" ry="8" fill="#8b5cf6" stroke="#7c3aed" stroke-width="2"></rect>
  <text x="625" y="270" font-family="sans-serif" font-size="16" font-weight="bold" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">Browsers</text>
  
  <!-- Connections -->
  <path d="M 260 150 Q 300 150 300 200" fill="none" stroke="#94a3b8" stroke-width="4" stroke-dasharray="8,4"></path>
  <path d="M 260 250 Q 300 250 300 200" fill="none" stroke="#94a3b8" stroke-width="4" stroke-dasharray="8,4"></path>
  
  <path d="M 500 200 Q 525 200 550 130" fill="none" stroke="#94a3b8" stroke-width="4" marker-end="url(#arrow)"></path>
  <path d="M 500 200 Q 525 200 550 270" fill="none" stroke="#94a3b8" stroke-width="4" marker-end="url(#arrow)"></path>
  
  <!-- Arrow definition -->
  <defs>
    <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L0,6 L9,3 z" fill="#94a3b8" />
    </marker>
  </defs>
</svg>
\`\`\`

### Outcome
The study concluded that these ecosystems are highly concentrated, recommending possible regulatory interventions to open up app stores and browser engines.
  `,
    authority: "CMA",
    status: "Closed",
    industry: "Technology",
    tags: ["Market Study", "Ecosystems", "App Stores", "Mobile"],
    parties_involved: ["Apple", "Google"],
    fine_amount: null,
    decision_date: "2022-06-10",
    links: ["https://www.gov.uk/cma-cases/mobile-ecosystems-market-study"],
}

async function seed() {
    console.log('Seeding SVG sample case...')
    const { data, error } = await supabase
        .from('Cases')
        .insert([svgCase])
        .select()

    if (error) {
        console.error('Error inserting case:', error)
    } else {
        console.log('Successfully inserted case:', data[0].id)
    }
}

seed()
