<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import CustomDialog from '../../components/CustomDialog.vue';
import CustomInput from '../../components/CustomInput.vue';
import CustomButton from '../../components/CustomButton.vue';
import { useViaCep } from '../../composables/useViaCep';
import { useToast } from '../../composables/useToast';

const route = useRoute();

const router = useRouter();

const { buscarEnderecoPorCep, carregandoCep, erroCep } = useViaCep();
const { sucesso, erro } = useToast();

const form = ref({
    nomeCompleto: '',
    genero: '',
    nomeSocial: '',
    cpf: '',
    nascimento: '',
    email: '',
    telefone: '',
    rua: '',
    numero: '',
    cep: '',
    bairro: '',
    cidade: '',
    estado: '',
});

const open = ref(false);
const toggleModal = () => (open.value = !open.value);

const openDelete = ref(false);
const toggleDeleteModal = () => (openDelete.value = !openDelete.value);

const isViewMode = computed(() => {
    return !route.path.includes("hemocentro/doadores/novo");
});

const isEditing = ref(false);

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

const inputDisabled = computed(() => {
    if (isViewMode.value && !isEditing.value) return true;
    return false;
});

const toggleEditing = () => {
    isEditing.value = !isEditing.value;
};

onMounted(() => {
    if (isViewMode.value) {
        const data = {
            nomeCompleto: 'Maria Souza',
            genero: 'Feminino',
            nomeSocial: '',
            cpf: '123.456.789-00',
            nascimento: '1990-01-01',
            email: 'maria@email.com',
            telefone: '48999999999',
            rua: 'Rua das Flores',
            numero: '123',
            cep: '88000-000',
            bairro: 'Centro',
            cidade: 'Florianópolis',
            estado: 'SC',
        };

        form.value = data;
    }
});
</script>

<template>
    <header>
        <h1>
            {{ !isViewMode
                ? 'Cadastrar doador'
                : isEditing
                    ? 'Editar doador'
                    : 'Visualizar doador'
            }}
        </h1>
    </header>

    <div class="dados-pessoais">
        <div class="template-dois-inputs">
            <CustomInput id="nome" class="input1" label="Nome Completo" v-model="form.nomeCompleto"
                :disabled="inputDisabled" />
            <CustomInput id="genero" class="input2" label="Gênero" v-model="form.genero" :disabled="inputDisabled" />
        </div>

        <div class="template-dois-inputs">
            <CustomInput id="nome-social" class="input1" label="Nome Social (opcional)" v-model="form.nomeSocial"
                :disabled="inputDisabled" />
            <CustomInput id="cpf" class="input2" label="CPF" v-model="form.cpf" :disabled="inputDisabled" />
        </div>

        <div class="template-dois-inputs">
            <CustomInput id="data-nascimento" label="Data de Nascimento" v-model="form.nascimento"
                :disabled="inputDisabled" type="date" />
        </div>

        <h2>Contato e endereço</h2>

        <div class="template-dois-inputs">
            <CustomInput id="email" class="input1" label="Email" v-model="form.email" :disabled="inputDisabled"
                type="email" />
            <CustomInput id="telefone" class="input2" label="Telefone" v-model="form.telefone"
                :disabled="inputDisabled" />
        </div>

        <div class="template-dois-inputs">
            <CustomInput id="rua" class="input1" label="Rua" v-model="form.rua" :disabled="inputDisabled" />
            <CustomInput id="numero" class="input2" label="Número" v-model="form.numero" :disabled="inputDisabled" />
        </div>

        <div class="template-endereco">
            <div class="cep-input-wrapper-gerenciar">
                <CustomInput 
                    id="cep" 
                    class="cep" 
                    label="CEP" 
                    v-model="form.cep" 
                    :disabled="inputDisabled || carregandoCep"
                />
                <button 
                    type="button"
                    @click="preencherEnderecoViaCep"
                    :disabled="carregandoCep || inputDisabled"
                    class="btn-buscar-cep-gerenciar"
                    v-if="!inputDisabled"
                >
                    {{ carregandoCep ? 'Buscando...' : 'Buscar' }}
                </button>
            </div>
            <p v-if="erroCep" class="erro-cep-gerenciar">{{ erroCep }}</p>
            <CustomInput id="bairro" class="bairro" label="Bairro" v-model="form.bairro" :disabled="inputDisabled" />
            <CustomInput id="cidade" class="cidade" label="Cidade" v-model="form.cidade" :disabled="inputDisabled" />
            <CustomInput id="estado" class="estado" label="Estado" v-model="form.estado" :disabled="inputDisabled" />
        </div>

        <div class="actions" v-if="!isViewMode && !isEditing">
            <CustomButton label="Salvar" @click="toggleModal" />
        </div>
        <div class="actions" v-if="isViewMode && isEditing">
            <CustomButton label="Cancelar" secondary @click="toggleEditing" />
            <CustomButton label="Salvar" @click="toggleModal" />
        </div>
        <div class="actions" v-if="isViewMode && !isEditing">
            <CustomButton label="Excluir" @click="toggleDeleteModal" />
            <CustomButton label="Editar" secondary @click="toggleEditing" />
        </div>
    </div>

    <CustomDialog v-model="open">
        <template #header>Doador cadastrado!</template>
        <template #default>Todos os dados foram salvos com sucesso!</template>
        <template #footer>
            <div class="actions">
                <CustomButton label="OK" @click="router.go(-1)" />
            </div>
        </template>
    </CustomDialog>

    <CustomDialog v-model="openDelete">
        <template #header>Excluir doador</template>

        <template #default>
            Tem certeza de que deseja excluir este item?
            <br />
            Esta ação é irreversível e os dados serão permanentemente removidos.
        </template>

        <template #footer>
            <div class="actions">
                <CustomButton label="Cancelar" secondary @click="toggleDeleteModal" />
                <CustomButton label="Confirmar" @click="router.go(-1)" />

            </div>
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

.cep-input-wrapper-gerenciar {
    display: flex;
    gap: 8px;
    align-items: flex-end;
}

.cep-input-wrapper-gerenciar :deep(.custom-input) {
    flex: 1;
}

.btn-buscar-cep-gerenciar {
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

.btn-buscar-cep-gerenciar:hover:not(:disabled) {
    background-color: #c41e3a;
}

.btn-buscar-cep-gerenciar:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.erro-cep-gerenciar {
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

.actions {
    display: flex;
    justify-content: flex-end;
    width: 100%;
    gap: 10px;
}

.actions button {
    width: 20%;
}
</style>