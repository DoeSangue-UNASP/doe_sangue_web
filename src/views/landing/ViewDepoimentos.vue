<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import CustomButton from '../../components/CustomButton.vue';
import { PhPlus, PhStar } from '@phosphor-icons/vue';
import * as depoimentoService from '../../services/depoimento';
import { ApiError } from '../../services/api';

const router = useRouter();

const depoimentos = ref<depoimentoService.Depoimento[]>([]);
const carregando = ref(true);
const erro = ref('');
const pagina = ref(1);
const totalItens = ref(0);
const itensPorPagina = 6;

async function carregarDepoimentos() {
    try {
        carregando.value = true;
        erro.value = '';
        const result = await depoimentoService.listarDepoimentos({
            status: 'APROVADO',
            pagina: pagina.value,
            limite: itensPorPagina,
        });
        depoimentos.value = result;
        totalItens.value = result.length;
    } catch (e) {
        const error = e as ApiError;
        erro.value = error.message || 'Erro ao carregar depoimentos';
    } finally {
        carregando.value = false;
    }
}

function irParaPagina(novaPagina: number) {
    pagina.value = novaPagina;
    carregarDepoimentos();
}

function criarDepoimento() {
    router.push({
        name: 'criar-depoimento'
    });
}

onMounted(() => {
    carregarDepoimentos();
});
</script>

<template>
    <div class="container">
        <header class="header">
            <div>
                <h1>Depoimentos</h1>
                <p class="subtitle">Histórias de doadores que salvaram vidas</p>
            </div>
            <CustomButton 
                icon="PhPlus" 
                label="Compartilhar Depoimento" 
                @click="criarDepoimento"
            />
        </header>

        <main class="content">
            <div v-if="carregando" class="loading">
                <p>Carregando depoimentos...</p>
            </div>

            <div v-else-if="erro" class="error">
                <p>{{ erro }}</p>
            </div>

            <div v-else-if="depoimentos.length === 0" class="empty">
                <p>Nenhum depoimento compartilhado ainda.</p>
                <p>Seja o primeiro a compartilhar sua história!</p>
            </div>

            <div v-else class="depoimentos-grid">
                <article v-for="depoimento in depoimentos" :key="depoimento.id" class="depoimento-card">
                    <div class="card-header">
                        <h3>{{ depoimento.titulo }}</h3>
                        <div class="rating">
                            <PhStar 
                                v-for="i in depoimento.avaliacoes" 
                                :key="`star-${i}`"
                                size="16"
                                weight="fill"
                                color="#FFB800"
                            />
                        </div>
                    </div>

                    <p class="depoimento-texto">
                        {{ depoimentoService.truncarTexto(depoimento.texto, 180) }}
                    </p>

                    <div class="card-footer">
                        <div class="meta">
                            <span v-if="depoimento.nomeAutor" class="autor">
                                {{ depoimento.nomeAutor }}
                            </span>
                            <span class="data">
                                {{ depoimentoService.formatarData(depoimento.dataDepoimento) }}
                            </span>
                        </div>
                        <CustomButton 
                            label="Ler Mais" 
                            secondary
                            @click="router.push({ name: 'detalhes-depoimento', params: { id: depoimento.id } })"
                        />
                    </div>
                </article>
            </div>

            <div v-if="depoimentos.length > 0" class="pagination">
                <CustomButton 
                    label="Anterior" 
                    secondary
                    :disabled="pagina === 1"
                    @click="irParaPagina(pagina - 1)"
                />
                <span class="page-info">Página {{ pagina }}</span>
                <CustomButton 
                    label="Próximo" 
                    secondary
                    @click="irParaPagina(pagina + 1)"
                />
            </div>
        </main>
    </div>
</template>

<style scoped>
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 3rem;
    gap: 2rem;
}

.header h1 {
    margin: 0;
    color: var(--color-primary);
    font-size: 2rem;
}

.subtitle {
    margin: 0.5rem 0 0;
    color: var(--color-text-secondary);
    font-size: 1rem;
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

.depoimentos-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 2rem;
    margin-bottom: 3rem;
}

.depoimento-card {
    background: white;
    border: 1px solid var(--color-border);
    border-radius: 12px;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    transition: all 0.3s ease;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.depoimento-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    border-color: var(--color-primary);
    transform: translateY(-2px);
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
}

.card-header h3 {
    margin: 0;
    color: var(--color-primary);
    font-size: 1.1rem;
    flex: 1;
}

.rating {
    display: flex;
    gap: 0.25rem;
    white-space: nowrap;
}

.depoimento-texto {
    margin: 0;
    color: var(--color-text);
    line-height: 1.6;
    flex: 1;
    font-size: 0.95rem;
}

.card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    padding-top: 1rem;
    border-top: 1px solid var(--color-border);
}

.meta {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    font-size: 0.85rem;
}

.autor {
    color: var(--color-text);
    font-weight: 600;
}

.data {
    color: var(--color-text-secondary);
}

.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    padding: 2rem;
    background: var(--color-background);
    border-radius: 8px;
}

.page-info {
    color: var(--color-text-secondary);
    font-size: 0.9rem;
    min-width: 100px;
    text-align: center;
}

@media (max-width: 768px) {
    .header {
        flex-direction: column;
        align-items: stretch;
    }

    .depoimentos-grid {
        grid-template-columns: 1fr;
    }

    .card-footer {
        flex-direction: column;
        align-items: flex-start;
    }
}
</style>
