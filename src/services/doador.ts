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

export interface EnderecoDoador {
    cep: string;
    numero: string;
    rua: string;
    bairro: string;
    cidade: string;
    estado: string;
}

export interface MeuPerfilDoador {
    id: string;
    nome: string;
    documento: string;
    telefone: string;
    dataNascimento: string;
    email: string | null;
    endereco: EnderecoDoador | null;
}

export interface AtualizarMeuPerfilRequest {
    nome: string;
    documento: string;
    telefone: string;
    dataNascimento: string;
    endereco: EnderecoDoador;
}

export async function buscarMeuPerfil(token: string): Promise<MeuPerfilDoador> {
    return apiRequest(
        '/Doador/me',
        { method: 'GET' },
        token
    );
}

export async function atualizarMeuPerfil(dados: AtualizarMeuPerfilRequest, token: string): Promise<void> {
    await apiRequest(
        '/Doador/me',
        {
            method: 'PUT',
            body: JSON.stringify(dados),
        },
        token
    );
}
