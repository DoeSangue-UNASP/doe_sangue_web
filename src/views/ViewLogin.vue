<script setup lang="ts">
import { ref } from 'vue';
import CustomButton from '../components/CustomButton.vue';
import CustomInput from '../components/CustomInput.vue';
import LinkButton from '../components/LinkButton.vue';
import { useRouter } from 'vue-router';
import { RouteNames } from '../router/route-names';
import IconButton from '../components/IconButton.vue';
import { PhX } from '@phosphor-icons/vue';

const router = useRouter();

const email = ref<string>();
const senha = ref<string>();

const login = () => {
    router.push({ name: RouteNames.HOME_DOADOR })
}

const cadastrar = () => {
    router.push({ name: RouteNames.CADASTRAR })
}
</script>

<template>
    <div class="view-login">
        <section class="logo" @click="router.push({ name: RouteNames.LANDING_PAGE })">
            <img src="../assets/logo-light.svg" alt="logo-doe-sangue" />
        </section>
        <section class="form">
            <div class="btn-close">
                <IconButton :icon="PhX" secondary @click="router.push({ name: RouteNames.LANDING_PAGE })" />
            </div>
            <div class="title">
                <h1 class="poppins-bold">Entrar</h1>
            </div>

            <div class="fields">
                <CustomInput label="E-mail ou CPF" id="email-cpf" :model-value="email" placeholder="email@email.com" />
                <CustomInput label="Senha" id="senha" :model-value="senha" placeholder="******" type="password" />
                <div class="form-button">
                    <CustomButton label="Entrar" @click="login()" />
                    <LinkButton label="Esqueci minha senha" :route-name="RouteNames.RECUPERAR_SENHA" />
                </div>
            </div>

            <div class="dont-have-account">
                <p>Ainda não tem uma conta?</p>
                <div class="form-button">
                    <CustomButton @click="cadastrar" label="Cadastre-se" secondary red-font-color />
                </div>
            </div>
        </section>
    </div>
</template>

<style scoped>
.view-login {
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

    cursor: pointer;
}

.form {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;

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
    height: 33%;
}

.fields {
    display: flex;
    flex-direction: column;
    gap: 30px;

    width: 50%;
    height: 33%;

}

.form-button {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    gap: 30px;

}

.form-button button {
    width: 170px;
}

.dont-have-account {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 10px;
    height: 33%;

}
</style>