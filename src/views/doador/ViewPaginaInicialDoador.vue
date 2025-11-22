<script setup lang="ts">
import { PhCalendarDots, PhEye } from '@phosphor-icons/vue';
import CustomButton from '../../components/CustomButton.vue';
import Table from '../../components/Table.vue';
import { h } from 'vue';
import Badge from '../../components/Badge.vue';
import { useRouter } from 'vue-router';
import { RouteNames } from '../../router/route-names';

const router = useRouter();

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
                Aprovado: "success",
                Reprovado: "danger",
            };

            return h(Badge, { variant: variantMap[status] }, () => status);
        }
    },
    {
        header: "Ações",
        cell: ({ row }) => {
            const status = row.original.status;
            return h(CustomButton, { icon: PhEye, label: "Visualizar", secondary: true });
        }
    }
];


const data = [
    {
        local: "Hemocentro A",
        data: "22/11/2025 10:00",
        status: "Aprovado",
    },
    {
        local: "Hemocentro B",
        data: "10/10/2025 14:00",
        status: "Reprovado",
    },
    {
        local: "Hemocentro C",
        data: "05/08/2025 08:00",
        status: "Aprovado",
    },
];
</script>

<template>
    <div class="view-container">
        <header class="home-header">
            <section class="welcome">
                <h1 class="poppins-bold">Olá, doador!</h1>
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
                <p class="next-dotaion-info"><span>Data: </span>20/12/2025</p>
                <p class="next-dotaion-info"><span>Hora: </span>10:00</p>
                <p class="next-dotaion-info"><span>Local: </span>Hemocentro</p>
            </div>
            <div class="last-donations">
                <div class="last-dontaion-title">
                    <h2>Últimas Doações</h2>
                </div>
                <Table :data="data" :columns="columns" :pageSize="pageSize" />
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
</style>