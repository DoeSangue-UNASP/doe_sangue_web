<script setup lang="ts">
defineProps<{
    label: string;
    click?: () => void;
    secondary?: boolean;
    redFontColor?: boolean;
    icon?: string;
}>();
</script>

<template>
    <button @click="click" :class="{ 'btn-secondary': secondary, 'red-font-color': redFontColor }"
        class="poppins-medium btn-container">
        <span v-if="icon" class="icon-wrapper">
            <component :is="icon" size="20" />
        </span>

        {{ label }}
    </button>
</template>

<style scoped>
button {
    width: 100%;
    height: 45px;

    background-color: var(--primary-color);
    color: var(--font-button-primary);
    border-radius: 8px;
    border: none;
    transition: 0.5s;

    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
}

button:hover {
    transition: 0.5s;
    cursor: pointer;
    background-color: var(--button-hover);
}

.btn-secondary {
    background-color: var(--button-secondary);
    color: var(--font-color);
    border: 1px solid var(--input-border-color);
    transition: 0.25s ease;
}

.btn-secondary:hover {
    background-color: var(--button-secondary-hover);
    border-color: var(--secondary-color);
    color: var(--secondary-color);
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.15);
    transform: translateY(-1px);
}

.red-font-color {
    color: var(--primary-color);
}

.icon-wrapper {
    display: flex;
    align-items: center;
}
</style>
