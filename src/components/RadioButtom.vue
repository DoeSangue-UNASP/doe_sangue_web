<script setup lang="ts">
defineProps<{
    id?: string;
    label: string;
    value?: string;
    Group: string; 
}>();

const modelValue = defineModel<string>();
</script>

<template>
    <div class="radio-container poppins-regular">
        <input
            type="radio"
            :id="id ?? label"
            :Group="Group"
            :value="value ?? label"
            v-model="modelValue"
        />
        <label :for="id ?? label">{{ label }}</label>
    </div>
</template>

<style scoped>
.radio-container {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
}

.radio-container input[type="radio"] {
    width: 18px;
    height: 18px;
    accent-color: var(--primary-color, #e53935);
}

.radio-container label {
    cursor: pointer;
}
</style>
