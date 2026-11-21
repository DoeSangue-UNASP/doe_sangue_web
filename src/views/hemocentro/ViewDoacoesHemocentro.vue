<script setup lang="ts">
import { onMounted, ref, h } from 'vue';
import { useRouter } from 'vue-router';
import Table from '../../components/Table.vue';
import { PhEye, PhPlus } from '@phosphor-icons/vue';
import CustomButton from '../../components/CustomButton.vue';
import CustomSelect from '../../components/CustomSelect.vue';
import Badge from '../../components/Badge.vue';
import CustomInput from '../../components/CustomInput.vue';
import { useAuth } from '../../composables/useAuth';
import * as doacaoService from '../../services/doacao';
import { ApiError } from '../../services/api';

const router = useRouter();
const { token } = useAuth();

const statusOptions = [
    { value: '', label: 'Todos os status' },
    { value: 'PENDENTE', label: 'Pendente' },
    { value: 'REALIZADA', label: 'Realizada' },
    { value: 'CANCELADA', label: 'Cancelada' },
];

const pageSize = 10;
const doacoes = ref<any[]>([]);
const carregando = ref(true);
const erro = ref('');
const filtros = ref({
    dataInicio: '',
    dataFim: '',
    documento: '',
    status: '',
});

const columns = [
    {
        header: "Documento",
        accessorKey: "doador",
        cell: ({ row }: { row: { original: doacaoService.Doacao } }) => {
            return row.original.doador.documento;
        }
    },
    {
        header: "Nome",
        accessorKey: "doador",
        cell: ({ row }: { row: { original: doacaoService.Doacao } }) => {
            return row.original.doador.nome;
        }
    },
    {
        header: "Data",
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
        const result = await doacaoService.listarDoacoesHemocentro(filtros.value, token.value);
        doacoes.value = result;
    } catch (e) {
        const error = e as ApiError;
        erro.value = error.message || 'Erro ao carregar doações';
    } finally {
        carregando.value = false;
    }
}

function buscar() {
    carregarDoacoes();
}

function limparFiltros() {
    filtros.value = {
        dataInicio: '',
        dataFim: '',
        documento: '',
        status: '',
    };
    carregarDoacoes();
}

function visualizarDetalhes(doacaoId: string) {
    router.push({
        name: 'detalhes-doacao-hemocentro',
        params: { id: doacaoId }
    });
}

function registrarNovaDoacao() {
    router.push({
        name: 'registrar-doacao'
    });
}

onMounted(() => {
    carregarDoacoes();
});
</script>

<template>
    <div class="container">
        <header>
            <h1>Doações</h1>
            <CustomButton 
                icon="PhPlus" 
                label="Registrar Doação" 
                @click="registrarNovaDoacao"
            />
        </header>

        <section class="filtros">
            <h2>Filtros</h2>
            <div class="filtros-grid">
                <CustomInput 
                    v-model="filtros.documento"
                    type="text"
                    label="Documento (CPF)"
                    placeholder="Digite o CPF do doador"
                />
                <CustomInput 
                    v-model="filtros.dataInicio"
                    type="date"
                    label="Data Início"
                />
                <CustomInput 
                    v-model="filtros.dataFim"
                    type="date"
                    label="Data Fim"
                />
                <CustomSelect 
                    id="status-filtro"
                    label="Status"
                    v-model="filtros.status"
                    :options="statusOptions"
                />
            </div>
            <div class="filtros-actions">
                <CustomButton 
                    label="Buscar" 
                    @click="buscar"
                />
                <CustomButton 
                    label="Limpar" 
                    secondary 
                    @click="limparFiltros"
                />
            </div>
        </section>

        <main class="content">
            <div v-if="carregando" class="loading">
                <p>Carregando doações...</p>
            </div>
            <div v-else-if="erro" class="error">
                <p>{{ erro }}</p>
            </div>
            <div v-else-if="doacoes.length === 0" class="empty">
                <p>Nenhuma doação encontrada.</p>
            </div>
            <Table v-else :data="doacoes" :columns="columns" :pageSize="pageSize" />
        </main>
    </div>
</template>

<style scoped>
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
}

header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    gap: 1rem;
}

header h1 {
    margin: 0;
    flex: 1;
}

.filtros {
    background: var(--color-background);
    border-radius: 8px;
    padding: 1.5rem;
    margin-bottom: 2rem;
}

.filtros h2 {
    margin-top: 0;
    margin-bottom: 1rem;
    font-size: 1rem;
    color: var(--color-primary);
}

.filtros-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 1rem;
}

.filtros-actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
}

.content {
    background: var(--color-background);
    border-radius: 8px;
    padding: 1.5rem;
}

.loading, .error, .empty {
    text-align: center;
    padding: 2rem;
    color: var(--color-text-secondary);
}

.error {
    color: var(--color-danger);
}

@media (max-width: 768px) {
    header {
        flex-direction: column;
        align-items: flex-start;
    }

    .filtros-grid {
        grid-template-columns: 1fr;
    }

    .filtros-actions {
        flex-direction: column;
    }
}
</style>
