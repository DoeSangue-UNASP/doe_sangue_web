<script setup lang="ts">
import SkeletonBlock from './SkeletonBlock.vue';

defineProps<{
  isLoading?: boolean;
}>();
</script>

<template>
  <section class="map">
    <SkeletonBlock :is-loading="isLoading" width="100%" height="100%" border-radius="16px">
      <slot />
    </SkeletonBlock>
  </section>
</template>

<style scoped>
.map {
  background-color: lightgray;
  width: 100%;
  border-radius: 16px;
  min-height: 400px;
  overflow: hidden;
}
</style>