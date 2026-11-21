<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import Badge from '../../components/Badge.vue';
import CustomInput from '../../components/CustomInput.vue';
import { obterToken } from '../../services/auth';
import * as agendamentoService from '../../services/agendamento';
import { formatarDataNascimento } from '../../services/doador';
import {
    formatarStatusBolsa,
    listarMinhasBolsas,
    tipoSanguineoCompleto,
    type BolsaSangue,
    type StatusBolsa,
} from '../../services/bolsa';

const route = useRoute();

const doacao = ref<agendamentoService.Agendamento | null>(null);
const bolsa = ref<BolsaSangue | null>(null);
const carregando = ref(true);
const erro = ref('');
const erroBolsa = ref('');

const variantePorStatus: Record<StatusBolsa, 'success' | 'warning' | 'danger'> = {
    DISPONIVEL: 'success',
    EM_ANALISE: 'warning',
    VENCIDA: 'danger',
    DESCARTADA: 'danger',
};

const data = (valor: string | null | undefined) => valor ? formatarDataNascimento(valor) : '-';
const texto = (valor: string | null | undefined) => valor?.trim() ? valor : '-';

const tipoSanguineo = computed(() => bolsa.value ? tipoSanguineoCompleto(bolsa.value) : '');

async function carregarDoacao() {
    try {
        carregando.value = true;
        erro.value = '';
        erroBolsa.value = '';
        const doacaoId = route.params.id as string;
        const token = obterToken() ?? '';
        const [agendamentos, bolsas] = await Promise.allSettled([
            agendamentoService.listarAgendamentosDoador(token),
            listarMinhasBolsas(token),
        ]);

        if (agendamentos.status === 'rejected') throw agendamentos.reason;
        doacao.value = agendamentoService.filtrarDoacoes(agendamentos.value).find(a => a.id === doacaoId) ?? null;

        if (bolsas.status === 'fulfilled') {
            bolsa.value = bolsas.value.find(b => b.agendamentoId === doacaoId) ?? null;
        } else {
            erroBolsa.value = (bolsas.reason as { message?: string })?.message || 'Não foi possível carregar a bolsa de sangue.';
        }
    } catch (e) {
        erro.value = (e as { message?: string }).message || 'Erro ao carregar doação';
    } finally {
        carregando.value = false;
    }
}

onMounted(() => {
    carregarDoacao();
});
</script>

<template>
    <header>
        <h1>Detalhes da Doação</h1>
    </header>

    <p v-if="carregando" class="empty">Carregando doação...</p>
    <p v-else-if="erro" class="empty erro">{{ erro }}</p>

    <main v-else-if="doacao" class="content">
        <section class="card">
            <h2>Informações Gerais</h2>
            <div class="campos campos-3">
                <CustomInput id="hemocentro" label="Hemocentro" :model-value="doacao.hemocentro.nomeFantasia" disabled />
                <CustomInput id="data-doacao" label="Data da Doação"
                    :model-value="agendamentoService.formatarDataBrasileira(doacao.agendadoPara)" disabled />
                <div class="status-campo">
                    <span class="status-label">Status</span>
                    <Badge variant="success">{{ agendamentoService.formatarStatusAgendamento(doacao.status) }}</Badge>
                </div>
            </div>
        </section>

        <section class="card">
            <div class="card-header">
                <h2>Bolsa de Sangue</h2>
                <Badge v-if="bolsa" :variant="variantePorStatus[bolsa.status]">{{ formatarStatusBolsa(bolsa.status) }}</Badge>
            </div>

            <div v-if="bolsa" class="campos campos-4">
                <CustomInput id="codigo" label="Código" :model-value="bolsa.codigo" disabled />
                <CustomInput id="tipo-sanguineo" label="Tipo Sanguíneo" :model-value="tipoSanguineo" disabled />
                <CustomInput id="fator-rh" label="Fator RH" :model-value="texto(bolsa.fatorRh)" disabled />
                <CustomInput id="volume" label="Volume" :model-value="`${bolsa.volume} ml`" disabled />
                <CustomInput id="componente" label="Tipo de Componente" :model-value="texto(bolsa.tipoComponente)" disabled />
                <CustomInput id="sorologico" label="Resultado Sorológico" :model-value="texto(bolsa.testeSorologico)" disabled />
                <CustomInput id="data-coleta" label="Data de Coleta" :model-value="data(bolsa.dataColeta)" disabled />
                <CustomInput id="data-validade" label="Validade" :model-value="data(bolsa.dataValidade)" disabled />
                <CustomInput id="local-coleta" label="Local de Coleta" :model-value="texto(bolsa.localColeta)" disabled />
                <CustomInput id="destino" label="Destino / Hospital" :model-value="texto(bolsa.destino)" disabled />
                <CustomInput id="responsavel" label="Responsável pela Coleta" :model-value="texto(bolsa.responsavelColeta)" disabled />
            </div>
            <p v-else-if="erroBolsa" class="sem-bolsa erro">{{ erroBolsa }}</p>
            <p v-else class="sem-bolsa">Nenhuma bolsa de sangue registrada para esta doação</p>
        </section>
    </main>

    <p v-else class="empty">Nenhuma doação encontrada</p>
</template>

<style scoped>
.empty {
    margin-top: 1rem;
    padding: 2rem;
    text-align: center;
    background: var(--color-background);
    border-radius: 8px;
    color: var(--color-text-secondary);
}

.empty.erro {
    color: var(--color-danger);
}

.content {
    display: flex;
    flex-direction: column;
    gap: 24px;
    margin-top: 32px;
}

.card {
    border: 1px solid var(--input-border-color);
    border-radius: 16px;
    padding: 30px;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.card h2 {
    margin: 0;
}

.card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
}

.campos {
    display: grid;
    gap: 20px;
}

.campos-3 {
    grid-template-columns: repeat(3, 1fr);
}

.campos-4 {
    grid-template-columns: repeat(4, 1fr);
}

.status-campo {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
}

.sem-bolsa {
    margin: 0;
    padding: 1.5rem;
    text-align: center;
    background: var(--color-background);
    border-radius: 8px;
    color: var(--color-text-secondary);
}

.sem-bolsa.erro {
    color: var(--color-danger);
}

@media (max-width: 1100px) {
    .campos-4 {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 700px) {
    .campos-3,
    .campos-4 {
        grid-template-columns: 1fr;
    }
}
</style>
