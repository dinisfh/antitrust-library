import { TranslationsType } from './en';

export const pt: TranslationsType = {
    header: {
        library: "Biblioteca de Casos",
        search_placeholder: "Pesquisar empresa, autoridade, ou conceito...",
        login: "Entrar",
        logout: "Terminar Sessão"
    },
    sidebar: {
        filters: "Filtros",
        reset: "Limpar",
        authority: "Autoridade",
        industry: "Indústria",
        status: "Estado",
        tags: "Tags de Caso",
        status_options: {
            open: "Aberto",
            closed: "Fechado",
            decision: "Decisão",
            appeal: "Recurso",
            fined: "Multado",
            blocked: "Bloqueado"
        },
        see_results: "Ver Resultados",
        see_results_count: "Ver Resultados ({{count}} Filtros)"
    },
    home: {
        hero_title: "Antitrust Library",
        hero_subtitle: "Biblioteca de pesquisa e consulta contínua de casos Antitrust.",
        no_results: "Nenhum caso encontrado para os critérios.",
        no_results_desc: "Tente ajustar ou remover os filtros aplicados.",
        load_more: "Carregar Mais Casos"
    },
    case_card: {
        no_date: "Sem Data",
        no_sources: "Sem fontes associadas"
    },
    case_detail: {
        back: "Voltar à biblioteca",
        summary_title: "Relatório Detalhado do Caso",
        parties: "Partes Envolvidas",
        status_fines: "Status e Multas",
        fine: "Multa",
        official_sources: "Fontes Oficiais",
        no_sources: "Nenhum documento público associado.",
        source: "Fonte"
    }
};
