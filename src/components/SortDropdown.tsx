'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useTransition } from 'react'
import { useLanguage } from '@/i18n/LanguageContext'
import CustomSelect from '@/components/ui/CustomSelect'

export default function SortDropdown({ currentSort }: { currentSort: string }) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isPending, startTransition] = useTransition()
    const { t } = useLanguage()

    const handleSortChange = (val: string) => {
        startTransition(() => {
            const params = new URLSearchParams(searchParams.toString())
            if (val && val !== 'recent') {
                params.set('sortBy', val)
            } else {
                params.delete('sortBy')
            }
            router.replace(`/?${params.toString()}`, { scroll: false })
        })
    }

    return (
        <div className="relative flex items-center gap-2">
            <label htmlFor="sort-select" className="text-dark-slate/60 text-sm font-medium">{t.home.sort_by}:</label>
            <div className="w-40 relative">
                <CustomSelect
                    options={[
                        { value: 'recent', label: t.home.sort_recent },
                        { value: 'cited', label: t.home.sort_cited },
                        { value: 'alphabetical', label: t.home.sort_alpha }
                    ]}
                    value={currentSort || 'recent'}
                    onChange={handleSortChange}
                    disabled={isPending}
                />
            </div>
            {isPending && (
                <div className="absolute -right-6 w-4 h-4 rounded-full border-2 border-primary-blue border-r-transparent animate-spin"></div>
            )}
        </div>
    )
}
