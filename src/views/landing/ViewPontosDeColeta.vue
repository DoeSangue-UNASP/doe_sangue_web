<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { PhCaretLeft, PhCaretRight } from '@phosphor-icons/vue';
import HemocentroCard from '../../components/HemocentroCard.vue';
import HemocentroInteractiveMap from '../../components/HemocentroInteractiveMap.vue';
import HemocentroMapPanel from '../../components/HemocentroMapPanel.vue';
import NavbarLanding from '../../components/NavbarLanding.vue';
import IconButton from '../../components/IconButton.vue';
import { buscarHemocentrosProximos } from '../../services/osm';
import type { Coordenada, HemocentroProximo } from '../../types/hemocentro';

const hemocentros = ref<HemocentroProximo[]>([]);
const isLoading = ref(true);
const skeletonCards = [1, 2, 3];
const locationDenied = ref(false);
const errorMessage = ref('');
const coordenadaUsuario = ref<Coordenada | null>(null);
const hemocentroSelecionadoId = ref<string | null>(null);
const focusSelectionToken = ref(0);
const itensPorPagina = 3;
const paginaAtual = ref(1);

const totalPaginas = computed(() => {
    if (!hemocentros.value.length) {
        return 1;
    }

    return Math.ceil(hemocentros.value.length / itensPorPagina);
});

const hemocentrosPaginados = computed(() => {
    const inicio = (paginaAtual.value - 1) * itensPorPagina;
    const fim = inicio + itensPorPagina;
    return hemocentros.value.slice(inicio, fim);
});

const mensagemSemPermissao =
    'Não foi possível localizar os pontos de coletas próximos, requer a permissão de localização';

const obterGeolocalizacao = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocalização não suportada pelo navegador'));
            return;
        }

        navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        });
    });
};

const carregarPontosProximos = async () => {
    isLoading.value = true;
    locationDenied.value = false;
    errorMessage.value = '';
    coordenadaUsuario.value = null;

    try {
        const posicao = await obterGeolocalizacao();

        coordenadaUsuario.value = {
            latitude: posicao.coords.latitude,
            longitude: posicao.coords.longitude
        };

        hemocentros.value = await buscarHemocentrosProximos({
            latitude: posicao.coords.latitude,
            longitude: posicao.coords.longitude
        });
    } catch (error: unknown) {
        if (error instanceof GeolocationPositionError && error.code === error.PERMISSION_DENIED) {
            locationDenied.value = true;
            hemocentros.value = [];
            coordenadaUsuario.value = null;
            return;
        }

        errorMessage.value = 'Não foi possível carregar os hemocentros próximos no momento.';
        hemocentros.value = [];
        coordenadaUsuario.value = null;
    } finally {
        isLoading.value = false;
    }
};

const abrirRotaNoOpenStreetMap = (hemocentro: HemocentroProximo) => {
    if (!coordenadaUsuario.value) {
        return;
    }

    const origem = `${coordenadaUsuario.value.latitude},${coordenadaUsuario.value.longitude}`;
    const destino = `${hemocentro.latitude},${hemocentro.longitude}`;
    const rotaUrl = `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${encodeURIComponent(`${origem};${destino}`)}`;

    window.open(rotaUrl, '_blank', 'noopener,noreferrer');
};

const selecionarHemocentro = (id: string) => {
    hemocentroSelecionadoId.value = id;
    focusSelectionToken.value += 1;
};

const irParaPaginaAnterior = () => {
    if (paginaAtual.value > 1) {
        hemocentroSelecionadoId.value = null;
        paginaAtual.value -= 1;
    }
};

const irParaProximaPagina = () => {
    if (paginaAtual.value < totalPaginas.value) {
        hemocentroSelecionadoId.value = null;
        paginaAtual.value += 1;
    }
};

watch(hemocentros, () => {
    paginaAtual.value = 1;
    hemocentroSelecionadoId.value = null;
});

watch(hemocentrosPaginados, () => {
    hemocentroSelecionadoId.value = null;
});

onMounted(() => {
    carregarPontosProximos();
});
</script>

