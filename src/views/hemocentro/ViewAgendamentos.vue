<script setup lang="ts">
import { computed, ref } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import type { EventInput } from '@fullcalendar/core/index.js'
import ptBrLocale from '@fullcalendar/core/locales/pt-br'
import IconButton from '../../components/IconButton.vue'
import CustomInput from '../../components/CustomInput.vue'
import { PhFunnel, PhMagnifyingGlass, PhPlus, PhX } from '@phosphor-icons/vue'
import CustomDialog from '../../components/CustomDialog.vue'
import CustomButton from '../../components/CustomButton.vue'
import CustomDatePicker from '../../components/CustomDatePicker.vue'
import CustomDropdown from '../../components/CustomDropdown.vue'

const openCriarAgendamento = ref<boolean>(false);
const openCancelarAgendamento = ref<boolean>(false);
const showingInput = ref(false)
const filter = ref('')
const selectedTime = ref('')
const isDatePickerOpen = ref(false)
const isTimeDropdownOpen = ref(false)

const timeOptions = [
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00'
]

const toggleModalCriarAgendamento = () => {
  openCriarAgendamento.value = !openCriarAgendamento.value;
};

const toggleModalCancelarAgendamento = () => {
  openCancelarAgendamento.value = !openCancelarAgendamento.value;
}

const toggleInput = () => {
  showingInput.value = !showingInput.value
}

const handleDatePickerOpenChange = (value: boolean) => {
  isDatePickerOpen.value = value

  if (value) {
    isTimeDropdownOpen.value = false
  }
}

const handleTimeDropdownOpenChange = (value: boolean) => {
  isTimeDropdownOpen.value = value

  if (value) {
    isDatePickerOpen.value = false
  }
}

const events = ref<EventInput[]>([
  {
    id: '1',
    title: 'Joe Doe',
    start: '2026-02-23T08:00:00',
    end: '2026-02-23T08:40:00',
    extendedProps: {
      cpf: '123.567.890-12'
    }
  },
  {
    id: '2',
    title: 'Joe Doe',
    start: '2026-02-23T09:00:00',
    end: '2026-02-23T09:40:00',
    extendedProps: {
      cpf: '123.567.890-12'
    }
  },
  {
    id: '3',
    title: 'Joe Doe',
    start: '2026-02-23T11:00:00',
    end: '2026-02-23T11:40:00',
    extendedProps: {
      cpf: '123.567.890-12'
    }
  },
  {
    id: '4',
    title: 'Joe Doe',
    start: '2026-02-24T12:00:00',
    end: '2026-02-24T12:40:00',
    extendedProps: {
      cpf: '123.567.890-12'
    }
  },
  {
    id: '5',
    title: 'Joe Doe',
    start: '2026-02-25T09:00:00',
    end: '2026-02-25T09:40:00',
    extendedProps: {
      cpf: '123.567.890-12'
    }
  }
])

const filteredEvents = computed(() => {
  const currentFilter = filter.value.trim().toLowerCase()

  if (!currentFilter) {
    return events.value
  }

  return events.value.filter((event) => {
    const title = String(event.title ?? '').toLowerCase()
    const cpf = String(event.extendedProps?.cpf ?? '').toLowerCase()

    return (
      title.includes(currentFilter)
      || cpf.includes(currentFilter)
    )
  })
})

const calendarOptions = computed(() => ({
  plugins: [
    dayGridPlugin,
    timeGridPlugin,
    interactionPlugin,
    listPlugin
  ],
  initialView: 'timeGridWeek',
  locale: ptBrLocale,
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
  },
  buttonText: {
    today: 'Hoje',
    month: 'Mês',
    week: 'Semana',
    day: 'Dia',
    list: 'Lista'
  },
  allDaySlot: false,
  weekends: false,
  slotMinTime: '08:00:00',
  slotMaxTime: '17:00:00',
  slotDuration: '01:00:00',
  eventMinHeight: 52,
  nowIndicator: true,
  editable: true,
  dayHeaderFormat: { weekday: 'long' as const },
  events: filteredEvents.value
}))
</script>

