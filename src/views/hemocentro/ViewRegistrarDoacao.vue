<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import CustomButton from '../../components/CustomButton.vue';
import CustomInput from '../../components/CustomInput.vue';
import CustomSelect from '../../components/CustomSelect.vue';
import Badge from '../../components/Badge.vue';
import { useAuth } from '../../composables/useAuth';
import { useToast } from '../../composables/useToast';
import * as agendamentoService from '../../services/agendamento';
import * as doacaoService from '../../services/doacao';
import { ApiError } from '../../services/api';

const router = useRouter();
const { token } = useAuth();
const { sucesso, erro } = useToast();

const tiposSanguineoOptions = [
    { value: 'O+', label: 'O+' },
    { value: 'O-', label: 'O-' },
    { value: 'A+', label: 'A+' },
    { value: 'A-', label: 'A-' },
    { value: 'B+', label: 'B+' },
    { value: 'B-', label: 'B-' },
    { value: 'AB+', label: 'AB+' },
    { value: 'AB-', label: 'AB-' },
];

const carregando = ref(false);
const salvando = ref(false);
const erroFormulario = ref('');
const sucessoFormulario = ref('');
const etapa = ref<'busca' | 'confirmacao' | 'bolsas'>('busca');

const documento = ref('');
const agendamentos = ref<agendamentoService.Agendamento[]>([]);
const agendamentoSelecionado = ref<agendamentoService.Agendamento | null>(null);

const dataDoacao = ref('');
const volumeDoacao = ref('');
const bolsas = ref<Array<{
    tipoSanguineo: string;
    volume: string;
    dataValidade: string;
}>>([]);
const novaDoacao = ref<doacaoService.Doacao | null>(null);

async function buscarAgendamentos() {
    if (!documento.value) {
        const mensagem = 'Digite o CPF do doador';
        erroFormulario.value = mensagem;
        erro(mensagem);
        return;
    }

    try {
        carregando.value = true;
        erroFormulario.value = '';

        // Buscar agendamentos do doador
        const result = await agendamentoService.listarAgendamentosHemocentro(
            { documento: documento.value },
            token.value
        );

        agendamentos.value = result.filter(a => a.status === 'AGENDADO');

        if (agendamentos.value.length === 0) {
            const mensagem = 'Nenhum agendamento encontrado para este doador.';
            erroFormulario.value = mensagem;
            erro(mensagem);
            return;
        }

        etapa.value = 'confirmacao';
    } catch (e) {
        const error = e as ApiError;
        const mensagem = error.message || 'Erro ao buscar agendamentos';
        erroFormulario.value = mensagem;
        erro(mensagem);
    } finally {
        carregando.value = false;
    }
}

function selecionarAgendamento(agendamento: agendamentoService.Agendamento) {
    agendamentoSelecionado.value = agendamento;
    dataDoacao.value = new Date().toISOString().split('T')[0];
    etapa.value = 'bolsas';
}

function adicionarBolsa() {
    bolsas.value.push({
        tipoSanguineo: 'O+',
        volume: '450',
        dataValidade: '',
    });
}

function removerBolsa(index: number) {
    bolsas.value.splice(index, 1);
}

async function salvarDoacao() {
    if (!agendamentoSelecionado.value) return;

    if (!dataDoacao.value) {
        const mensagem = 'Selecione a data da doação';
        erroFormulario.value = mensagem;
        erro(mensagem);
        return;
    }

    if (!volumeDoacao.value) {
        const mensagem = 'Digite o volume doado';
        erroFormulario.value = mensagem;
        erro(mensagem);
        return;
    }

    if (bolsas.value.length === 0) {
        const mensagem = 'Adicione pelo menos uma bolsa de sangue';
        erroFormulario.value = mensagem;
        erro(mensagem);
        return;
    }

    for (let bolsa of bolsas.value) {
        if (!bolsa.tipoSanguineo || !bolsa.volume || !bolsa.dataValidade) {
            const mensagem = 'Preencha todos os campos das bolsas de sangue';
            erroFormulario.value = mensagem;
            erro(mensagem);
            return;
        }
    }

    try {
        salvando.value = true;
        erroFormulario.value = '';

        // Criar doação
        const doacaoCriada = await doacaoService.criarDoacao(
            {
                agendamentoId: agendamentoSelecionado.value.id,
                volume: parseInt(volumeDoacao.value),
                dataDoacao: `${dataDoacao.value}T12:00:00`,
            },
            token.value
        );

        // Criar bolsas de sangue
        for (let bolsa of bolsas.value) {
            await doacaoService.criarBolsaSangue(
                {
                    doacaoId: doacaoCriada.id,
                    tipoSanguineo: bolsa.tipoSanguineo,
                    volume: parseInt(bolsa.volume),
                    dataValidade: `${bolsa.dataValidade}T23:59:59`,
                },
                token.value
            );
        }

        novaDoacao.value = doacaoCriada;
        const mensagem = 'Doação registrada com sucesso!';
        sucessoFormulario.value = mensagem;
        sucesso(mensagem);

        setTimeout(() => {
            router.push({
                name: 'detalhes-doacao-hemocentro',
                params: { id: doacaoCriada.id }
            });
        }, 2000);
    } catch (e) {
        const error = e as ApiError;
        const mensagem = error.message || 'Erro ao registrar doação';
        erroFormulario.value = mensagem;
        erro(mensagem);
    } finally {
        salvando.value = false;
    }
}

