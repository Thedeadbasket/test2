<template>
  <DatePickerComp @update:selectedDate="handleDateChange"/>
  <p>Ausgewählte Kalendar Woche {{ weekNumber }}</p>

  <div class="role-staffing-plan">
    <h1>Staffingplan</h1>

    <div class="controls" style="margin-bottom:1rem;">
      <label>
        Zeitraum-Typ:
        <select v-model="periodType">
          <option value="weeks">Kalenderwochen</option>
        </select>
      </label>

      <label style="margin-left:1rem;">
        Anzahl:
        <input
            type="number"
            min="1"
            v-model.number="periodValue"
            style="width: 60px;"
        />
      </label>
    </div>

    <div class="table-wrapper">
      <table>
        <thead>
        <tr>
          <th>Rolle / Zeitraum</th>
          <th v-for="label in displayedLabels" :key="label.key" class="date-header">
            {{ label.text }}
          </th>
          <th class="total-header">Total Staffed</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="role in roles" :key="role.track">
          <td class="role-cell-auto">
            <div class="role-display-auto">
              <div
                  class="color-dot"
                  :style="{ backgroundColor: role.color || '#3498db' }"
                  :title="`Track-Farbe: ${role.color || '#3498db'}`"
              ></div>
              <span class="role-name-auto" :title="role.track">{{ role.track }}</span>
            </div>
          </td>
          <td v-for="label in displayedLabels" :key="label.key" class="cell">
            <input
                type="number"
                min="0"
                step="0.5"
                v-model.number="schedule[role.track][label.key]"
                @input="validateValue(role, label.key)"
                class="number-input"
            />
          </td>
          <td class="total-cell">
            {{ getTrackTotal(role.track) }}
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { getTracks } from '@/service/GetTracks'
import DatePickerComp from "@/components/DatePickerComp.vue";
import { getWeek } from "@/service/GetCW";
import {EstimationCalc} from "@/service/EstimationCalc";
import {SaveKW} from "@/service/SaveKW";
import {PatchData} from "@/service/PatchData"
import {DeltaCalc} from "@/service/DeltaCalc";

const lol = ref([])
const selectedDateFromChild = ref(null);

function handleDateChange(date) {
  selectedDateFromChild.value = date;
  console.log('Datum aus Kind-Komponente:', date);
}

const weekNumber = computed(() => {
  return selectedDateFromChild.value ? getWeek(selectedDateFromChild.value) : ''
})

const roles = ref(getTracks())

const periodType = ref('weeks')
const periodValue = ref(4)
const schedule = reactive({})

function getWeekNumber(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7)
  return { year: d.getUTCFullYear(), week: weekNo }
}

function getNextWeeks(numWeeks) {
  const weeks = []
  const today = selectedDateFromChild.value || new Date()
  const currentMonday = new Date(today)
  const day = currentMonday.getDay() || 7
  currentMonday.setDate(currentMonday.getDate() - day + 1)

  for (let i = 0; i < numWeeks; i++) {
    const weekStart = new Date(currentMonday)
    weekStart.setDate(weekStart.getDate() + i * 7)
    const { year, week } = getWeekNumber(weekStart)
    const key = `${year}-KW${week.toString().padStart(2, '0')}`
    const text = `KW${week.toString().padStart(2, '0')}/${year}`
    weeks.push({ key, text })
  }
  return weeks
}

const displayedLabels = computed(() => {
  if (periodType.value === 'weeks') {
    return getNextWeeks(periodValue.value)
  }

  return []
})

// Function to calculate total staffed for a track
function getTrackTotal(track) {
  if (!schedule[track]) return 0;

  return displayedLabels.value.reduce((total, label) => {
    const value = schedule[track][label.key] || 0;
    return total + value;
  }, 0);
}

function initializeSchedule() {
  // Alte Daten löschen
  Object.keys(schedule).forEach(key => delete schedule[key])

  roles.value.forEach(role => {
    schedule[role.track] = {}
    displayedLabels.value.forEach(({ key }) => {
      schedule[role.track][key] = 0
    })
  })
}

