<template>
  <div class="card">
    <DataTable
        :value="customers"
        rowGroupMode="rowspan"
        :groupRowsBy="['epicGroup', 'epic', 'story']"
        sortMode="single"
        :sortOrder="1"
        dataKey="id"
        show-gridlines
        tableStyle="min-width: 50rem"
        editMode="cell"
        @cell-edit-complete="onCellEditComplete"
        :pt="{
        table: { style: 'min-width: 50rem' },
        column: {
            bodycell: ({ state }) => ({
                class: [{ '!py-0': state['d_editing'] }]
            })
        }
    }"
    >
      <Column header="#" headerStyle="width:3rem">
        <template #body="slotProps">
          {{ slotProps.index + 1 }}
        </template>
      </Column>

      <Column v-for="col of columns" :key="col.field" :field="col.field" :header="col.header"  style="width: 14%" >
        <template #editor="{ data, field }">
          <template v-if="col.field">
            <InputText v-model="data[field]"  />
          </template>
        </template>
      </Column>

      <Column header="Resulting Estimate" field="resultingEstimate">
        <template #body="slotProps">
          {{ slotProps.data.resultingEstimate || '--' }}
        </template>
      </Column>


      <Column header="Track" field="track">
        <template #editor="{ data, field }">
          <Select v-model="data[field]" :options="track" option-label="label" option-value="value" placeholder="Select Track"  :max-selected-labels="1" />
        </template>
      </Column>
      <Column header="Override Estimation" field="override">
        <template #editor="{ data, field }">
          <input-text v-model="data[field]"  />
        </template>
      </Column>

    </DataTable>
  </div>
</template>

<script setup>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Select from 'primevue/select';
import { ref, onMounted } from 'vue'
import { useEstimationDatatable } from '@/composables/useEstimationDatatable'
import { parseTracks } from '@/service/trackService'
import {EstimationCalc} from "@/service/EstimationCalc";
import {PatchData} from "@/service/PatchData";

const hallol = localStorage.getItem('saveId')
console.log(hallol)
const lol = ref([])
const track = ref([])
const metric = ref([])
const columns = ref([
  { field: 'epicGroup', header: 'Epic Group' },
  { field: 'epic', header: 'Epic' },
  { field: 'story', header: 'Story' },
  { field: 'task', header: 'Task' },
  { field: 'estimate', header: 'Estimate' },
])

const { customers, addEpic, isEmptyRow, loadTableData } = useEstimationDatatable(columns, metric)

onMounted(() => {
  const customersRaw = sessionStorage.getItem('customers')
  lol.value = JSON.parse(customersRaw)
  console.log(lol)

  const tracksRaw = sessionStorage.getItem('tracksData')
  if (tracksRaw) {
    track.value = parseTracks(JSON.parse(tracksRaw))
  }
  const metricRaw = sessionStorage.getItem('metricsData')
  if (metricRaw) {
    metric.value = JSON.parse(metricRaw)
  }
  checkifOutdated(track.value, metric.value,lol.value)
  loadTableData()

})
function checkifOutdated(tracks, metrics, customers) {
  let dataChanged = false;

  customers.forEach((customer) => {

    if (customer.track) {
      const trackExists = tracks.some(track => track.value === customer.track);
      if (!trackExists) {
        console.warn(`Track "${customer.track}" for customer ${customer.id} is outdated - setting to empty`);
        customer.track = "";
        dataChanged = true;
      }
    }

    if (customer.estimate) {
      const metricExists = metrics.some(metric => metric.metrics === customer.estimate);
      if (!metricExists) {
        console.warn(`Metric "${customer.estimate}" for customer ${customer.id} is outdated - setting to empty`);
        customer.estimate = "";
        dataChanged = true;
      }
    }
  });

  if (dataChanged) {
    console.log('Data was cleaned - updating sessionStorage');
    sessionStorage.setItem('customers', JSON.stringify(customers));
  }

  return dataChanged;
}
const onCellEditComplete = async ({ data, newValue, field }) => {
  const idx = customers.value.findIndex(c => c.id === data.id)
  if (idx === customers.value.length - 1 && newValue.length > 0) {
    addEpic()
  }

  data[field] = newValue

  if (isEmptyRow(data) && data.id !== customers.value[customers.value.length - 1].id) {
    customers.value = customers.value.filter(c => c.id !== data.id)
  }

  if (field === 'override' && newValue.length > 0) {
    data.resultingEstimate = newValue
  }

  if (field === 'estimate') {
    const match = metric.value.find(m => m.metrics === newValue)
    if (match) {
      data.resultingEstimate = match.times
    }
  }
  EstimationCalc(lol.value)


  sessionStorage.setItem('customers', JSON.stringify(customers.value))
  await PatchData()
}
</script>