<template>
    <div class="background">
        <NavbarLanding />
        <div class="view-hemocentros">
            <header class="title">
                <h1>Buscar Pontos de coleta</h1>
            </header>

            <p v-if="locationDenied" class="location-warning">{{ mensagemSemPermissao }}</p>

            <main>
                <section v-if="!locationDenied" class="hemocentros">
                    <HemocentroCard v-for="item in skeletonCards" v-show="isLoading" :key="`skeleton-${item}`"
                        is-loading />

                    <div v-for="hemocentro in hemocentrosPaginados" v-show="!isLoading" :key="hemocentro.id"
                        class="hemocentro-item" :class="{ selected: hemocentroSelecionadoId === hemocentro.id }"
                        @click="selecionarHemocentro(hemocentro.id)">
                        <HemocentroCard :hemocentro="hemocentro" :is-loading="isLoading"
                            :on-route-click="() => abrirRotaNoOpenStreetMap(hemocentro)" />
                    </div>

                    <div v-if="!isLoading && hemocentros.length" class="pagination-footer">
                        <div class="pagination-info">
                            <div class="total-by-page">
                                {{ hemocentrosPaginados.length }}
                            </div>
                            resultados por página
                        </div>

                        <div class="pagination-actions">
                            <IconButton class="btn" :icon="PhCaretLeft" secondary :disabled="paginaAtual === 1"
                                :click="irParaPaginaAnterior" />
                            <IconButton class="btn" :icon="PhCaretRight" secondary
                                :disabled="paginaAtual === totalPaginas" :click="irParaProximaPagina" />
                        </div>
                    </div>

                    <p v-if="!isLoading && !hemocentros.length && !errorMessage" class="empty-message">
                        Não encontramos pontos de coleta em um raio de 15 km da sua localização.
                    </p>

                    <p v-if="!isLoading && errorMessage" class="error-message">
                        {{ errorMessage }}
                    </p>
                </section>

                <HemocentroMapPanel v-if="!locationDenied" :is-loading="isLoading">
                    <HemocentroInteractiveMap v-if="coordenadaUsuario" :user-location="coordenadaUsuario"
                        :points="hemocentrosPaginados" :selected-point-id="hemocentroSelecionadoId"
                        :focus-selection-token="focusSelectionToken" @select-point="selecionarHemocentro" />
                    <div v-else class="map-empty">Não foi possível exibir o mapa no momento.</div>
                </HemocentroMapPanel>
            </main>
        </div>
    </div>
</template>

<style scoped>
.background {
    background-color: var(--background-color);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

.view-hemocentros {
    flex: 1;
    padding: 100px;
    display: flex;
    flex-direction: column;
}

.title {
    height: 15%;
    color: var(--secondary-color);
    margin-top: 50px;
    margin-bottom: 50px;
}

main {
    flex: 1;
    display: flex;
    flex-direction: row;
    gap: 35px;
}

.location-warning {
    color: var(--secondary-color);
    margin-bottom: 20px;
}

.hemocentros {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    gap: 20px;

    border: 1px solid;
    border-color: var(--input-border-color);
    border-radius: 16px;
    padding: 20px 20px 15px 20px;
    width: 100%;
}

.empty-message,
.error-message {
    color: var(--font-color);
    text-align: center;
}

.pagination-footer {
    margin-top: auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
}

.pagination-info {
    display: flex;
    align-items: center;
    justify-items: center;
    gap: 10px;
    font-size: 14px;
}

.pagination-actions {
    display: flex;
    gap: 10px;
}

.total-by-page {
    border: solid 1px;
    border-color: #E0E0E0;
    padding: 5px 10px;
    border-radius: 5px;
}

.pagination-page {
    color: var(--secondary-color);
}

.btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.hemocentro-item {
    border: 1px solid transparent;
    border-radius: 12px;
    cursor: pointer;
    transition: border-color 0.2s ease;
}

.hemocentro-item:hover {
    background-color: var(--button-secondary-hover);
    border-color: var(--input-border-color);
}

.hemocentro-item.selected {
    border-color: var(--primary-color);
}

.map-empty {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--font-color);
}
</style>