<script setup lang="ts">
import { h, onBeforeUnmount, onMounted, ref, render, watch } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { PhHouse, PhHospital, PhMapPin } from '@phosphor-icons/vue';
import type { Coordenada, HemocentroProximo } from '../types/hemocentro';

const props = defineProps<{
  userLocation: Coordenada | null;
  points: HemocentroProximo[];
  selectedPointId: string | null;
  focusSelectionToken: number;
}>();

const emit = defineEmits<{
  (event: 'select-point', pointId: string): void;
}>();

const mapContainer = ref<HTMLElement | null>(null);
let map: L.Map | null = null;
let markersLayer: L.LayerGroup | null = null;
let routeLayer: L.Polyline | null = null;
let routeRequestVersion = 0;

const INITIAL_ZOOM = 15;
const SELECTED_ZOOM = 17;
const FIT_BOUNDS_MAX_ZOOM = 16;

const iconToMarkup = (iconComponent: typeof PhHouse, color: string) => {
  const container = document.createElement('div');
  render(h(iconComponent, { size: 20, color, weight: 'fill' }), container);
  const markup = container.innerHTML;
  render(null, container);
  return markup;
};

const criarIconeUsuario = () => {
  return L.divIcon({
    className: 'leaflet-ph-marker-wrapper',
    html: `<div class="leaflet-ph-marker marker-user">${iconToMarkup(PhHouse, '#070E4D')}</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  });
};

const criarIconeHemocentro = () => {
  return L.divIcon({
    className: 'leaflet-ph-marker-wrapper',
    html: `<div class="leaflet-ph-marker marker-hospital">${iconToMarkup(PhHospital, '#B20000')}</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  });
};

