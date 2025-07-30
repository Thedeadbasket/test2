<script setup>
import { ref, watch } from 'vue';
import DatePicker from 'primevue/datepicker';


// emit definieren
const emit = defineEmits(['update:selectedDate']);

const selectedDate = ref(null);

// Wenn sich selectedDate ändert, emitten wir das Event
watch(selectedDate, (newVal) => {
  emit('update:selectedDate', newVal);
});
</script>

<template>
  <div class="card flex flex-col items-center">
    <DatePicker v-model="selectedDate" dateFormat="dd/mm/yy" />

  </div>
</template>
