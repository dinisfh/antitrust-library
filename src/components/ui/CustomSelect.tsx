'use client'

import { useState, useRef, useEffect } from 'react'

export type SelectOption = {
    value: string
    label: string
}

type CustomSelectProps = {
    options: SelectOption[]
    value?: string
    defaultValue?: string
    onChange?: (value: string) => void
    name?: string
    disabled?: boolean
    placeholder?: string
    className?: string
}

export default function CustomSelect({ options, value, defaultValue, onChange, name, disabled, placeholder = "Select...", className = "" }: CustomSelectProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [internalValue, setInternalValue] = useState(value || defaultValue || options[0]?.value || '')
    const containerRef = useRef<HTMLDivElement>(null)

    // Sync external value
    useEffect(() => {
        if (value !== undefined) {
            setInternalValue(value)
        }
    }, [value])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const selectedOption = options.find(o => o.value === internalValue)
    const displayLabel = selectedOption ? selectedOption.label : placeholder

    const handleSelect = (val: string) => {
        setInternalValue(val)
        setIsOpen(false)
        if (onChange) {
            onChange(val)
        }
    }

    return (
        <div className={`relative ${className}`} ref={containerRef}>
            {name && <input type="hidden" name={name} value={internalValue} />}
            <button
                type="button"
                className={`w-full flex items-center justify-between bg-white border border-light-gray text-dark-slate text-sm rounded-lg hover:border-primary-blue focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue p-2.5 transition-all outline-none shadow-sm ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
            >
                <span className="truncate block font-medium group-hover:text-primary-blue transition-colors">{displayLabel}</span>
                <svg className={`w-4 h-4 text-dark-slate/50 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
            </button>

            {isOpen && (
                <div className="absolute z-[100] w-full mt-1 bg-white border border-light-gray rounded-xl shadow-xl max-h-60 overflow-y-auto transform origin-top transition-all scale-100 opacity-100">
                    <ul className="py-1.5 focus:outline-none">
                        {options.map((option) => (
                            <li key={option.value}>
                                <button
                                    type="button"
                                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-blue-50/80 hover:text-primary-blue transition-colors flex items-center justify-between ${internalValue === option.value ? 'bg-blue-50 text-primary-blue font-bold' : 'text-dark-slate font-medium'}`}
                                    onClick={() => handleSelect(option.value)}
                                >
                                    {option.label}
                                    {internalValue === option.value && (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                                    )}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}
