export interface Coordenada {
    latitude: number;
    longitude: number;
}

export interface HemocentroProximo {
    id: string;
    nomeHemocentro: string;
    tipo: string;
    endereco: string;
    latitude: number;
    longitude: number;
    distanciaKm: number;
}