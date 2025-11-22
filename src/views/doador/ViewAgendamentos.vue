<script setup>
import { ref } from 'vue'
import Badge from '../../components/Badge.vue'
import Table from '../../components/Table.vue'
import { PhEye, PhX, PhClockClockwise } from '@phosphor-icons/vue'
import { h } from "vue";
import CustomButton from '../../components/CustomButton.vue'

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
        cell: ({ row }) => {
            const status = row.original.status;

            const variantMap = {
                Agendado: "warning",
                Concluido: "success",
                Cancelado: "danger",
            };

            return h(Badge, { variant: variantMap[status] }, () => status);
        }
    },
    {
        header: "Ações",
        cell: ({ row }) => {
            const status = row.original.status;

            if (status === "Agendado") {
                return h(CustomButton, { icon: PhX, label: "Cancelar", secondary: true });
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
    <header class="title">
        <h1>Agendamentos</h1>
    </header>
    <Table :data="data" :columns="columns" :pageSize="pageSize" />
</template>