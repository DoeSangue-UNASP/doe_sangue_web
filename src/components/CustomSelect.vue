<script setup lang="ts">
const props = defineProps<{
    id: string;
    label: string;
    disabled?: boolean;
    options: Array<{ value: string; label: string }>;
}>();

const modelValue = defineModel<string>();
</script>

<template>
    <div class="select-container poppins-regular">
        <label :for="id">{{ label }}</label>

        <select class="poppins-regular" :id="id" :disabled="props.disabled" v-model="modelValue">
            <option v-for="option in options" :key="option.value" :value="option.value">
                {{ option.label }}
            </option>
        </select>
    </div>
</template>

<style scoped>
.select-container {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.select-container select {
    width: 100%;
    height: 40px;

    border-radius: 8px;
    border: 1px solid var(--input-border-color);
    padding: 0 16px;

    background-color: white;
    font-family: inherit;
    font-size: 1rem;
    color: inherit;

    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: right 12px center;
    background-size: 20px;
    padding-right: 36px;
}

/* Aparência quando está desabilitado */
.select-container select:disabled {
    background-color: #f2f2f2;
    cursor: not-allowed;
    opacity: 0.7;
}

.select-container select:focus {
    outline: none;
    border-color: var(--primary-color);
}

/* Remove a aparência padrão do select em alguns navegadores */
.select-container select::-ms-expand {
    display: none;
}
</style>
