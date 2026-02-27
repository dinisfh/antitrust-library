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
    },
    login_page: {
        restricted_access: "Restricted Access",
        description: "The Library platform is closed. Log in or request access to your account.",
        existing_login: "Existing Login",
        request_access_tab: "Request Access",
        email_address: "Email Address",
        email_placeholder: "name@company.com",
        password: "Password",
        password_min_length: "Minimum 6 characters.",
        btn_request_access: "Request Platform Access",
        btn_login: "Log into Platform"
    }
};

export type TranslationsType = typeof en;
