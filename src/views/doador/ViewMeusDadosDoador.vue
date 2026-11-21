<script setup lang="ts">
import { onMounted, ref } from 'vue';
import CustomButton from '../../components/CustomButton.vue';
import CustomDialog from '../../components/CustomDialog.vue';
import CustomDatePicker from '../../components/CustomDatePicker.vue';
import CustomInput from '../../components/CustomInput.vue';
import CustomSelect from '../../components/CustomSelect.vue';
import { useViaCep } from '../../composables/useViaCep';
import { useToast } from '../../composables/useToast';
import { obterToken } from '../../services/auth';
import { atualizarMeuPerfil, buscarMeuPerfil, SEXO_OPTIONS, TIPO_SANGUINEO_OPTIONS } from '../../services/doador';

const open = ref<boolean>(false);
const carregando = ref(true);
const salvando = ref(false);
const { buscarEnderecoPorCep, carregandoCep, erroCep } = useViaCep();
const { sucesso, erro } = useToast();

const form = ref({
    nome: '',
    documento: '',
    dataNascimento: '',
    sexo: '',
    tipoSanguineo: '',
    email: '',
    telefone: '',
    cep: '',
    rua: '',
    numero: '',
    bairro: '',
    cidade: '',
    estado: '',
});

const mensagemErro = (e: unknown, padrao: string) => (e as { message?: string }).message || padrao;

const anoAtual = new Date().getFullYear();
const anosNascimento = { min: anoAtual - 120, max: anoAtual };

const toggleModal = () => {
    open.value = !open.value;
};

async function carregarPerfil() {
    try {
        const perfil = await buscarMeuPerfil(obterToken() ?? '');
        form.value = {
            nome: perfil.nome,
            documento: perfil.documento,
            dataNascimento: perfil.dataNascimento,
            sexo: perfil.sexo ?? '',
            tipoSanguineo: perfil.tipoSanguineo ?? '',
            email: perfil.email ?? '',
            telefone: perfil.telefone,
            cep: perfil.endereco?.cep ?? '',
            rua: perfil.endereco?.rua ?? '',
            numero: perfil.endereco?.numero ?? '',
            bairro: perfil.endereco?.bairro ?? '',
            cidade: perfil.endereco?.cidade ?? '',
            estado: perfil.endereco?.estado ?? '',
        };
    } catch (e) {
        erro(mensagemErro(e, 'Não foi possível carregar seus dados.'));
    } finally {
        carregando.value = false;
    }
}

async function salvar() {
    const dados = form.value;
    const obrigatorios = [dados.nome, dados.documento, dados.dataNascimento, dados.telefone,
        dados.cep, dados.rua, dados.numero, dados.bairro, dados.cidade, dados.estado];
    if (obrigatorios.some(campo => !campo.trim())) {
        erro('Preencha todos os campos.');
        return;
    }

    salvando.value = true;
    try {
        await atualizarMeuPerfil({
            nome: dados.nome.trim(),
            documento: dados.documento.trim(),
            telefone: dados.telefone.trim(),
            dataNascimento: dados.dataNascimento,
            sexo: dados.sexo,
            tipoSanguineo: dados.tipoSanguineo,
            endereco: {
                cep: dados.cep.trim(),
                rua: dados.rua.trim(),
                numero: dados.numero.trim(),
                bairro: dados.bairro.trim(),
                cidade: dados.cidade.trim(),
                estado: dados.estado.trim(),
            },
        }, obterToken() ?? '');
        sucesso('Dados salvos com sucesso!');
        toggleModal();
    } catch (e) {
        erro(mensagemErro(e, 'Não foi possível salvar seus dados.'));
    } finally {
        salvando.value = false;
    }
}

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

onMounted(carregarPerfil);
</script>

<template>
    <header>
        <h1>Meus Dados</h1>
    </header>
    <div class="dados-pessoais">
        <div class="template-dois-inputs">
            <CustomInput class="input1" label="Nome Completo" id="nome-completo" placeholder="" v-model="form.nome" />
            <CustomInput class="input2" label="CPF" id="cpf" placeholder="" v-model="form.documento" />
        </div>

        <div class="template-dados-clinicos">
            <CustomDatePicker title="Data de Nascimento" id="data-nascimento" v-model="form.dataNascimento"
                :year-range="anosNascimento" />
            <CustomSelect class="select-clinico" id="sexo" label="Sexo (opcional)" v-model="form.sexo"
                :options="SEXO_OPTIONS" />
            <CustomSelect class="select-clinico" id="tipo-sanguineo" label="Tipo sanguíneo (opcional)"
                v-model="form.tipoSanguineo" :options="TIPO_SANGUINEO_OPTIONS" />
        </div>

        <div class="template-dois-inputs">
            <CustomInput class="input1" label="Email" id="email" placeholder="" type="email" v-model="form.email"
                disabled />
            <CustomInput class="input2" label="Telefone" id="telefone" placeholder="" v-model="form.telefone" />
        </div>

        <div class="template-dois-inputs">
            <CustomInput class="input1" label="Rua" id="rua" placeholder="" v-model="form.rua" />
            <CustomInput class="input2" label="Número" id="numero" placeholder="" v-model="form.numero" />
        </div>

        <div class="template-endereco">
            <div class="cep-input-wrapper-endereco">
                <CustomInput label="CEP" id="cep" placeholder="" v-model="form.cep" />
                <button 
                    type="button"
                    @click="preencherEnderecoViaCep"
                    :disabled="carregandoCep"
                    class="btn-buscar-cep-endereco"
                >
                    {{ carregandoCep ? 'Buscando...' : 'Buscar' }}
                </button>
            </div>
            <CustomInput class="bairro" label="Bairro" id="bairro" placeholder="" v-model="form.bairro" />
            <CustomInput class="cidade" label="Cidade" id="cidade" placeholder="" v-model="form.cidade" />
            <CustomInput class="estado" label="Estado" id="estado" placeholder="" v-model="form.estado" />
        </div>
        <p v-if="erroCep" class="erro-cep-endereco">{{ erroCep }}</p>

        <div class="save-btn">
            <CustomButton :label="salvando ? 'Salvando...' : 'Salvar'" :disabled="salvando || carregando"
                @click="salvar" />
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

.template-dados-clinicos {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    gap: 20px;
}

.select-clinico {
    width: 250px;
}

.template-endereco {
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    gap: 20px;
}

.cep-input-wrapper-endereco {
    display: flex;
    align-items: flex-end;
    gap: 8px;
    width: 30%;
}

.cep-input-wrapper-endereco :deep(.input-container) {
    flex: 1;
    min-width: 0;
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
    width: 25%;
}

.cidade {
    width: 25%;
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