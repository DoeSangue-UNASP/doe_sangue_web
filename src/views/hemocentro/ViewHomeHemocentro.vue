<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { PhHandHeart } from '@phosphor-icons/vue';
import type { ApexOptions } from 'apexcharts';
import VueApexCharts from 'vue3-apexcharts';
import { useRouter } from 'vue-router';
import CustomButton from '../../components/CustomButton.vue';
import CustomInput from '../../components/CustomInput.vue';
import { RouteNames } from '../../router/route-names';
import { obterToken } from '../../services/auth';
import * as agendamentoService from '../../services/agendamento';
import { buscarMeuHemocentro } from '../../services/hemocentro';
import { listarBolsasHemocentro, tipoSanguineoCompleto, TIPOS_SANGUINEOS, type BolsaSangue } from '../../services/bolsa';
import { useToast } from '../../composables/useToast';

const router = useRouter();
const { erro } = useToast();

const carregando = ref(true);
const nomeHemocentro = ref('');
const doacoes = ref<agendamentoService.Agendamento[]>([]);
const bolsas = ref<BolsaSangue[]>([]);
const pesquisa = ref('');

const saudacao = computed(() => nomeHemocentro.value ? `Olá, ${nomeHemocentro.value}!` : 'Olá!');

const tipoPorAgendamento = computed(() => {
    const mapa = new Map<string, string>();
    bolsas.value.forEach((bolsa) => mapa.set(bolsa.agendamentoId, tipoSanguineoCompleto(bolsa)));
    return mapa;
});

const ultimasDoacoes = computed(() => {
    const termo = pesquisa.value.trim().toLowerCase();
    return doacoes.value
        .filter((doacao) => !termo || doacao.doador.nome.toLowerCase().includes(termo))
        .slice(0, 5)
        .map((doacao) => ({
            id: doacao.id,
            nome: doacao.doador.nome,
            data: agendamentoService.formatarDataBrasileira(doacao.agendadoPara),
            tipoSanguineo: tipoPorAgendamento.value.get(doacao.id) ?? '-',
        }));
});

// Apenas bolsas disponíveis compõem o estoque
const estoqueSangue = computed(() => {
    const disponiveis = bolsas.value.filter((bolsa) => bolsa.status === 'DISPONIVEL');
    return TIPOS_SANGUINEOS.map((tipo) => ({
        tipo,
        quantidade: disponiveis.filter((bolsa) => tipoSanguineoCompleto(bolsa) === tipo).length,
    }));
});

const totalEstoque = computed(() => estoqueSangue.value.reduce((acumulado, item) => acumulado + item.quantidade, 0));

const estoqueSeries = computed(() => [
    {
        name: 'Percentual do estoque',
        data: estoqueSangue.value.map((item) =>
            totalEstoque.value === 0 ? 0 : Number(((item.quantidade / totalEstoque.value) * 100).toFixed(2)))
    }
]);

async function carregarDados() {
    const token = obterToken() ?? '';
    const [hemocentro, agendamentos, listaBolsas] = await Promise.allSettled([
        buscarMeuHemocentro(token),
        agendamentoService.listarAgendamentosHemocentro({}, token),
        listarBolsasHemocentro(token),
    ]);

    if (hemocentro.status === 'fulfilled') nomeHemocentro.value = hemocentro.value.nomeFantasia;
    if (agendamentos.status === 'fulfilled') doacoes.value = agendamentoService.filtrarDoacoes(agendamentos.value);
    if (listaBolsas.status === 'fulfilled') bolsas.value = listaBolsas.value;

    const falha = [hemocentro, agendamentos, listaBolsas].find((resultado) => resultado.status === 'rejected');
    if (falha && falha.status === 'rejected') {
        erro((falha.reason as { message?: string })?.message || 'Não foi possível carregar o dashboard.');
    }
    carregando.value = false;
}

onMounted(carregarDados);

