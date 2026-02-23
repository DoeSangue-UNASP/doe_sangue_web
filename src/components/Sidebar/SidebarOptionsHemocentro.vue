<script setup lang="ts">
import { PhCardsThree, PhChartPieSlice, PhClockUser, PhUser } from '@phosphor-icons/vue';
import { useRoute } from 'vue-router';
import SidebarOption from './SidebarOption.vue';
import { RouteNames } from '../../router/route-names';

const route = useRoute();

</script>

<template>
    <SidebarOption :icon="PhChartPieSlice" label="Dashboard" :selected="route.name === RouteNames.HOME_HEMOCENTRO"
        :route="RouteNames.HOME_HEMOCENTRO" />
    <SidebarOption :icon="PhUser" label="Doadores" :selected="route.name === RouteNames.DOADORES_HEMOCENTRO_LISTAR"
        :route="RouteNames.DOADORES_HEMOCENTRO_LISTAR" />
    <SidebarOption :icon="PhCardsThree" label="Banco de Sangue"
        :selected="route.name === RouteNames.BOLSAS_SANGUE_HEMOCENTRO" :route="RouteNames.BOLSAS_SANGUE_HEMOCENTRO" />
    <SidebarOption :icon="PhClockUser" label="Agendamentos"
        :selected="route.name === RouteNames.AGENDAMENTOS_HEMOCENTRO" :route="RouteNames.AGENDAMENTOS_HEMOCENTRO" />
</template>

<style scoped></style>