const criarIconeSelecionado = () => {
  return L.divIcon({
    className: 'leaflet-ph-marker-wrapper',
    html: `<div class="leaflet-ph-marker marker-selected">${iconToMarkup(PhMapPin, '#B20000')}</div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 17]
  });
};

const renderMarkers = () => {
  if (!map || !markersLayer) {
    return;
  }

  markersLayer.clearLayers();

  if (props.userLocation) {
    const userMarker = L.marker([props.userLocation.latitude, props.userLocation.longitude], {
      icon: criarIconeUsuario()
    }).bindPopup('Sua localização');

    userMarker.addTo(markersLayer);
  }

  props.points.forEach(point => {
    const isSelected = point.id === props.selectedPointId;

    const marker = L.marker([point.latitude, point.longitude], {
      icon: isSelected ? criarIconeSelecionado() : criarIconeHemocentro()
    }).bindPopup(`<strong>${point.nomeHemocentro}</strong><br/>${point.endereco}`);

    marker.on('click', () => {
      emit('select-point', point.id);
    });

    marker.addTo(markersLayer);
  });
};

const centralizarMapa = () => {
  if (!map || !props.userLocation) {
    return;
  }

  map.setView([props.userLocation.latitude, props.userLocation.longitude], INITIAL_ZOOM);
};

const ajustarParaPontosDaPagina = () => {
  if (!map) {
    return;
  }

  const bounds = L.latLngBounds([]);

  if (props.userLocation) {
    bounds.extend([props.userLocation.latitude, props.userLocation.longitude]);
  }

  props.points.forEach(point => {
    bounds.extend([point.latitude, point.longitude]);
  });

  if (!bounds.isValid()) {
    return;
  }

  map.fitBounds(bounds, {
    padding: [40, 40],
    maxZoom: FIT_BOUNDS_MAX_ZOOM
  });
};

const ajustarParaUsuarioEDestino = (destino: HemocentroProximo) => {
  if (!map || !props.userLocation) {
    return;
  }

  const bounds = L.latLngBounds([
    [props.userLocation.latitude, props.userLocation.longitude],
    [destino.latitude, destino.longitude]
  ]);

  map.fitBounds(bounds, {
    padding: [40, 40],
    maxZoom: FIT_BOUNDS_MAX_ZOOM
  });
};

const limparRota = () => {
  if (!map || !routeLayer) {
    return;
  }

  map.removeLayer(routeLayer);
  routeLayer = null;
};

interface OsrmRoute {
  geometry?: {
    coordinates?: [number, number][];
  };
}

interface OsrmResponse {
  routes?: OsrmRoute[];
}

const desenharRotaSelecionada = async () => {
  if (!map || !props.userLocation || !props.selectedPointId) {
    limparRota();
    return;
  }

  const selectedPoint = props.points.find(point => point.id === props.selectedPointId);

  if (!selectedPoint) {
    limparRota();
    return;
  }

  const currentRequestVersion = ++routeRequestVersion;

  const origem = `${props.userLocation.longitude},${props.userLocation.latitude}`;
  const destino = `${selectedPoint.longitude},${selectedPoint.latitude}`;
  const routeUrl = `https://router.project-osrm.org/route/v1/driving/${origem};${destino}?overview=full&geometries=geojson`;

  try {
    const response = await fetch(routeUrl);

    if (!response.ok) {
      limparRota();
      ajustarParaUsuarioEDestino(selectedPoint);
      return;
    }

    const data = (await response.json()) as OsrmResponse;

    if (currentRequestVersion !== routeRequestVersion) {
      return;
    }

    const coordinates = data.routes?.[0]?.geometry?.coordinates;

    if (!coordinates?.length) {
      limparRota();
      ajustarParaUsuarioEDestino(selectedPoint);
      return;
    }

    const latLngs = coordinates.map(([longitude, latitude]) => [latitude, longitude] as [number, number]);

    limparRota();

    routeLayer = L.polyline(latLngs, {
      color: 'var(--primary-color)',
      weight: 4,
      opacity: 0.85
    }).addTo(map);

    map.fitBounds(routeLayer.getBounds(), {
      padding: [40, 40],
      maxZoom: 16
    });
  } catch {
    limparRota();
    ajustarParaUsuarioEDestino(selectedPoint);
  }
};

onMounted(() => {
  if (!mapContainer.value) {
    return;
  }

  map = L.map(mapContainer.value, {
    zoomControl: true,
    attributionControl: true
  });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  markersLayer = L.layerGroup().addTo(map);

  ajustarParaPontosDaPagina();
  renderMarkers();
});

watch(
  () => props.userLocation,
  () => {
    limparRota();
    ajustarParaPontosDaPagina();
    renderMarkers();
  },
  { deep: true }
);

watch(
  () => props.points,
  () => {
    limparRota();
    ajustarParaPontosDaPagina();
    renderMarkers();
  },
  { deep: true }
);

watch(
  () => props.selectedPointId,
  () => {
    renderMarkers();
  }
);

watch(
  () => props.focusSelectionToken,
  () => {
    desenharRotaSelecionada();
  }
);

onBeforeUnmount(() => {
  if (map) {
    limparRota();
    map.remove();
    map = null;
    markersLayer = null;
  }
});
</script>

<template>
  <div ref="mapContainer" class="map-container" />
</template>

<style scoped>
.map-container {
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 1;
}

:deep(.leaflet-ph-marker-wrapper) {
  background: transparent;
  border: none;
}

:deep(.leaflet-ph-marker) {
  width: 30px;
  height: 30px;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--input-border-color);
  background-color: #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

:deep(.leaflet-ph-marker.marker-user) {
  border-color: var(--secondary-color);
}

:deep(.leaflet-ph-marker.marker-hospital) {
  border-color: var(--primary-color);
}

:deep(.leaflet-ph-marker.marker-selected) {
  width: 34px;
  height: 34px;
  border-color: var(--primary-color);
}

:deep(.leaflet-top),
:deep(.leaflet-bottom),
:deep(.leaflet-control) {
  z-index: 900;
}
</style>