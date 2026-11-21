<script setup lang="ts">
import { onMounted, ref, h } from 'vue';
import { useRouter } from 'vue-router';
import Table from '../../components/Table.vue';
import { PhEye } from '@phosphor-icons/vue';
import CustomButton from '../../components/CustomButton.vue';
import Badge from '../../components/Badge.vue';
import { obterToken } from '../../services/auth';
import * as agendamentoService from '../../services/agendamento';
import { RouteNames } from '../../router/route-names';

type TableRowContext = { row: { original: agendamentoService.Agendamento } };

const router = useRouter();

const pageSize = 6;
const doacoes = ref<agendamentoService.Agendamento[]>([]);
const carregando = ref(true);
const erro = ref('');

const columns = [
    {
        header: "Hemocentro",
        accessorKey: "hemocentro",
        cell: ({ row }: TableRowContext) => row.original.hemocentro.nomeFantasia,
    },
    {
        header: "Data da Doação",
        accessorKey: "agendadoPara",
        cell: ({ row }: TableRowContext) => agendamentoService.formatarDataBrasileira(row.original.agendadoPara),
    },
    {
        header: "Status",
        accessorKey: "status",
        cell: ({ row }: TableRowContext) =>
            h(Badge, { variant: 'success' }, () => agendamentoService.formatarStatusAgendamento(row.original.status)),
    },
    {
        header: "Ações",
        cell: ({ row }: TableRowContext) =>
            h(CustomButton, {
                icon: PhEye,
                label: "Detalhes",
                secondary: true,
                onClick: () => router.push({ name: RouteNames.DETALHES_DOACAO, params: { id: row.original.id } }),
            }),
    }
];

async function carregarDoacoes() {
    try {
        carregando.value = true;
        erro.value = '';
        const agendamentos = await agendamentoService.listarAgendamentosDoador(obterToken() ?? '');
        doacoes.value = agendamentoService.filtrarDoacoes(agendamentos);
    } catch (e) {
        erro.value = (e as { message?: string }).message || 'Erro ao carregar doações';
    } finally {
        carregando.value = false;
    }
}

onMounted(() => {
    carregarDoacoes();
});
</script>

<template>
    <header>
        <h1>Minhas Doações</h1>
    </header>
    <main>
        <div v-if="carregando" class="loading">
            <p>Carregando doações...</p>
        </div>
        <div v-else-if="erro" class="error">
            <p>{{ erro }}</p>
        </div>
        <div v-else-if="doacoes.length === 0" class="empty">
            <p>Nenhuma doação realizada</p>
        </div>
        <Table v-else :data="doacoes" :columns="columns" :pageSize="pageSize" />
    </main>
</template>

<style scoped>
.loading, .error, .empty {
    padding: 2rem;
    text-align: center;
    background: var(--color-background);
    border-radius: 8px;
    margin-top: 1rem;
}

.error {
    color: var(--color-danger);
}

.empty {
    color: var(--color-text-secondary);
}
</style>