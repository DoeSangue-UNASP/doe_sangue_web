import { ref } from 'vue';

export interface Toast {
    id: string;
    message: string;
    type: 'success' | 'error';
    duration: number;
}

const toasts = ref<Toast[]>([]);

export function useToast() {
    function addToast(message: string, type: 'success' | 'error' = 'success', duration: number = 3000) {
        const id = Date.now().toString();
        const toast: Toast = {
            id,
            message,
            type,
            duration,
        };

        toasts.value.push(toast);

        setTimeout(() => {
            removeToast(id);
        }, duration);

        return id;
    }

    function removeToast(id: string) {
        toasts.value = toasts.value.filter((t) => t.id !== id);
    }

    function sucesso(message: string, duration?: number) {
        return addToast(message, 'success', duration);
    }

    function erro(message: string, duration?: number) {
        return addToast(message, 'error', duration);
    }

    return {
        toasts,
        addToast,
        removeToast,
        sucesso,
        erro,
    };
}
