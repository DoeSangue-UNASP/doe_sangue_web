<script setup lang="ts">
import { ref } from 'vue';
import CustomButton from '../components/CustomButton.vue';
import CustomInput from '../components/CustomInput.vue';
import LinkButton from '../components/LinkButton.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const email = ref<string>();
const senha = ref<string>();

const login = () => {
    router.push({name: 'home-doador'})
}
</script>

<template>
    <div class="view-login">
        <section class="logo">
            <img src="../assets/logo-light.svg" alt="logo-doe-sangue" />
        </section>
        <section class="form">
            <div class="title">
                <h1 class="poppins-bold">Entrar</h1>
            </div>

            <div class="fields">
                <CustomInput label="E-mail ou CPF" id="email-cpf" :model-value="email" placeholder="email@email.com"/>
                <CustomInput label="Senha" id="senha" :model-value="senha" placeholder="******" type="password"/>
                <div class="form-button">
                    <CustomButton label="Entrar" @click="login()"/>
                    <LinkButton label="Esqueci minha senha" route-name="esqueci-minha-senha"/>
                </div>
            </div>

            <div class="dont-have-account">
                <p>Ainda não tem uma conta?</p>
                <div class="form-button">
                    <CustomButton label="Cadastre-se" secondary red-font-color/>
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
}

.form {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;

    width: 50%;

    border-radius: 0 40px 40px 0;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
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