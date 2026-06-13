<script setup lang="ts">
import { h } from 'vue';
import { PhEye } from '@phosphor-icons/vue';
import CustomButton from '../../components/CustomButton.vue';
import Badge from '../../components/Badge.vue';
import Table from '../../components/Table.vue';
import { useRouter } from 'vue-router';
import { RouteNames } from '../../router/route-names';


const router = useRouter();

const pageSize = 6;

const columns = [
    {
        header: "Doador",
        accessorKey: "doador",
    },
    {
        header: "Data de Nascimento",
        accessorKey: "data_nascimento",
    },
    {
        header: "Sexo",
        accessorKey: "sexo",
    },
    {
        header: "Tipo Sanguíneo",
        accessorKey: "tipo_sanguineo",
    },
    {
        header: "Número de doações",
        accessorKey: "qtd_doacoes",
    },
    {
        header: "Status de Elegibilidade",
        accessorKey: "status",
        cell: ({ row }: { row: { original: { status: string } } }) => {
            const status = row.original.status;

            const variantMap: Record<string, string> = {
                Aguardando: "warning",
                Apto: "success",
                Inapto: "danger",
            };

            return h(Badge, { variant: variantMap[status] }, () => status);
        }
    },
    {
        header: "Ações",
        cell: () => h(CustomButton, { icon: PhEye, label: "Visualizar Doador", secondary: true, 'onClick': () => router.push(`/hemocentro/doadores/1`) }),
    },
];


const data = [
    {
        id: 1,
        doador: "Maria Souza",
        data_nascimento: "01/01/1990",
        sexo: 'F',
        tipo_sanguineo: "-O",
        qtd_doacoes: 10,
        status: "Apto",
    },
    {
        id: 1,
        doador: "João Silva",
        data_nascimento: "01/01/1990",
        sexo: 'F',
        tipo_sanguineo: "-O",
        qtd_doacoes: 10,
        status: "Inapto",
    },
    {
        id: 1,
        doador: "José Miguel",
        data_nascimento: "01/01/1990",
        sexo: 'F',
        tipo_sanguineo: "-O",
        qtd_doacoes: 10,
        status: "Aguardando",
    },
    {
        id: 1,
        doador: "Severina Josefa",
        data_nascimento: "01/01/1990",
        sexo: 'F',
        tipo_sanguineo: "-O",
        qtd_doacoes: 10,
        status: "Apto",
    },
    {
        id: 1,
        doador: "Fátima Cristiane",
        data_nascimento: "01/01/1990",
        sexo: 'F',
        tipo_sanguineo: "-O",
        qtd_doacoes: 10,
        status: "Apto",
    },
];
</script>

<template>
    <header>
        <h1>Doadores</h1>
    </header>
    <main>
        <Table :data="data" :columns="columns" :pageSize="pageSize" :addRoute="RouteNames.DOADORES_HEMOCENTRO_NOVO" />
    </main>
</template>

<style scoped></style>