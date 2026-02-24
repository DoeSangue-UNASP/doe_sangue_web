<script setup lang="ts">
import { ref } from 'vue'
import Badge from '../../components/Badge.vue'
import Table from '../../components/Table.vue'
import { PhEye, PhX, PhClockClockwise, PhMagnifyingGlass } from '@phosphor-icons/vue'
import { h } from "vue";
import CustomButton from '../../components/CustomButton.vue'
import CustomDialog from '../../components/CustomDialog.vue';
import CustomDatePicker from '../../components/CustomDatePicker.vue';
import IconButton from '../../components/IconButton.vue';
import CustomDropdown from '../../components/CustomDropdown.vue';
import CustomInput from '../../components/CustomInput.vue';
import { router } from '../../router';
import { RouteNames } from '../../router/route-names';

type AgendamentoStatus = 'Agendado' | 'Concluido' | 'Cancelado'

type Agendamento = {
    local: string
    data: string
    status: AgendamentoStatus
}

type TableRowContext = {
    row: {
        original: Agendamento
    }
}


const openCriarAgendamento = ref<boolean>(false);
const openCancelarAgendamento = ref<boolean>(false);
const isDatePickerOpen = ref(false)
const isTimeDropdownOpen = ref(false)
const selectedTime = ref('')

const timeOptions = [
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00'
]


const openModalCriarAgendamento = () => {
    openCriarAgendamento.value = true;
};

const toggleModalCancelarAgendamento = () => {
    openCancelarAgendamento.value = !openCancelarAgendamento.value;
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
        header: "Local",
        accessorKey: "local",
    },
    {
        header: "Marcado Para",
        accessorKey: "data",
    },
    {
        header: "Status",
        accessorKey: "status",
        cell: ({ row }: TableRowContext) => {
            const status = row.original.status;

            const variantMap: Record<AgendamentoStatus, 'warning' | 'success' | 'danger'> = {
                Agendado: "warning",
                Concluido: "success",
                Cancelado: "danger",
            };

            return h(Badge, { variant: variantMap[status] }, () => status);
        }
    },
    {
        header: "Ações",
        cell: ({ row }: TableRowContext) => {
            const status = row.original.status;

            if (status === "Agendado") {
                return h(CustomButton, {
                    icon: PhX,
                    label: "Cancelar",
                    secondary: true,
                    onClick: toggleModalCancelarAgendamento,
                });
            }
            if (status === "Concluido") {
                return h(CustomButton, { icon: PhEye, label: "Visualizar Doação", secondary: true });
            }
            if (status === "Cancelado") {
                return h(CustomButton, { icon: PhClockClockwise, label: "Reagendar", secondary: true });
            }
        }
    }
];


const data: Agendamento[] = [
    {
        local: "Hemocentro A",
        data: "22/11/2025 10:00",
        status: "Agendado",
    },
    {
        local: "Hemocentro B",
        data: "10/10/2025 14:00",
        status: "Concluido",
    },
    {
        local: "Hemocentro C",
        data: "05/08/2025 08:00",
        status: "Cancelado",
    },
];
</script>


<template>
    <header class="title">
        <h1>Agendamentos</h1>
    </header>
    <Table :data="data" :columns="columns" :pageSize="pageSize" @add="openModalCriarAgendamento" />
    <CustomDialog v-model="openCriarAgendamento" width="760px">
        <template #header>
            Criar Agendamento
        </template>
        <template #default>
            <div class="modal-content-search-row">
                <CustomInput class="modal-content-input" label="Pesquisar Hemocentro" id="pesquisar-hemocentro"
                    placeholder="Pesquisar hemocentro" />
                <IconButton :icon="PhMagnifyingGlass" />
                <CustomButton class="modal-content-btn" secondary red-font-color label="Procurar no mapa"
                    @click="router.push(RouteNames.BUSCAR_HEMOCENTROS_DOADOR)" />
            </div>

            <div class="modal-content-schedule">
                <h3 class="modal-content-schedule-title">Selecione um horário</h3>

                <div class="modal-content-schedule-fields">
                    <CustomDatePicker class="modal-content-datepicker" title="Dia" id="data-agendamento"
                        v-model:model-open="isDatePickerOpen" @update:model-open="handleDatePickerOpenChange" />

                    <CustomDropdown class="modal-content-time-select" title="Horário" label="Selecione"
                        :options="timeOptions" v-model="selectedTime" v-model:model-open="isTimeDropdownOpen"
                        @update:model-open="handleTimeDropdownOpenChange" />
                </div>
            </div>
        </template>
        <template #footer>
            <div class="modal-footer">
                <CustomButton class="modal-content-btn" label="Salvar" />
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
                <CustomButton class="modal-content-btn" label="Cancelar" secondary />
                <CustomButton class="modal-content-btn" label="Confirmar" />
            </div>
        </template>
    </CustomDialog>
</template>

<style scoped>
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