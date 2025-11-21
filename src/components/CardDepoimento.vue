<script setup lang="ts">
defineProps<{
    nome: string;
    cidade: string;
    depoimento: string;
}>();

</script>

<template>
    <div class="depoimento-card-container">

        <div class="card-content">
            <p class="card-depoimento-text">
                {{depoimento}}
            </p>
        </div>

        <div class="card-meta-data">
            <h4 class="card-nome">
                {{nome}}
            </h4>
            <p class="card-cidade">
               {{cidade}}
            </p>
        </div>

    </div>
</template>

<style scoped>

.depoimento-card-container {
    display: flex;
    flex-direction: column;
    padding: 1.5rem;
    max-width: 400px;
    min-height: 200px; 

    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
}

.depoimento-card-container:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.card-content {
    flex-grow: 1; 
    margin-bottom: 1rem;
}

.card-depoimento-text {
    font-style: italic;
    font-size: 1.1rem;
    color: #333333;
    line-height: 1.5;
}

.card-meta-data {
    border-top: 1px solid #eeeeee;
    padding-top: 0.75rem;
    text-align: right; 
}

.card-nome {
    font-size: 1rem;
    font-weight: 600; 
    color: #cc0000; 
    margin: 0 0 0.25rem 0;
}

.card-cidade {
    font-size: 0.85rem;
    color: #666666;
    margin: 0;
}
</style>