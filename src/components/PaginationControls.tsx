'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import CustomSelect from '@/components/ui/CustomSelect'

export default function PaginationControls({
    totalCount,
    currentPage,
    itemsPerPage
}: {
    totalCount: number
    currentPage: number
    itemsPerPage: number
}) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const totalPages = Math.ceil(totalCount / itemsPerPage)

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams)
        params.set('page', newPage.toString())
        router.push(`${pathname}?${params.toString()}`, { scroll: false })
    }

    const handleLimitChange = (val: string) => {
        const newLimit = val
        const params = new URLSearchParams(searchParams)
        params.set('limit', newLimit)
        params.set('page', '1') // reset to first page when changing limit
        router.push(`${pathname}?${params.toString()}`, { scroll: false })
    }

    return (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border border-light-gray">
            <div className="flex items-center gap-3 text-sm text-dark-slate/80">
                <label className="font-medium whitespace-nowrap">Items per page:</label>
                <div className="w-24">
                    <CustomSelect
                        options={[
                            { value: '20', label: '20' },
                            { value: '40', label: '40' },
                            { value: '80', label: '80' }
                        ]}
                        value={itemsPerPage.toString()}
                        onChange={handleLimitChange}
                    />
                </div>
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="px-3 py-2 text-sm font-medium text-dark-slate bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    Previous
                </button>
                <span className="text-sm font-medium text-dark-slate/80 px-2" suppressHydrationWarning>
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className="px-3 py-2 text-sm font-medium text-dark-slate bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    Next
                </button>
            </div>
        </div>
    )
}
