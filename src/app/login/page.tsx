import { login } from './actions'

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="w-16 h-16 bg-light-gray rounded-xl mx-auto flex items-center justify-center mb-6 shadow-sm">
                    <span className="text-dark-slate font-heading font-bold text-xl select-none">AL</span>
                </div>
                <h2 className="text-center text-3xl font-heading font-bold tracking-tight text-dark-slate">
                    Acesso Restrito
                </h2>
                <p className="mt-2 text-center text-sm text-dark-slate/70">
                    Esta plataforma é reservada a utilizadores autorizados.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-sm sm:rounded-xl sm:px-10 border border-light-gray">
                    <form className="space-y-6" action={login}>
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
                                    placeholder="Seu email corporativo"
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
                                    autoComplete="current-password"
                                    required
                                    className="block w-full rounded-md border-0 py-2.5 text-dark-slate shadow-sm ring-1 ring-inset ring-light-gray placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-blue sm:text-sm sm:leading-6 px-3"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-primary-blue px-3 py-2.5 text-sm font-semibold leading-6 text-white shadow-sm hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-blue transition-opacity"
                            >
                                Entrar
                            </button>
                        </div>

                        <div className="mt-4 text-center">
                            <a href="#" className="text-sm font-semibold text-primary-blue hover:text-blue-700 hover:underline">
                                Esqueceu a sua palavra-passe?
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
