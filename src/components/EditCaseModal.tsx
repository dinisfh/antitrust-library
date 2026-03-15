'use client'

import { type CaseMatch } from '@/app/actions'
import { editCaseAction } from '@/app/admin/actions'
import { useLanguage } from '@/i18n/LanguageContext'
import { useState, useEffect } from 'react'
import CustomSelect from './ui/CustomSelect'

type EditCaseModalProps = {
    caseId: string;
    onClose: () => void;
}

export default function EditCaseModal({ caseId, onClose }: EditCaseModalProps) {
    const { t } = useLanguage()
    const tAdmin = t.admin_panel || {}

    const [data, setData] = useState<CaseMatch | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        const fetchCase = async () => {
            const { getCaseById } = await import('@/app/actions')
            const result = await getCaseById(caseId)
            setData(result)
            setIsLoading(false)
        }
        fetchCase()
    }, [caseId])

    if (isLoading) {
        return (
            <div className="fixed inset-0 bg-dark-slate/50 z-[100] flex items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-xl w-64 p-6 flex flex-col items-center justify-center gap-4">
                    <div className="w-8 h-8 rounded-full border-4 border-light-gray border-t-primary-blue animate-spin"></div>
                    <p className="text-sm font-semibold text-dark-slate">A carregar...</p>
                </div>
            </div>
        )
    }

    if (!data) {
        return (
            <div className="fixed inset-0 bg-dark-slate/50 z-[100] flex items-center justify-center p-4" onClick={onClose}>
                <div className="bg-white rounded-xl shadow-xl p-6" onClick={(e) => e.stopPropagation()}>
                    <p className="text-red-600 font-bold mb-4">Erro ao carregar caso.</p>
                    <button onClick={onClose} className="px-4 py-2 bg-gray-100 rounded text-sm font-bold">Fechar</button>
                </div>
            </div>
        )
    }

    // Parse the tags into a comma separated string for the input
    const initialTags = data.tags ? data.tags.join(', ') : ''
    // Parse links into a newline separated string
    const initialSources = data.links ? data.links.join('\n') : ''

    return (
        <div className="fixed inset-0 bg-dark-slate/50 z-[100] flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
            <div 
                className="bg-white rounded-xl shadow-xl w-full max-w-4xl p-6 relative flex flex-col max-h-[90vh]" 
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6 border-b border-light-gray pb-4">
                    <h2 className="font-heading font-bold text-xl text-dark-slate">Editar Caso</h2>
                    <button 
                        onClick={onClose}
                        className="text-dark-slate/50 hover:text-dark-slate p-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="overflow-y-auto flex-1 pr-2">
                    <form 
                        action={async (formData) => {
                            setIsSubmitting(true)
                            try {
                                await editCaseAction(formData)
                                onClose()
                            } catch (e) {
                                console.error(e)
                            } finally {
                                setIsSubmitting(false)
                            }
                        }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    >
                        <input type="hidden" name="caseId" value={data.id} />

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-dark-slate mb-1">{tAdmin.case_title_label || 'Case Title'}</label>
                            <input name="title" type="text" defaultValue={data.title} required className="w-full px-3 py-2 border border-light-gray rounded-md focus:ring-1 focus:ring-primary-blue focus:outline-none" />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-dark-slate mb-1">{tAdmin.case_content_label || 'Summary / Content'}</label>
                            <textarea
                                name="summary"
                                rows={8}
                                defaultValue={data.summary}
                                className="w-full px-3 py-2 border border-light-gray rounded-md focus:ring-1 focus:ring-primary-blue focus:outline-none font-mono text-sm"
                            ></textarea>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-dark-slate mb-1">{tAdmin.authority_label || 'Authority'}</label>
                            <input name="authority" type="text" defaultValue={data.authority} required className="w-full px-3 py-2 border border-light-gray rounded-md focus:ring-1 focus:ring-primary-blue focus:outline-none" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-dark-slate mb-1">Status</label>
                            <select name="status" defaultValue={data.status} className="w-full px-3 py-2 border border-light-gray rounded-md focus:ring-1 focus:ring-primary-blue focus:outline-none">
                                <option value="Em Investigação">Em Investigação</option>
                                <option value="Decidido">Decidido</option>
                                <option value="Em Recurso">Em Recurso</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-dark-slate mb-1">{tAdmin.industry_label || 'Industry'}</label>
                            <input name="industry" type="text" defaultValue={data.industry} className="w-full px-3 py-2 border border-light-gray rounded-md focus:ring-1 focus:ring-primary-blue focus:outline-none" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-dark-slate mb-1">Geography</label>
                            <input name="geography" type="text" defaultValue={data.geography || ''} className="w-full px-3 py-2 border border-light-gray rounded-md focus:ring-1 focus:ring-primary-blue focus:outline-none" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-dark-slate mb-1">Decision Date</label>
                            <input name="decision_date" type="text" defaultValue={data.decision_date || ''} placeholder="e.g. 2026-03 ou Sept 2023" className="w-full px-3 py-2 border border-light-gray rounded-md focus:ring-1 focus:ring-primary-blue focus:outline-none" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-dark-slate mb-1">Start Date</label>
                            <input name="start_date" type="text" defaultValue={data.start_date || ''} placeholder="e.g. 2020" className="w-full px-3 py-2 border border-light-gray rounded-md focus:ring-1 focus:ring-primary-blue focus:outline-none" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-dark-slate mb-1">Tags (Case Types)</label>
                            <input name="tags" type="text" defaultValue={initialTags} placeholder="Cartel, Abuse of Dominance" className="w-full px-3 py-2 border border-light-gray rounded-md focus:ring-1 focus:ring-primary-blue focus:outline-none" />
                            <p className="text-xs text-dark-slate/50 mt-1">Separated by commas</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-dark-slate mb-1">Fine Amount</label>
                            <input name="fine_amount" type="text" defaultValue={data.fine_amount || ''} placeholder="Ex: €1.5B" className="w-full px-3 py-2 border border-light-gray rounded-md focus:ring-1 focus:ring-primary-blue focus:outline-none" />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-dark-slate mb-1">{tAdmin.case_sources_label || 'Sources (URLs)'}</label>
                            <textarea name="sources" rows={3} defaultValue={initialSources} className="w-full px-3 py-2 border border-light-gray rounded-md focus:ring-1 focus:ring-primary-blue focus:outline-none" placeholder="https://..."></textarea>
                        </div>

                        <div className="md:col-span-2 border-t border-light-gray pt-6 mt-2 flex justify-end gap-3">
                            <button type="button" onClick={onClose} className="px-6 py-2.5 bg-gray-100 text-dark-slate rounded-md font-semibold text-sm hover:bg-gray-200 transition-colors">
                                Cancelar
                            </button>
                            <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 bg-primary-blue text-white rounded-md font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50">
                                {isSubmitting ? 'A guardar...' : tAdmin.btn_save || 'Guardar Alterações'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
