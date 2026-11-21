<script setup lang="ts">
import { computed, h, onMounted, ref, watch } from 'vue'
import Badge from '../../components/Badge.vue'
import Table from '../../components/Table.vue'
import { PhEye, PhX, PhClockClockwise } from '@phosphor-icons/vue'
import CustomButton from '../../components/CustomButton.vue'
import CustomDialog from '../../components/CustomDialog.vue';
import CustomDatePicker from '../../components/CustomDatePicker.vue';
import CustomDropdown from '../../components/CustomDropdown.vue';
import CustomSelect from '../../components/CustomSelect.vue';
import { useRouter } from 'vue-router';
import { RouteNames } from '../../router/route-names';
import { obterToken } from '../../services/auth';
import * as agendamentoService from '../../services/agendamento';
import { buscarMeuPerfil } from '../../services/doador';
import { gerarHorarios, listarHemocentros, type Hemocentro } from '../../services/hemocentro';
import { useToast } from '../../composables/useToast';

type TableRowContext = {
    row: {
        original: agendamentoService.Agendamento
    }
}

const router = useRouter();
const { sucesso, erro } = useToast();

const mensagemErro = (e: unknown, padrao: string) => (e as { message?: string }).message || padrao;
const dataDeHoje = () => agendamentoService.formatarDataParaInput(new Date()).split('T')[0] as string;

const agendamentos = ref<agendamentoService.Agendamento[]>([]);
const hemocentros = ref<Hemocentro[]>([]);
const doadorId = ref('');
const carregando = ref(true);
const erroCarregamento = ref('');
const tabelaKey = ref(0);
const salvando = ref(false);

const openCriarAgendamento = ref<boolean>(false);
const openCancelarAgendamento = ref<boolean>(false);
const agendamentoParaCancelar = ref<string | null>(null);
const agendamentoParaReagendar = ref<string | null>(null);
const isDatePickerOpen = ref(false)
const isTimeDropdownOpen = ref(false)
const hemocentroSelecionadoId = ref('');
const dataSelecionada = ref(dataDeHoje());
const selectedTime = ref('')

const hemocentrosOptions = computed(() => [
    { value: '', label: 'Selecione um hemocentro' },
    ...hemocentros.value.map(h => ({ value: h.id, label: h.nomeFantasia })),
]);

const timeOptions = computed(() => {
    const hemocentro = hemocentros.value.find(h => h.id === hemocentroSelecionadoId.value);
    return hemocentro ? gerarHorarios(hemocentro.abreEm, hemocentro.fechaEm) : [];
});

watch(hemocentroSelecionadoId, () => {
    selectedTime.value = '';
});

const abrirCriarAgendamento = (hemocentroId = '', agendamentoId: string | null = null) => {
    agendamentoParaReagendar.value = agendamentoId;
    hemocentroSelecionadoId.value = hemocentroId;
    dataSelecionada.value = dataDeHoje();
    selectedTime.value = '';
    openCriarAgendamento.value = true;
};

const abrirCancelarAgendamento = (agendamentoId: string) => {
    agendamentoParaCancelar.value = agendamentoId;
    openCancelarAgendamento.value = true;
}

const fecharCancelarAgendamento = () => {
    openCancelarAgendamento.value = false;
    agendamentoParaCancelar.value = null;
}


const handleDatePickerOpenChange = (value: boolean) => {
    isDatePickerOpen.value = value

    if (value) {
        isTimeDropdownOpen.value = false
    }
}

const handleTimeDropdownOpenChange = (value: boolean) => {
    isTimeDropdownOpen.value = value

    if (value) {
        isDatePickerOpen.value = false
    }
}

const pageSize = 6;

