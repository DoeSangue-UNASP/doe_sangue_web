<script setup lang="ts">
import { ref } from 'vue';
import CustomButton from '../components/CustomButton.vue';
import CustomInput from '../components/CustomInput.vue';
import CustomSelect from '../components/CustomSelect.vue';
import LinkButton from '../components/LinkButton.vue';
import { useRoute, useRouter } from 'vue-router';
import { RouteNames } from '../router/route-names';
import { PhX } from '@phosphor-icons/vue';
import IconButton from '../components/IconButton.vue';
import { apiRequest } from '../services/api';
import { useToast } from '../composables/useToast';

const router = useRouter();
const route = useRoute();
const { sucesso, erro } = useToast();

const perfil = ref<'doador' | 'hemocentro'>(route.query.perfil === 'hemocentro' ? 'hemocentro' : 'doador');
const form = ref({
    nome: '', documento: '', telefone: '', dataNascimento: '',
    cnpj: '', site: '', nomeFantasia: '', abreEm: '', fechaEm: '',
    email: '', senha: '', confirmarSenha: '',
    cep: '', numero: '', rua: '', bairro: '', cidade: '', estado: '',
});
const erroFormulario = ref('');
const carregando = ref(false);

const cadastrar = async () => {
    erroFormulario.value = '';
    const dados = form.value;
    const camposComuns = [dados.email, dados.senha, dados.confirmarSenha, dados.cep, dados.numero,
        dados.rua, dados.bairro, dados.cidade, dados.estado];
    const camposPerfil = perfil.value === 'doador'
        ? [dados.nome, dados.documento, dados.telefone, dados.dataNascimento]
        : [dados.cnpj, dados.site, dados.nomeFantasia, dados.abreEm, dados.fechaEm];
    if ([...camposComuns, ...camposPerfil].some(campo => !campo.trim())) {
        const mensagem = 'Preencha todos os campos.';
        erroFormulario.value = mensagem;
        erro(mensagem);
        return;
    }
    if (dados.senha !== dados.confirmarSenha) {
        const mensagem = 'As senhas não coincidem.';
        erroFormulario.value = mensagem;
        erro(mensagem);
        return;
    }
    const endereco = {
        cep: dados.cep.trim(), numero: dados.numero.trim(), rua: dados.rua.trim(),
        bairro: dados.bairro.trim(), cidade: dados.cidade.trim(), estado: dados.estado.trim(),
    };
    const body = perfil.value === 'doador'
        ? {
            nome: dados.nome.trim(), documento: dados.documento.trim(), telefone: dados.telefone.trim(),
            dataNasimento: dados.dataNascimento, email: dados.email.trim(), senha: dados.senha, endereco,
        }
        : {
            cnpj: dados.cnpj.trim(), site: dados.site.trim(), nomeFantasia: dados.nomeFantasia.trim(),
            abreEm: `2000-01-01T${dados.abreEm}:00`, fechaEm: `2000-01-01T${dados.fechaEm}:00`,
            email: dados.email.trim(), senha: dados.senha, endereco,
        };
    carregando.value = true;
    try {
        await apiRequest(perfil.value === 'doador' ? '/Doador' : '/Hemocentro', {
            method: 'POST',
            body: JSON.stringify(body),
        });
        sucesso('Cadastro realizado com sucesso!');
        await router.push({ name: RouteNames.LOGIN, query: { cadastro: 'concluido' } });
    } catch (error) {
        const mensagem = error instanceof Error ? error.message : 'Não foi possível realizar o cadastro.';
        erroFormulario.value = mensagem;
        erro(mensagem);
    } finally {
        carregando.value = false;
    }
};
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
            <div class="title"><h1 class="poppins-bold">Cadastrar</h1></div>

            <form class="fields" @submit.prevent="cadastrar">
                <CustomSelect 
                    id="perfil" 
                    label="Tipo de cadastro"
                    v-model="perfil"
                    :options="[
                        { value: 'doador', label: 'Doador' },
                        { value: 'hemocentro', label: 'Hemocentro' }
                    ]"
                />
                <template v-if="perfil === 'doador'">
                    <CustomInput label="Nome completo" id="nome" v-model="form.nome" />
                    <CustomInput label="CPF" id="documento" v-model="form.documento" />
                    <CustomInput label="Telefone" id="telefone" v-model="form.telefone" type="tel" />
                    <CustomInput label="Data de nascimento" id="nascimento" v-model="form.dataNascimento" type="date" />
                </template>
                <template v-else>
                    <CustomInput label="Nome do hemocentro" id="nome-hemocentro" v-model="form.nomeFantasia" />
                    <CustomInput label="CNPJ" id="cnpj" v-model="form.cnpj" />
                    <CustomInput label="Site" id="site" v-model="form.site" />
                    <CustomInput label="Horário de abertura" id="abertura" v-model="form.abreEm" type="time" />
                    <CustomInput label="Horário de fechamento" id="fechamento" v-model="form.fechaEm" type="time" />
                </template>
                <CustomInput label="E-mail" id="email" v-model="form.email" type="email" />
                <CustomInput label="Senha" id="senha" v-model="form.senha" type="password" />
                <CustomInput label="Confirme a senha" id="confirmar-senha" v-model="form.confirmarSenha" type="password" />
                <p>A senha deve ter ao menos 6 caracteres, incluindo letra maiúscula, minúscula, número e símbolo.</p>
                <h2>Endereço</h2>
                <CustomInput label="CEP" id="cep" v-model="form.cep" />
                <CustomInput label="Rua" id="rua" v-model="form.rua" />
                <CustomInput label="Número" id="numero" v-model="form.numero" />
                <CustomInput label="Bairro" id="bairro" v-model="form.bairro" />
                <CustomInput label="Cidade" id="cidade" v-model="form.cidade" />
                <CustomInput label="Estado" id="estado" v-model="form.estado" />
                <p v-if="erroFormulario" class="erro" role="alert">{{ erroFormulario }}</p>
                <div class="form-button">
                    <CustomButton :label="carregando ? 'Cadastrando...' : 'Cadastrar'" :disabled="carregando" />
                    <LinkButton label="Já tenho conta" :route-name="RouteNames.LOGIN" />
                </div>
            </form>
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

.fields select {
    height: 40px;
    border: 1px solid var(--input-border-color);
    border-radius: 8px;
    padding: 0 16px;
    background: white;
}

.erro {
    color: #b91c1c;
}

@media (max-width: 760px) {
    .view-cadastrar { padding: 16px; }
    .logo { display: none; }
    .form { width: 100%; border-radius: 20px; }
}
.logo {
    background-color: var(--primary-color);

    display: flex;
    justify-content: flex-start;
    align-items: center;

    width: 50%;
    overflow-y: auto;
    padding: 45px 20px;

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
    margin-bottom: 24px;
}

.fields {
    display: flex;
    flex-direction: column;
    gap: 16px;

    width: min(100%, 480px);

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