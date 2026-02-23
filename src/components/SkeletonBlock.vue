<script setup lang="ts">
withDefaults(defineProps<{
  isLoading?: boolean;
  width?: string;
  height?: string;
  borderRadius?: string;
}>(), {
  isLoading: false,
  width: '100%',
  height: '16px',
  borderRadius: '8px'
});
</script>

<template>
  <slot v-if="!isLoading" />
  <span v-else class="skeleton" :style="{ width, height, borderRadius }" aria-hidden="true" />
</template>

<style scoped>
.skeleton {
  display: block;
  background: linear-gradient(90deg,
      var(--input-border-color) 25%,
      #ececec 50%,
      var(--input-border-color) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }

  100% {
    background-position: -200% 0;
  }
}
</style>