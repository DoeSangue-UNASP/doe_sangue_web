<script setup lang="ts">
import { h } from 'vue';
import Table from '../../components/Table.vue';
import { PhEye } from '@phosphor-icons/vue';
import CustomButton from '../../components/CustomButton.vue';
import Badge from '../../components/Badge.vue';
import { RouteNames } from '../../router/route-names';

const pageSize = 6;

const columns = [
    {
        header: "Tipo Sanguíneo",
        accessorKey: "tipo_sangue",
    },
    {
        header: "Código",
        accessorKey: "codigo",
    },
    {
        header: "Data de Coleta",
        accessorKey: "data_coleta",
    },
    {
        header: "Validade",
        accessorKey: "validade",
    },
    {
        header: "Volume",
        accessorKey: "volume",
    },
    {
        header: "Fator RH",
        accessorKey: "fator_rh",
    },
    {
        header: "Status",
        accessorKey: "status",
        cell: ({ row }: { row: { original: { status: string } } }) => {
            const status = row.original.status;

            const variantMap: Record<string, string> = {
                Descartado: "danger",
                Disponivel: "success",
                Vencido: "danger",
            };

            return h(Badge, { variant: variantMap[status] }, () => status);
        }
    },
    {
        header: "Ações",
        cell: () => {
            return h(CustomButton, { icon: PhEye, label: "Visualizar", secondary: true });
        }
    }
];


const data = [
    {
        tipo_sangue: "A+",
        codigo: "HEMO12345678",
        data_coleta: "22/11/2025 10:00",
        validade: "01/12/2025 10:00",
        volume: "405 ml",
        fator_rh: "Negativo",
        status: "Descartado"
    },
    {
        tipo_sangue: "A+",
        codigo: "HEMO12345678",
        data_coleta: "22/11/2025 10:00",
        validade: "01/12/2025 10:00",
        volume: "405 ml",
        fator_rh: "Negativo",
        status: "Vencido"
    },
    {
        tipo_sangue: "A+",
        codigo: "HEMO12345678",
        data_coleta: "22/11/2025 10:00",
        validade: "01/12/2025 10:00",
        volume: "405 ml",
        fator_rh: "Negativo",
        status: "Disponivel"
    },
];
</script>

<template>
    <header>
        <h1>Bolsas de Sangue</h1>
    </header>
    <main>
        <Table :data="data" :columns="columns" :pageSize="pageSize"
            :addRoute="RouteNames.CRIAR_BOLSA_SANGUE_HEMOCENTRO" />
    </main>
</template>

<style scoped></style>