<script setup lang="ts">
import { ref } from 'vue';

defineProps<{
  label: string;
  options: string[];
  secondary?: boolean;
  redFontColor?: boolean;
}>();

const isOpen = ref(false);

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};
</script>

<template>
  <div class="dropdown">
    <button 
      @click="toggleDropdown"
      :class="{ 'btn-secondary': secondary, 'red-font-color': redFontColor }" 
      class="poppins-medium"
    >
      {{ label }}
    </button>

    <ul v-if="isOpen" class="dropdown-menu">
      <li v-for="(option, index) in options" :key="index" class="dropdown-item">
        {{ option }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
.dropdown {
  position: relative;
  width: 100%;
}

button {
  width: 100%;
  height: 45px;
  background-color: var(--primary-color);
  color: var(--font-button-primary);
  border-radius: 16px;
  border: none;
  transition: 0.5s;
}

button:hover {
  transition: 0.5s;
  cursor: pointer;
  background-color: var(--button-hover);
}

.btn-secondary {
  background-color: var(--button-secondary);
  color: var(--font-color);
  border: 1px solid;
  border-color: var(--input-border-color);
}

.btn-secondary:hover {
  background-color: var(--button-primary);
  color: var(--font-button-primary);
}

.red-font-color {
  color: var(--primary-color);
}

.dropdown-menu {
  position: absolute;
  top: 50px;
  left: 0;
  width: 100%;
  background-color: var(--button-secondary);
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  list-style: none;
  padding: 8px 0;
  margin: 0;
}

.dropdown-item {
  padding: 10px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.dropdown-item:hover {
  background-color: var(--button-hover);
  color: var(--font-button-primary);
}
</style>
