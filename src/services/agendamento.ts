import { apiRequest } from './api';

export type StatusAgendamento = 'AGENDADO' | 'CONCLUIDO' | 'CANCELADO';

export interface Agendamento {
  id: string;
  agendadoPara: string;
  status: StatusAgendamento;
  doador: {
    id: string;
    nome: string;
    documento: string;
    telefone: string;
  };
  hemocentro: {
    id: string;
    nomeFantasia: string;
  };
}

export interface CriarAgendamentoRequest {
  doadorId: string;
  hemocentroId: string;
  agendadoPara: string;
}

export async function criarAgendamentoDoador(
  request: CriarAgendamentoRequest,
  token: string
): Promise<void> {
  await apiRequest(
    '/Agendamentos',
    {
      method: 'POST',
      body: JSON.stringify(request),
    },
    token
  );
}

export async function criarAgendamentoHemocentro(
  request: CriarAgendamentoRequest,
  token: string
): Promise<void> {
  await apiRequest(
    '/Agendamentos/hemocentro',
    {
      method: 'POST',
      body: JSON.stringify(request),
    },
    token
  );
}

export async function listarAgendamentosDoador(token: string): Promise<Agendamento[]> {
  return apiRequest(
    '/Agendamentos/me',
    { method: 'GET' },
    token
  );
}

export interface FiltrosAgendamentoHemocentro {
  data?: string;
  documento?: string;
}

export async function listarAgendamentosHemocentro(
  filtros: FiltrosAgendamentoHemocentro,
  token: string
): Promise<Agendamento[]> {
  const params = new URLSearchParams();
  if (filtros.data) {
    params.append('data', filtros.data);
  }

  const url = params.toString()
    ? `/Agendamentos/hemocentro?${params.toString()}`
    : '/Agendamentos/hemocentro';

  const headers: Record<string, string> = {};
  if (filtros.documento) {
    headers['documento'] = filtros.documento;
  }

  return apiRequest(
    url,
    {
      method: 'GET',
      headers,
    },
    token
  );
}

export async function cancelarAgendamento(
  agendamentoId: string,
  token: string
): Promise<void> {
  await apiRequest(
    `/Agendamentos/${agendamentoId}/cancelar`,
    { method: 'PATCH' },
    token
  );
}

export async function concluirAgendamento(
  agendamentoId: string,
  token: string
): Promise<void> {
  await apiRequest(
    `/Agendamentos/${agendamentoId}/concluir`,
    { method: 'PATCH' },
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

export function formatarStatusAgendamento(status: StatusAgendamento): string {
  const statusMap: Record<StatusAgendamento, string> = {
    AGENDADO: 'Agendado',
    CONCLUIDO: 'Concluído',
    CANCELADO: 'Cancelado',
  };
  return statusMap[status] || status;
}

function ordenarPorDataDesc(agendamentos: Agendamento[]): Agendamento[] {
  return [...agendamentos].sort(
    (a, b) => new Date(b.agendadoPara).getTime() - new Date(a.agendadoPara).getTime()
  );
}

export async function listarAgendamentosOrdenadosDoador(token: string): Promise<Agendamento[]> {
  return ordenarPorDataDesc(await listarAgendamentosDoador(token));
}

// No back, uma doação é um agendamento concluído
export function filtrarDoacoes(agendamentos: Agendamento[]): Agendamento[] {
  return ordenarPorDataDesc(agendamentos.filter(a => a.status === 'CONCLUIDO'));
}

export function buscarProximoAgendamento(agendamentos: Agendamento[]): Agendamento | null {
  const agora = Date.now();
  const futuros = agendamentos
    .filter(a => a.status === 'AGENDADO' && new Date(a.agendadoPara).getTime() >= agora)
    .sort((a, b) => new Date(a.agendadoPara).getTime() - new Date(b.agendadoPara).getTime());
  return futuros[0] ?? null;
}

export function formatarApenasData(data: string): string {
  return new Date(data).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function formatarApenasHora(data: string): string {
  return new Date(data).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatarDataParaInput(data: Date | string): string {
  const date = typeof data === 'string' ? new Date(data) : data;
  const ano = date.getFullYear();
  const mes = String(date.getMonth() + 1).padStart(2, '0');
  const dia = String(date.getDate()).padStart(2, '0');
  const horas = String(date.getHours()).padStart(2, '0');
  const minutos = String(date.getMinutes()).padStart(2, '0');
  return `${ano}-${mes}-${dia}T${horas}:${minutos}`;
}

export function extrairDataEHora(datetime: string): { data: string; hora: string } {
  const parts = datetime.split('T');
  const data = parts[0] || '';
  const hora = parts[1]?.substring(0, 5) || '00:00';
  return { data, hora };
}

export function validarDataFutura(datetime: string): boolean {
  const data = new Date(datetime);
  return data > new Date();
}

export function validarDataFutura2(datetime?: string): boolean {
  if (!datetime) return false;
  const data = new Date(datetime);
  return data > new Date();
}
