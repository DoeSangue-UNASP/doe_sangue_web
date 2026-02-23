<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { PhCalendarDots, PhCaretLeft, PhCaretRight } from '@phosphor-icons/vue';
import IconButton from './IconButton.vue';


const props = defineProps<{
    id?: string;
    title: string;
    modelOpen?: boolean;
}>();

const emit = defineEmits<{
    (e: 'update:modelOpen', value: boolean): void;
}>();

const today = new Date();
const selectedDate = ref<string>(
    `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`
);
const isCalendarOpen = ref<boolean>(false);
const currentMonthIndex = ref<number>(today.getMonth());
const currentYear = ref<number>(today.getFullYear());

const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];


const navigateMonth = (direction: 'prev' | 'next'): void => {
    if (direction === 'next') {
        if (currentMonthIndex.value === 11) {
            currentMonthIndex.value = 0;
            currentYear.value++;
        } else {
            currentMonthIndex.value++;
        }
    } else {
        if (currentMonthIndex.value === 0) {
            currentMonthIndex.value = 11;
            currentYear.value--;
        } else {
            currentMonthIndex.value--;
        }
    }
};

const toggleCalendar = (): void => {
    isCalendarOpen.value = !isCalendarOpen.value;
};

const handleDateSelect = (day: number): void => {
    const month = (currentMonthIndex.value + 1).toString().padStart(2, '0');
    const dayStr = day.toString().padStart(2, '0');
    selectedDate.value = `${dayStr}/${month}/${currentYear.value}`;
    isCalendarOpen.value = false;
};


interface DayCell {
    day: number;
    isCurrentMonth: boolean;
    isToday: boolean;
    isSelected: boolean;
    hasEvent: boolean;
}

const calendarDays = computed<DayCell[]>(() => {
    const days: DayCell[] = [];
    const firstDayOfMonth = new Date(currentYear.value, currentMonthIndex.value, 1).getDay();
    const daysInMonth = new Date(currentYear.value, currentMonthIndex.value + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear.value, currentMonthIndex.value, 0).getDate();
    const daysToPrepend = firstDayOfMonth;
    const mockedEvents = new Set([5, 12, 21]);

    let selectedDayValue: number | null = null
    let selectedMonthIndexValue: number | null = null
    let selectedYearValue: number | null = null
    if (selectedDate.value && selectedDate.value.includes('/')) {
        const parts = selectedDate.value.split('/')
        if (parts.length === 3) {
            const d = parseInt(parts[0] as string, 10)
            const m = parseInt(parts[1] as string, 10)
            const y = parseInt(parts[2] as string, 10)
            if (!Number.isNaN(d) && !Number.isNaN(m) && !Number.isNaN(y)) {
                selectedDayValue = d
                selectedMonthIndexValue = m - 1
                selectedYearValue = y
            }
        }
    }

    for (let i = daysToPrepend - 1; i >= 0; i--) {
        days.push({
            day: daysInPrevMonth - i,
            isCurrentMonth: false,
            isToday: false,
            isSelected: false,
            hasEvent: false,
        });
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const isToday = (
            day === today.getDate() &&
            currentMonthIndex.value === today.getMonth() &&
            currentYear.value === today.getFullYear()
        );

        const isSelected = (
            selectedDayValue !== null &&
            day === selectedDayValue &&
            selectedMonthIndexValue === currentMonthIndex.value &&
            selectedYearValue === currentYear.value
        );

        days.push({
            day: day,
            isCurrentMonth: true,
            isToday: isToday,
            isSelected: isSelected,
            hasEvent: mockedEvents.has(day),
        });
    }

    for (let day = 1; days.length < 42; day++) {
        days.push({
            day: day,
            isCurrentMonth: false,
            isToday: false,
            isSelected: false,
            hasEvent: false,
        });
    }

    return days;
});

const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

watch(() => props.modelOpen, (value) => {
    if (typeof value === 'boolean') {
        isCalendarOpen.value = value;
    }
});

watch(isCalendarOpen, (value) => {
    emit('update:modelOpen', value);
});



</script>