const estoqueChartOptions: ApexOptions = {
    chart: {
        fontFamily: 'Poppins, sans-serif',
        toolbar: {
            show: true
        }
    },
    colors: ['var(--primary-color)'],
    plotOptions: {
        bar: {
            borderRadius: 4,
            columnWidth: '50%'
        }
    },
    dataLabels: {
        enabled: false
    },
    legend: {
        fontSize: '14px'
    },
    xaxis: {
        categories: TIPOS_SANGUINEOS,
        labels: {
            style: {
                fontSize: '14px'
            }
        },
        title: {
            text: 'Tipo sanguíneo',
            style: {
                fontSize: '16px'
            }
        }
    },
    yaxis: {
        title: {
            text: 'Percentual do estoque total (%)',
            style: {
                fontSize: '16px'
            }
        },
        min: 0,
        max: 100,
        tickAmount: 10,
        labels: {
            style: {
                fontSize: '14px'
            },
            formatter: (valor) => `${valor.toFixed(0)}%`
        }
    },
    tooltip: {
        y: {
            formatter: (valor) => `${valor.toFixed(2)}%`
        }
    }
};
</script>

<template>
    <div class="view-container">
        <header>
            <h1>{{ saudacao }}</h1>
            <CustomButton label="Nova Doação" @click="router.push({ name: RouteNames.CRIAR_BOLSA_SANGUE_HEMOCENTRO })" />
        </header>
        <main>
            <section class="secao-ultimas-doacoes">
                <div class="header-ultimas-doacoes">
                    <h2>Últimas Doações</h2>
                    <CustomInput label="Pesquisar" id="pesquisar" v-model="pesquisa" placeholder="pesquisar" />
                </div>
                <div class="listagem-ultimas-doacoes">
                    <p v-if="carregando" class="empty">Carregando...</p>
                    <p v-else-if="doacoes.length === 0" class="empty">Nenhuma doação realizada</p>
                    <p v-else-if="ultimasDoacoes.length === 0" class="empty">Nenhuma doação encontrada</p>
                    <template v-else>
                        <div class="ultimas-doacoes" v-for="doacao in ultimasDoacoes" :key="doacao.id">
                            <div class="icon">
                                <PhHandHeart size="25" color="var(--primary-color)" />
                            </div>
                            <div class="nome-data">
                                <p>{{ doacao.nome }}</p>
                                <p>{{ doacao.data }}</p>
                            </div>
                            <div class="tipo-sangue">
                                <p>{{ doacao.tipoSanguineo }}</p>
                            </div>
                        </div>
                    </template>
                </div>
            </section>

            <section class="grafico">
                <h2>Banco de Sangue</h2>
                <p v-if="carregando" class="empty">Carregando...</p>
                <div v-else-if="totalEstoque > 0" class="grafico-container">
                    <VueApexCharts type="bar" height="100%" width="100%" :options="estoqueChartOptions"
                        :series="estoqueSeries" />
                </div>
                <p v-else class="empty">Nenhuma bolsa de sangue disponível</p>
            </section>
        </main>
    </div>
</template>

<style scoped>
.view-container {
    display: flex;
    flex-direction: column;
    gap: 50px;
    height: 100%;
}

header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

header button {
    width: 200px;
}

main section {
    border: 1px solid;
    border-color: var(--input-border-color);
    border-radius: 16px;
    height: 100%;
}

main section:nth-child(1) {
    width: 40%;
}

main section:nth-child(2) {
    width: 60%;
}

main {
    display: flex;
    flex-direction: row;
    gap: 20px;

    flex: 1;
    min-height: 0;
}

.secao-ultimas-doacoes {
    height: 100%;
    min-height: 0;
    padding: 30px;

    display: flex;
    flex-direction: column;

    gap: 20px;
}

.header-ultimas-doacoes {
    display: flex;
    flex-direction: column;

    gap: 20px;
}

.ultimas-doacoes {
    display: flex;
    flex-direction: row;

    align-items: center;
    justify-content: space-evenly;
    gap: 20px;

    width: 100%;

    border: 1px solid;
    border-color: var(--input-border-color);
    border-radius: 16px;

    padding: 20px;
}

.listagem-ultimas-doacoes {
    display: flex;
    flex-direction: column;
    gap: 20px;

    flex: 1;
    min-height: 0;
    overflow-y: auto;
}

.listagem-ultimas-doacoes > * {
    flex-shrink: 0;
}

.grafico {
    padding: 30px;
    min-height: 0;

    display: flex;
    flex-direction: column;
    gap: 20px;
}

.grafico-container {
    flex: 1;
    min-height: 0;
}

.empty {
    margin: 0;
    padding: 2rem;
    text-align: center;
    background: var(--color-background);
    border-radius: 8px;
    color: var(--color-text-secondary);
}
</style>