const columns = [
    {
        id: "hemocentro",
        header: "Local",
        accessorFn: (agendamento: agendamentoService.Agendamento) => agendamento.hemocentro.nomeFantasia,
    },
    {
        header: "Marcado Para",
        accessorKey: "agendadoPara",
        enableGlobalFilter: false,
        cell: ({ row }: TableRowContext) => agendamentoService.formatarDataBrasileira(row.original.agendadoPara),
    },
    {
        header: "Status",
        accessorKey: "status",
        enableGlobalFilter: false,
        cell: ({ row }: TableRowContext) => {
            const status = row.original.status;

            const variantMap: Record<agendamentoService.StatusAgendamento, 'warning' | 'success' | 'danger'> = {
                AGENDADO: "warning",
                CONCLUIDO: "success",
                CANCELADO: "danger",
            };

            return h(Badge, { variant: variantMap[status] }, () => agendamentoService.formatarStatusAgendamento(status));
        }
    },
    {
        header: "Ações",
        cell: ({ row }: TableRowContext) => {
            const { status, id, hemocentro } = row.original;

            if (status === "AGENDADO") {
                return h(CustomButton, {
                    icon: PhX,
                    label: "Cancelar",
                    secondary: true,
                    onClick: () => abrirCancelarAgendamento(id),
                });
            }
            if (status === "CONCLUIDO") {
                return h(CustomButton, {
                    icon: PhEye,
                    label: "Visualizar Doação",
                    secondary: true,
                    onClick: () => router.push({ name: RouteNames.DETALHES_DOACAO, params: { id } }),
                });
            }
            return h(CustomButton, {
                icon: PhClockClockwise,
                label: "Reagendar",
                secondary: true,
                onClick: () => abrirCriarAgendamento(hemocentro.id, id),
            });
        }
    }
];

async function carregarAgendamentos() {
    agendamentos.value = await agendamentoService.listarAgendamentosOrdenadosDoador(obterToken() ?? '');
    tabelaKey.value++;
}

async function carregarDados() {
    try {
        await carregarAgendamentos();
    } catch (e) {
        erroCarregamento.value = mensagemErro(e, 'Erro ao carregar agendamentos');
    } finally {
        carregando.value = false;
    }

    try {
        const [perfil, listaHemocentros] = await Promise.all([
            buscarMeuPerfil(obterToken() ?? ''),
            listarHemocentros(),
        ]);
        doadorId.value = perfil.id;
        hemocentros.value = listaHemocentros;
    } catch (e) {
        erro(mensagemErro(e, 'Não foi possível carregar os hemocentros.'));
    }
}

async function confirmarCancelamento() {
    if (!agendamentoParaCancelar.value) return;

    salvando.value = true;
    try {
        await agendamentoService.cancelarAgendamento(agendamentoParaCancelar.value, obterToken() ?? '');
        sucesso('Agendamento cancelado com sucesso!');
        fecharCancelarAgendamento();
        await carregarAgendamentos();
    } catch (e) {
        erro(mensagemErro(e, 'Não foi possível cancelar o agendamento.'));
    } finally {
        salvando.value = false;
    }
}

async function salvarAgendamento() {
    if (!hemocentroSelecionadoId.value) {
        erro('Selecione um hemocentro.');
        return;
    }
    if (!selectedTime.value) {
        erro('Selecione um horário.');
        return;
    }

    const agendadoPara = `${dataSelecionada.value}T${selectedTime.value}:00`;
    if (!agendamentoService.validarDataFutura(agendadoPara)) {
        erro('Selecione uma data e um horário futuros.');
        return;
    }
    if (!doadorId.value && !agendamentoParaReagendar.value) {
        erro('Não foi possível identificar o doador.');
        return;
    }

    salvando.value = true;
    try {
        if (agendamentoParaReagendar.value) {
            await agendamentoService.reagendarAgendamento(agendamentoParaReagendar.value, agendadoPara, obterToken() ?? '');
            sucesso('Agendamento reagendado com sucesso!');
        } else {
            await agendamentoService.criarAgendamentoDoador(
                { doadorId: doadorId.value, hemocentroId: hemocentroSelecionadoId.value, agendadoPara },
                obterToken() ?? ''
            );
            sucesso('Agendamento criado com sucesso!');
        }
        openCriarAgendamento.value = false;
        await carregarAgendamentos();
    } catch (e) {
        erro(mensagemErro(e, 'Não foi possível salvar o agendamento.'));
    } finally {
        salvando.value = false;
    }
}

onMounted(carregarDados);
</script>


