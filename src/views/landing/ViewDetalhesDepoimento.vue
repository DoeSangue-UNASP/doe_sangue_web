<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import CustomButton from '../../components/CustomButton.vue';
import { PhArrowLeft, PhStar } from '@phosphor-icons/vue';
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
        const depoimentoId = route.params.id as string;
        depoimento.value = await depoimentoService.buscarDepoimento(depoimentoId);
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
            </div>

            <article v-else-if="depoimento" class="depoimento-completo">
                <header class="depoimento-header">
                    <div>
                        <h1>{{ depoimento.titulo }}</h1>
                        <div class="rating">
                            <PhStar 
                                v-for="i in depoimento.avaliacoes" 
                                :key="`star-${i}`"
                                size="20"
                                weight="fill"
                                color="#FFB800"
                            />
                        </div>
                    </div>
                </header>

                <div class="depoimento-meta">
                    <div v-if="depoimento.nomeAutor" class="meta-item">
                        <label>Autor:</label>
                        <p>{{ depoimento.nomeAutor }}</p>
                    </div>
                    <div v-if="depoimento.tipoSanguineo" class="meta-item">
                        <label>Tipo Sanguíneo:</label>
                        <p class="tipo-sangue">{{ depoimento.tipoSanguineo }}</p>
                    </div>
                    <div class="meta-item">
                        <label>Data:</label>
                        <p>{{ depoimentoService.formatarData(depoimento.dataDepoimento) }}</p>
                    </div>
                    <div class="meta-item">
                        <label>Status:</label>
                        <span class="status" :class="`status-${depoimento.status.toLowerCase()}`">
                            {{ depoimento.status }}
                        </span>
                    </div>
                </div>

                <div class="depoimento-corpo">
                    <p>{{ depoimento.texto }}</p>
                </div>

                <footer class="depoimento-footer">
                    <CustomButton 
                        label="Voltar" 
                        secondary 
                        @click="voltar"
                    />
                </footer>
            </article>
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

.loading, .error {
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

.depoimento-completo {
    background: white;
    border: 1px solid var(--color-border);
    border-radius: 12px;
    padding: 2.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.depoimento-header {
    margin-bottom: 2rem;
    padding-bottom: 1.5rem;
    border-bottom: 2px solid var(--color-border);
}

.depoimento-header h1 {
    margin: 0;
    color: var(--color-primary);
    font-size: 2rem;
    line-height: 1.3;
}

.rating {
    display: flex;
    gap: 0.5rem;
    margin-top: 1rem;
}

.depoimento-meta {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
    padding: 1.5rem;
    background: rgba(var(--color-primary-rgb), 0.05);
    border-radius: 8px;
}

.meta-item {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.meta-item label {
    font-weight: 600;
    color: var(--color-text-secondary);
    font-size: 0.75rem;
    text-transform: uppercase;
}

.meta-item p {
    margin: 0;
    color: var(--color-text);
    font-size: 0.95rem;
}

.tipo-sangue {
    font-weight: 600;
    color: var(--color-primary);
    font-size: 1.1rem;
}

.status {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
}

.status-aprovado {
    background: rgba(34, 197, 94, 0.1);
    color: #22c55e;
}

.status-pendente {
    background: rgba(255, 184, 0, 0.1);
    color: #FFB800;
}

.status-rejeitado {
    background: rgba(220, 38, 38, 0.1);
    color: var(--color-danger);
}

.depoimento-corpo {
    margin: 2rem 0;
    padding: 1.5rem;
    background: rgba(var(--color-primary-rgb), 0.02);
    border-left: 4px solid var(--color-primary);
    border-radius: 4px;
}

.depoimento-corpo p {
    margin: 0;
    color: var(--color-text);
    line-height: 1.8;
    font-size: 1rem;
}

.depoimento-footer {
    display: flex;
    gap: 1rem;
    padding-top: 1.5rem;
    border-top: 1px solid var(--color-border);
}

@media (max-width: 768px) {
    .depoimento-completo {
        padding: 1.5rem;
    }

    .depoimento-header h1 {
        font-size: 1.5rem;
    }

    .depoimento-meta {
        grid-template-columns: 1fr;
    }
}
</style>