<template>
  <div class="view-container">
    <header class="header">
      <h1>Agendamentos</h1>

      <div class="header-actions">
        <IconButton :icon="PhPlus" @click="toggleModalCriarAgendamento" />
        <IconButton :icon="PhFunnel" secondary @click="toggleInput" />

        <transition name="fade">
          <div v-if="showingInput" class="filter-input">
            <CustomInput id="filtrar-agendamentos" label="Pesquisar" placeholder="Pesquisar doador ou CPF"
              v-model="filter" />
          </div>
        </transition>
      </div>
    </header>

    <main class="calendar-container">
      <FullCalendar :options="calendarOptions">
        <template #eventContent="arg">
          <div class="event-content">
            <button type="button" class="event-cancel-btn" aria-label="Cancelar agendamento"
              @click.stop.prevent="toggleModalCancelarAgendamento">
              <PhX :size="12" weight="bold" />
            </button>
            <p class="event-title">{{ arg.event.title }}</p>
            <p v-if="arg.event.extendedProps?.cpf" class="event-subtitle">{{ arg.event.extendedProps?.cpf }}</p>
          </div>
        </template>
      </FullCalendar>
    </main>
  </div>

  <CustomDialog v-model="openCriarAgendamento" width="760px">
    <template #header>
      Criar Agendamento
    </template>
    <template #default>
      <div class="modal-content-search-row">
        <CustomInput class="modal-content-input" label="Pesquisar Doador" id="pesquisar-doador"
          placeholder="Pesquisar doador ou CPF" />
        <IconButton :icon="PhMagnifyingGlass" />
        <CustomButton class="modal-content-btn" secondary red-font-color label="Cadastrar doador" />
      </div>

      <div class="modal-content-schedule">
        <h3 class="modal-content-schedule-title">Selecione um horário</h3>

        <div class="modal-content-schedule-fields">
          <CustomDatePicker class="modal-content-datepicker" title="Dia" id="data-agendamento"
            v-model:model-open="isDatePickerOpen" @update:model-open="handleDatePickerOpenChange" />

          <CustomDropdown class="modal-content-time-select" title="Horário" label="Selecione" :options="timeOptions"
            v-model="selectedTime" v-model:model-open="isTimeDropdownOpen"
            @update:model-open="handleTimeDropdownOpenChange" />
        </div>
      </div>
    </template>
    <template #footer>
      <div class="modal-footer">
        <CustomButton class="modal-content-btn" label="Salvar" />
      </div>
    </template>
  </CustomDialog>

  <CustomDialog v-model="openCancelarAgendamento">
    <template #header>Confirmação de Cancelamento</template>
    <template #default>
      <p>Tem certeza que deseja cancelar o agendamento?</p>
    </template>
    <template #footer>
      <div class="modal-footer">
        <CustomButton class="modal-content-btn" label="Cancelar" secondary />
        <CustomButton class="modal-content-btn" label="Confirmar" />
      </div>
    </template>
  </CustomDialog>
</template>

<style scoped>
.view-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.header-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  min-height: 45px;
}

.filter-input {
  width: 260px;
}

.filter-input :deep(label) {
  display: none;
}

.calendar-container {
  width: 100%;
  flex: 1;
  min-height: 0;
  border-radius: 8px;
  padding: 8px;
}

.calendar-container :deep(.fc) {
  height: 100%;
  --fc-today-bg-color: color-mix(in srgb, var(--secondary-color) 4%, white);
  --fc-now-indicator-color: var(--primary-color);
}

.calendar-container :deep(.fc .fc-day-today) {
  background-color: var(--fc-today-bg-color) !important;
}

.calendar-container :deep(.fc .fc-timegrid-now-indicator-line) {
  border-top-width: 3px;
}

.calendar-container :deep(.fc .fc-timegrid-now-indicator-arrow) {
  border-top-width: 7px;
  border-bottom-width: 7px;
  border-left-width: 10px;
}

.calendar-container :deep(.fc-scrollgrid) {
  border-radius: 8px;
}

.calendar-container :deep(.fc .fc-toolbar) {
  gap: 10px;
}

