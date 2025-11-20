<script setup lang="ts">
defineProps<{
    label: string;
    click?: () => void
}>();
</script>

<template>
    <button class="poppins-medium">{{ label }}</button>
</template>
<style scoped>
button {
    width: 100%;
    height: 45px;

    background-color: var(--primary-color);
    color: var(--font-button-primary);
    border-radius: 16px;
    border: none;
    transition: 0.5s;
}

button:hover {
    transition: 0.5s;
    cursor: pointer;
    background-color: var(--secondary-color);
}
</style>

