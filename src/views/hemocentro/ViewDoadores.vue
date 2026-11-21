<script setup lang="ts">
import { h, onMounted, ref } from 'vue';
import { PhEye } from '@phosphor-icons/vue';
import CustomButton from '../../components/CustomButton.vue';
import Badge from '../../components/Badge.vue';
import Table from '../../components/Table.vue';
import { useRouter } from 'vue-router';
import { RouteNames } from '../../router/route-names';
import { obterToken } from '../../services/auth';
import * as agendamentoService from '../../services/agendamento';
import { buscarDoadores, formatarDataNascimento, formatarSexo, type Doador } from '../../services/doador';

type DoadorLinha = Doador & { qtdDoacoes: number };
type TableRowContext = { row: { original: DoadorLinha } };

const router = useRouter();

const pageSize = 6;

const doadores = ref<DoadorLinha[]>([]);
const carregando = ref(true);
const erroCarregamento = ref('');

const apenasDigitos = (valor: string) => valor.replace(/\D/g, '');

const columns = [
    {
        header: "Doador",
        accessorKey: "nome",
    },
    {
        header: "CPF",
        accessorKey: "documento",
    },
    {
        header: "Data de Nascimento",
        accessorKey: "dataNascimento",
        enableGlobalFilter: false,
        cell: ({ row }: TableRowContext) => formatarDataNascimento(row.original.dataNascimento),
    },
    {
        header: "Sexo",
        accessorKey: "sexo",
        enableGlobalFilter: false,
        cell: ({ row }: TableRowContext) => formatarSexo(row.original.sexo),
    },
    {
        header: "Tipo Sanguíneo",
        accessorKey: "tipoSanguineo",
        cell: ({ row }: TableRowContext) => row.original.tipoSanguineo ?? '-',
    },
    {
        header: "Número de doações",
        accessorKey: "qtdDoacoes",
        enableGlobalFilter: false,
    },
    {
        header: "Cadastro",
        accessorKey: "ehLead",
        enableGlobalFilter: false,
        cell: ({ row }: TableRowContext) => row.original.ehLead
            ? h(Badge, { variant: 'warning' }, () => 'Lead')
            : h(Badge, { variant: 'success' }, () => 'Usuário'),
    },
    {
        header: "Ações",
        cell: ({ row }: TableRowContext) => h(CustomButton, {
            icon: PhEye,
            label: "Visualizar Doador",
            secondary: true,
            onClick: () => router.push({ name: RouteNames.DOADORES_HEMOCENTRO_EDITAR, params: { id: row.original.id } }),
        }),
    },
];

async function carregarDoadores() {
    const token = obterToken() ?? '';
    try {
        const [lista, agendamentos] = await Promise.all([
            buscarDoadores(token),
            agendamentoService.listarAgendamentosHemocentro({}, token).catch(() => []),
        ]);

        // A contagem usa o CPF, pois um lead convertido em usuário pode ter mais de um registro
        const concluidos = agendamentoService.filtrarDoacoes(agendamentos);
        doadores.value = lista.map((doador) => ({
            ...doador,
            qtdDoacoes: concluidos.filter(
                (agendamento) => apenasDigitos(agendamento.doador.documento) === apenasDigitos(doador.documento)
            ).length,
        }));
    } catch (e) {
        erroCarregamento.value = (e as { message?: string }).message || 'Erro ao carregar doadores';
    } finally {
        carregando.value = false;
    }
}

onMounted(carregarDoadores);
</script>

<template>
    <header>
        <h1>Doadores</h1>
    </header>
    <main>
        <p v-if="carregando" class="empty">Carregando doadores...</p>
        <p v-else-if="erroCarregamento" class="empty erro">{{ erroCarregamento }}</p>
        <Table v-else-if="doadores.length > 0" :data="doadores" :columns="columns" :pageSize="pageSize"
            :addRoute="RouteNames.DOADORES_HEMOCENTRO_NOVO" />
        <div v-else class="empty-state">
            <p>Nenhum doador cadastrado</p>
            <CustomButton label="Cadastrar Doador"
                @click="router.push({ name: RouteNames.DOADORES_HEMOCENTRO_NOVO })" />
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