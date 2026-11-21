<script setup lang="ts">
import { PhCalendarDots, PhEye } from '@phosphor-icons/vue';
import CustomButton from '../../components/CustomButton.vue';
import Table from '../../components/Table.vue';
import { computed, h, onMounted, ref } from 'vue';
import Badge from '../../components/Badge.vue';
import { useRouter } from 'vue-router';
import { RouteNames } from '../../router/route-names';
import { obterToken } from '../../services/auth';
import { ApiError } from '../../services/api';
import * as agendamentoService from '../../services/agendamento';
import { buscarMeuPerfil } from '../../services/doador';
import { useToast } from '../../composables/useToast';

type TableRowContext = { row: { original: agendamentoService.Agendamento } };

const router = useRouter();
const { erro } = useToast();

const pageSize = 6;

const nomeDoador = ref('');
const carregando = ref(true);
const proximoAgendamento = ref<agendamentoService.Agendamento | null>(null);
const ultimasDoacoes = ref<agendamentoService.Agendamento[]>([]);

const saudacao = computed(() => nomeDoador.value ? `Olá, ${nomeDoador.value}!` : 'Olá!');

const columns = [
    {
        header: "Local",
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
                label: "Visualizar",
                secondary: true,
                onClick: () => router.push({ name: RouteNames.DETALHES_DOACAO, params: { id: row.original.id } }),
            }),
    }
];

async function carregarDados() {
    const token = obterToken() ?? '';
    try {
        const [perfil, agendamentos] = await Promise.all([
            buscarMeuPerfil(token),
            agendamentoService.listarAgendamentosDoador(token),
        ]);
        nomeDoador.value = perfil.nome;
        proximoAgendamento.value = agendamentoService.buscarProximoAgendamento(agendamentos);
        ultimasDoacoes.value = agendamentoService.filtrarDoacoes(agendamentos);
    } catch (e) {
        erro(e instanceof ApiError || e instanceof Error ? e.message : 'Não foi possível carregar seus dados.');
    } finally {
        carregando.value = false;
    }
}

onMounted(carregarDados);
</script>

<template>
    <div class="view-container">
        <header class="home-header">
            <section class="welcome">
                <h1 class="poppins-bold">{{ saudacao }}</h1>
            </section>
            <section class="btn-hemocentro">
                <CustomButton label="Buscar Hemocentro"
                    @click="router.push({ name: RouteNames.BUSCAR_HEMOCENTROS_DOADOR })" />
            </section>
        </header>
        <main>
            <div class="next-donation">
                <div class="next-donation-title">
                    <PhCalendarDots size="25" />
                    <h2>Seu próximo agendamento</h2>
                </div>
                <template v-if="carregando">
                    <p class="empty">Carregando...</p>
                </template>
                <template v-else-if="proximoAgendamento">
                    <p class="next-dotaion-info"><span>Data: </span>{{ agendamentoService.formatarApenasData(proximoAgendamento.agendadoPara) }}</p>
                    <p class="next-dotaion-info"><span>Hora: </span>{{ agendamentoService.formatarApenasHora(proximoAgendamento.agendadoPara) }}</p>
                    <p class="next-dotaion-info"><span>Local: </span>{{ proximoAgendamento.hemocentro.nomeFantasia }}</p>
                </template>
                <p v-else class="empty">Nenhum agendamento</p>
            </div>
            <div class="last-donations">
                <div class="last-dontaion-title">
                    <h2>Últimas Doações</h2>
                </div>
                <p v-if="carregando" class="empty">Carregando...</p>
                <Table v-else-if="ultimasDoacoes.length > 0" :data="ultimasDoacoes" :columns="columns" :pageSize="pageSize" />
                <p v-else class="empty">Nenhuma doação realizada</p>
            </div>
        </main>
    </div>
</template>

<style scoped>
.view-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 50px;

    overflow-y: auto;
    height: 100%;
}

.home-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    gap: 50px;
}

.welcome {
    width: 100%;
}

.btn-hemocentro {
    display: flex;
    justify-content: flex-end;

    width: 100%;
}

.btn-hemocentro button {
    width: 200px;
}

main {
    display: flex;
    flex-direction: column;
    gap: 50px;
}

.next-donation {
    display: flex;
    flex-direction: column;
    gap: 10px;

    border: 1px solid;
    border-color: var(--input-border-color);
    border-radius: 16px;
    padding: 30px;
}

.next-donation-title {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 20px;
}

.last-donations {
    display: flex;
    flex-direction: column;

    border: 1px solid;
    border-color: var(--input-border-color);
    border-radius: 16px;
    padding: 16px;
}

.empty {
    color: #6b7280;
    margin: 0;
}
</style>