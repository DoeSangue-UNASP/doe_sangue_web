<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import CustomButton from '../../components/CustomButton.vue';
import CustomInput from '../../components/CustomInput.vue';
import Badge from '../../components/Badge.vue';
import { useAuth } from '../../composables/useAuth';
import * as doacaoService from '../../services/doacao';
import { ApiError } from '../../services/api';

const router = useRouter();
const route = useRoute();
const { token } = useAuth();

const doacao = ref<doacaoService.Doacao | null>(null);
const carregando = ref(true);
const erro = ref('');
const salvando = ref(false);
const edicao = ref(false);
const novaStatus = ref<doacaoService.StatusDoacao>('PENDENTE');

async function carregarDoacao() {
    try {
        carregando.value = true;
        erro.value = '';
        const doacaoId = route.params.id as string;
        doacao.value = await doacaoService.buscarDoacaoPorId(doacaoId, token.value);
        novaStatus.value = doacao.value!.status;
    } catch (e) {
        const error = e as ApiError;
        erro.value = error.message || 'Erro ao carregar doação';
    } finally {
        carregando.value = false;
    }
}

async function salvarAlteracoes() {
    if (!doacao.value) return;

    try {
        salvando.value = true;
        erro.value = '';
        await doacaoService.atualizarDoacao(
            doacao.value.id,
            { status: novaStatus.value },
            token.value
        );
        doacao.value.status = novaStatus.value;
        edicao.value = false;
    } catch (e) {
        const error = e as ApiError;
        erro.value = error.message || 'Erro ao salvar alterações';
    } finally {
        salvando.value = false;
    }
}

async function cancelarDoacao() {
    if (!doacao.value) return;

    if (!confirm('Tem certeza que deseja cancelar esta doação?')) return;

    try {
        salvando.value = true;
        erro.value = '';
        await doacaoService.cancelarDoacao(doacao.value.id, token.value);
        doacao.value.status = 'CANCELADA';
        edicao.value = false;
    } catch (e) {
        const error = e as ApiError;
        erro.value = error.message || 'Erro ao cancelar doação';
    } finally {
        salvando.value = false;
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
                label="Voltar" 
                secondary 
                @click="voltar"
            />
            <h1>Detalhes da Doação</h1>
        </header>

        <main v-if="carregando" class="loading">
            <p>Carregando doação...</p>
        </main>

        <main v-else-if="erro && !doacao" class="error">
            <p>{{ erro }}</p>
        </main>

        <main v-else-if="doacao" class="content">
            <div v-if="erro" class="error-message">
                {{ erro }}
            </div>

            <section class="info-section">
                <h2>Informações do Doador</h2>
                <div class="info-grid">
                    <div class="info-item">
                        <label>Nome:</label>
                        <p>{{ doacao.doador.nome }}</p>
                    </div>
                    <div class="info-item">
                        <label>CPF:</label>
                        <p>{{ doacao.doador.documento }}</p>
                    </div>
                </div>
            </section>

            <section class="info-section">
                <div class="section-header">
                    <h2>Informações da Doação</h2>
                    <div class="actions">
                        <CustomButton 
                            v-if="!edicao && doacao.status !== 'CANCELADA'"
                            label="Editar" 
                            @click="edicao = true"
                        />
                    </div>
                </div>

                <div class="info-grid">
                    <div class="info-item">
                        <label>Data da Doação:</label>
                        <p>{{ doacaoService.formatarDataBrasileira(doacao.dataDoacao) }}</p>
                    </div>
                    <div class="info-item">
                        <label>Volume Doado:</label>
                        <p>{{ doacao.volume }}ml</p>
                    </div>
                    <div class="info-item">
                        <label>Status:</label>
                        <div v-if="!edicao">
                            <Badge :variant="doacao.status === 'CONCLUIDA' ? 'success' : doacao.status === 'PENDENTE' ? 'warning' : 'danger'">
                                {{ doacaoService.formatarStatus(doacao.status) }}
                            </Badge>
                        </div>
                        <div v-else class="select-wrapper">
                            <select v-model="novaStatus">
                                <option value="PENDENTE">Pendente</option>
                                <option value="CONCLUIDA">Concluída</option>
                                <option value="CANCELADA">Cancelada</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div v-if="edicao" class="edit-actions">
                    <CustomButton 
                        label="Salvar" 
                        :disabled="salvando"
                        @click="salvarAlteracoes"
                    />
                    <CustomButton 
                        label="Cancelar Doação" 
                        variant="danger"
                        :disabled="salvando"
                        @click="cancelarDoacao"
                    />
                    <CustomButton 
                        label="Descartar" 
                        secondary 
                        :disabled="salvando"
                        @click="edicao = false"
                    />
                </div>
            </section>

            <section class="bolsas-section" v-if="doacao.bolsas && doacao.bolsas.length > 0">
                <h2>Bolsas de Sangue Geradas ({{ doacao.bolsas.length }})</h2>
                <div class="bolsas-list">
                    <div v-for="bolsa in doacao.bolsas" :key="bolsa.id" class="bolsa-card">
                        <div class="bolsa-header">
                            <h3>{{ bolsa.codigo }}</h3>
                            <Badge :variant="bolsa.status === 'DISPONIVEL' ? 'success' : bolsa.status === 'UTILIZADA' ? 'info' : 'danger'">
                                {{ doacaoService.formatarStatusBolsa(bolsa.status) }}
                            </Badge>
                        </div>
                        <div class="bolsa-info">
                            <div class="bolsa-item">
                                <label>Tipo Sanguíneo:</label>
                                <p>{{ bolsa.tipoSanguineo }}</p>
                            </div>
                            <div class="bolsa-item">
                                <label>Volume:</label>
                                <p>{{ bolsa.volume }}ml</p>
                            </div>
                            <div class="bolsa-item">
                                <label>Data de Coleta:</label>
                                <p>{{ doacaoService.formatarDataBrasileira(bolsa.dataColeta) }}</p>
                            </div>
                            <div class="bolsa-item">
                                <label>Validade:</label>
                                <p>{{ doacaoService.formatarDataBrasileira(bolsa.dataValidade) }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section v-else class="empty">
                <p>Nenhuma bolsa de sangue foi gerada para esta doação.</p>
            </section>
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

.error-message {
    padding: 1rem;
    background: rgba(220, 38, 38, 0.1);
    color: var(--color-danger);
    border-radius: 4px;
    margin-bottom: 1rem;
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

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
}

.section-header h2 {
    margin: 0;
    color: var(--color-primary);
}

.actions {
    display: flex;
    gap: 0.5rem;
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

.select-wrapper {
    display: flex;
    flex-direction: column;
}

.select-wrapper select {
    padding: 0.5rem;
    border: 1px solid var(--color-border);
    border-radius: 4px;
    background: white;
    color: var(--color-text);
    font-size: 0.875rem;
}

.edit-actions {
    display: flex;
    gap: 1rem;
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid var(--color-border);
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

    .edit-actions {
        flex-direction: column;
    }
}
</style>
