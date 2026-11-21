import { apiRequest } from './api';
import { TIPOS_SANGUINEOS } from './doador';

export { TIPOS_SANGUINEOS };

export type StatusBolsa = 'DESCARTADA' | 'VENCIDA' | 'DISPONIVEL' | 'EM_ANALISE';

export interface BolsaSangue {
    id: string;
    codigo: string;
    testeSorologico: string;
    tipoComponente: string;
    fatorRh: string;
    tipoSanguineo: string;
    volume: number;
    status: StatusBolsa;
    criadoEm: string;
    dataColeta: string | null;
    dataValidade: string | null;
    localColeta: string | null;
    destino: string | null;
    responsavelColeta: string | null;
    agendamentoId: string;
    agendadoPara: string;
    hemocentro: string;
    doadorId: string;
    doador: string;
}

export interface CriarBolsaRequest {
    agendamentoId: string;
    codigo: string;
    testeSorologico: string;
    tipoComponente: string;
    fatorRh: string;
    tipoSanguineo: string;
    volume: number;
    dataColeta: string;
    dataValidade: string;
    localColeta?: string;
    destino?: string;
    responsavelColeta?: string;
}

export async function criarBolsa(dados: CriarBolsaRequest, token: string): Promise<void> {
    await apiRequest('/BolsaSangue', { method: 'POST', body: JSON.stringify(dados) }, token);
}

interface BolsasHemocentroResponse {
    bolsas: BolsaSangue[];
    estoque: { status: StatusBolsa; quantidade: number }[];
}

export async function listarBolsasHemocentro(token: string): Promise<BolsaSangue[]> {
    const resposta = await apiRequest<BolsasHemocentroResponse>('/BolsaSangue/hemocentro', { method: 'GET' }, token);
    return resposta.bolsas;
}

// O back guarda o tipo (A, B, AB, O) e o fator Rh em campos separados
export function tipoSanguineoCompleto(bolsa: Pick<BolsaSangue, 'tipoSanguineo' | 'fatorRh'>): string {
    const tipo = bolsa.tipoSanguineo.trim().toUpperCase();
    if (/[+-]$/.test(tipo)) return tipo;

    const fator = bolsa.fatorRh.trim().toLowerCase();
    if (fator.includes('pos') || fator.includes('+')) return `${tipo}+`;
    if (fator.includes('neg') || fator.includes('-')) return `${tipo}-`;
    return tipo;
}

export function formatarStatusBolsa(status: StatusBolsa): string {
    const statusMap: Record<StatusBolsa, string> = {
        DISPONIVEL: 'Disponível',
        EM_ANALISE: 'Em análise',
        VENCIDA: 'Vencida',
        DESCARTADA: 'Descartada',
    };
    return statusMap[status] || status;
}