<template>
    <header class="title">
        <h1>Agendamentos</h1>
    </header>
    <p v-if="carregando" class="empty">Carregando agendamentos...</p>
    <p v-else-if="erroCarregamento" class="empty erro">{{ erroCarregamento }}</p>
    <template v-else>
        <Table v-if="agendamentos.length > 0" :key="tabelaKey" :data="agendamentos" :columns="columns"
            :pageSize="pageSize" @add="abrirCriarAgendamento()" />
        <div v-else class="empty-state">
            <p>Nenhum agendamento</p>
            <CustomButton label="Agendar" @click="abrirCriarAgendamento()" />
        </div>
    </template>
    <CustomDialog v-model="openCriarAgendamento" width="760px">
        <template #header>
            {{ agendamentoParaReagendar ? 'Reagendar Agendamento' : 'Criar Agendamento' }}
        </template>
        <template #default>
            <div class="modal-content-search-row">
                <CustomSelect class="modal-content-input" id="hemocentro-agendamento" label="Hemocentro"
                    v-model="hemocentroSelecionadoId" :options="hemocentrosOptions"
                    :disabled="!!agendamentoParaReagendar" />
                <CustomButton v-if="!agendamentoParaReagendar" class="modal-content-btn" secondary red-font-color
                    label="Procurar no mapa" @click="router.push({ name: RouteNames.BUSCAR_HEMOCENTROS_DOADOR })" />
            </div>

            <div class="modal-content-schedule">
                <h3 class="modal-content-schedule-title">Selecione um horário</h3>

                <div class="modal-content-schedule-fields">
                    <CustomDatePicker class="modal-content-datepicker" title="Dia" id="data-agendamento"
                        v-model="dataSelecionada" v-model:model-open="isDatePickerOpen"
                        @update:model-open="handleDatePickerOpenChange" />

                    <CustomDropdown class="modal-content-time-select" title="Horário" label="Selecione"
                        :options="timeOptions" v-model="selectedTime" v-model:model-open="isTimeDropdownOpen"
                        @update:model-open="handleTimeDropdownOpenChange" />
                </div>
            </div>
        </template>
        <template #footer>
            <div class="modal-footer">
                <CustomButton class="modal-content-btn" :label="salvando ? 'Salvando...' : 'Salvar'"
                    :disabled="salvando" @click="salvarAgendamento" />
            </div>
        </template>
    </CustomDialog>

    <CustomDialog v-model="openCancelarAgendamento">
        <template #header>Confirmação de Cancelamento</template>
        <template #default>
            <p>Tem certeza que deseja cancelar o agendamento?</p>
        </template>
        <template #footer>
            <div class="modal-footer">
                <CustomButton class="modal-content-btn" label="Voltar" secondary
                    @click="fecharCancelarAgendamento" />
                <CustomButton class="modal-content-btn" :label="salvando ? 'Cancelando...' : 'Confirmar'"
                    :disabled="salvando" @click="confirmarCancelamento" />
            </div>
        </template>
    </CustomDialog>
</template>

<style scoped>
.empty {
    padding: 2rem;
    text-align: center;
    background: var(--color-background);
    border-radius: 8px;
    margin-top: 1rem;
    color: var(--color-text-secondary);
}

.empty.erro {
    color: var(--color-danger);
}

.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    margin-top: 1rem;
}

.empty-state p {
    width: 100%;
    margin: 0;
    padding: 2rem;
    text-align: center;
    background: var(--color-background);
    border-radius: 8px;
    color: var(--color-text-secondary);
}

.empty-state button {
    width: 170px;
}

.modal-content-input {
    width: 350px;
}

.modal-content-search-row {
    width: 100%;
    display: flex;
    align-items: flex-end;
    gap: 12px;
}

.modal-content-btn {
    width: 150px;
}

.modal-content-schedule {
    margin-top: 40px;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.modal-content-schedule-title {
    font-size: large;
    color: var(--font-color);
}

.modal-content-schedule-fields {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    gap: 24px;
}

.modal-content-datepicker {
    width: 250px;
}

.modal-content-time-select {
    width: 250px;
}

.modal-footer {
    margin-left: auto;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 20px;
}
</style>