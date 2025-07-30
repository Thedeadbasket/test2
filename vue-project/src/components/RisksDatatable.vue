<template>
  <div class="card">
    <DataTable
        :value="customers"
        rowGroupMode="rowspan"
        sortMode="single"
        :sortOrder="1"
        show-gridlines
        tableStyle="min-width: 50rem"
        editMode="cell"
        @cell-edit-complete="onCellEditComplete"
    >
      <Column header="#" headerStyle="width:3rem">
        <template #body="slotProps">
          {{ slotProps.index + 1 }}
        </template>
      </Column>

      <Column
          v-for="col in columns"
          :key="col.field"
          :field="col.field"
          :header="col.header"
          style="width: 17%"
      >
        <template v-if="col.editable" #editor="{ data, field }">
          <InputText
              v-model="data[field]"
              autofocus
              fluid
              @keydown.enter="$event.target.blur()"
          />
        </template>
      </Column>


      <!-- Read-only riskbuffer column -->
      <Column field="riskbuffer" header="Riskbuffer">
        <template #body="slotProps">
          {{ slotProps.data.riskbuffer }}
        </template>
      </Column>

      <Column header="Affected Track" field="track">
        <template #editor="{ data, field }">
          <Select
              v-model="data[field]"
              :options="tracks"
              option-label="track"
              option-value="track"
              placeholder="Select Track"
              :max-selected-labels="1"
          />
        </template>
      </Column>

      <Column header="Actions" headerStyle="width:5rem">
        <template #body="slotProps">
          <Button
              icon="pi pi-trash"
              class="p-button-rounded p-button-danger p-button-text p-button-sm"
              @click="deleteRow(slotProps.data.id)"
              :disabled="customers.length <= 1"
          />
        </template>
      </Column>
    </DataTable>

    <div style="margin-top: 1rem;">
      <Button
          @click="addEpic"
          icon="pi pi-plus"
          label="Add Row"
          class="p-button-sm"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Select from 'primevue/select';
import InputText from 'primevue/inputtext';
import { PatchData } from '@/service/PatchData';
import { RiskCalc } from '@/service/RiskCalc';

const savedName = ref('');
const SaveId = computed(() => savedName.value);
const customers = ref([]);
const selectedTrack = ref();

const tracks = ref([]);

const columns = ref([
  { field: 'objectiveRisk', header: 'Objective Risk', editable: true },
  { field: 'impactInDays', header: 'Impact [Days]', editable: true },
  { field: 'likelihoodInPercent', header: 'Likelihood [%]', editable: true },
  { field: 'teamMultiplier', header: 'Team Multiplier', editable: true },
]);

const generateId = () => {
  return Date.now() + Math.random();
};

const addEpic = () => {
  const newEpic = {
    id: generateId(),
    objectiveRisk: '',
    impactInDays: '',
    likelihoodInPercent: '',
    teamMultiplier: '',
    riskbuffer: 0,
    track: ''
  };

  customers.value.push(newEpic);
  sessionStorage.setItem('risks', JSON.stringify(customers.value));
};

const deleteRow = (id) => {
  if (customers.value.length <= 1) return;
  customers.value = customers.value.filter(c => c.id !== id);
  sessionStorage.setItem('risks', JSON.stringify(customers.value));
};

function isEmptyRow(row) {
  if (!row || typeof row !== 'object') return true;

  return Object.entries(row).every(([key, value]) => {
    if (key === 'id') return true;
    return value === null || value === undefined || value === '';
  });
}

const onCellEditComplete = async (event) => {
  try {
    let { data, newValue, field } = event;

    const idx = customers.value.findIndex(c => c.id === data.id);

    if (idx === customers.value.length - 1 && newValue && newValue.toString().trim().length > 0) {
      addEpic();
    }

    data[field] = newValue;

    if (isEmptyRow(data) && data.id !== customers.value[customers.value.length - 1]?.id && customers.value.length > 1) {
      customers.value = customers.value.filter(c => c.id !== data.id);
      console.log('Empty row deleted');
    }
    console.log(customers.value);

    // 🔁 Recalculate buffers after editing
    RiskCalc(customers.value);

    sessionStorage.setItem('risks', JSON.stringify(customers.value));



    await PatchData();

  } catch (error) {
    console.error('Error in onCellEditComplete:', error);
  }
};

onMounted(() => {
  const risksRaw = sessionStorage.getItem('risks');
  const tracksRaw = sessionStorage.getItem('tracksData');

  if (tracksRaw) {
    tracks.value = JSON.parse(tracksRaw);
  }

  if (risksRaw) {
    const parsedRisks = JSON.parse(risksRaw);
    if (Array.isArray(parsedRisks) && parsedRisks.length > 0) {
      RiskCalc(parsedRisks); // ✅ Berechne riskbuffer
      customers.value = parsedRisks;
    } else {
      addEpic();
    }
  } else {
    addEpic();
  }


});
</script>
