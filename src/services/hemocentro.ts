import { apiRequest } from './api';

export interface Hemocentro {
    id: string;
    cnpj: string;
    site: string;
    nomeFantasia: string;
    abreEm: string;
    fechaEm: string;
}

export async function listarHemocentros(): Promise<Hemocentro[]> {
    return apiRequest('/Hemocentro', { method: 'GET' });
}

// Gera horários de hora em hora dentro do funcionamento do hemocentro (HH:mm:ss -> HH:mm)
export function gerarHorarios(abreEm: string, fechaEm: string): string[] {
    const paraMinutos = (hora: string) => {
        const [h, m] = hora.split(':');
        return Number(h) * 60 + Number(m);
    };

    const abertura = paraMinutos(abreEm);
    const fechamento = paraMinutos(fechaEm);
    if (abertura === fechamento) return [];

    const horarios: string[] = [];
    let atual = abertura;
    while (atual !== fechamento && horarios.length < 24) {
        const h = String(Math.floor(atual / 60)).padStart(2, '0');
        const m = String(atual % 60).padStart(2, '0');
        horarios.push(`${h}:${m}`);
        atual = (atual + 60) % 1440;
    }
    return horarios;
}