<template>
    <div class="date-picker-wrapper poppins-medium">
        <label id="date-picker-label" class="poppins-regular">{{ title }}</label>
        <div class="date-input-container" @click="toggleCalendar">
            <input type="text" :value="selectedDate" class="date-input" placeholder="Selecione uma data" readonly />
            <span class="calendar-icon">
                <PhCalendarDots :size="32" />
            </span>
        </div>

        <div class="calendar-dropdown" v-if="isCalendarOpen">

            <div class="calendar-container">

                <div class="calendar-header">
                    <IconButton :icon="PhCaretLeft" secondary aria-label="Mês Anterior"
                        @click.stop="navigateMonth('prev')" />
                    <h2 class="current-month-year">
                        {{ monthNames[currentMonthIndex] }} {{ currentYear }}
                    </h2>
                    <IconButton :icon="PhCaretRight" secondary aria-label="Próximo Mês"
                        @click.stop="navigateMonth('next')" />
                </div>

                <div class="calendar-grid">

                    <div class="day-of-week-header">
                        <span v-for="day in daysOfWeek" :key="day" class="day-name">
                            {{ day }}
                        </span>
                    </div>

                    <div class="calendar-days">
                        <div v-for="(item, index) in calendarDays" :key="index" :class="[
                            'day-cell',
                            { 'non-current-month': !item.isCurrentMonth },
                            { 'today': item.isToday },
                            { 'selected': item.isSelected },
                            { 'has-event': item.hasEvent },
                        ]" @click="item.isCurrentMonth && handleDateSelect(item.day)">
                            {{ item.day }}
                        </div>
                    </div>

                </div>
            </div>

        </div>
    </div>
</template>

<style scoped>
.date-picker-wrapper {
    position: relative;
    width: 250px;
}

.date-input-container {
    position: relative;
    cursor: pointer;
    background-color: var(--font-button-primary);
    height: var(--input-height);
    margin: 8px 0;
}

.date-input {
    width: 100%;
    height: 100%;
    padding: 10px 44px 10px 10px;
    outline: none;
    font-size: 1em;
    border: 1px solid var(--input-border-color);
    border-radius: 8px;
    cursor: pointer;

}

.calendar-icon {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 1.2em;
    color: var(--font-color);
    display: flex;
    align-items: center;
    pointer-events: none;
}

.calendar-dropdown {
    position: absolute;
    z-index: 1000;
    top: calc(var(--input-height) + 5px);
    left: 0;

}

.calendar-container {
    max-width: 320px;
    width: 320px;
    border: 1px solid var(--calendar-border-color);
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    background-color: var(--form-color);
    padding: 15px;
}

.calendar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 1px solid var(--calendar-border-color);
}

.current-month-year {
    font-size: 1.1em;
    font-weight: bold;
    margin: 0;
}

.calendar-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 1px;
}

.day-of-week-header {
    grid-column: 1 / -1;
    display: contents;
}

.day-name {
    text-align: center;
    font-weight: bold;
    padding: 6px 0;
    font-size: 0.8em;
    color: var(--primary-color);
}

.calendar-days {
    grid-column: 1 / -1;
    display: contents;
}

.day-cell {
    text-align: center;
    padding: 8px 3px;
    min-height: 35px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    border-radius: 4px;
    transition: background-color 0.1s;
    font-size: 0.9em;
    position: relative;
    user-select: none;
}

.day-cell:hover:not(.non-current-month) {
    background-color: #f0f0f0;
}

.non-current-month {
    color: var(--day-inactive-color);
    opacity: 0.6;
    cursor: default;
}

.today {
    background-color: var(--today-bg-color);
    font-weight: bold;
    border: 1px solid var(--primary-color);
}

.selected {
    background-color: var(--primary-color);
    color: var(--font-button-primary);
    font-weight: bold;
}

.selected:hover {
    background-color: var(--selected-bg-color);
}

.has-event::after {
    content: '';
    position: absolute;
    bottom: 4px;
    left: 50%;
    transform: translateX(-50%);
    width: 4px;
    height: 4px;
    background-color: var(--event-dot-color);
    border-radius: 50%;
}
</style>