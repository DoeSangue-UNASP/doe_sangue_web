<script setup lang="ts">
import { ref, computed } from 'vue';
import EnviarEmail from './passos/EnviarEmail.vue';
import VerificarCodigo from './passos/VerificarCodigo.vue';
import CriarNovaSenha from './passos/CriarNovaSenha.vue';
import { PhX } from '@phosphor-icons/vue';
import IconButton from '../../components/IconButton.vue';
import { useRouter } from 'vue-router';
import { RouteNames } from '../../router/route-names';

const router = useRouter();

const step = ref(0);

const steps = [
    EnviarEmail,
    VerificarCodigo,
    CriarNovaSenha
];

const currentStepComponent = computed(() => steps[step.value]);

const handleNext = () => {
    step.value = Math.min(step.value + 1, steps.length - 1);
};

const handleBack = () => {
    step.value = Math.max(step.value - 1, 0);
};
</script>

<template>
    <div class="view-recuperar-senha">
        <section class="logo">
            <img src="../../assets/logo-light.svg" alt="logo-doe-sangue" />
        </section>
        <section class="form">
            <div class="btn-close">
                <IconButton :icon="PhX" secondary @click="router.push({ name: RouteNames.LANDING_PAGE })" />
            </div>
            <div class="title">
                <h1 class="poppins-bold">Recuperação de Senha</h1>
            </div>
            <component :is="currentStepComponent" @next="handleNext" @back="handleBack" />
        </section>
    </div>
</template>

<style scoped>
.view-recuperar-senha {
    background-color: var(--background-color);

    display: flex;
    flex-direction: row;

    height: 100vh;
    width: 100%;

    padding: 40px;
}

.logo {
    background-color: var(--primary-color);

    display: flex;
    justify-content: center;
    align-items: center;

    width: 50%;

    border-radius: 40px 0 0 40px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}

.form {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 5%;

    width: 50%;

    border-radius: 0 40px 40px 0;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}

.btn-close {
    position: absolute;
    top: 20px;
    right: 20px;
    z-index: 10;
}

.title {
    display: flex;
    flex-direction: column;
    justify-content: center;
    color: var(--secondary-color);
}
</style>