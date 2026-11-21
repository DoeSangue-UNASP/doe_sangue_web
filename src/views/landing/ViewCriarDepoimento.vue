<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import CustomButton from '../../components/CustomButton.vue';
import CustomInput from '../../components/CustomInput.vue';
import * as depoimentoService from '../../services/depoimento';
import { ApiError } from '../../services/api';
import { useAuth } from '../../composables/useAuth';

const router = useRouter();
const { token } = useAuth();

const formulario = ref({
    titulo: '',
    conteudo: '',
});

const salvando = ref(false);
const erro = ref('');
const sucesso = ref(false);
const erros = ref<Record<string, string>>({});

function validar(): boolean {
    erros.value = {};

    if (!formulario.value.titulo.trim()) {
        erros.value.titulo = 'Título é obrigatório';
    }

    if (!formulario.value.conteudo.trim()) {
        erros.value.conteudo = 'Depoimento é obrigatório';
    }

    if (formulario.value.conteudo.trim().length < 20) {
        erros.value.conteudo = 'Depoimento deve ter pelo menos 20 caracteres';
    }

    if (formulario.value.conteudo.trim().length > 2000) {
        erros.value.conteudo = 'Depoimento não pode exceder 2000 caracteres';
    }

    return Object.keys(erros.value).length === 0;
}

async function salvar() {
    if (!validar()) return;

    try {
        salvando.value = true;
        erro.value = '';

        await depoimentoService.criarDepoimento({
            titulo: formulario.value.titulo.trim(),
            conteudo: formulario.value.conteudo.trim(),
        }, token.value);

        sucesso.value = true;

        setTimeout(() => {
            router.push({
                name: 'depoimentos'
            });
        }, 2000);
    } catch (e) {
        const error = e as ApiError;
        erro.value = error.message || 'Erro ao enviar depoimento';
    } finally {
        salvando.value = false;
    }
}

function voltar() {
    router.back();
}

const caracteresRestantes = () => 2000 - formulario.value.conteudo.length;
</script>

<template>
    <div class="container">
        <header class="header">
            <CustomButton 
                label="Voltar" 
                secondary 
                @click="voltar"
            />
            <h1>Compartilhar Depoimento</h1>
        </header>

        <main class="content">
            <div v-if="sucesso" class="success">
                <h2>✓ Depoimento enviado com sucesso!</h2>
                <p>Obrigado por compartilhar sua história.</p>
                <p style="font-size: 0.875rem; margin-top: 0.5rem;">Redirecionando...</p>
            </div>

            <form v-else class="form" @submit.prevent="salvar">
                <div v-if="erro" class="error">
                    <p>{{ erro }}</p>
                </div>

                <div class="form-group">
                    <label for="titulo">Título do Depoimento *</label>
                    <CustomInput 
                        id="titulo"
                        label="Título do Depoimento"
                        v-model="formulario.titulo"
                        type="text"
                        placeholder="Ex: Minha primeira doação salvou vidas"
                        :error="!!erros.titulo"
                    />
                    <span v-if="erros.titulo" class="error-message">{{ erros.titulo }}</span>
                </div>

                <div class="form-group">
                    <div class="label-with-counter">
                        <label for="conteudo">Seu Depoimento *</label>
                        <span class="char-counter" :class="{ warning: caracteresRestantes() < 100 }">
                            {{ caracteresRestantes() }} caracteres restantes
                        </span>
                    </div>
                    <textarea 
                        id="conteudo"
                        v-model="formulario.conteudo"
                        class="textarea"
                        placeholder="Compartilhe sua experiência como doador de sangue. Como você se sentiu? Qual é o impacto que gostaria que sua doação tivesse?"
                        maxlength="2000"
                        rows="8"
                        :class="{ error: !!erros.conteudo }"
                    />
                    <span v-if="erros.conteudo" class="error-message">{{ erros.conteudo }}</span>
                </div>

                <div class="disclaimer">
                    <p>
                        <strong>Aviso de Privacidade:</strong> Seu depoimento será revisado antes da publicação.
                    </p>
                </div>

                <div class="form-actions">
                    <CustomButton 
                        label="Enviar Depoimento" 
                        type="submit"
                        :disabled="salvando"
                    />
                    <CustomButton 
                        label="Cancelar" 
                        secondary 
                        :disabled="salvando"
                        @click="voltar"
                    />
                </div>
            </form>
        </main>
    </div>
</template>

<style scoped>
.container {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
}

.header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 2rem;
}

.header h1 {
    margin: 0;
    flex: 1;
    color: var(--color-primary);
}

.content {
    background: var(--color-background);
    border-radius: 8px;
    padding: 2rem;
}

.success {
    padding: 2rem;
    background: rgba(34, 197, 94, 0.1);
    border: 1px solid #22c55e;
    border-radius: 8px;
    color: #22c55e;
    text-align: center;
}

.success h2 {
    margin-top: 0;
}

.error {
    padding: 1rem;
    background: rgba(220, 38, 38, 0.1);
    color: var(--color-danger);
    border-radius: 4px;
    margin-bottom: 1.5rem;
}

.form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

label {
    font-weight: 600;
    color: var(--color-text);
    font-size: 0.95rem;
}

.label-with-counter {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.char-counter {
    font-size: 0.75rem;
    color: var(--color-text-secondary);
}

.char-counter.warning {
    color: var(--color-danger);
    font-weight: 600;
}

.textarea {
    padding: 0.75rem;
    border: 1px solid var(--color-border);
    border-radius: 4px;
    background: white;
    color: var(--color-text);
    font-size: 0.95rem;
    font-family: inherit;
    resize: vertical;
}

.textarea:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(var(--color-primary-rgb), 0.1);
}

.textarea.error {
    border-color: var(--color-danger);
}

.error-message {
    color: var(--color-danger);
    font-size: 0.75rem;
    margin-top: -0.25rem;
}

.disclaimer {
    padding: 1rem;
    background: rgba(var(--color-primary-rgb), 0.05);
    border-left: 4px solid var(--color-primary);
    border-radius: 4px;
}

.disclaimer p {
    margin: 0;
    color: var(--color-text-secondary);
    font-size: 0.85rem;
    line-height: 1.5;
}

.form-actions {
    display: flex;
    gap: 1rem;
    padding-top: 1rem;
    border-top: 1px solid var(--color-border);
}

@media (max-width: 768px) {
    .form-actions {
        flex-direction: column;
    }
}
</style>
