<template>
    <span :class="['badge', variantClass]">
        <slot></slot>
    </span>
</template>


<script setup lang="ts">
import { computed } from 'vue'


const props = defineProps({
    variant: {
        type: String,
        default: 'default',
    },
})


const variantClass = computed(() => {
    switch (props.variant) {
        case 'success':
            return 'badge-success'
        case 'warning':
            return 'badge-warning'
        case 'danger':
            return 'badge-danger'
        case 'info':
            return 'badge-info'
        default:
            return 'badge-default'
    }
})
</script>


<style scoped>
.badge {
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    text-transform: capitalize;
    border: 1px solid transparent;
}


.badge-default {
    background: #e5e7eb;
    color: #374151;
}


.badge-success {
    background: #2aa87a;
    color: #fff;
}


.badge-warning {
    background: #cf9a14;
    color: #fff;
}


.badge-danger {
    background: #bb3d3d;
    color: #fff;
}


.badge-info {
    background: #dbeafe;
    color: #1e40af;
}
</style>