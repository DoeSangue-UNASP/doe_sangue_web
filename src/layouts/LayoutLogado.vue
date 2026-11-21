<script setup lang="ts">
import Sidebar from '../components/Sidebar/Sidebar.vue';
import SidebarOptionsDoador from '../components/Sidebar/SidebarOptionsDoador.vue';
import SidebarOptionsHemocentro from '../components/Sidebar/SidebarOptionsHemocentro.vue';

defineProps<{
    sidebarDoador: boolean;
}>();
</script>

<template>
    <div class="layout-container">
        <div class="sidebar">
            <Sidebar>
                <component :is="sidebarDoador ? SidebarOptionsDoador : SidebarOptionsHemocentro" />
            </Sidebar>
        </div>
        <div class="view-container">
            <slot></slot>
        </div>
    </div>
</template>

<style scoped>
.layout-container {
    width: 100%;
    height: 100vh;
    background-color: var(--background-color);

    display: flex;
    flex-direction: row;

    gap: 25px;

    padding: 40px;
}

.sidebar {
    width: 300px;
    border-radius: 40px;
    background-color: #FFFFFF;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}

.view-container {
    width: 100%;
    height: 100%;
    min-height: 0;
    background-color: #FFFFFF;
    border-radius: 40px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
    padding: 60px;
    overflow-y: auto;
}
</style>
