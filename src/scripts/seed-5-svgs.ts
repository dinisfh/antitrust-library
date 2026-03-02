import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials. Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const cases = [
  {
    title: "European Commission vs Intel (Rebates)",
    summary: `
### Background
The European Commission found that Intel engaged in anti-competitive practices by offering loyalty rebates to computer manufacturers on the condition that they bought all or almost all of their x86 CPUs from Intel.

### Fidelity Rebates Mechanics
Here is an SVG diagram illustrating how the fidelity rebates foreclosed the market to AMD.

\`\`\`svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400" width="100%" height="100%">
  <!-- Background -->
  <rect width="100%" height="100%" fill="#f8fafc" rx="12" ry="12"></rect>
  
  <!-- Market Dominant Player -->
  <rect x="50" y="150" width="160" height="80" rx="8" fill="#1e40af" stroke="#1e3a8a" stroke-width="3"></rect>
  <text x="130" y="190" font-family="sans-serif" font-size="20" font-weight="bold" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">Intel</text>
  
  <!-- Competitor -->
  <rect x="50" y="280" width="160" height="80" rx="8" fill="#16a34a" stroke="#15803d" stroke-width="3"></rect>
  <text x="130" y="320" font-family="sans-serif" font-size="20" font-weight="bold" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">AMD</text>
  
  <!-- OEM 1 -->
  <rect x="550" y="80" width="200" height="60" rx="8" fill="#475569" stroke="#334155" stroke-width="2"></rect>
  <text x="650" y="110" font-family="sans-serif" font-size="16" font-weight="bold" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">Dell</text>
  
  <!-- OEM 2 -->
  <rect x="550" y="160" width="200" height="60" rx="8" fill="#475569" stroke="#334155" stroke-width="2"></rect>
  <text x="650" y="190" font-family="sans-serif" font-size="16" font-weight="bold" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">HP</text>
  
  <!-- OEM 3 -->
  <rect x="550" y="240" width="200" height="60" rx="8" fill="#475569" stroke="#334155" stroke-width="2"></rect>
  <text x="650" y="270" font-family="sans-serif" font-size="16" font-weight="bold" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">Lenovo</text>
  
  <!-- Rebate Paths -->
  <path d="M 210 170 Q 380 110 540 110" fill="none" stroke="#eab308" stroke-width="6" marker-end="url(#arrow-yellow)"></path>
  <path d="M 210 190 Q 380 190 540 190" fill="none" stroke="#eab308" stroke-width="6" marker-end="url(#arrow-yellow)"></path>
  <path d="M 210 210 Q 380 270 540 270" fill="none" stroke="#eab308" stroke-width="6" marker-end="url(#arrow-yellow)"></path>

  <!-- Blocked Paths -->
  <path d="M 210 320 Q 380 270 520 270" fill="none" stroke="#ef4444" stroke-width="4" stroke-dasharray="8,4"></path>
  
  <line x1="480" y1="240" x2="510" y2="300" stroke="#ef4444" stroke-width="6"></line>
  <line x1="510" y1="240" x2="480" y2="300" stroke="#ef4444" stroke-width="6"></line>

  <!-- Labels -->
  <rect x="300" y="60" width="160" height="40" rx="4" fill="#fef08a" stroke="#eab308" stroke-width="2"></rect>
  <text x="380" y="80" font-family="sans-serif" font-size="14" font-weight="bold" fill="#854d0e" text-anchor="middle" dominant-baseline="middle">Conditional Rebates</text>

  <rect x="300" y="320" width="160" height="40" rx="4" fill="#fecaca" stroke="#ef4444" stroke-width="2"></rect>
  <text x="380" y="340" font-family="sans-serif" font-size="14" font-weight="bold" fill="#991b1b" text-anchor="middle" dominant-baseline="middle">Market Foreclosed</text>

  <!-- Defs -->
  <defs>
    <marker id="arrow-yellow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L0,6 L9,3 z" fill="#eab308" />
    </marker>
  </defs>
</svg>
\`\`\`

### Impact
Intel achieved an artificially high market share by locking OEMs into almost exclusive purchasing arrangements, severely impacting competitors' ability to reach the market. The Commission imposed a staggering €1.06B fine.
    `,
    authority: "European Commission",
    status: "Fined",
    industry: "Semiconductors",
    tags: ["Article 102", "Loyalty Rebates", "Abuse of Dominance"],
    parties_involved: ["Intel", "AMD"],
    fine_amount: "€1.06 billion",
    decision_date: "2009-05-13",
    links: ["https://ec.europa.eu/competition/antitrust/cases/dec_docs/37990/37990_3581_18.pdf"],
  },
  {
    title: "DOJ vs AT&T (T-Mobile Acquisition Attempt)",
    summary: `
### Background
AT&T announced its intention to acquire T-Mobile USA for $39 billion. The US Department of Justice filed a lawsuit to block the deal, asserting it would substantially lessen competition in the mobile wireless telecommunications services market.

### Market Concentration Diagram (HHI Impact)
This visualization demonstrates the pre-and-post merger market shares out of the "Big 4" national carriers, highlighting the dangerous level of market concentration.

\`\`\`svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="100%" height="100%">
  <rect width="100%" height="100%" fill="#ffffff" rx="12" ry="12"></rect>
  
  <text x="400" y="40" font-family="sans-serif" font-size="22" font-weight="bold" fill="#334155" text-anchor="middle">Mobile Market Concentration (Pre vs Post Merger)</text>

  <!-- Pre-Merger Pie -->
  <text x="250" y="100" font-family="sans-serif" font-size="18" font-weight="bold" fill="#475569" text-anchor="middle">Pre-Merger Market Share</text>
  <g transform="translate(250, 250)">
    <!-- AT&T (Blue) 32% -->
    <path d="M 0 0 L 0 -110 A 110 110 0 0 1 97 50 Z" fill="#3b82f6" stroke="#fff" stroke-width="2"/>
    <!-- Verizon (Red) 34% -->
    <path d="M 0 0 L 97 50 A 110 110 0 0 1 -70 85 Z" fill="#ef4444" stroke="#fff" stroke-width="2"/>
    <!-- Sprint (Yellow) 18% -->
    <path d="M 0 0 L -70 85 A 110 110 0 0 1 -105 -35 Z" fill="#eab308" stroke="#fff" stroke-width="2"/>
    <!-- T-Mobile (Magenta) 16% -->
    <path d="M 0 0 L -105 -35 A 110 110 0 0 1 0 -110 Z" fill="#ec4899" stroke="#fff" stroke-width="2"/>
  </g>

  <!-- Post-Merger Pie -->
  <text x="550" y="100" font-family="sans-serif" font-size="18" font-weight="bold" fill="#475569" text-anchor="middle">Post-Merger (Proposed)</text>
  <g transform="translate(550, 250)">
    <!-- AT&T + T-Mobile (Purple) 48% -->
    <path d="M 0 0 L 0 -110 A 110 110 0 0 1 14 109 Z" fill="#8b5cf6" stroke="#fff" stroke-width="2"/>
    <!-- Verizon (Red) 34% -->
    <path d="M 0 0 L 14 109 A 110 110 0 0 1 -105 -35 Z" fill="#ef4444" stroke="#fff" stroke-width="2"/>
    <!-- Sprint (Yellow) 18% -->
    <path d="M 0 0 L -105 -35 A 110 110 0 0 1 0 -110 Z" fill="#eab308" stroke="#fff" stroke-width="2"/>
  </g>

  <!-- Legend -->
  <g transform="translate(50, 400)">
    <rect x="0" y="0" width="20" height="20" fill="#3b82f6" rx="4"/>
    <text x="30" y="15" font-family="sans-serif" font-size="14" fill="#334155">AT&T</text>
    
    <rect x="120" y="0" width="20" height="20" fill="#ec4899" rx="4"/>
    <text x="150" y="15" font-family="sans-serif" font-size="14" fill="#334155">T-Mobile</text>
    
    <rect x="250" y="0" width="20" height="20" fill="#ef4444" rx="4"/>
    <text x="280" y="15" font-family="sans-serif" font-size="14" fill="#334155">Verizon</text>
    
    <rect x="380" y="0" width="20" height="20" fill="#eab308" rx="4"/>
    <text x="410" y="15" font-family="sans-serif" font-size="14" fill="#334155">Sprint</text>
    
    <rect x="500" y="0" width="20" height="20" fill="#8b5cf6" rx="4"/>
    <text x="530" y="15" font-family="sans-serif" font-size="14" font-weight="bold" fill="#334155">AT&T Holding T-Mobile</text>
  </g>
</svg>
\`\`\`

### Outcome
Faced with overwhelming opposition from the DOJ and the FCC (who stated the merger was not in the public interest), AT&T abandoned the bid in late 2011, triggering a $4 billion breakup fee paid to T-Mobile.
    `,
    authority: "DOJ",
    status: "Blocked",
    industry: "Telecommunications",
    tags: ["Merger Control", "HHI", "Horizontal Acquisition"],
    parties_involved: ["AT&T", "T-Mobile"],
    fine_amount: null,
    decision_date: "2011-12-19",
    links: ["https://www.justice.gov/opa/pr/justice-department-files-antitrust-lawsuit-block-att-s-acquisition-t-mobile"],
  },
  {
    title: "CMA / Meta (Giphy Acquisition)",
    summary: `
### Background
Meta (formerly Facebook) acquired Giphy, the largest supplier of animated images (GIFs) to social networks, for $400M. The Competition and Markets Authority (CMA) intervened, representing a rare occurrence where a competition authority forced the unwinding of a finalized tech acquisition.

### Theory of Harm: Supply Foreclosure
The CMA argued Meta could deny or degrade API access to Giphy for rival social networks, forcing users into the Meta ecosystem.

\`\`\`svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="100%" height="100%">
  <rect width="100%" height="100%" fill="#f1f5f9" rx="12" ry="12"></rect>

  <rect x="300" y="50" width="200" height="80" rx="8" fill="#14b8a6" stroke="#0f766e" stroke-width="3"></rect>
  <text x="400" y="90" font-family="sans-serif" font-size="24" font-weight="bold" fill="#ffffff" text-anchor="middle">GIPHY (GIF API)</text>
  
  <rect x="300" y="250" width="200" height="150" fill="none" stroke="#2563eb" stroke-width="3" stroke-dasharray="8,4" rx="12"></rect>
  <text x="400" y="275" font-family="sans-serif" font-size="14" font-weight="bold" fill="#1e3a8a" text-anchor="middle">Acquirer</text>

  <rect x="320" y="300" width="160" height="60" rx="8" fill="#3b82f6" stroke="#1d4ed8" stroke-width="2"></rect>
  <text x="400" y="330" font-family="sans-serif" font-size="18" font-weight="bold" fill="#ffffff" text-anchor="middle">Meta (Facebook)</text>

  <!-- Competitors -->
  <rect x="50" y="300" width="160" height="60" rx="8" fill="#cbd5e1" stroke="#94a3b8" stroke-width="2"></rect>
  <text x="130" y="330" font-family="sans-serif" font-size="18" font-weight="bold" fill="#334155" text-anchor="middle">Snapchat</text>

  <rect x="590" y="300" width="160" height="60" rx="8" fill="#cbd5e1" stroke="#94a3b8" stroke-width="2"></rect>
  <text x="670" y="330" font-family="sans-serif" font-size="18" font-weight="bold" fill="#334155" text-anchor="middle">TikTok</text>

  <!-- Flow Lines -->
  <path d="M 400 130 L 400 290" fill="none" stroke="#10b981" stroke-width="6" marker-end="url(#arrow-green)"></path>
  <text x="420" y="200" font-family="sans-serif" font-size="14" font-weight="bold" fill="#047857">Unlimited API</text>

  <path d="M 350 130 Q 130 180 130 290" fill="none" stroke="#ef4444" stroke-width="6" stroke-dasharray="8,4"></path>
  <text x="200" y="200" font-family="sans-serif" font-size="14" font-weight="bold" fill="#b91c1c">Degraded / Blocked</text>

  <path d="M 450 130 Q 670 180 670 290" fill="none" stroke="#ef4444" stroke-width="6" stroke-dasharray="8,4"></path>
  <text x="600" y="200" font-family="sans-serif" font-size="14" font-weight="bold" fill="#b91c1c">Degraded / Blocked</text>

  <circle cx="210" cy="200" r="15" fill="#ef4444"></circle>
  <path d="M 200 190 L 220 210 M 220 190 L 200 210" stroke="#fff" stroke-width="3"></path>

  <circle cx="580" cy="200" r="15" fill="#ef4444"></circle>
  <path d="M 570 190 L 590 210 M 590 190 L 570 210" stroke="#fff" stroke-width="3"></path>

  <!-- Defs -->
  <defs>
    <marker id="arrow-green" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L0,6 L9,3 z" fill="#10b981" />
    </marker>
  </defs>
</svg>
\`\`\`

### Resolution
Meta was ordered to sell Giphy in its entirety. They ultimately sold Giphy to Shutterstock in 2023 for $53 million—a massive loss compared to the $400 million purchase price.
    `,
    authority: "CMA",
    status: "Blocked",
    industry: "Social Media",
    tags: ["Vertical Merger", "Unwinding", "API Access"],
    parties_involved: ["Meta", "Giphy", "Shutterstock"],
    fine_amount: null,
    decision_date: "2022-10-18",
    links: ["https://www.gov.uk/cma-cases/facebook-inc-giphy-inc-merger-inquiry"],
  },
  {
    title: "EU Commission vs Apple (App Store Policies)",
    summary: `
### Background
Following a complaint by Spotify, the EU Commission found that Apple abused its dominant position by imposing anti-steering provisions on music streaming app developers. These provisions prevented developers from informing iOS users about alternative, cheaper music subscription options available outside of the app.

### The "Anti-Steering" Wall
This SVG illustrates the information asymmetry created by Apple's policies.

\`\`\`svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="100%" height="100%">
  <rect width="100%" height="100%" fill="#ffffff" rx="12" ry="12"></rect>

  <!-- iOS Device -->
  <rect x="300" y="50" width="200" height="400" rx="20" fill="#cbd5e1" stroke="#94a3b8" stroke-width="4"></rect>
  <rect x="310" y="60" width="180" height="380" rx="12" fill="#0f172a"></rect>
  <text x="400" y="90" font-family="sans-serif" font-size="18" font-weight="bold" fill="#ffffff" text-anchor="middle">iPhone User</text>

  <!-- Spotify App Inside -->
  <rect x="320" y="150" width="160" height="80" rx="8" fill="#1db954"></rect>
  <text x="400" y="180" font-family="sans-serif" font-size="18" font-weight="bold" fill="#ffffff" text-anchor="middle">Spotify App</text>
  <text x="400" y="210" font-family="sans-serif" font-size="14" fill="#ffffff" text-anchor="middle">Price: €12.99/mo</text>

  <!-- Commission / Apple Cut -->
  <path d="M 400 230 L 400 370" fill="none" stroke="#ef4444" stroke-width="4" marker-end="url(#arrow-down)"></path>
  <rect x="340" y="370" width="120" height="40" rx="6" fill="#ef4444"></rect>
  <text x="400" y="395" font-family="sans-serif" font-size="14" font-weight="bold" fill="#ffffff" text-anchor="middle">Apple 30% Fee</text>

  <!-- The Outside World -->
  <rect x="650" y="150" width="120" height="80" rx="8" fill="#475569" stroke="#334155" stroke-width="2"></rect>
  <text x="710" y="180" font-family="sans-serif" font-size="16" font-weight="bold" fill="#ffffff" text-anchor="middle">Spotify.com</text>
  <text x="710" y="210" font-family="sans-serif" font-size="14" fill="#ffffff" text-anchor="middle">Price: €9.99/mo</text>

  <!-- The Wall -->
  <rect x="550" y="100" width="20" height="300" fill="#f59e0b" stroke="#d97706" stroke-width="2"></rect>
  <text x="560" y="90" font-family="sans-serif" font-size="14" font-weight="bold" fill="#b45309" text-anchor="middle">Anti-Steering Rules</text>

  <!-- Arrow passing wall (Blocked) -->
  <path d="M 480 190 L 535 190" fill="none" stroke="#ef4444" stroke-width="6"></path>
  <line x1="535" y1="170" x2="535" y2="210" stroke="#ef4444" stroke-width="6"></line>
  
  <text x="610" y="270" font-family="sans-serif" font-size="12" font-weight="bold" fill="#b45309" transform="rotate(-90 610 270)">No Emails or Links allowed</text>

  <!-- Defs -->
  <defs>
    <marker id="arrow-down" markerWidth="10" markerHeight="10" refX="5" refY="9" orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L10,0 L5,9 z" fill="#ef4444" />
    </marker>
  </defs>
</svg>
\`\`\`

### Impact
Apple was fined a massive €1.84B ($2 billion) and was ordered to remove the anti-steering provisions. The ruling fundamentally alters how App Store monetization limits can be enforced against services.
    `,
    authority: "European Commission",
    status: "Fined",
    industry: "Digital Markets",
    tags: ["App Store", "Anti-Steering", "Article 102", "Music Streaming"],
    parties_involved: ["Apple", "Spotify"],
    fine_amount: "€1.84 billion",
    decision_date: "2024-03-04",
    links: ["https://ec.europa.eu/commission/presscorner/detail/en/ip_24_1161"],
  },
  {
    title: "FTC vs Amazon (Project Nessie)",
    summary: `
### Background
The FTC alleged that Amazon engaged in a multi - front monopoly maintenance scheme.As part of an unredacted complaint, it emerged that Amazon used a pricing algorithm known as *Project Nessie *.

### Project Nessie Dynamics
Project Nessie was allegedly used to artificially inflate prices across the internet.When Amazon raised prices, it anticipated that competitors tracking Amazon would also raise theirs.If competitors failed to follow, Nessie would revert to the normal price.

\`\`\`svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 350" width="100%" height="100%">
  <rect width="100%" height="100%" fill="#fefce8" rx="12" ry="12"></rect>

  <text x="400" y="40" font-family="sans-serif" font-size="20" font-weight="bold" fill="#854d0e" text-anchor="middle">Project Nessie Price Inflation Cycle</text>

  <!-- Nodes -->
  <rect x="100" y="120" width="160" height="80" rx="8" fill="#f59e0b" stroke="#d97706" stroke-width="3"></rect>
  <text x="180" y="150" font-family="sans-serif" font-size="14" font-weight="bold" fill="#ffffff" text-anchor="middle">Amazon tests</text>
  <text x="180" y="170" font-family="sans-serif" font-size="16" font-weight="bold" fill="#ffffff" text-anchor="middle">Price Increase</text>

  <rect x="540" y="120" width="160" height="80" rx="8" fill="#3b82f6" stroke="#2563eb" stroke-width="3"></rect>
  <text x="620" y="150" font-family="sans-serif" font-size="14" font-weight="bold" fill="#ffffff" text-anchor="middle">Competitors' Bots</text>
  <text x="620" y="170" font-family="sans-serif" font-size="16" font-weight="bold" fill="#ffffff" text-anchor="middle">Match Price</text>

  <rect x="320" y="250" width="160" height="60" rx="8" fill="#10b981" stroke="#059669" stroke-width="3"></rect>
  <text x="400" y="280" font-family="sans-serif" font-size="14" font-weight="bold" fill="#ffffff" text-anchor="middle">New Base Price</text>

  <!-- Arrows -->
  <path d="M 260 160 L 520 160" fill="none" stroke="#64748b" stroke-width="4" marker-end="url(#arrow-gray)"></path>
  <text x="390" y="145" font-family="sans-serif" font-size="12" fill="#475569" text-anchor="middle">Bots scrape &amp; follow</text>

  <path d="M 620 200 L 620 280 L 480 280" fill="none" stroke="#10b981" stroke-width="4" marker-end="url(#arrow-green-n)"></path>
  <text x="560" y="295" font-family="sans-serif" font-size="12" fill="#047857" text-anchor="middle">If followed</text>

  <!-- Reversion mechanism -->
  <path d="M 620 120 L 620 70 L 180 70 L 180 120" fill="none" stroke="#ef4444" stroke-width="4" stroke-dasharray="6,4" marker-end="url(#arrow-red)"></path>
  <text x="400" y="55" font-family="sans-serif" font-size="12" fill="#b91c1c" text-anchor="middle">If NOT followed: Nessie reverts price</text>

  <!-- Defs -->
  <defs>
    <marker id="arrow-gray" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L0,6 L9,3 z" fill="#64748b" />
    </marker>
    <marker id="arrow-green-n" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L0,6 L9,3 z" fill="#10b981" />
    </marker>
    <marker id="arrow-red" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L0,6 L9,3 z" fill="#ef4444" />
    </marker>
  </defs>
</svg>
\`\`\`

### Status
The litigation is actively ongoing. By using algorithmic price matching, Nessie effectively extracted more money from consumers across the entire retail landscape, not just on Amazon.
    `,
    authority: "FTC",
    status: "Open",
    industry: "E-Commerce",
    tags: ["Pricing Algorithm", "Monopoly Maintenance", "Project Nessie"],
    parties_involved: ["Amazon"],
    fine_amount: null,
    decision_date: "2023-09-26",
    links: ["https://www.ftc.gov/news-events/news/press-releases/2023/09/ftc-sues-amazon-illegally-maintaining-monopoly-power"],
  }
]

async function seedMultiple() {
  console.log('Seeding multiple SVG sample cases...')
  const { data, error } = await supabase
    .from('Cases')
    .insert(cases)
    .select()

  if (error) {
    console.error('Error inserting cases:', error)
  } else {
    console.log(`Successfully inserted ${data.length} cases!`)
  }
}

seedMultiple()
