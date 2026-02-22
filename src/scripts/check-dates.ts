import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

async function main() {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        console.error('Missing env vars')
        return
    }
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    const { data, error } = await supabase.from('Cases').select('id, title, decision_date')

    if (error) {
        console.error('Error fetching cases', error)
        return
    }

    const total = data.length
    const withDate = data.filter(c => !!c.decision_date).length
    const withoutDate = total - withDate

    console.log(`Total cases: ${total}`)
    console.log(`With decision_date: ${withDate}`)
    console.log(`Without decision_date: ${withoutDate}`)

    // Imprimir os 5 primeiros sem data
    console.log('First 5 without date:')
    console.log(data.filter(c => !c.decision_date).slice(0, 5))
}

main()
