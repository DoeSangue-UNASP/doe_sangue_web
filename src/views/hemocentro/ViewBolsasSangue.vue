<script setup lang="ts">
import { h, onMounted, ref } from 'vue';
import Table from '../../components/Table.vue';
import { PhEye } from '@phosphor-icons/vue';
import CustomButton from '../../components/CustomButton.vue';
import Badge from '../../components/Badge.vue';
import { RouteNames } from '../../router/route-names';
import { useRouter } from 'vue-router';
import { obterToken } from '../../services/auth';
import { formatarDataNascimento } from '../../services/doador';
import { formatarStatusBolsa, listarBolsasHemocentro, tipoSanguineoCompleto, type BolsaSangue, type StatusBolsa } from '../../services/bolsa';

type TableRowContext = { row: { original: BolsaSangue } };

const router = useRouter();

const pageSize = 6;

const bolsas = ref<BolsaSangue[]>([]);
const carregando = ref(true);
const erroCarregamento = ref('');

const variantePorStatus: Record<StatusBolsa, 'success' | 'warning' | 'danger'> = {
    DISPONIVEL: 'success',
    EM_ANALISE: 'warning',
    VENCIDA: 'danger',
    DESCARTADA: 'danger',
};

const columns = [
    {
        id: "tipoSanguineo",
        header: "Tipo Sanguíneo",
        accessorFn: (bolsa: BolsaSangue) => tipoSanguineoCompleto(bolsa),
    },
    {
        header: "Código",
        accessorKey: "codigo",
    },
    {
        header: "Data de Coleta",
        accessorKey: "dataColeta",
        enableGlobalFilter: false,
        cell: ({ row }: TableRowContext) =>
            row.original.dataColeta ? formatarDataNascimento(row.original.dataColeta) : '-',
    },
    {
        header: "Validade",
        accessorKey: "dataValidade",
        enableGlobalFilter: false,
        cell: ({ row }: TableRowContext) =>
            row.original.dataValidade ? formatarDataNascimento(row.original.dataValidade) : '-',
    },
    {
        header: "Volume",
        accessorKey: "volume",
        enableGlobalFilter: false,
        cell: ({ row }: TableRowContext) => `${row.original.volume} ml`,
    },
    {
        header: "Fator RH",
        accessorKey: "fatorRh",
    },
    {
        header: "Status",
        accessorKey: "status",
        enableGlobalFilter: false,
        cell: ({ row }: TableRowContext) =>
            h(Badge, { variant: variantePorStatus[row.original.status] }, () => formatarStatusBolsa(row.original.status)),
    },
    {
        header: "Ações",
        cell: () => {
            return h(CustomButton, { icon: PhEye, label: "Visualizar", secondary: true });
        }
    }
];

async function carregarBolsas() {
    try {
        const lista = await listarBolsasHemocentro(obterToken() ?? '');
        bolsas.value = [...lista].sort((a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime());
    } catch (e) {
        erroCarregamento.value = (e as { message?: string }).message || 'Erro ao carregar bolsas de sangue';
    } finally {
        carregando.value = false;
    }
}

onMounted(carregarBolsas);
</script>

<template>
    <header>
        <h1>Bolsas de Sangue</h1>
    </header>
    <main>
        <p v-if="carregando" class="empty">Carregando bolsas de sangue...</p>
        <p v-else-if="erroCarregamento" class="empty erro">{{ erroCarregamento }}</p>
        <Table v-else-if="bolsas.length > 0" :data="bolsas" :columns="columns" :pageSize="pageSize"
            :addRoute="RouteNames.CRIAR_BOLSA_SANGUE_HEMOCENTRO" />
        <div v-else class="empty-state">
            <p>Nenhuma bolsa de sangue cadastrada</p>
            <CustomButton label="Cadastrar Bolsa"
                @click="router.push({ name: RouteNames.CRIAR_BOLSA_SANGUE_HEMOCENTRO })" />
        </div>
    </main>
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
    width: 200px;
}
</style>