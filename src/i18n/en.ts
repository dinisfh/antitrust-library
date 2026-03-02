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
    },
    admin_panel: {
        title: "Administration Panel",
        subtitle: "Manage and invite authorized platform users.",
        add_user_title: "Add User",
        email_label: "Email",
        password_label: "Password (Optional)",
        password_placeholder: "Default: megie2025",
        role_label: "Role",
        role_reader: "Reader (Researcher/Viewer)",
        role_admin: "Administrator",
        btn_add_user: "Add User",
        import_csv_title: "Bulk Import (CSV)",
        import_csv_desc: "The CSV file must have a header. Columns: <strong>email</strong>, <strong>role</strong> (Admin/Reader) and <strong>password</strong> (optional). Accounts with no password will use <strong>megie2025</strong> by default.",
        click_to_submit: "Click to submit",
        or_drag_file: "or drag the file",
        file_type: "File *.csv",
        btn_start_import: "Start Import",
        pending_requests_title: "Pending Access Requests ({{count}})",
        table_email: "Email",
        table_request_date: "Request Date",
        table_actions: "Actions",
        btn_approve: "Approve",
        btn_reject: "Reject",
        active_users_title: "Active Users ({{count}})",
        table_role: "Role",
        table_reg_date: "Registration Date",
        btn_save: "Save",
        btn_delete: "Delete",
        add_case_title: "Add New Case Study (Manual)",
        add_case_desc: "Use this form to force the creation of a case in the library (e.g. when web integrations fail). Advanced Markdown details should be adjusted via Supabase after creating this basic skeleton.",
        case_title_label: "Case Title",
        case_title_placeholder: "Ex: Insurers Cartel",
        case_content_label: "Case Content (Markdown)",
        case_sources_label: "Sources / URLs (1 per line)",
        authority_label: "Involved Authority",
        status_label: "Process Status",
        industry_label: "Sector / Industry (Optional)",
        industry_placeholder: "Ex: Technology, Biological Retail...",
        btn_create_case: "Create and Publish Case",
        status_investigation: "Under Investigation",
        status_decided: "Decided (Concluded)",
        status_appeal: "Under Appeal"
    }
};

export type TranslationsType = typeof en;
