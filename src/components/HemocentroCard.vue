<script setup lang="ts">
import { PhDropSimple, PhMapPin, PhTrafficSign } from '@phosphor-icons/vue';
import IconButton from './IconButton.vue';
import SkeletonBlock from './SkeletonBlock.vue';

interface Hemocentro {
  nomeHemocentro: string;
  tipo: string;
  endereco: string;
  distanciaKm?: number;
}

defineProps<{
  hemocentro?: Hemocentro;
  isLoading?: boolean;
  onRouteClick?: () => void;
}>();
</script>

<template>
  <div class="card-hemocentro">
    <div class="nome-hemocentro">
      <PhDropSimple v-if="!isLoading" size="25" color="var(--primary-color)" />
      <SkeletonBlock :is-loading="isLoading" width="26px" height="26px" border-radius="50%" />
      <SkeletonBlock :is-loading="isLoading" width="180px" height="22px">
        <p>{{ hemocentro?.nomeHemocentro }}</p>
      </SkeletonBlock>
    </div>

    <SkeletonBlock :is-loading="isLoading" width="150px" height="20px">
      <div class="tipo">{{ hemocentro?.tipo }}</div>
    </SkeletonBlock>

    <SkeletonBlock :is-loading="isLoading" width="120px" height="20px">
      <p v-if="hemocentro?.distanciaKm !== undefined" class="distancia">
        {{ hemocentro.distanciaKm.toFixed(1) }} km
      </p>
    </SkeletonBlock>

    <div class="endereco">
      <PhMapPin v-if="!isLoading" size="25" />
      <SkeletonBlock :is-loading="isLoading" width="26px" height="26px" border-radius="50%" />
      <SkeletonBlock :is-loading="isLoading" width="280px" height="20px">
        <p>{{ hemocentro?.endereco }}</p>
      </SkeletonBlock>
      <SkeletonBlock :is-loading="isLoading" width="45px" height="45px" border-radius="8px">
        <IconButton :icon="PhTrafficSign" secondary :click="onRouteClick" />
      </SkeletonBlock>
    </div>
  </div>
</template>

<style scoped>
.nome-hemocentro {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.endereco {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.card-hemocentro {
  display: flex;
  flex-direction: column;
  text-align: center;
  padding: 10px
}

.tipo {
  margin: 0 auto;
}

.distancia {
  color: var(--secondary-color);
  margin: 0 auto;
}
</style>