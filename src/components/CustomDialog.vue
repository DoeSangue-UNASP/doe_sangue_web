<script setup lang="ts">
import { PhX } from '@phosphor-icons/vue';

defineProps<{
    modelValue: boolean;
}>();

const emit = defineEmits(["update:modelValue"]);

const close = () => {
    emit("update:modelValue", false);
}
</script>

<template>
    <teleport to="body">
        <transition name="fade">
            <div v-if="modelValue" class="overlay" @click="close"></div>
        </transition>

        <transition name="scale">
            <div v-if="modelValue" class="dialog">
                <header class="dialog-header">
                    <h2>
                        <slot name="header"></slot>
                    </h2>
                    <button class="close-btn" @click="close()">
                        <PhX size="25" />
                    </button>
                </header>

                <div class="dialog-body">
                    <slot />
                </div>

                <footer class="dialog-footer">
                    <slot name="footer" />
                </footer>
            </div>
        </transition>
    </teleport>
</template>

<style scoped>
.overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(2px);
}

.dialog {
    display: flex;
    flex-direction: column;
    gap: 20px;

    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    width: 500px;
    border-radius: 12px;
    padding: 16px;
    box-shadow: 0 12px 25px rgba(0, 0, 0, 0.2);
    z-index: 999;
}

.dialog-header {
    display: flex;
    justify-content: space-between;
    font-weight: bold;
    margin-bottom: 12px;

    color: var(--secondary-color);
}

.close-btn {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 18px;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity .2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.scale-enter-active,
.scale-leave-active {
    transition: transform .2s ease, opacity .2s ease;
}

.scale-enter-from,
.scale-leave-to {
    transform: scale(0.9);
    opacity: 0;
}
</style>
