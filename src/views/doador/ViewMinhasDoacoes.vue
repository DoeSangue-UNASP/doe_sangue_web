<script setup lang="ts">
import { onMounted, ref, h } from 'vue';
import { useRouter } from 'vue-router';
import Table from '../../components/Table.vue';
import { PhEye } from '@phosphor-icons/vue';
import CustomButton from '../../components/CustomButton.vue';
import Badge from '../../components/Badge.vue';
import { useAuth } from '../../composables/useAuth';
import * as doacaoService from '../../services/doacao';
import { ApiError } from '../../services/api';

const router = useRouter();
const { token } = useAuth();

const pageSize = 6;
const doacoes = ref<any[]>([]);
const carregando = ref(true);
const erro = ref('');

const columns = [
    {
        header: "Hemocentro",
        accessorKey: "hemocentro",
        cell: ({ row }: { row: { original: doacaoService.Doacao } }) => {
            return row.original.hemocentro.nomeFantasia;
        }
    },
    {
        header: "Data da Doação",
        accessorKey: "dataDoacao",
        cell: ({ row }: { row: { original: doacaoService.Doacao } }) => {
            return doacaoService.formatarDataBrasileira(row.original.dataDoacao);
        }
    },
    {
        header: "Volume (ml)",
        accessorKey: "volume",
    },
    {
        header: "Bolsas",
        accessorKey: "bolsas",
        cell: ({ row }: { row: { original: doacaoService.Doacao } }) => {
            return row.original.bolsas?.length || 0;
        }
    },
    {
        header: "Status",
        accessorKey: "status",
        cell: ({ row }: { row: { original: doacaoService.Doacao } }) => {
            const status = doacaoService.formatarStatus(row.original.status);
            const variantMap: Record<string, string> = {
                'Pendente': 'warning',
                'Concluída': 'success',
                'Cancelada': 'danger',
            };

            return h(Badge, { variant: variantMap[status] || 'default' }, () => status);
        }
    },
    {
        header: "Ações",
        cell: ({ row }: { row: { original: doacaoService.Doacao } }) => {
            return h(CustomButton, {
                icon: PhEye,
                label: "Detalhes",
                secondary: true,
                onClick: () => visualizarDetalhes(row.original.id)
            });
        }
    }
];

async function carregarDoacoes() {
    try {
        carregando.value = true;
        erro.value = '';
        const result = await doacaoService.listarMinhasDoacoes(token.value);
        doacoes.value = result;
    } catch (e) {
        const error = e as ApiError;
        erro.value = error.message || 'Erro ao carregar doações';
    } finally {
        carregando.value = false;
    }
}

function visualizarDetalhes(doacaoId: string) {
    router.push({
        name: 'detalhes-doacao',
        params: { id: doacaoId }
    });
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
            <p>Você ainda não realizou nenhuma doação.</p>
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