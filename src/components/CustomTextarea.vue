<script setup lang="ts">
defineProps<{
    id: string;
    label: string;
    placeholder?: string;
    rows?: number;
}>();

const modelValue = defineModel<string>()
</script>

<template>
    <div class="textarea-container poppins-regular">
        <label :for="id">{{ label }}</label>
        <textarea class="poppins-regular" :id="id" placeholder="Mensagem aqui" :rows="rows ?? 4" v-model="modelValue" />
    </div>
</template>

<style scoped>
.textarea-container {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.textarea-container textarea {
    width: 100%;
    min-height: 40px;
    resize: vertical;

    border-radius: 8px;
    border: 1px solid;
    border-color: var(--input-border-color);
    padding: 12px 16px;

    font-family: inherit;
    font-size: inherit;
}

.textarea-container textarea:focus {
    outline: none;
    border-color: var(--primary-color);
}
</style>