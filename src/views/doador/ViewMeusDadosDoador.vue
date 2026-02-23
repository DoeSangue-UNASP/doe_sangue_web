<script setup lang="ts">
import { ref } from 'vue';
import CustomButton from '../../components/CustomButton.vue';
import CustomDialog from '../../components/CustomDialog.vue';
import CustomInput from '../../components/CustomInput.vue';;

const open = ref<boolean>(false);

const toggleModal = () => {
    open.value = !open.value;
};
</script>

<template>
    <header>
        <h1>Meus Dados</h1>
    </header>
    <div class="dados-pessoais">
        <div class="template-dois-inputs">
            <CustomInput class="input1" label="Nome Completo" id="nome-completo" placeholder="" />
            <CustomInput class="input2" label="Gênero" id="genero" placeholder="" />
        </div>

        <div class="template-dois-inputs">
            <CustomInput class="input1" label="Nome Social (opcional)" id="nome-social" placeholder="" />
            <CustomInput class="input2" label="CPF" id="cpf" placeholder="" />
        </div>

        <div class="template-dois-inputs">
            <CustomInput label="Data de Nascimento" id="data-nascimento" placeholder="" />
        </div>

        <div class="template-dois-inputs">
            <CustomInput class="input1" label="Email" id="email" placeholder="" type="email" />
            <CustomInput class="input2" label="Telefone" id="telefone" placeholder="" />
        </div>

        <div class="template-dois-inputs">
            <CustomInput class="input1" label="Rua" id="rua" placeholder="" />
            <CustomInput class="input2" label="Número" id="numero" placeholder="" />
        </div>

        <div class="template-endereco">
            <CustomInput class="cep" label="CEP" id="cep" placeholder="" />
            <CustomInput class="bairro" label="Bairro" id="bairro" placeholder="" />
            <CustomInput class="cidade" label="Cidade" id="cidade" placeholder="" />
            <CustomInput class="estado" label="Estado" id="estado" placeholder="" />
        </div>

        <div class="save-btn">
            <CustomButton @click="toggleModal" label="Salvar" />
        </div>
    </div>

    <CustomDialog v-model="open">
        <template #header>
            Dados Salvos!
        </template>
        <template #default>
            Seus dados foram salvos com sucesso!
        </template>
        <template #footer>
            <CustomButton label="OK" @click="toggleModal" />
        </template>
    </CustomDialog>
</template>

<style scoped>
.dados-pessoais {
    display: flex;
    flex-direction: column;
    gap: 25px;

    height: 100%;
    overflow-y: auto;
}

.template-dois-inputs {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    gap: 20px;
}

.template-dois-inputs .input1 {
    width: 70%;
}

.template-dois-inputs .input2 {
    width: 30%;
}

.template-endereco {
    display: flex;
    flex-direction: row;
    gap: 20px;
}

.cep {
    width: 20%;
}

.estado {
    width: 20%;
}

.bairro {
    width: 30%;
}

.cidade {
    width: 30%;
}

.save-btn {
    display: flex;
    justify-content: flex-end;
    width: 100%;
    margin: auto;
}

.save-btn button {
    width: 20%;
}
</style>