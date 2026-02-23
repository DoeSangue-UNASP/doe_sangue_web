<script setup lang="ts">
import type { Component } from 'vue';

defineProps<{
    click?: () => void;
    secondary?: boolean;
    icon: Component;
}>();
</script>

<template>
    <button :class="{ 'btn-secondary': secondary }" class="poppins-medium" type="button" @click="click?.()">
        <component :is="icon" size="25" :color="secondary ? 'var(--primary-color)' : 'var(--font-button-primary)'" />
    </button>
</template>

<style scoped>
button {
    width: 45px;
    height: 45px;

    background-color: var(--primary-color);
    color: var(--font-button-primary);
    border-radius: 8px;
    border: none;
    transition: 0.5s;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

button:hover {
    transition: 0.5s;
    cursor: pointer;
    background-color: var(--button-hover);
}

.btn-secondary {
    background-color: var(--button-secondary);
    color: var(--font-color);
    border: 1px solid;
    border-color: var(--primary-color);
}

.btn-secondary:hover {
    background-color: #e2e2e2;
    color: var(--font-button-primary);
}
</style>
