<script setup lang="ts">
import { defineProps, defineEmits } from "vue";

defineProps<{
    label: string;
    active: boolean;
}>();

const emit = defineEmits(['select']);

function handleClick() {
    emit('select');
}
</script>

<template>
    <button class="tab-item" :class="{
        'tab-item-active': active,
        'tab-item-inactive': !active
    }" @click="handleClick" :aria-selected="active" :tabindex="active ? 0 : -1" role="tab">
        {{ label }}
    </button>
</template>

<style scoped>
.tab-item {
    position: relative;
    padding: 8px 12px;
    font-size: 1rem;
    font-weight: 600;
    transition: all 0.2s ease-in-out;
    cursor: pointer;
    white-space: nowrap;
    outline: none;
    border: none;
    background: none;
    color: #4b5563;
    z-index: 10;
}

.tab-item:focus-visible {
    box-shadow: 0 0 0 2px #fff, 0 0 0 4px #ff0000;
    border-radius: 4px;
}

.tab-item-inactive:hover {
    color: #1f2937;
}

.tab-item-active {
    color: #ff0000;
    background-color: white;
    border-bottom: none;
    border-radius: 8px 8px 0 0;
    margin-bottom: -1px;
}
</style>