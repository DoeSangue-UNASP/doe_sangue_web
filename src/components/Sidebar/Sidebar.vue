<script setup lang="ts">
import { PhGear, PhSignOut } from '@phosphor-icons/vue';
import SidebarOption from './SidebarOption.vue';
import CustomDialog from '../CustomDialog.vue';
import { ref } from 'vue';
import CustomButton from '../CustomButton.vue';
import { useRouter } from 'vue-router';
import { RouteNames } from '../../router/route-names';

const router = useRouter();

const open = ref<boolean>(false);

const toggleModal = () => {
    open.value = !open.value;
};
</script>

<template>
    <div class="sidebar-container">
        <section class="logo">
            <img src="../../assets/logo_vertical.svg" alt="logo-doe-sangue">
        </section>
        <section class="sidebar-options">
            <slot></slot>
        </section>
        <section class="config-logout">
            <SidebarOption :icon="PhGear" label="Configurações" route="" />
            <SidebarOption @click="toggleModal" :icon="PhSignOut" label="Sair" route="" />
        </section>
    </div>

    <CustomDialog v-model="open">
        <template #header>
            Deseja realmente sair?
        </template>
        <template #default>
            Ao clicar em "Confirmar", você estará saindo da aplicação.
        </template>
        <template #footer>
            <div class="modal-footer">
                <CustomButton label="Cancelar" secondary @click="toggleModal" />
                <CustomButton label="Confirmar" @click="router.push({ name: RouteNames.LOGIN })" />
            </div>
        </template>
    </CustomDialog>
</template>

<style scoped>
.sidebar-container {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 300px;
    height: 100%;

    padding: 50px 20px;
}

.logo {
    width: 100%;
    height: 50%;
    display: flex;
    justify-content: center;
    align-items: flex-start;
}

.sidebar-options {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    gap: 10px;
}

.config-logout {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    gap: 10px;
}

.modal-footer {
    display: flex;
    flex-direction: row;
    gap: 20px;
}
</style>