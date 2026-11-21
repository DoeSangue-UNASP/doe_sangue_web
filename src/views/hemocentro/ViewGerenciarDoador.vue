<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import CustomDialog from '../../components/CustomDialog.vue';
import CustomDatePicker from '../../components/CustomDatePicker.vue';
import CustomInput from '../../components/CustomInput.vue';
import CustomSelect from '../../components/CustomSelect.vue';
import CustomButton from '../../components/CustomButton.vue';
import { useToast } from '../../composables/useToast';
import { obterToken } from '../../services/auth';
import {
    atualizarDoadorPeloHemocentro,
    buscarDoadorPorId,
    cadastrarLead,
    SEXO_OPTIONS,
    TIPO_SANGUINEO_OPTIONS,
    type Doador,
} from '../../services/doador';

const route = useRoute();

const router = useRouter();

const { sucesso, erro } = useToast();

const form = ref({
    nomeCompleto: '',
    cpf: '',
    nascimento: '',
    telefone: '',
    sexo: '',
    tipoSanguineo: '',
});

const doador = ref<Doador | null>(null);
const carregando = ref(false);
const salvando = ref(false);

const anoAtual = new Date().getFullYear();
const anosNascimento = { min: anoAtual - 120, max: anoAtual };

const mensagemErro = (e: unknown, padrao: string) => (e as { message?: string }).message || padrao;

const open = ref(false);
const toggleModal = () => (open.value = !open.value);

const openDelete = ref(false);
const toggleDeleteModal = () => (openDelete.value = !openDelete.value);

const isViewMode = computed(() => {
    return !route.path.includes("hemocentro/doadores/novo");
});

const isEditing = ref(false);

const inputDisabled = computed(() => {
    if (isViewMode.value && !isEditing.value) return true;
    return false;
});

// Para doadores usuários, o hemocentro só pode alterar sexo e tipo sanguíneo
const dadosPessoaisDisabled = computed(() => inputDisabled.value || !!doador.value?.ehUsuario);

const toggleEditing = () => {
    isEditing.value = !isEditing.value;
    if (!isEditing.value && doador.value) preencherFormulario(doador.value);
};

function preencherFormulario(dados: Doador) {
    form.value = {
        nomeCompleto: dados.nome,
        cpf: dados.documento,
        nascimento: dados.dataNascimento,
        telefone: dados.telefone,
        sexo: dados.sexo ?? '',
        tipoSanguineo: dados.tipoSanguineo ?? '',
    };
}

async function carregarDoador() {
    carregando.value = true;
    try {
        const dados = await buscarDoadorPorId(route.params.id as string, obterToken() ?? '');
        doador.value = dados;
        preencherFormulario(dados);
    } catch (e) {
        erro(mensagemErro(e, 'Não foi possível carregar o doador.'));
    } finally {
        carregando.value = false;
    }
}

async function salvar() {
    const dados = form.value;
    if (!dados.nomeCompleto.trim() || !dados.cpf.trim() || !dados.telefone.trim() || !dados.nascimento) {
        erro('Preencha nome, CPF, telefone e data de nascimento.');
        return;
    }

    const requisicao = {
        nome: dados.nomeCompleto.trim(),
        documento: dados.cpf.replace(/\D/g, ''),
        telefone: dados.telefone.replace(/\D/g, ''),
        dataNascimento: dados.nascimento,
        sexo: dados.sexo,
        tipoSanguineo: dados.tipoSanguineo,
    };

    salvando.value = true;
    try {
        const token = obterToken() ?? '';
        if (isViewMode.value) {
            await atualizarDoadorPeloHemocentro(route.params.id as string, requisicao, token);
            sucesso('Doador atualizado com sucesso!');
        } else {
            await cadastrarLead(requisicao, token);
            sucesso('Doador cadastrado com sucesso!');
        }
        toggleModal();
    } catch (e) {
        erro(mensagemErro(e, 'Não foi possível salvar o doador.'));
    } finally {
        salvando.value = false;
    }
}

onMounted(() => {
    if (isViewMode.value) carregarDoador();
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
                :disabled="dadosPessoaisDisabled" />
            <CustomInput id="cpf" class="input2" label="CPF" v-model="form.cpf" :disabled="dadosPessoaisDisabled" />
        </div>

        <div class="template-linha">
            <CustomDatePicker title="Data de Nascimento" id="data-nascimento" v-model="form.nascimento"
                :year-range="anosNascimento" :disabled="dadosPessoaisDisabled" />
            <CustomInput id="telefone" class="input-telefone" label="Telefone" v-model="form.telefone"
                :disabled="dadosPessoaisDisabled" />
        </div>

        <div class="template-linha">
            <CustomSelect class="select-clinico" id="sexo" label="Sexo (opcional)" v-model="form.sexo"
                :options="SEXO_OPTIONS" :disabled="inputDisabled" />
            <CustomSelect class="select-clinico" id="tipo-sanguineo" label="Tipo sanguíneo (opcional)"
                v-model="form.tipoSanguineo" :options="TIPO_SANGUINEO_OPTIONS" :disabled="inputDisabled" />
        </div>

        <div class="actions" v-if="!isViewMode && !isEditing">
            <CustomButton :label="salvando ? 'Salvando...' : 'Salvar'" :disabled="salvando" @click="salvar" />
        </div>
        <div class="actions" v-if="isViewMode && isEditing">
            <CustomButton label="Cancelar" secondary @click="toggleEditing" />
            <CustomButton :label="salvando ? 'Salvando...' : 'Salvar'" :disabled="salvando" @click="salvar" />
        </div>
        <div class="actions" v-if="isViewMode && !isEditing">
            <CustomButton label="Excluir" @click="toggleDeleteModal" />
            <CustomButton label="Editar" secondary :disabled="carregando || !doador" @click="toggleEditing" />
        </div>
    </div>

    <CustomDialog v-model="open">
        <template #header>{{ isViewMode ? 'Doador atualizado!' : 'Doador cadastrado!' }}</template>
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

.template-linha {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    gap: 20px;
}

.template-linha .input-telefone {
    width: 250px;
}

.select-clinico {
    width: 250px;
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