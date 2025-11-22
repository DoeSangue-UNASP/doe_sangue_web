<script setup lang="ts">
import { PhHeart } from '@phosphor-icons/vue';
import CardDepoimento from '../../components/CardDepoimento.vue';
import CustomButton from '../../components/CustomButton.vue';
import NavbarLanding from '../../components/NavbarLanding.vue';
import { useRouter } from 'vue-router';
import { RouteNames } from '../../router/route-names';
import CustomDialog from '../../components/CustomDialog.vue';
import { ref } from 'vue';
import CustomInput from '../../components/CustomInput.vue';
import CustomTextarea from '../../components/CustomTextarea.vue';

const router = useRouter();

const open = ref<boolean>(false);

const toggleModal = () => {
    open.value = !open.value;
};
</script>

<template>
    <div class="background">
        <NavbarLanding/>
        <main class="view-landing">
            <section class="welcome">
                <h1 class="poppins-regular">Olá! Somos o <span>Doe Sangue</span></h1>
                <p>Conectamos doadores voluntários com hemocentros credenciados através de uma plataforma segura, moderna e eficiente, contribuindo para salvar vidas em todo o Brasil.</p>
                <div class="welcome-buttons">
                    <CustomButton @click="router.push({name: RouteNames.CADASTRAR})" label="Sou Hemocentro" secondary/>
                    <CustomButton @click="router.push({name: RouteNames.CADASTRAR})" label="Quero Doar Sangue"/>
                </div>
            </section>
    
            <section class="depoimentos">
                <h1 class="poppins-regular">Depoimentos</h1>
                <p>Confira os depoimentos inspiradores de doadores e receptores de sangue!</p>
                <div class="cards-depoimentos">
                    <CardDepoimento nome="Luis" cidade="Embu das Artes - SP" depoimento="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean aliquet sagittis sem a cursus. Praesent est mauris, commodo in libero ultrices, ullamcorper accumsan nulla. Ut tincidunt id mi et tempus. Morbi nec malesuada eros."/>
                    <CardDepoimento nome="Luis" cidade="Embu das Artes - SP" depoimento="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean aliquet sagittis sem a cursus. Praesent est mauris, commodo in libero ultrices, ullamcorper accumsan nulla. Ut tincidunt id mi et tempus. Morbi nec malesuada eros."/>
                    <CardDepoimento nome="Luis" cidade="Embu das Artes - SP" depoimento="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean aliquet sagittis sem a cursus. Praesent est mauris, commodo in libero ultrices, ullamcorper accumsan nulla. Ut tincidunt id mi et tempus. Morbi nec malesuada eros."/>
                    <CardDepoimento nome="Luis" cidade="Embu das Artes - SP" depoimento="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean aliquet sagittis sem a cursus. Praesent est mauris, commodo in libero ultrices, ullamcorper accumsan nulla. Ut tincidunt id mi et tempus. Morbi nec malesuada eros."/>
                </div>
                <div class="novo-depoimento">
                    <PhHeart size="50"/>
                    <p>Compartilhe sua experiência</p>
                    <p>Compartilhe sua experiência como doador ou receptor e incentive outras pessoas a fazerem a diferença. Sua história pode salvar vidas!</p>

                    <CustomButton @click="toggleModal" label="Compartilhe sua história!" secondary red-font-color />
                </div>
            </section>
        </main>
    </div>
    <CustomDialog v-model="open">
        <template #default>
            <div class="header">
                <PhHeart size="50" color="var(--primary-color)"/>
                <span>Compartilhe sua experiência</span>
                <p>Sua experiência pode inspirar outras pessoas a doarem sangue e salvarem vidas!</p>
            </div>
            <div class="form">
                <CustomInput label="Nome" id="nome" model-value="" placeholder="Nome"/>
                <div class="template-input-cidade-estado">
                    <CustomInput class="input-width" label="Cidade" id="cidade" model-value="" placeholder="São Paulo"/>
                    <CustomInput class="input-width" label="Estado" id="estado" model-value="" placeholder="SP"/>
                </div>
                <CustomTextarea label="Seu Depoimento" id="depoimento" model-value="" placeholder="depoimento..."/>
                <CustomButton label="Enviar" @click="toggleModal"/>
            </div>
        </template>
    </CustomDialog>
</template>

<style scoped>
.background {
    background-color: var(--background-color);
    height: 100%;
    padding-bottom: 50px;
}

.view-landing {
    margin-top: 100px;
    margin: 100px 100px 0 100px;
}

.welcome {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    width: 100%;
    height: 80vh;
    gap: 50px;
}

.welcome h1 {
    font-size: 60px;
    color: var(--font-color);
}


.welcome p {
    text-align: center;
    width: 700px;
}

.welcome span {
    color: var(--primary-color);
}

.welcome-buttons {
    display: flex;
    flex-direction: row;
    gap: 60px;
}

.welcome-buttons button {
    width: 200px;
    font-size: 16px;
}

.depoimentos {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 50px;
}

.cards-depoimentos {
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 30px;
    flex-wrap: wrap;
}

.novo-depoimento {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: var(--primary-color);
    color: #FFFFFF;

    padding: 40px;
    border-radius: 16px;
    max-width: 660px;
    gap: 20px;
    text-align: center;
}

.header {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    text-align: center;

    gap: 20px;
}

.template-input-cidade-estado {
    display: flex;
    flex-direction: row;
    gap: 20px;
}

.input-width {
    width: 50%;
}

.form {
    display: flex;
    flex-direction: column;
    gap: 20px;
}
</style>