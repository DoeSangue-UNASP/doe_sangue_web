<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import CustomButton from '../../components/CustomButton.vue';
import Badge from '../../components/Badge.vue';
import { obterToken } from '../../services/auth';
import * as agendamentoService from '../../services/agendamento';
import { PhArrowLeft } from '@phosphor-icons/vue';

const router = useRouter();
const route = useRoute();

const doacao = ref<agendamentoService.Agendamento | null>(null);
const carregando = ref(true);
const erro = ref('');

async function carregarDoacao() {
    try {
        carregando.value = true;
        erro.value = '';
        const doacaoId = route.params.id as string;
        const agendamentos = await agendamentoService.listarAgendamentosDoador(obterToken() ?? '');
        doacao.value = agendamentoService.filtrarDoacoes(agendamentos).find(a => a.id === doacaoId) ?? null;
    } catch (e) {
        erro.value = (e as { message?: string }).message || 'Erro ao carregar doação';
    } finally {
        carregando.value = false;
    }
}

function voltar() {
    router.back();
}

onMounted(() => {
    carregarDoacao();
});
</script>

<template>
    <div class="container">
        <header class="header">
            <CustomButton 
                :icon="PhArrowLeft" 
                label="Voltar" 
                secondary 
                @click="voltar"
            />
            <h1>Detalhes da Doação</h1>
        </header>

        <main v-if="carregando" class="loading">
            <p>Carregando doação...</p>
        </main>

        <main v-else-if="erro" class="error">
            <p>{{ erro }}</p>
        </main>

        <main v-else-if="doacao" class="content">
            <section class="info-section">
                <h2>Informações Gerais</h2>
                <div class="info-grid">
                    <div class="info-item">
                        <label>Hemocentro:</label>
                        <p>{{ doacao.hemocentro.nomeFantasia }}</p>
                    </div>
                    <div class="info-item">
                        <label>Data da Doação:</label>
                        <p>{{ agendamentoService.formatarDataBrasileira(doacao.agendadoPara) }}</p>
                    </div>
                    <div class="info-item">
                        <label>Status:</label>
                        <Badge variant="success">
                            {{ agendamentoService.formatarStatusAgendamento(doacao.status) }}
                        </Badge>
                    </div>
                </div>
            </section>
        </main>

        <main v-else class="empty">
            <p>Nenhuma doação encontrada</p>
        </main>
    </div>
</template>

<style scoped>
.container {
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem;
}

.header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 2rem;
}

.header h1 {
    margin: 0;
    flex: 1;
}

.loading, .error, .empty {
    padding: 2rem;
    text-align: center;
    background: var(--color-background);
    border-radius: 8px;
    color: var(--color-text-secondary);
}

.error {
    color: var(--color-danger);
}

.content {
    display: flex;
    flex-direction: column;
    gap: 2rem;
}

.info-section,
.bolsas-section {
    background: var(--color-background);
    border-radius: 8px;
    padding: 1.5rem;
}

.info-section h2,
.bolsas-section h2 {
    margin-top: 0;
    margin-bottom: 1rem;
    color: var(--color-primary);
}

.info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
}

.info-item {
    display: flex;
    flex-direction: column;
}

.info-item label {
    font-weight: 600;
    color: var(--color-text-secondary);
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
}

.info-item p {
    margin: 0;
    color: var(--color-text);
    font-size: 1rem;
}

.bolsas-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1rem;
}

.bolsa-card {
    background: white;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    padding: 1rem;
}

.bolsa-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--color-border);
}

.bolsa-header h3 {
    margin: 0;
    color: var(--color-primary);
}

.bolsa-info {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
}

.bolsa-item {
    display: flex;
    flex-direction: column;
}

.bolsa-item label {
    font-weight: 600;
    color: var(--color-text-secondary);
    margin-bottom: 0.25rem;
    font-size: 0.75rem;
    text-transform: uppercase;
}

.bolsa-item p {
    margin: 0;
    color: var(--color-text);
    font-size: 0.875rem;
}

@media (max-width: 768px) {
    .info-grid {
        grid-template-columns: 1fr;
    }

    .bolsas-list {
        grid-template-columns: 1fr;
    }

    .bolsa-info {
        grid-template-columns: 1fr;
    }
}
</style>
