import { apiRequest } from './api';

export interface Lead {
  id: string;
  nome: string;
  documento: string;
  email: string;
  telefone: string;
  dataNascimento: string;
  genero: string;
  endereco: {
    cep: string;
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
  };
  tipoSanguineo: string;
  hemocentroId: string;
  criadoEm: string;
  atualizadoEm: string;
}

export interface CriarLeadRequest {
  nome: string;
  documento: string;
  email: string;
  telefone: string;
  dataNascimento: string;
  genero: string;
  endereco: {
    cep: string;
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
  };
  tipoSanguineo: string;
}

export interface AtualizarLeadRequest {
  nome?: string;
  email?: string;
  telefone?: string;
  dataNascimento?: string;
  genero?: string;
  endereco?: {
    cep?: string;
    logradouro?: string;
    numero?: string;
    complemento?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
  };
  tipoSanguineo?: string;
}

export async function criarLead(
  request: CriarLeadRequest,
  token: string
): Promise<Lead> {
  return apiRequest(
    '/Leads',
    {
      method: 'POST',
      body: JSON.stringify(request),
    },
    token
  );
}

export async function buscarLeadPorId(leadId: string, token: string): Promise<Lead> {
  return apiRequest(
    `/Leads/${leadId}`,
    { method: 'GET' },
    token
  );
}

export async function buscarLeadPorDocumento(
  documento: string,
  token: string
): Promise<Lead | null> {
  try {
    return await apiRequest(
      `/Leads/documento/${documento}`,
      { method: 'GET' },
      token
    );
  } catch {
    return null;
  }
}

export interface FiltrosLeadHemocentro {
  documento?: string;
  nome?: string;
}

export async function listarLeadsHemocentro(
  filtros: FiltrosLeadHemocentro,
  token: string
): Promise<Lead[]> {
  const params = new URLSearchParams();
  
  if (filtros.documento) params.append('documento', filtros.documento);
  if (filtros.nome) params.append('nome', filtros.nome);

  const url = params.toString()
    ? `/Leads/hemocentro?${params.toString()}`
    : '/Leads/hemocentro';

  return apiRequest(
    url,
    { method: 'GET' },
    token
  );
}

export async function atualizarLead(
  leadId: string,
  request: AtualizarLeadRequest,
  token: string
): Promise<Lead> {
  return apiRequest(
    `/Leads/${leadId}`,
    {
      method: 'PUT',
      body: JSON.stringify(request),
    },
    token
  );
}

export async function deletarLead(leadId: string, token: string): Promise<void> {
  await apiRequest(
    `/Leads/${leadId}`,
    { method: 'DELETE' },
    token
  );
}

export function formatarDataBrasileira(data: string): string {
  const date = new Date(data);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function formatarGenero(genero: string): string {
  const generoMap: Record<string, string> = {
    M: 'Masculino',
    F: 'Feminino',
    O: 'Outro',
  };
  return generoMap[genero] || genero;
}
