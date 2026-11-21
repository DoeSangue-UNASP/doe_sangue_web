import { apiRequest } from './api';

export interface Depoimento {
  id: string;
  texto: string;
  titulo: string;
  nomeAutor?: string;
  tipoSanguineo?: string;
  dataDepoimento: string;
  status: 'PENDENTE' | 'APROVADO' | 'REJEITADO';
  avaliacoes: number;
  criadoEm: string;
  atualizadoEm: string;
}

export interface CriarDepoimentoRequest {
  titulo: string;
  texto: string;
  nomeAutor?: string;
  tipoSanguineo?: string;
}

export interface AtualizarDepoimentoRequest {
  titulo?: string;
  texto?: string;
  status?: 'PENDENTE' | 'APROVADO' | 'REJEITADO';
  avaliacoes?: number;
}

export interface FiltrosDepoimento {
  status?: 'APROVADO';
  pagina?: number;
  limite?: number;
}

/**
 * Listar depoimentos aprovados (público)
 */
export async function listarDepoimentos(
  filtros: FiltrosDepoimento = {}
): Promise<Depoimento[]> {
  const params = new URLSearchParams();
  
  if (filtros.status) params.append('status', filtros.status);
  if (filtros.pagina) params.append('pagina', filtros.pagina.toString());
  if (filtros.limite) params.append('limite', filtros.limite.toString());

  const url = params.toString()
    ? `/Depoimentos?${params.toString()}`
    : '/Depoimentos';

  return apiRequest(url, { method: 'GET' });
}

/**
 * Buscar depoimento por ID (público)
 */
export async function buscarDepoimento(depoimentoId: string): Promise<Depoimento> {
  return apiRequest(
    `/Depoimentos/${depoimentoId}`,
    { method: 'GET' }
  );
}

/**
 * Criar novo depoimento (anônimo)
 * Não requer autenticação
 */
export async function criarDepoimento(
  request: CriarDepoimentoRequest
): Promise<Depoimento> {
  return apiRequest(
    '/Depoimentos',
    {
      method: 'POST',
      body: JSON.stringify(request),
    }
  );
}

/**
 * Listar depoimentos para gerenciamento (requer autenticação)
 */
export async function listarDepoimentosGerenciamento(
  filtros: FiltrosDepoimento = {},
  token: string
): Promise<Depoimento[]> {
  const params = new URLSearchParams();
  
  if (filtros.status) params.append('status', filtros.status);
  if (filtros.pagina) params.append('pagina', filtros.pagina.toString());
  if (filtros.limite) params.append('limite', filtros.limite.toString());

  const url = params.toString()
    ? `/Depoimentos/gerenciar?${params.toString()}`
    : '/Depoimentos/gerenciar';

  return apiRequest(
    url,
    { method: 'GET' },
    token
  );
}

/**
 * Atualizar depoimento (requer autenticação)
 */
export async function atualizarDepoimento(
  depoimentoId: string,
  request: AtualizarDepoimentoRequest,
  token: string
): Promise<Depoimento> {
  return apiRequest(
    `/Depoimentos/${depoimentoId}`,
    {
      method: 'PUT',
      body: JSON.stringify(request),
    },
    token
  );
}

/**
 * Deletar depoimento (requer autenticação)
 */
export async function deletarDepoimento(
  depoimentoId: string,
  token: string
): Promise<void> {
  await apiRequest(
    `/Depoimentos/${depoimentoId}`,
    { method: 'DELETE' },
    token
  );
}

/**
 * Aprovar depoimento (requer autenticação de admin)
 */
export async function aprovarDepoimento(
  depoimentoId: string,
  token: string
): Promise<Depoimento> {
  return apiRequest(
    `/Depoimentos/${depoimentoId}/aprovar`,
    { method: 'PATCH' },
    token
  );
}

/**
 * Rejeitar depoimento (requer autenticação de admin)
 */
export async function rejeitarDepoimento(
  depoimentoId: string,
  token: string
): Promise<Depoimento> {
  return apiRequest(
    `/Depoimentos/${depoimentoId}/rejeitar`,
    { method: 'PATCH' },
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
