<script setup lang="ts">
import { defineProps, defineModel } from "vue";
import TabItem from "./TabItem.vue";

defineProps<{
    tabs: Array<{ label: string; value: string }>;
}>();

const modelValue = defineModel<string>({ required: true });

function selectTab(value: string) {
    modelValue.value = value;
}
</script>

<template>
    <div class="tabs-wrapper">
        <div class="tabs-list" role="tablist" aria-label="Navegação entre escolhas">
            <TabItem v-for="tab in tabs" :key="tab.value" :label="tab.label" :active="tab.value === modelValue"
                @select="selectTab(tab.value)" />
        </div>
    </div>

    <div class="tabs-content">
        <slot />
    </div>
</template>

<style scoped>
.tabs-wrapper {
    position: relative;

}

.tabs-list {
    display: flex;
    gap: 0px;
    padding-bottom: 0;
    margin-bottom: 0;
    border-bottom: none;
    overflow-x: auto;
}

.tabs-content {
    border-top: 1px solid #e5e7eb;
    background-color: white;
    padding-top: 16px;
    padding-left: 4px;
    padding-right: 4px;
    padding-left: 16px;
    padding-right: 16px;
    padding-bottom: 16px;
    border-radius: 0 0 8px 8px;
    box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
}
</style>