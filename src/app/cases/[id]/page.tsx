import { getCaseById } from '../../actions'
import { notFound } from 'next/navigation'
import CaseDetailUI from '@/components/CaseDetailUI'

export default async function CasePage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params
    const caseData = await getCaseById(resolvedParams.id)

    if (!caseData) {
        notFound()
    }

    return <CaseDetailUI caseData={caseData as any} />
}
