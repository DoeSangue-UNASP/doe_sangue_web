<script setup lang="ts">
import { computed } from 'vue';
import { PhCheckCircle, PhWarningCircle } from '@phosphor-icons/vue';

export interface ToastProps {
    message: string;
    type: 'success' | 'error';
    duration?: number;
}

const props = defineProps<ToastProps>();
defineEmits<{
    close: [];
}>();

const icon = computed(() => {
    return {
        success: PhCheckCircle,
        error: PhWarningCircle,
    }[props.type];
});
</script>

<template>
    <div class="toast" :class="`toast-${type}`">
        <component :is="icon" size="24" weight="fill" />
        <p class="toast-message">{{ message }}</p>
    </div>
</template>

<style scoped>
.toast {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    animation: slideIn 0.3s ease-out;
    max-width: 400px;
}

.toast-success {
    background: rgba(34, 197, 94, 0.95);
    color: white;
}

.toast-error {
    background: rgba(220, 38, 38, 0.95);
    color: white;
}

.toast-message {
    margin: 0;
    font-size: 0.95rem;
    line-height: 1.4;
}

@keyframes slideIn {
    from {
        transform: translateX(400px);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes slideOut {
    from {
        transform: translateX(0);
        opacity: 1;
    }
    to {
        transform: translateX(400px);
        opacity: 0;
    }
}
</style>
