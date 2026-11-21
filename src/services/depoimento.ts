import { apiRequest } from './api';

export interface Depoimento {
  id: string;
  titulo: string;
  conteudo: string;
  criadoEm: string;
  atualizadoEm?: string;
  autor?: {
    id: string;
    email: string;
    nome: string;
  };
}

export interface CriarDepoimentoRequest {
  titulo: string;
  conteudo: string;
}

/**
 * Listar depoimentos públicos (últimos 10)
 * Não requer autenticação
 */
export async function listarDepoimentos(): Promise<Depoimento[]> {
  return apiRequest('/Depoimento/publico', { method: 'GET' });
}

/**
 * Buscar depoimento por ID (público)
 */
export async function obterDepoimento(depoimentoId: string): Promise<Depoimento> {
  return apiRequest(
    `/Depoimento/${depoimentoId}`,
    { method: 'GET' }
  );
}

/**
 * Buscar depoimento por ID (público)
 * @deprecated Use obterDepoimento instead
 */
export async function buscarDepoimento(depoimentoId: string): Promise<Depoimento> {
  return obterDepoimento(depoimentoId);
}

/**
 * Criar novo depoimento (requer autenticação)
 */
export async function criarDepoimento(
  request: CriarDepoimentoRequest,
  token: string
): Promise<Depoimento> {
  return apiRequest(
    '/Depoimento',
    {
      method: 'POST',
      body: JSON.stringify(request),
    },
    token
  );
}

/**
 * Listar todos os depoimentos (requer autenticação)
 */
export async function listarTodosDepoimentos(
  token: string
): Promise<Depoimento[]> {
  return apiRequest(
    '/Depoimento',
    { method: 'GET' },
    token
  );
}

export function formatarData(data: string): string {
  const date = new Date(data);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function truncarTexto(texto: string, limite: number = 150): string {
  if (texto.length <= limite) return texto;
  return texto.substring(0, limite) + '...';
}
