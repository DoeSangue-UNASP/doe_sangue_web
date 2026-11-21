import { apiRequest } from './api';

export interface CadastrarLeadRequest {
    nome: string;
    documento: string;
    telefone: string;
    dataNascimento: string;
}

export async function cadastrarLead(leadData: CadastrarLeadRequest, token: string): Promise<void> {
    await apiRequest(
        '/Hemocentro/leads',
        {
            method: 'POST',
            body: JSON.stringify(leadData),
        },
        token
    );
}

export interface Doador {
    id: string;
    nome: string;
    documento: string;
    telefone: string;
    dataNascimento: string;
    ehLead: boolean;
    ehUsuario: boolean;
}

export async function buscarDoadores(token: string): Promise<Doador[]> {
    return apiRequest(
        '/Doadores',
        { method: 'GET' },
        token
    );
}

export async function buscarDoadorPorId(doadorId: string, token: string): Promise<Doador> {
    return apiRequest(
        `/Doadores/${doadorId}`,
        { method: 'GET' },
        token
    );
}

export async function buscarDoadorPorCpf(cpf: string, token: string): Promise<Doador[]> {
    return apiRequest(
        `/Doadores/cpf/${cpf}`,
        { method: 'GET' },
        token
    );
}
