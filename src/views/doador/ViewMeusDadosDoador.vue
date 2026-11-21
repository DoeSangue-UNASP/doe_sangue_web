<script setup lang="ts">
import { ref } from 'vue';
import CustomButton from '../../components/CustomButton.vue';
import CustomDialog from '../../components/CustomDialog.vue';
import CustomInput from '../../components/CustomInput.vue';
import { useViaCep } from '../../composables/useViaCep';
import { useToast } from '../../composables/useToast';

const open = ref<boolean>(false);
const { buscarEnderecoPorCep, carregandoCep, erroCep } = useViaCep();
const { sucesso, erro } = useToast();

const form = ref({
    cep: '',
    rua: '',
    numero: '',
    bairro: '',
    cidade: '',
    estado: '',
});

const toggleModal = () => {
    open.value = !open.value;
};

const preencherEnderecoViaCep = async () => {
    if (!form.value.cep.trim()) {
        erro('Digite um CEP');
        return;
    }

    const endereco = await buscarEnderecoPorCep(form.value.cep);
    
    if (endereco) {
        form.value.rua = endereco.rua;
        form.value.bairro = endereco.bairro;
        form.value.cidade = endereco.cidade;
        form.value.estado = endereco.estado;
        sucesso('Endereço preenchido com sucesso!');
    } else if (erroCep.value) {
        erro(erroCep.value);
    }
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
            <div class="cep-input-wrapper-endereco">
                <CustomInput 
                    class="cep" 
                    label="CEP" 
                    id="cep" 
                    placeholder="" 
                    v-model="form.cep"
                />
                <button 
                    type="button"
                    @click="preencherEnderecoViaCep"
                    :disabled="carregandoCep"
                    class="btn-buscar-cep-endereco"
                >
                    {{ carregandoCep ? 'Buscando...' : 'Buscar' }}
                </button>
            </div>
            <p v-if="erroCep" class="erro-cep-endereco">{{ erroCep }}</p>
            <CustomInput 
                class="bairro" 
                label="Bairro" 
                id="bairro" 
                placeholder="" 
                v-model="form.bairro"
            />
            <CustomInput 
                class="cidade" 
                label="Cidade" 
                id="cidade" 
                placeholder="" 
                v-model="form.cidade"
            />
            <CustomInput 
                class="estado" 
                label="Estado" 
                id="estado" 
                placeholder="" 
                v-model="form.estado"
            />
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
    flex-direction: column;
    gap: 20px;
}

.cep-input-wrapper-endereco {
    display: flex;
    gap: 8px;
    align-items: flex-end;
}

.cep-input-wrapper-endereco :deep(.custom-input) {
    flex: 1;
}

.btn-buscar-cep-endereco {
    padding: 8px 16px;
    background-color: var(--primary-color);
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    font-size: 0.875rem;
    white-space: nowrap;
    height: 40px;
    transition: background-color 0.3s ease;
}

.btn-buscar-cep-endereco:hover:not(:disabled) {
    background-color: #c41e3a;
}

.btn-buscar-cep-endereco:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.erro-cep-endereco {
    color: #b91c1c;
    font-size: 0.875rem;
    margin: 0;
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