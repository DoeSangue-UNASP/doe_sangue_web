<script setup>
import { ref } from 'vue'
import { PhCaretLeft, PhCaretRight, PhFinnTheHuman, PhFunnel, PhPlus } from '@phosphor-icons/vue'

const props = defineProps({
    data: Array,
    columns: Array,
    pageSize: {
        type: Number,
        default: 10,
    }
})

import {
    useVueTable,
    FlexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel,
} from '@tanstack/vue-table'
import IconButton from './IconButton.vue'
import CustomInput from './CustomInput.vue'

const showingInput = ref(false)

function toggleInput() {
    showingInput.value = !showingInput.value
}

const data = ref(props.data)

const sorting = ref([])
const filter = ref('')
const pagination = ref({
    pageIndex: 0,
    pageSize: props.pageSize,
})

const table = useVueTable({
    data: data.value,
    columns: props.columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),

    state: {
        get sorting() {
            return sorting.value
        },
        get globalFilter() {
            return filter.value
        },
        get pagination() {
            return pagination.value
        },
    },

    onSortingChange: updaterOrValue => {
        sorting.value =
            typeof updaterOrValue === 'function'
                ? updaterOrValue(sorting.value)
                : updaterOrValue
    },

    onGlobalFilterChange: value => {
        filter.value = value
    },

    onPaginationChange: updaterOrValue => {
        pagination.value =
            typeof updaterOrValue === 'function'
                ? updaterOrValue(pagination.value)
                : updaterOrValue
    },
})
</script>

<template>
    <div class="container">
        <div class="table-wrapper">
            <div class="table-scroll">
                <div class="table-inner">
                    <div class="header-actions">
                        <IconButton :icon="PhPlus" />
                        <IconButton :icon="PhFunnel" @click="toggleInput" secondary />
                        <transition name="fade">
                            <CustomInput v-if="showingInput" placeholder="Pesquisar" v-model="filter" />
                        </transition>
                    </div>

                    <table class="table">
                        <thead>
                            <tr v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
                                <th v-for="header in headerGroup.headers" :key="header.id"
                                    :class="['table-header', { 'sortable': header.column.getCanSort() }]"
                                    @click="header.column.getToggleSortingHandler()?.($event)">
                                    <FlexRender :render="header.column.columnDef.header" :props="header.getContext()" />
                                    {{ { asc: '↑', desc: '↓' }[header.column.getIsSorted()] }}
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr v-for="row in table.getRowModel().rows" :key="row.id">
                                <td v-for="cell in row.getVisibleCells()" :key="cell.id" class="table-cell">
                                    <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="table-footer">
                <div class="pagination-info">
                    <div class="total-by-page">
                        {{ table.getPaginationRowModel().rows.length }}
                    </div>
                    resultados por página
                </div>
                <div class="pagination-actions">
                    <IconButton class="btn" :icon="PhCaretLeft" secondary :disabled="!table.getCanPreviousPage()"
                        @click="table.previousPage()" />
                    <IconButton class="btn" :icon="PhCaretRight" secondary :disabled="!table.getCanNextPage()"
                        @click="table.nextPage()" />
                </div>
            </div>
        </div>
    </div>
</template>

<style>
.container {
    padding-left: 16px;
    padding-right: 16px;
}

.table-wrapper {
    margin-top: 32px;
}

.table-scroll {
    overflow-x: auto;
    margin-left: -16px;
    margin-right: -16px;
}

.table-inner {
    min-width: 100%;
    padding: 16px;
}

.header-actions {
    margin: 16px 0;
    display: flex;
    justify-items: center;
    align-items: center;
    gap: 10px;
    justify-content: flex-end;

}

.table {
    width: 100%;
    border-collapse: collapse;
    border-spacing: 0;
}

.table thead tr {
    border-bottom: 1px solid #d1d5db;
}

.table-header {
    padding: 12px 8px;
    text-align: left;
    font-size: 14px;
    font-weight: 600;
    color: #111827;
}

.table-header.sortable {
    cursor: pointer;
    user-select: none;
}

.table tbody tr {
    border-bottom: 1px solid #e5e7eb;
}

.table-cell {
    padding: 12px 8px;
    font-size: 14px;
    color: #6b7280;
    white-space: nowrap;
}

.btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.table-footer {
    display: flex;
    align-items: center;
    justify-items: center;
    justify-content: space-between;
}

.pagination-info {
    display: flex;
    align-items: center;
    justify-items: center;
    gap: 10px;
    font-size: 14px;
}

.pagination-actions {
    display: flex;
    gap: 10px;
}

.total-by-page {
    border: solid 1px;
    border-color: #E0E0E0;
    padding: 5px 10px;
    border-radius: 5px;
}
</style>