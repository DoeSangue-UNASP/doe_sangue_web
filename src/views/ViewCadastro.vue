<script setup lang="ts">
import { ref } from 'vue';
import CustomButton from '../components/CustomButton.vue';
import CustomInput from '../components/CustomInput.vue';
import LinkButton from '../components/LinkButton.vue';
import { useRouter } from 'vue-router';
import { RouteNames } from '../router/route-names';
import { PhX } from '@phosphor-icons/vue';
import IconButton from '../components/IconButton.vue';

const router = useRouter();

const usuario = ref<string>();
const email = ref<string>();
const senha = ref<string>();
const confirmarSenha = ref<string>();

const login = () => {
    router.push({ name: RouteNames.HOME_DOADOR });
}
</script>

<template>
    <div class="view-cadastrar">
        <section class="logo" @click="router.push({ name: RouteNames.LANDING_PAGE })">
            <img src="../assets/logo-light.svg" alt="logo-doe-sangue" />
        </section>
        <section class="form">
            <div class="btn-close">
                <IconButton :icon="PhX" secondary @click="router.push({ name: RouteNames.LANDING_PAGE })" />
            </div>
            <div class="title">
                <h1 class="poppins-bold">Cadastrar</h1>
            </div>

            <div class="fields">
                <CustomInput label="Usuário" id="usuario" :model-value="usuario" placeholder="usuario" />
                <CustomInput label="E-mail" id="email" :model-value="email" placeholder="email@email.com"
                    type="email" />
                <CustomInput label="Senha" id="senha" :model-value="senha" placeholder="******" type="password" />
                <CustomInput label="Confirme a Senha" id="confirmar-senha" :model-value="confirmarSenha"
                    placeholder="******" type="password" />
                <div class="form-button">
                    <CustomButton label="Entrar" @click="login()" />
                    <LinkButton label="Já tenho conta" :route-name="RouteNames.LOGIN" />
                </div>
            </div>
        </section>
    </div>
</template>

<style scoped>
.view-cadastrar {
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
    height: 30%;
}

.fields {
    display: flex;
    flex-direction: column;
    gap: 30px;

    width: 50%;
    height: 70%;

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
</style>