function voltarEtapa() {
    if (etapa.value === 'confirmacao') {
        etapa.value = 'busca';
        agendamentos.value = [];
        agendamentoSelecionado.value = null;
    } else if (etapa.value === 'bolsas') {
        etapa.value = 'confirmacao';
    }
}

function voltar() {
    router.back();
}

onMounted(() => {
    // Inicializar com uma bolsa vazia
    adicionarBolsa();
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
            <h1>Registrar Doação</h1>
        </header>

        <main class="content">
            <div v-if="sucessoFormulario" class="success">
                <p>✓ {{ sucessoFormulario }}</p>
                <p style="font-size: 0.875rem; margin-top: 0.5rem;">Redirecionando...</p>
            </div>

            <div v-if="erroFormulario" class="error">
                <p>✗ {{ erroFormulario }}</p>
            </div>

            <!-- ETAPA 1: BUSCAR DOADOR -->
            <section v-if="etapa === 'busca'" class="step">
                <div class="step-header">
                    <h2>Etapa 1: Buscar Doador</h2>
                    <span class="step-counter">1 de 3</span>
                </div>

                <div class="form-group">
                    <CustomInput 
                        v-model="documento"
                        type="text"
                        label="CPF do Doador"
                        placeholder="Digite o CPF (sem pontos ou traços)"
                        @keyup.enter="buscarAgendamentos"
                    />
                </div>

                <div class="actions">
                    <CustomButton 
                        label="Buscar Agendamentos" 
                        :disabled="carregando || !documento"
                        @click="buscarAgendamentos"
                    />
                </div>
            </section>

            <!-- ETAPA 2: CONFIRMAR AGENDAMENTO -->
            <section v-if="etapa === 'confirmacao'" class="step">
                <div class="step-header">
                    <h2>Etapa 2: Selecionar Agendamento</h2>
                    <span class="step-counter">2 de 3</span>
                </div>

                <div v-if="carregando" class="loading">
                    <p>Carregando agendamentos...</p>
                </div>

                <div v-else-if="agendamentos.length === 0" class="empty">
                    <p>Nenhum agendamento encontrado.</p>
                </div>

                <div v-else class="agendamentos-list">
                    <div
                        v-for="agendamento in agendamentos"
                        :key="agendamento.id"
                        class="agendamento-card"
                        :class="{ selected: agendamentoSelecionado?.id === agendamento.id }"
                        @click="selecionarAgendamento(agendamento)"
                    >
                        <div class="card-header">
                            <h3>{{ agendamento.doador.nome }}</h3>
                            <Badge variant="info">
                                {{ agendamentoService.formatarDataBrasileira(agendamento.agendadoPara) }}
                            </Badge>
                        </div>
                        <div class="card-info">
                            <p><strong>CPF:</strong> {{ agendamento.doador.documento }}</p>
                            <p><strong>Telefone:</strong> {{ agendamento.doador.telefone }}</p>
                            <p><strong>Hemocentro:</strong> {{ agendamento.hemocentro.nomeFantasia }}</p>
                        </div>
                    </div>
                </div>

                <div class="actions">
                    <CustomButton 
                        label="Voltar" 
                        secondary 
                        @click="voltarEtapa"
                    />
                </div>
            </section>

            <!-- ETAPA 3: REGISTRAR DOAÇÃO E BOLSAS -->
            <section v-if="etapa === 'bolsas'" class="step">
                <div class="step-header">
                    <h2>Etapa 3: Registrar Doação e Bolsas</h2>
                    <span class="step-counter">3 de 3</span>
                </div>

                <div class="doador-info">
                    <p><strong>Doador:</strong> {{ agendamentoSelecionado?.doador.nome }}</p>
                    <p><strong>CPF:</strong> {{ agendamentoSelecionado?.doador.documento }}</p>
                </div>

                <div class="form-group">
                    <CustomInput 
                        v-model="dataDoacao"
                        type="date"
                        label="Data da Doação"
                    />
                </div>

                <div class="form-group">
                    <CustomInput 
                        v-model="volumeDoacao"
                        type="number"
                        label="Volume Total (ml)"
                        placeholder="Ex: 450"
                    />
                </div>

                <div class="bolsas-section">
                    <div class="section-header">
                        <h3>Bolsas de Sangue</h3>
                        <CustomButton 
                            label="Adicionar Bolsa" 
                            secondary
                            @click="adicionarBolsa"
                        />
                    </div>

                    <div class="bolsas-list">
                        <div v-for="(bolsa, index) in bolsas" :key="index" class="bolsa-form">
                            <div class="bolsa-header">
                                <h4>Bolsa {{ index + 1 }}</h4>
                                <button 
                                    v-if="bolsas.length > 1"
                                    class="btn-remove"
                                    @click="removerBolsa(index)"
                                    type="button"
                                >
                                    ✕
                                </button>
                            </div>

                            <div class="bolsa-fields">
                                <div class="field">
                                    <CustomSelect 
                                        :id="`tipo-sangue-${index}`"
                                        label="Tipo Sanguíneo"
                                        v-model="bolsa.tipoSanguineo"
                                        :options="tiposSanguineoOptions"
                                    />
                                </div>
                                <div class="field">
                                    <label>Volume (ml)</label>
                                    <input v-model="bolsa.volume" type="number" placeholder="450" />
                                </div>
                                <div class="field">
                                    <label>Data de Validade</label>
                                    <input v-model="bolsa.dataValidade" type="date" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="actions">
                    <CustomButton 
                        label="Salvar Doação" 
                        :disabled="salvando"
                        @click="salvarDoacao"
                    />
                    <CustomButton 
                        label="Voltar" 
                        secondary 
                        :disabled="salvando"
                        @click="voltarEtapa"
                    />
                </div>
            </section>
        </main>
    </div>
</template>

<style scoped>
.container {
    max-width: 800px;
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

.content {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.success {
    padding: 1rem;
    background: rgba(34, 197, 94, 0.1);
    color: #22c55e;
    border-radius: 4px;
    border-left: 4px solid #22c55e;
}

.error {
    padding: 1rem;
    background: rgba(220, 38, 38, 0.1);
    color: var(--color-danger);
    border-radius: 4px;
    border-left: 4px solid var(--color-danger);
}

.step {
    background: var(--color-background);
    border-radius: 8px;
    padding: 1.5rem;
}

.step-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid var(--color-border);
}

.step-header h2 {
    margin: 0;
    color: var(--color-primary);
}

.step-counter {
    background: var(--color-primary);
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 600;
}

.form-group {
    margin-bottom: 1rem;
}

.loading, .empty {
    padding: 2rem;
    text-align: center;
    color: var(--color-text-secondary);
}

.agendamentos-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 1rem;
}

.agendamento-card {
    padding: 1rem;
    border: 2px solid var(--color-border);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
}

.agendamento-card:hover {
    border-color: var(--color-primary);
    background: rgba(var(--color-primary-rgb), 0.05);
}

.agendamento-card.selected {
    border-color: var(--color-primary);
    background: rgba(var(--color-primary-rgb), 0.1);
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
    gap: 1rem;
}

.card-header h3 {
    margin: 0;
    color: var(--color-primary);
}

.card-info {
    font-size: 0.875rem;
    color: var(--color-text-secondary);
}

.card-info p {
    margin: 0.25rem 0;
}

.doador-info {
    padding: 1rem;
    background: rgba(var(--color-primary-rgb), 0.05);
    border-radius: 4px;
    margin-bottom: 1.5rem;
    font-size: 0.875rem;
}

.doador-info p {
    margin: 0.5rem 0;
}

.bolsas-section {
    margin: 1.5rem 0;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.section-header h3 {
    margin: 0;
    color: var(--color-primary);
}

.bolsas-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 1rem;
}

.bolsa-form {
    padding: 1rem;
    border: 1px solid var(--color-border);
    border-radius: 4px;
    background: white;
}

.bolsa-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.bolsa-header h4 {
    margin: 0;
    color: var(--color-text);
}

.btn-remove {
    padding: 0.25rem 0.5rem;
    background: var(--color-danger);
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 600;
}

.btn-remove:hover {
    opacity: 0.8;
}

.bolsa-fields {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
}

.field {
    display: flex;
    flex-direction: column;
}

.field label {
    font-weight: 600;
    color: var(--color-text-secondary);
    margin-bottom: 0.5rem;
    font-size: 0.75rem;
    text-transform: uppercase;
}

.field select,
.field input {
    padding: 0.5rem;
    border: 1px solid var(--color-border);
    border-radius: 4px;
    background: white;
    color: var(--color-text);
    font-size: 0.875rem;
}

.actions {
    display: flex;
    gap: 1rem;
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid var(--color-border);
}

@media (max-width: 768px) {
    .agendamento-card {
        padding: 0.75rem;
    }

    .bolsa-fields {
        grid-template-columns: 1fr;
    }

    .actions {
        flex-direction: column;
    }
}
</style>
