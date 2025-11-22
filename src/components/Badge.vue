<template>
    <span :class="['badge', variantClass]">
        <slot></slot>
    </span>
</template>


<script setup>
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
    background: #34d399;
    color: #fff;
}


.badge-warning {
    background: #FFCB00;
    color: #fff;
}


.badge-danger {
    background: #FF4B47;
    color: #fff;
}


.badge-info {
    background: #dbeafe;
    color: #1e40af;
}
</style>