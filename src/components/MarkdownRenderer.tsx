'use client'

import React, { useEffect, useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import mermaid from 'mermaid';

// Configuração global do Mermaid 
mermaid.initialize({
    startOnLoad: false,
    theme: 'base',
    themeVariables: {
        primaryColor: '#f1f5f9', // slate-100
        primaryTextColor: '#1e293b', // slate-800
        primaryBorderColor: '#cbd5e1', // slate-300
        lineColor: '#3b82f6', // blue-500
        secondaryColor: '#eff6ff', // blue-50
        tertiaryColor: '#ffffff',
    },
    securityLevel: 'loose',
});

const MermaidChart = ({ code }: { code: string }) => {
    const [svg, setSvg] = useState<string>('');
    const idRef = useRef(`mermaid-${Math.random().toString(36).substr(2, 9)}`);

    useEffect(() => {
        let isMounted = true;

        const renderMermaid = async () => {
            try {
                const { svg: svgResult } = await mermaid.render(idRef.current, code);
                if (isMounted) {
                    setSvg(svgResult);
                }
            } catch (error) {
                console.error("Erro a renderizar Gráfico Mermaid:", error);
            }
        };

        // Em ambientes SSR/Next.js é essencial desenhar unicamente no Client.
        renderMermaid();

        return () => { isMounted = false; };
    }, [code]);

    if (!svg) {
        return <div className="p-8 text-center text-sm text-slate-400 animate-pulse bg-slate-50 rounded-lg border border-slate-200">A processar diagrama interativo...</div>;
    }

    return (
        <div
            className="my-8 py-6 w-full overflow-x-auto flex justify-center bg-white border border-slate-200 shadow-sm rounded-xl"
            dangerouslySetInnerHTML={{ __html: svg }}
        />
    );
};

export default function MarkdownRenderer({ content }: { content: string }) {
    return (
        <div className="prose prose-slate max-w-none md:prose-lg prose-headings:font-heading prose-headings:text-primary-blue prose-a:text-blue-600 hover:prose-a:text-blue-800 prose-table:border-collapse prose-th:bg-slate-100 prose-th:p-3 prose-td:p-3 prose-td:border-b prose-td:border-slate-200">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    code(props) {
                        const { children, className, node, ...rest } = props;
                        const match = /language-(\w+)/.exec(className || '');

                        // Hook customizado intercepta blocos code gerados pela IA como mermaid
                        if (match && match[1] === 'mermaid') {
                            return <MermaidChart code={String(children).replace(/\n$/, '')} />;
                        }

                        // Restantes pedaços de código inline ou não-mermaid são normais
                        return (
                            <code {...rest} className={`${className || ''} bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-sm`}>
                                {children}
                            </code>
                        );
                    }
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}
