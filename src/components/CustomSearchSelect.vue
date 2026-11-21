<script setup lang="ts">
import { computed, ref } from 'vue';
import { PhCaretDown } from '@phosphor-icons/vue';

type Option = { value: string; label: string; description?: string };

const props = defineProps<{
    id: string;
    label: string;
    placeholder?: string;
    options: Option[];
    emptyText?: string;
}>();

const modelValue = defineModel<string>();

const aberto = ref(false);
const busca = ref('');

const normalizar = (texto: string) => texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const apenasDigitos = (texto: string) => texto.replace(/\D/g, '');

const selecionada = computed(() => props.options.find(opcao => opcao.value === modelValue.value));

// A busca considera o texto (nome) e, quando há dígitos, também o documento da descrição
const filtradas = computed(() => {
    const termo = normalizar(busca.value.trim());
    const digitos = apenasDigitos(busca.value);
    if (!termo) return props.options;

    return props.options.filter(opcao =>
        normalizar(opcao.label).includes(termo) ||
        (digitos.length > 0 && apenasDigitos(opcao.description ?? '').includes(digitos))
    );
});

const abrir = () => {
    aberto.value = true;
    busca.value = '';
};

const fechar = () => {
    aberto.value = false;
    busca.value = '';
};

const selecionar = (opcao: Option) => {
    modelValue.value = opcao.value;
    fechar();
};

// Texto exibido: o que está sendo digitado ou o item selecionado
const textoExibido = computed(() => aberto.value ? busca.value : selecionada.value?.label ?? '');
</script>

<template>
    <div class="search-select poppins-regular" @focusout="(e: FocusEvent) => { if (!(e.currentTarget as HTMLElement).contains(e.relatedTarget as Node)) fechar(); }">
        <label :for="id">{{ label }}</label>

        <div class="search-select-field" :class="{ open: aberto }">
            <input :id="id" class="poppins-regular" type="text" autocomplete="off" :value="textoExibido"
                :placeholder="selecionada && !aberto ? '' : placeholder" @focus="abrir" @click="abrir"
                @input="busca = ($event.target as HTMLInputElement).value" @keydown.esc="fechar" />
            <PhCaretDown class="arrow" :class="{ rotate: aberto }" :size="20" />
        </div>

        <ul v-if="aberto" class="search-select-list" tabindex="-1">
            <li v-for="opcao in filtradas" :key="opcao.value" tabindex="0"
                :class="{ selected: opcao.value === modelValue }" @mousedown.prevent="selecionar(opcao)"
                @keydown.enter.prevent="selecionar(opcao)">
                <span class="option-label">{{ opcao.label }}</span>
                <span v-if="opcao.description" class="option-description">{{ opcao.description }}</span>
            </li>
            <li v-if="filtradas.length === 0" class="empty">{{ emptyText ?? 'Nenhum resultado' }}</li>
        </ul>
    </div>
</template>

<style scoped>
.search-select {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.search-select-field {
    position: relative;
}

.search-select-field input {
    width: 100%;
    height: 40px;
    border-radius: 8px;
    border: 1px solid var(--input-border-color);
    padding: 0 40px 0 16px;
    background-color: white;
}

.search-select-field input:focus,
.search-select-field.open input {
    outline: none;
    border-color: var(--primary-color);
}

.arrow {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #070E4D;
    pointer-events: none;
    transition: transform 0.3s ease;
}

.arrow.rotate {
    transform: translateY(-50%) rotate(180deg);
}

.search-select-list {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    width: 100%;
    z-index: 100;
    max-height: 220px;
    overflow-y: auto;
    margin: 0;
    padding: 0;
    list-style: none;
    background: white;
    border: 1px solid var(--input-border-color);
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.search-select-list li {
    display: flex;
    flex-direction: column;
    padding: 10px 16px;
    cursor: pointer;
    font-size: 14px;
    color: var(--font-color);
    transition: background-color 0.2s;
}

.search-select-list li:hover,
.search-select-list li:focus {
    outline: none;
    background-color: #c2bfd8;
    color: black;
}

.search-select-list li.selected {
    background-color: #0c1452;
    color: #fff;
}

.option-label {
    font-weight: 500;
}

.option-description {
    font-size: 12px;
    opacity: 0.75;
}

.search-select-list li.empty {
    cursor: default;
    color: #6b7280;
}

.search-select-list li.empty:hover {
    background: transparent;
}
</style>
