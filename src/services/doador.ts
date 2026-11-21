import { apiRequest } from './api';

export const TIPOS_SANGUINEOS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

// Sexo e tipo sanguíneo são opcionais: '' representa "Não informado"
export const SEXO_OPTIONS = [
    { value: '', label: 'Não informado' },
    { value: 'M', label: 'Masculino' },
    { value: 'F', label: 'Feminino' },
];

export const TIPO_SANGUINEO_OPTIONS = [
    { value: '', label: 'Não informado' },
    ...TIPOS_SANGUINEOS.map(tipo => ({ value: tipo, label: tipo })),
];

export function formatarSexo(sexo: string | null | undefined): string {
    return SEXO_OPTIONS.find(opcao => opcao.value === sexo && sexo)?.label ?? '-';
}

export interface CadastrarLeadRequest {
    nome: string;
    documento: string;
    telefone: string;
    dataNascimento: string;
    sexo?: string;
    tipoSanguineo?: string;
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
    sexo: string | null;
    tipoSanguineo: string | null;
    ehLead: boolean;
    ehUsuario: boolean;
}

export interface AtualizarDoadorHemocentroRequest {
    nome: string;
    documento: string;
    telefone: string;
    dataNascimento: string;
    sexo?: string;
    tipoSanguineo?: string;
}

export async function atualizarDoadorPeloHemocentro(
    doadorId: string,
    dados: AtualizarDoadorHemocentroRequest,
    token: string
): Promise<void> {
    await apiRequest(
        `/Doador/${doadorId}`,
        {
            method: 'PUT',
            body: JSON.stringify(dados),
        },
        token
    );
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
    sexo: string | null;
    tipoSanguineo: string | null;
    email: string | null;
    endereco: EnderecoDoador | null;
}

export interface AtualizarMeuPerfilRequest {
    nome: string;
    documento: string;
    telefone: string;
    dataNascimento: string;
    endereco: EnderecoDoador;
    sexo?: string;
    tipoSanguineo?: string;
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

export function formatarCpf(cpf: string): string {
    const digitos = cpf.replace(/\D/g, '');
    return digitos.length === 11
        ? `${digitos.slice(0, 3)}.${digitos.slice(3, 6)}.${digitos.slice(6, 9)}-${digitos.slice(9)}`
        : cpf;
}

// Datas sem horário (yyyy-MM-dd) não devem passar por Date, para não sofrer deslocamento de fuso
export function formatarDataNascimento(data: string): string {
    const [ano, mes, dia] = data.split('T')[0]!.split('-');
    return ano && mes && dia ? `${dia}/${mes}/${ano}` : data;
}
