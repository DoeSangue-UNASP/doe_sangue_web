<script setup lang="ts">
import { useRoute } from 'vue-router';
import { RouteNames } from './router/route-names';
import LayoutLogado from './layouts/LayoutLogado.vue';

const route = useRoute();
const simpleViews = [RouteNames.LANDING_PAGE, RouteNames.LOGIN, RouteNames.CADASTRAR, RouteNames.REQUISITOS_DOACAO] as string[];
</script>

<template>
    <div v-if="simpleViews.includes(route.name as string)">
        <RouterView/>
    </div>
    <div v-else>
        <LayoutLogado :sidebar-doador="route.path.includes('doador')">
            <RouterView/>
        </LayoutLogado>
    </div>
</template>

<style scoped>
</style>