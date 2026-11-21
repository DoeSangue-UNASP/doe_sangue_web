import { apiRequest } from './api';

export type StatusDoacao = 'PENDENTE' | 'CONCLUIDA' | 'CANCELADA';

export interface BolsaSangue {
  id: string;
  codigo: string;
  tipoSanguineo: string;
  volume: number;
  dataColeta: string;
  dataValidade: string;
  status: 'DISPONIVEL' | 'UTILIZADA' | 'DESCARTADA';
}

export interface Doacao {
  id: string;
  dataDoacao: string;
  status: StatusDoacao;
  volume: number;
  doador: {
    id: string;
    nome: string;
    documento: string;
  };
  hemocentro: {
    id: string;
    nomeFantasia: string;
  };
  bolsas: BolsaSangue[];
}

export interface CriarDoacaoRequest {
  agendamentoId: string;
  volume: number;
  dataDoacao: string;
}

export interface AtualizarDoacaoRequest {
  volume?: number;
  status?: StatusDoacao;
}

export interface CriarBolsaSangueRequest {
  doacaoId: string;
  tipoSanguineo: string;
  volume: number;
  dataValidade: string;
}

// Doações do doador
export async function listarMinhasDoacoes(token: string): Promise<Doacao[]> {
  return apiRequest(
    '/Doacoes/me',
    { method: 'GET' },
    token
  );
}

export async function buscarDoacaoPorId(doacaoId: string, token: string): Promise<Doacao> {
  return apiRequest(
    `/Doacoes/${doacaoId}`,
    { method: 'GET' },
    token
  );
}

// Doações do hemocentro
export interface FiltrosDoacaoHemocentro {
  dataInicio?: string;
  dataFim?: string;
  documento?: string;
  status?: StatusDoacao;
}

export async function listarDoacoesHemocentro(
  filtros: FiltrosDoacaoHemocentro,
  token: string
): Promise<Doacao[]> {
  const params = new URLSearchParams();
  
  if (filtros.dataInicio) params.append('dataInicio', filtros.dataInicio);
  if (filtros.dataFim) params.append('dataFim', filtros.dataFim);
  if (filtros.status) params.append('status', filtros.status);
  if (filtros.documento) params.append('documento', filtros.documento);

  const url = params.toString()
    ? `/Doacoes/hemocentro?${params.toString()}`
    : '/Doacoes/hemocentro';

  return apiRequest(
    url,
    { method: 'GET' },
    token
  );
}

export async function criarDoacao(
  request: CriarDoacaoRequest,
  token: string
): Promise<Doacao> {
  return apiRequest(
    '/Doacoes',
    {
      method: 'POST',
      body: JSON.stringify(request),
    },
    token
  );
}

export async function atualizarDoacao(
  doacaoId: string,
  request: AtualizarDoacaoRequest,
  token: string
): Promise<Doacao> {
  return apiRequest(
    `/Doacoes/${doacaoId}`,
    {
      method: 'PUT',
      body: JSON.stringify(request),
    },
    token
  );
}

export async function cancelarDoacao(
  doacaoId: string,
  token: string
): Promise<void> {
  await apiRequest(
    `/Doacoes/${doacaoId}/cancelar`,
    { method: 'PATCH' },
    token
  );
}

// Bolsas de sangue
export async function criarBolsaSangue(
  request: CriarBolsaSangueRequest,
  token: string
): Promise<BolsaSangue> {
  return apiRequest(
    '/BolsasSangue',
    {
      method: 'POST',
      body: JSON.stringify(request),
    },
    token
  );
}

export async function listarBolsasPorDoacao(
  doacaoId: string,
  token: string
): Promise<BolsaSangue[]> {
  return apiRequest(
    `/BolsasSangue/doacao/${doacaoId}`,
    { method: 'GET' },
    token
  );
}

export async function buscarBolsaPorId(
  bolsaId: string,
  token: string
): Promise<BolsaSangue> {
  return apiRequest(
    `/BolsasSangue/${bolsaId}`,
    { method: 'GET' },
    token
  );
}

export async function atualizarBolsaSangue(
  bolsaId: string,
  status: 'DISPONIVEL' | 'UTILIZADA' | 'DESCARTADA',
  token: string
): Promise<BolsaSangue> {
  return apiRequest(
    `/BolsasSangue/${bolsaId}`,
    {
      method: 'PUT',
      body: JSON.stringify({ status }),
    },
    token
  );
}

export function formatarDataBrasileira(data: string): string {
  const date = new Date(data);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatarStatus(status: StatusDoacao): string {
  const statusMap: Record<StatusDoacao, string> = {
    PENDENTE: 'Pendente',
    CONCLUIDA: 'Concluída',
    CANCELADA: 'Cancelada',
  };
  return statusMap[status] || status;
}

export function formatarStatusBolsa(status: string): string {
  const statusMap: Record<string, string> = {
    DISPONIVEL: 'Disponível',
    UTILIZADA: 'Utilizada',
    DESCARTADA: 'Descartada',
  };
  return statusMap[status] || status;
}
