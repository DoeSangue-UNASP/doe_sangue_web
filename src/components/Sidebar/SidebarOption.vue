<script setup lang="ts">
import type { Component } from 'vue';
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps<{
    label: string;
    icon: Component;
    selected?: boolean;
    route: string;
}>();

const isSelected = computed(() => Boolean(props.selected));

const iconColor = computed(() => (isSelected.value ? '#FFFFFF' : 'var(--secondary-color)'));

const goToRoute = () => {
    router.push({ name: props.route });
};
</script>

<template>
    <div @click="goToRoute" class="option poppins-regular" :class="{ selected: isSelected }">
        <component :is="icon" :size="20" :color="iconColor" />
        <p class="label">{{ label }}</p>
    </div>
</template>

<style scoped>
.option {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: 20px;

    width: 100%;
    height: 40px;

    background-color: #FFFFFF;
    color: var(--secondary-color);
    padding: 0 20px;
    border-radius: 16px;

    cursor: pointer;
    transition: background-color 0.2s ease;
}

.option.selected {
    background-color: var(--secondary-color);
    color: #FFFFFF;
}

.option:hover {
    background-color: var(--button-secondary-hover);
}

.option.selected:hover {
    background-color: var(--secondary-color);
}

.label {
    color: inherit;
}
</style>