<script setup lang="ts">
import { h } from 'vue';
import Table from '../../components/Table.vue';
import { PhEye } from '@phosphor-icons/vue';
import CustomButton from '../../components/CustomButton.vue';
import Badge from '../../components/Badge.vue';


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
        cell: ({ row }: { row: { original: { status: string } } }) => {
            const status = row.original.status;

            const variantMap: Record<string, string> = {
                Agendado: "warning",
                Concluido: "success",
                Cancelado: "danger",
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
    <header>
        <h1>Minhas Doações</h1>
    </header>
    <main>
        <Table :data="data" :columns="columns" :pageSize="pageSize" />
    </main>
</template>

<style scoped></style>