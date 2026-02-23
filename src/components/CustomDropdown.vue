<script setup lang="ts">
import { PhCaretDown } from '@phosphor-icons/vue';
import { ref, watch } from 'vue';

const props = defineProps<{
    title?: string;
    label: string;
    options: string[];
    modelValue?: string;
    modelOpen?: boolean;
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void;
    (e: 'update:modelOpen', value: boolean): void;
    (e: 'change', value: string): void;
}>();

const isOpen = ref(false);

const toggleDropdown = () => {
    isOpen.value = !isOpen.value;
};

const selectOption = (option: string) => {
    emit('update:modelValue', option);
    emit('change', option);
    isOpen.value = false;
};

watch(() => props.modelOpen, (value) => {
    if (typeof value === 'boolean') {
        isOpen.value = value;
    }
});

watch(isOpen, (value) => {
    emit('update:modelOpen', value);
});
</script>

<template>
    <div class="dropdown-container">

        <label v-if="title" class="dropdown-label poppins-regular">{{ title }}</label>


        <div class="dropdown-header" @click="toggleDropdown">

            <span>{{ modelValue || label }}</span>
            <span class="arrow" :class="{ 'arrow-rotate': isOpen }"><PhCaretDown/></span>
        </div>


        <ul class="dropdown-list" v-if="isOpen">
            <li v-for="option in options" :key="option" :class="{ 'selected': option === modelValue }"
                @click="selectOption(option)">
                {{ option }}
            </li>
        </ul>
    </div>
</template>

<style scoped>
.dropdown-container {
    --primary-color: #000;
    --font-button-primary: #fff;
    --font-color: #333;
    --input-border-color: #ddd;
    --label-color: #000;

    width: 100%;
    position: relative;
    margin-bottom: 16px;

}

.dropdown-label {
    display: block;
    margin-bottom: 8px;
}

.dropdown-header {
    width: 100%;
    height: 40px;
    background-color: #fff;
    border: 1px solid var(--input-border-color);
    color: var(--font-color);
    border-radius: 8px;
    padding: 0 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    transition: all 0.3s ease;
    user-select: none;
}

.dropdown-header:hover {
    border-color: var(--primary-color);
}

.arrow {
    font-size: 24px;
    transition: transform 0.3s ease;
    color: #070E4D;
}

.arrow-rotate {
    transform: rotate(180deg);
}

.dropdown-list {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    width: 100%;
    z-index: 100;
    background: white;
    border-radius: 12px;
    border: 1px solid var(--input-border-color);
    max-height: 200px;
    overflow-y: auto;
    list-style-type: none;
    padding: 0;
    overflow-x: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.dropdown-list li {
    padding: 12px 16px;
    cursor: pointer;
    transition: background-color 0.2s, color 0.2s;
    color: var(--font-color);
    font-size: 14px;
    font-weight: 500;
}

.dropdown-list li:hover{
    background-color: #c2bfd8;
    color: black;
}

.dropdown-list li.selected {
    background-color: #0c1452;
    color: var(--font-button-primary);
}
</style>