import { getUniqueFilters } from '@/app/actions'
import SidebarUI from './SidebarUI'

export default async function Sidebar() {
    const { authorities, industries, statuses, tags } = await getUniqueFilters()

    return (
        <SidebarUI
            AUTHORITIES={authorities}
            INDUSTRIES={industries}
            STATUSES={statuses}
            TAGS={tags}
        />
    )
}
