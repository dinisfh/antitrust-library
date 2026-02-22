export const en = {
    header: {
        library: "Case Library",
        search_placeholder: "Search for a company, authority, or concept...",
        login: "Log In",
        logout: "Log Out"
    },
    sidebar: {
        filters: "Filters",
        reset: "Clear",
        authority: "Authority",
        industry: "Industry",
        status: "Status",
        tags: "Case Tags",
        status_options: {
            open: "Open",
            closed: "Closed",
            decision: "Decision",
            appeal: "Appeal",
            fined: "Fined",
            blocked: "Blocked"
        },
        see_results: "See Results",
        see_results_count: "See Results ({{count}} Filters)"
    },
    home: {
        hero_title: "Antitrust Library",
        hero_subtitle: "Continuous research library of Antitrust cases and key tech regulations.",
        no_results: "No cases found matching the criteria.",
        no_results_desc: "Try adjusting or clearing your filters.",
        load_more: "Load More Cases"
    },
    case_card: {
        no_date: "No Date",
        no_sources: "No sources linked"
    },
    case_detail: {
        back: "Back to library",
        summary_title: "Detailed Case Report",
        parties: "Parties Involved",
        status_fines: "Status & Fines",
        fine: "Fine",
        official_sources: "Official Sources",
        no_sources: "No public documents linked.",
        source: "Source"
    }
};

export type TranslationsType = typeof en;
