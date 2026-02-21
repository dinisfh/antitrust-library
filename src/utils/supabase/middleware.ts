import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    // Exclude static files, images, and API routes from middleware checks immediately
    if (
        request.nextUrl.pathname.startsWith('/_next') ||
        request.nextUrl.pathname.startsWith('/api') ||
        request.nextUrl.pathname.match(/\.(.*)$/)
    ) {
        return supabaseResponse
    }

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    const {
        data: { user },
    } = await supabase.auth.getUser()

    const pathname = request.nextUrl.pathname
    const isAuthPage = pathname.startsWith('/login')
    const isPendingPage = pathname.startsWith('/pending')

    // Se NÃO ESTÁ logado
    if (!user) {
        if (!isAuthPage) {
            const url = request.nextUrl.clone()
            url.pathname = '/login'
            return NextResponse.redirect(url)
        }
        return supabaseResponse
    }

    // A partir daqui: ESTÁ logado

    // Otimização: buscar estado à BD
    const { data: profile } = await supabase
        .from('Users')
        .select('status')
        .eq('id', user.id)
        .single()

    const isPending = profile?.status === 'Pending'

    // Lógica 1: Está Pendente mas não está na sala de espera
    if (isPending && !isPendingPage) {
        const url = request.nextUrl.clone()
        url.pathname = '/pending'
        return NextResponse.redirect(url)
    }

    // Lógica 2: NÃO está pendente (Ativo), mas tenta ir para Auth ou Sala de Espera
    if (!isPending && (isAuthPage || isPendingPage)) {
        const url = request.nextUrl.clone()
        url.pathname = '/'
        return NextResponse.redirect(url)
    }

    return supabaseResponse
}
