'use client'

import { useState } from 'react'
import { login, requestAccess } from './actions'

export default function LoginPage() {
    const [isRegistering, setIsRegistering] = useState(false)

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-12 px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="w-16 h-16 bg-light-gray rounded-xl mx-auto flex items-center justify-center mb-6 shadow-sm">
                    <span className="text-dark-slate font-heading font-bold text-xl select-none">AL</span>
                </div>
                <h2 className="text-center text-3xl font-heading font-bold tracking-tight text-dark-slate">
                    Acesso Restrito
                </h2>
                <p className="mt-2 text-center text-sm text-dark-slate/70">
                    A plataforma Library é fechada. Faça login ou peça acesso à sua conta.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white p-2 shadow-sm sm:rounded-xl border border-light-gray flex gap-2 mb-4">
                    <button
                        onClick={() => setIsRegistering(false)}
                        className={`flex-1 text-sm font-semibold rounded-lg py-2 transition-colors ${!isRegistering ? 'bg-primary-blue text-white shadow-sm' : 'text-dark-slate/60 hover:text-dark-slate hover:bg-gray-50'}`}
                    >
                        Login Existente
                    </button>
                    <button
                        onClick={() => setIsRegistering(true)}
                        className={`flex-1 text-sm font-semibold rounded-lg py-2 transition-colors ${isRegistering ? 'bg-primary-blue text-white shadow-sm' : 'text-dark-slate/60 hover:text-dark-slate hover:bg-gray-50'}`}
                    >
                        Pedir Acesso
                    </button>
                </div>

                <div className="bg-white py-8 px-4 shadow-sm sm:rounded-xl sm:px-10 border border-light-gray">
                    <form className="space-y-6" action={isRegistering ? requestAccess : login}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-dark-slate">
                                Endereço de Email
                            </label>
                            <div className="mt-2">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="block w-full rounded-md border-0 py-2.5 text-dark-slate shadow-sm ring-1 ring-inset ring-light-gray placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-blue sm:text-sm sm:leading-6 px-3"
                                    placeholder="nome@empresa.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium leading-6 text-dark-slate">
                                Palavra-passe
                            </label>
                            <div className="mt-2">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete={isRegistering ? "new-password" : "current-password"}
                                    required
                                    minLength={6}
                                    className="block w-full rounded-md border-0 py-2.5 text-dark-slate shadow-sm ring-1 ring-inset ring-light-gray placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-blue sm:text-sm sm:leading-6 px-3"
                                    placeholder="••••••••"
                                />
                            </div>
                            {isRegistering && (
                                <p className="mt-1 text-xs text-dark-slate/50">Mínimo 6 caracteres.</p>
                            )}
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-dark-slate px-3 py-2.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary-blue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-blue transition-colors"
                            >
                                {isRegistering ? 'Pedir Acesso à Plataforma' : 'Entrar na Plataforma'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
