import { apiRequest } from './api';

export type Perfil = 'DOADOR' | 'HEMOCENTRO';

interface LoginResponse {
    token: string;
    email: string;
    role: string;
}

interface UsuarioAtual {
    userId: string;
    email: string;
    role: string;
}

const TOKEN_KEY = 'doe-sangue-token';

export function obterToken(): string | null {
    return sessionStorage.getItem(TOKEN_KEY);
}

export function sair(): void {
    sessionStorage.removeItem(TOKEN_KEY);
}

export async function entrar(email: string, senha: string): Promise<Perfil> {
    const result = await apiRequest<LoginResponse>('/Auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, senha }),
    });

    if (!result.token || (result.role !== 'DOADOR' && result.role !== 'HEMOCENTRO')) {
        throw new Error('A API retornou uma sessão inválida.');
    }

    sessionStorage.setItem(TOKEN_KEY, result.token);
    return result.role;
}

export async function consultarPerfil(token: string): Promise<Perfil> {
    const result = await apiRequest<UsuarioAtual>('/Auth/me', {}, token);
    if (result.role !== 'DOADOR' && result.role !== 'HEMOCENTRO') {
        throw new Error('A API retornou um perfil inválido.');
    }
    return result.role;
}
