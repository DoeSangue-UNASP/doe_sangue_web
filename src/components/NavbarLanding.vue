<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import CustomButton from './CustomButton.vue';
import { RouteNames } from '../router/route-names';

const router = useRouter();
const route = useRoute();

const navegarPara = (nomeRota: string) => {
    router.push({ name: nomeRota });
};

const isSelected = (nomeRota: string) => route.name === nomeRota;

</script>

<template>
    <nav class="poppins-regular">
        <section class="logo" @click="navegarPara(RouteNames.LANDING_PAGE)">
            <img src="../assets/logo_vertical.svg" alt="logo-doe-sangue" />
        </section>
        <section class="options">
            <div class="navbar-option" :class="{ selected: isSelected(RouteNames.SOBRE_NOS) }"
                @click="navegarPara(RouteNames.SOBRE_NOS)">Sobre Nós</div>
            <div class="navbar-option" :class="{ selected: isSelected(RouteNames.PONTOS_COLETA) }"
                @click="navegarPara(RouteNames.PONTOS_COLETA)">Pontos de Coleta</div>
            <div class="navbar-option" :class="{ selected: isSelected(RouteNames.REQUISITOS_DOACAO) }"
                @click="navegarPara(RouteNames.REQUISITOS_DOACAO)">Requisitos</div>
            <div class="navbar-option" :class="{ selected: isSelected(RouteNames.QUIZ_APTIDAO) }"
                @click="navegarPara(RouteNames.QUIZ_APTIDAO)">Quiz de Aptidão</div>
            <CustomButton class="btn-entrar" label="Entrar" @click="navegarPara(RouteNames.LOGIN)" />
        </section>
    </nav>
</template>

<style scoped>
nav {
    background-color: #FFFFFF;
    position: fixed;
    width: 100%;
    height: 100px;

    display: flex;
    flex-direction: row;
    border: 1px solid;
    border-color: var(--input-border-color);

    padding: 0 30px;
    top: 0;
    z-index: 1000;
}

.logo {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 40%;

    cursor: pointer;
}

.options {
    width: 60%;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    gap: 60px;
}

.navbar-option {
    max-width: 200px;
}

.navbar-option:hover {
    cursor: pointer;
    color: var(--secondary-color);
}

.options>div.navbar-option {
    position: relative;
    width: fit-content;
}

.options>div.navbar-option::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: -4px;
    width: 100%;
    height: 2px;
    background-color: currentColor;
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.25s ease;
}

.options>div.navbar-option:hover::after {
    transform: scaleX(1);
}

.options>div.navbar-option.selected {
    color: var(--secondary-color);
}

.options>div.navbar-option.selected::after {
    transform: scaleX(1);
}

.btn-entrar {
    max-width: 200px;
    font-size: 18px;
}
</style>
