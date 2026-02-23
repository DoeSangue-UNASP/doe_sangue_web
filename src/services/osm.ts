import type { Coordenada, HemocentroProximo } from '../types/hemocentro';

const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';
const RAIO_MAXIMO_METROS = 15000;
const DISTANCIA_MAXIMA_KM = 15;

interface OverpassElement {
    id: number;
    lat?: number;
    lon?: number;
    center?: {
        lat: number;
        lon: number;
    };
    tags?: Record<string, string>;
}

interface OverpassResponse {
    elements: OverpassElement[];
}

const toRadians = (valor: number) => (valor * Math.PI) / 180;

const calcularDistanciaKm = (origem: Coordenada, destino: Coordenada): number => {
    const raioTerraKm = 6371;
    const deltaLat = toRadians(destino.latitude - origem.latitude);
    const deltaLon = toRadians(destino.longitude - origem.longitude);
    const lat1 = toRadians(origem.latitude);
    const lat2 = toRadians(destino.latitude);

    const a =
        Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
        Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return raioTerraKm * c;
};

const montarEndereco = (tags?: Record<string, string>): string => {
    if (!tags) {
        return 'Endereço não informado';
    }

    const rua = tags['addr:street'] ?? tags['street'] ?? '';
    const numero = tags['addr:housenumber'] ?? '';
    const bairro = tags['addr:suburb'] ?? tags['addr:neighbourhood'] ?? '';
    const cidade = tags['addr:city'] ?? tags['addr:town'] ?? tags['addr:village'] ?? '';
    const estado = tags['addr:state'] ?? '';

    const linha1 = [rua, numero].filter(Boolean).join(', ');
    const linha2 = [bairro, cidade, estado].filter(Boolean).join(' - ');
    const endereco = [linha1, linha2].filter(Boolean).join(', ');

    return endereco || 'Endereço não informado';
};

const extrairCoordenada = (elemento: OverpassElement): Coordenada | null => {
    const latitude = elemento.lat ?? elemento.center?.lat;
    const longitude = elemento.lon ?? elemento.center?.lon;

    if (latitude === undefined || longitude === undefined) {
        return null;
    }

    return { latitude, longitude };
};

const mapearTipo = (nome: string, tags?: Record<string, string>): string => {
    if (!tags) {
        return 'Ponto de coleta';
    }

    const nomeNormalizado = nome.toLowerCase();

    if (nomeNormalizado.includes('hemocentro') || nomeNormalizado.includes('banco de sangue')) {
        return 'Hemocentro';
    }

    if (tags.amenity === 'blood_donation' || tags.healthcare === 'blood_donation') {
        return 'Ponto de coleta';
    }

    if (tags.amenity === 'hospital') {
        return 'Hospital';
    }

    if (tags.healthcare === 'clinic') {
        return 'Clínica';
    }

    return 'Ponto de coleta';
};

const prioridadeTipo = (tipo: string): number => {
    if (tipo === 'Hemocentro') {
        return 0;
    }

    if (tipo === 'Ponto de coleta') {
        return 1;
    }

    return 2;
};

const montarQueryOverpass = (coordenada: Coordenada): string => `
[out:json][timeout:25];
(
  node(around:${RAIO_MAXIMO_METROS},${coordenada.latitude},${coordenada.longitude})[amenity=blood_donation];
  way(around:${RAIO_MAXIMO_METROS},${coordenada.latitude},${coordenada.longitude})[amenity=blood_donation];
  relation(around:${RAIO_MAXIMO_METROS},${coordenada.latitude},${coordenada.longitude})[amenity=blood_donation];

  node(around:${RAIO_MAXIMO_METROS},${coordenada.latitude},${coordenada.longitude})[healthcare=blood_donation];
  way(around:${RAIO_MAXIMO_METROS},${coordenada.latitude},${coordenada.longitude})[healthcare=blood_donation];
  relation(around:${RAIO_MAXIMO_METROS},${coordenada.latitude},${coordenada.longitude})[healthcare=blood_donation];

  node(around:${RAIO_MAXIMO_METROS},${coordenada.latitude},${coordenada.longitude})[amenity=hospital];
  way(around:${RAIO_MAXIMO_METROS},${coordenada.latitude},${coordenada.longitude})[amenity=hospital];
  relation(around:${RAIO_MAXIMO_METROS},${coordenada.latitude},${coordenada.longitude})[amenity=hospital];

  node(around:${RAIO_MAXIMO_METROS},${coordenada.latitude},${coordenada.longitude})[healthcare=clinic];
  way(around:${RAIO_MAXIMO_METROS},${coordenada.latitude},${coordenada.longitude})[healthcare=clinic];
  relation(around:${RAIO_MAXIMO_METROS},${coordenada.latitude},${coordenada.longitude})[healthcare=clinic];
);
out center tags;
`;

export const buscarHemocentrosProximos = async (
    coordenadaUsuario: Coordenada
): Promise<HemocentroProximo[]> => {
    const query = montarQueryOverpass(coordenadaUsuario);

    const resposta = await fetch(OVERPASS_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain;charset=UTF-8'
        },
        body: query
    });

    if (!resposta.ok) {
        throw new Error('Falha ao consultar OpenStreetMap');
    }

    const payload: OverpassResponse = await resposta.json();
    const itensUnicos = new Map<string, HemocentroProximo>();

    for (const elemento of payload.elements ?? []) {
        const coordenada = extrairCoordenada(elemento);

        if (!coordenada) {
            continue;
        }

        const distanciaKm = calcularDistanciaKm(coordenadaUsuario, coordenada);

        if (distanciaKm > DISTANCIA_MAXIMA_KM) {
            continue;
        }

        const nome = elemento.tags?.name?.trim() || 'Ponto de Coleta';
        const endereco = montarEndereco(elemento.tags);
        const tipo = mapearTipo(nome, elemento.tags);
        const chaveUnica = `${nome}-${coordenada.latitude}-${coordenada.longitude}`;

        if (itensUnicos.has(chaveUnica)) {
            continue;
        }

        itensUnicos.set(chaveUnica, {
            id: `${elemento.id}`,
            nomeHemocentro: nome,
            tipo,
            endereco,
            latitude: coordenada.latitude,
            longitude: coordenada.longitude,
            distanciaKm: Number(distanciaKm.toFixed(1))
        });
    }

    return [...itensUnicos.values()].sort((a, b) => {
        const diferencaPrioridade = prioridadeTipo(a.tipo) - prioridadeTipo(b.tipo);

        if (diferencaPrioridade !== 0) {
            return diferencaPrioridade;
        }

        return a.distanciaKm - b.distanciaKm;
    });
};