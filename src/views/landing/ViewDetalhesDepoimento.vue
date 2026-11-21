<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import CustomButton from '../../components/CustomButton.vue';
import * as depoimentoService from '../../services/depoimento';
import { ApiError } from '../../services/api';

const router = useRouter();
const route = useRoute();

const depoimento = ref<depoimentoService.Depoimento | null>(null);
const carregando = ref(true);
const erro = ref('');

async function carregarDepoimento() {
    try {
        carregando.value = true;
        erro.value = '';

        let id: string;
        if (Array.isArray(route.params.id)) {
            id = route.params.id[0] || '';
        } else {
            id = (route.params.id as string) || '';
        }

        if (!id) {
            erro.value = 'ID do depoimento inválido';
            return;
        }

        const result = await depoimentoService.obterDepoimento(id);
        depoimento.value = result;
    } catch (e) {
        const error = e as ApiError;
        erro.value = error.message || 'Erro ao carregar depoimento';
    } finally {
        carregando.value = false;
    }
}

function voltar() {
    router.back();
}

onMounted(() => {
    carregarDepoimento();
});
</script>

<template>
    <div class="container">
        <header class="header">
            <CustomButton 
                label="Voltar" 
                secondary 
                @click="voltar"
            />
        </header>

        <main class="content">
            <div v-if="carregando" class="loading">
                <p>Carregando depoimento...</p>
            </div>

            <div v-else-if="erro" class="error">
                <p>{{ erro }}</p>
                <CustomButton 
                    label="Voltar" 
                    secondary 
                    @click="voltar"
                />
            </div>

            <article v-else-if="depoimento" class="depoimento-detail">
                <header class="article-header">
                    <h1>{{ depoimento.titulo }}</h1>
                    <div class="meta">
                        <span v-if="depoimento.autor?.nome" class="autor">
                            Por {{ depoimento.autor.nome }}
                        </span>
                        <span class="data">
                            {{ depoimentoService.formatarData(depoimento.criadoEm) }}
                        </span>
                    </div>
                </header>

                <div class="content-text">
                    <p>{{ depoimento.conteudo }}</p>
                </div>

                <footer class="article-footer">
                    <div class="actions">
                        <CustomButton 
                            label="Voltar aos Depoimentos" 
                            @click="router.push({ name: 'depoimentos' })"
                        />
                    </div>
                </footer>
            </article>

            <div v-else class="empty">
                <p>Depoimento não encontrado.</p>
            </div>
        </main>
    </div>
</template>

<style scoped>
.container {
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem;
}

.header {
    margin-bottom: 2rem;
}

.content {
    min-height: 400px;
}

.loading, .error, .empty {
    padding: 3rem;
    text-align: center;
    background: var(--color-background);
    border-radius: 8px;
    color: var(--color-text-secondary);
}

.error {
    color: var(--color-danger);
    background: rgba(220, 38, 38, 0.1);
}

.depoimento-detail {
    background: white;
    border: 1px solid var(--color-border);
    border-radius: 12px;
    padding: 3rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
}

.article-header {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding-bottom: 1.5rem;
    border-bottom: 2px solid var(--color-border);
}

.article-header h1 {
    margin: 0;
    color: var(--color-primary);
    font-size: 2rem;
    line-height: 1.3;
}

.meta {
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: 0.9rem;
    color: var(--color-text-secondary);
}

.autor {
    color: var(--color-text);
    font-weight: 600;
}

.data {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.content-text {
    flex: 1;
    line-height: 1.8;
    font-size: 1rem;
    color: var(--color-text);
}

.content-text p {
    margin: 0;
    white-space: pre-wrap;
    word-break: break-word;
}

.article-footer {
    padding-top: 1.5rem;
    border-top: 1px solid var(--color-border);
}

.actions {
    display: flex;
    gap: 1rem;
}

@media (max-width: 768px) {
    .container {
        padding: 1rem;
    }

    .depoimento-detail {
        padding: 1.5rem;
    }

    .article-header h1 {
        font-size: 1.5rem;
    }

    .meta {
        flex-wrap: wrap;
    }

    .actions {
        flex-direction: column;
    }
}
</style>
