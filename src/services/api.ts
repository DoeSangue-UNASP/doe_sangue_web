const apiUrl = (import.meta.env.VITE_API_URL || '/backend/api').replace(/\/$/, '');

export class ApiError {
    readonly status: number;
    readonly message: string;

    constructor(status: number, message: string) {
        this.status = status;
        this.message = message;
    }

    toString(): string {
        return this.message;
    }
}

export async function apiRequest<T>(path: string, options: RequestInit = {}, token?: string): Promise<T> {
    const headers = new Headers(options.headers);
    if (options.body) headers.set('Content-Type', 'application/json');
    if (token) headers.set('Authorization', `Bearer ${token}`);

    let response: Response;
    try {
        response = await fetch(`${apiUrl}${path}`, { ...options, headers });
    } catch {
        throw new Error('Não foi possível conectar à API. Verifique se ela está em execução.');
    }

    if (!response.ok) {
        const contentType = response.headers.get('content-type') || '';
        let message = `Não foi possível concluir a operação (${response.status}).`;
        if (contentType.includes('application/json')) {
            const body: unknown = await response.json();
            if (typeof body === 'string') message = body;
            else if (body && typeof body === 'object' && 'errors' in body) {
                const errors = (body as { errors: Record<string, string[]> }).errors;
                message = Object.values(errors).flat().join(' ') || message;
            } else if (body && typeof body === 'object' && 'title' in body && typeof body.title === 'string') {
                message = body.title;
            }
        } else {
            const text = await response.text();
            if (text && response.status < 500) message = text;
        }
        throw new ApiError(response.status, message);
    }

    if (response.status === 204 || response.headers.get('content-length') === '0') return undefined as T;
    const text = await response.text();
    return text ? JSON.parse(text) as T : undefined as T;
}
