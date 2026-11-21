<script setup lang="ts">
import { PhHeart } from '@phosphor-icons/vue';
import CardDepoimento from '../../components/CardDepoimento.vue';
import CustomButton from '../../components/CustomButton.vue';
import NavbarLanding from '../../components/NavbarLanding.vue';
import { useRouter } from 'vue-router';
import { RouteNames } from '../../router/route-names';
import CustomDialog from '../../components/CustomDialog.vue';
import { ref, onMounted } from 'vue';
import CustomInput from '../../components/CustomInput.vue';
import CustomTextarea from '../../components/CustomTextarea.vue';
import * as depoimentoService from '../../services/depoimento';
import { ApiError } from '../../services/api';
import { useAuth } from '../../composables/useAuth';
import { useToast } from '../../composables/useToast';

const router = useRouter();
const { token } = useAuth();
const { sucesso, erro } = useToast();

const open = ref<boolean>(false);
const depoimentos = ref<depoimentoService.Depoimento[]>([]);
const carregandoDepoimentos = ref(true);
const erroDepoimentos = ref('');

const formulario = ref({
    titulo: '',
    conteudo: '',
});
const salvando = ref(false);
const erroFormulario = ref('');

const toggleModal = () => {
    open.value = !open.value;
    if (!open.value) {
        formulario.value = { titulo: '', conteudo: '' };
        erroFormulario.value = '';
    }
};

async function carregarDepoimentos() {
    try {
        carregandoDepoimentos.value = true;
        erroDepoimentos.value = '';
        const result = await depoimentoService.listarDepoimentos();
        depoimentos.value = result;
    } catch (e) {
        const error = e as ApiError;
        erroDepoimentos.value = error.message || 'Erro ao carregar depoimentos';
    } finally {
        carregandoDepoimentos.value = false;
    }
}

async function enviarDepoimento() {
    if (!formulario.value.titulo.trim() || !formulario.value.conteudo.trim()) {
        erroFormulario.value = 'Preencha todos os campos';
        erro('Preencha todos os campos obrigatórios');
        return;
    }

    try {
        salvando.value = true;
        erroFormulario.value = '';

        await depoimentoService.criarDepoimento({
            titulo: formulario.value.titulo.trim(),
            conteudo: formulario.value.conteudo.trim(),
        }, token.value);

        sucesso('Depoimento enviado com sucesso!');
        toggleModal();
        await carregarDepoimentos();
    } catch (e) {
        const error = e as ApiError;
        const mensagem = error.message || 'Erro ao enviar depoimento';
        erroFormulario.value = mensagem;
        erro(mensagem);
    } finally {
        salvando.value = false;
    }
}

onMounted(() => {
    carregarDepoimentos();
});
</script>

<template>
    <div class="background">
        <NavbarLanding />
        <main class="view-landing">
            <section class="welcome">
                <h1 class="poppins-regular">Olá! Somos o <span>Doe Sangue</span></h1>
                <p>Conectamos doadores voluntários com hemocentros credenciados através de uma plataforma segura,
                    moderna e eficiente, contribuindo para salvar vidas em todo o Brasil.</p>
                <div class="welcome-buttons">
                    <CustomButton @click="router.push({ name: RouteNames.CADASTRAR, query: { perfil: 'hemocentro' } })"
                        label="Sou Hemocentro" secondary />
                    <CustomButton @click="router.push({ name: RouteNames.CADASTRAR, query: { perfil: 'doador' } })"
                        label="Quero Doar Sangue" />
                </div>
            </section>

            <section v-if="!carregandoDepoimentos && depoimentos.length > 0" class="depoimentos">
                <h1 class="poppins-regular">Depoimentos</h1>
                <p>Confira os depoimentos inspiradores de doadores e receptores de sangue!</p>
                <div class="cards-depoimentos">
                    <CardDepoimento v-for="dep in depoimentos" :key="dep.id" :nome="dep.autor?.nome || 'Anônimo'"
                        :cidade="dep.autor?.nome ? 'Brasil' : ''"
                        :depoimento="depoimentoService.truncarTexto(dep.conteudo, 180)" />
                </div>
            </section>
            <div class="novo-depoimento">
                <div class="card-novo-depoimento">
                    <PhHeart size="50" />
                    <h1 class="card-novo-depoimento-title">Compartilhe sua experiência</h1>
                    <p>Compartilhe sua experiência como doador ou receptor e incentive outras pessoas a fazerem a
                        diferença. Sua história pode salvar vidas!</p>

                    <CustomButton @click="toggleModal" label="Compartilhe sua história!" secondary red-font-color />
                </div>
            </div>
        </main>
    </div>
    <CustomDialog v-model="open">
        <template #default>
            <div class="dialog-header">
                <PhHeart size="50" color="var(--primary-color)" />
                <h1 class="dialog-title">Compartilhe sua experiência</h1>
                <p>Sua experiência pode inspirar outras pessoas a doarem sangue e salvarem vidas!</p>
            </div>
            <div class="form">
                <div v-if="erroFormulario" class="error-message">
                    {{ erroFormulario }}
                </div>
                <CustomInput id="titulo" label="Título" v-model="formulario.titulo"
                    placeholder="Ex: Minha primeira doação salvou vidas" />
                <CustomTextarea id="depoimento" label="Seu Depoimento" v-model="formulario.conteudo"
                    placeholder="Compartilhe sua experiência..." />
                <CustomButton label="Enviar" @click="enviarDepoimento" :disabled="salvando" />
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

.novo-depoimento {
    display: flex;
    flex-direction: column;
    align-items: center;
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

.card-novo-depoimento {
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

.card-novo-depoimento-title {
    font-weight: bold;
    font-size: larger;
}

.dialog-header {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    text-align: center;

    gap: 20px;
}

.dialog-title {
    font-weight: bold;
    font-size: large;
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

.error-message {
    padding: 0.75rem;
    background: rgba(220, 38, 38, 0.1);
    color: var(--color-danger);
    border-radius: 4px;
    font-size: 0.875rem;
}
</style>