.calendar-container :deep(.fc .fc-toolbar-chunk) {
  display: flex;
  align-items: center;
  gap: 8px;
}

.calendar-container :deep(.fc .fc-toolbar-chunk:first-child) {
  flex-wrap: nowrap;
  white-space: nowrap;
}

.calendar-container :deep(.fc .fc-toolbar-title) {
  font-size: medium;
  color: var(--font-light-color);
}

.calendar-container :deep(.fc .fc-button-group) {
  display: flex;
  gap: 8px;
}

.calendar-container :deep(.fc .fc-button-group > .fc-button) {
  border-radius: 8px;
}

.calendar-container :deep(.fc .fc-button-primary) {
  height: 45px;
  border-radius: 8px;
  border: 1px solid var(--font-color);
  background-color: var(--button-secondary);
  color: var(--font-color);
  font-family: "Poppins", sans-serif;
  font-weight: 500;
  text-transform: none;
  box-shadow: none;
  transition: 0.25s ease;
}

.calendar-container :deep(.fc .fc-button-primary:hover) {
  background-color: var(--button-secondary-hover);
  color: var(--secondary-color);
  border-color: var(--secondary-color);
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.15);
  transform: translateY(-1px);
}

.calendar-container :deep(.fc .fc-button-primary:focus) {
  box-shadow: none;
}

.calendar-container :deep(.fc .fc-button-primary.fc-button-active) {
  background-color: var(--secondary-color);
  color: var(--button-secondary-hover);
  border: none;
}

.calendar-container :deep(.fc .fc-button-primary:disabled) {
  opacity: 0.5;
}

.calendar-container :deep(.fc .fc-timegrid-axis-cushion),
.calendar-container :deep(.fc .fc-timegrid-slot-label-cushion) {
  font-size: 12px;
  color: var(--font-color);
}

.calendar-container :deep(.fc .fc-col-header-cell-cushion) {
  font-size: 12px;
  color: var(--font-color);
  text-transform: capitalize;
  padding: 12px 0;
}

.calendar-container :deep(.fc .fc-timegrid-slot) {
  height: 52px;
}

.calendar-container :deep(.fc .fc-timegrid-event) {
  height: 100%;
  border: none;
  border-radius: 8px;
  overflow: hidden;
  background-color: color-mix(in srgb, var(--secondary-color) 30%, white)
}

.calendar-container :deep(.fc .fc-event-main) {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  border-radius: 8px;
  padding: 4px 8px 4px 24px;
  overflow: hidden;
}

.calendar-container :deep(.event-content) {
  position: relative;
}

.calendar-container :deep(.event-cancel-btn) {
  position: absolute;
  top: 2px;
  right: 2px;
  width: 18px;
  height: 18px;
  border: none;
  border-radius: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  line-height: 1;
  background-color: var(--secondary-color);
  color: var(--button-secondary);
  cursor: pointer;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
}

.calendar-container :deep(.fc .fc-timegrid-event:hover .event-cancel-btn) {
  opacity: 1;
  pointer-events: auto;
}

.calendar-container :deep(.fc .fc-event-main)::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 18px;
  background-color: var(--secondary-color);
}

.calendar-container :deep(.fc .fc-event-time) {
  display: none;
}

.calendar-container :deep(.event-title) {
  font-size: 14px;
  line-height: 18px;
  color: var(--font-color);
}

.calendar-container :deep(.event-subtitle) {
  font-size: 12px;
  line-height: 14px;
  color: var(--font-color);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.modal-content-input {
  width: 350px;
}

.modal-content-search-row {
  width: 100%;
  display: flex;
  align-items: flex-end;
  gap: 12px;
}

.modal-content-btn {
  width: 150px;
}

.modal-content-schedule {
  margin-top: 40px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.modal-content-schedule-title {
  font-size: large;
  color: var(--font-color);
}

.modal-content-schedule-fields {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 24px;
}

.modal-content-datepicker {
  width: 250px;
}

.modal-content-time-select {
  width: 250px;
}

.modal-footer {
  margin-left: auto;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 20px;
}
</style>