function saveSchedule() {
  const filteredSchedule = {}

  for (const roleKey in schedule) {
    filteredSchedule[roleKey] = {}
    for (const periodKey in schedule[roleKey]) {
      const val = schedule[roleKey][periodKey]
      if (val > 0) {
        filteredSchedule[roleKey][periodKey] = val
      }
    }
    if (Object.keys(filteredSchedule[roleKey]).length === 0) {
      delete filteredSchedule[roleKey]
    }
  }

  sessionStorage.setItem('schedule', JSON.stringify(filteredSchedule))

  SaveKW(lol.value)
  PatchData()
}

function loadSchedule() {
  const stored = sessionStorage.getItem('schedule')
  if (!stored) return

  const loaded = JSON.parse(stored)
  console.log(stored)

  initializeSchedule()

  for (const roleKey in schedule) {
    for (const label of displayedLabels.value) {
      schedule[roleKey][label.key] = (loaded[roleKey] && loaded[roleKey][label.key]) ?? 0
    }
  }
}

function validateValue(role, key) {
  let val = schedule[role.track][key]
  if (val < 0 || isNaN(val)) {
    schedule[role.track][key] = 0
  } else {
    schedule[role.track][key] = Math.round(val * 2) / 2
  }

  saveSchedule()
}

watch([periodType, periodValue, displayedLabels], () => {
  initializeSchedule()
  loadSchedule()
}, { immediate: true })

watch(() => sessionStorage.getItem('tracksData'), () => {
  roles.value = getTracks()
  initializeSchedule()
  loadSchedule()
}, { immediate: false })

watch(roles, () => {
  initializeSchedule()
  loadSchedule()
}, { immediate: true })

onMounted(() => {
  const tracksraw = sessionStorage.getItem('tracksData');
  if (!tracksraw) return;
  lol.value = JSON.parse(tracksraw);
  SaveKW(lol.value)
  initializeSchedule()
  DeltaCalc()

  loadSchedule()

})
</script>

<style scoped>
.role-staffing-plan {
  max-width: 100vw;
  padding: 0.5rem;
  font-family: Arial, sans-serif;
  overflow-x: auto;
  font-size: 0.75rem;
}

h1 {
  text-align: center;
  margin-bottom: 0.5rem;
}

.controls {
  margin-bottom: 0.5rem;
  text-align: center;
}

select,
input[type='number'] {
  font-size: 0.8rem;
  padding: 0.15rem 0.3rem;
}

.table-wrapper {
  overflow-x: auto;
}

table {
  border-collapse: collapse;
  width: 100%;
  min-width: 500px;
  table-layout: auto; /* Ermöglicht dynamische Spaltenbreiten */
}

.number-input::-webkit-outer-spin-button,
.number-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.number-input[type='number'] {
  -moz-appearance: textfield;
}

th,
td {
  border: 1px solid #ccc;
  padding: 3px 5px;
  text-align: center;
  vertical-align: middle;
  white-space: nowrap;
}

/* OPTION 4: Flexibles Auto-System für Rollen-Spalte */
.role-cell-auto {
  width: max-content;
  min-width: 30px;
  max-width: 100px;
  padding: 2px 6px;
  overflow: hidden;
  text-align: left;
  font-weight: 600;
  background-color: transparent;
  white-space: nowrap;
}

.role-display-auto {
  display: flex;
  align-items: center;
  gap: 3px;
  max-width: 100%;
}

.color-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: 1px solid #ddd;
  flex-shrink: 0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.role-name-auto {
  font-size: 0.7rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 80px;
  flex: 1;
}

/* Erste Spalte (Rollen) soll minimal sein */
table th:first-child,
table td:first-child {
  width: 1%; /* Wird automatisch auf minimale benötigte Breite erweitert */
}

.date-header {
  padding: 8px 2px;
  width: 35px;
  min-width: 35px;
  user-select: none;
  font-size: 0.7rem;
}

.total-header {
  padding: 8px 2px;
  width: auto;
  min-width: max-content;
  user-select: none;
  font-size: 0.7rem;
  font-weight: bold;
  background-color: #f5f5f5;
  border-left: 2px solid #ddd;
}

.number-input {
  width: 35px;
  font-size: 0.7rem;
  text-align: center;
  padding: 1px 2px;
}

.cell {
  padding: 2px 3px;
}

.total-cell {
  padding: 2px 2px;
  font-weight: bold;
  background-color: #f9f9f9;
  border-left: 2px solid #ddd;
  color: #333;
  font-size: 0.7rem;
  width: 5px;

}
</style>