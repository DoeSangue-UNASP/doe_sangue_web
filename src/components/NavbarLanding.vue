<script setup lang="ts">
import { useRouter } from 'vue-router';
import CustomButton from './CustomButton.vue';
import { RouteNames } from '../router/route-names';

var router = useRouter();

const navegarPara = (nomeRota: string) => {
    router.push({ name: nomeRota });
}

</script>

<template>
    <nav class="poppins-regular">
        <section class="logo" @click="navegarPara(RouteNames.LANDING_PAGE)">
            <img src="../assets/logo_vertical.svg" alt="logo-doe-sangue" />
        </section>
        <section class="options">
            <div class="navbar-option" @click="navegarPara('sobre-nos')">Sobre Nós</div>
            <div class="navbar-option" @click="navegarPara(RouteNames.PONTOS_COLETA)">Pontos de Coleta</div>
            <div class="navbar-option" @click="navegarPara(RouteNames.REQUISITOS_DOACAO)">Requisitos</div>
            <div class="navbar-option" @click="navegarPara('requisitos')">Quiz de Aptidão</div>
            <CustomButton class="navbar-option btn-entrar" label="Entrar" @click="navegarPara('login')" />
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
}

.btn-entrar {
    font-size: 18px;
}
</style>
