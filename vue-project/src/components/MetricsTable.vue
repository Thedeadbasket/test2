<template>
  <div class="card"  >
    <div>
      <DataTable
          :value="Metrics"
          rowGroupMode="rowspan"
          sortMode="single"
          :sortOrder="1"
          editMode="cell"
          @cell-edit-complete="onCellEditComplete">

        <Column header="#" headerStyle="width:3rem">
          <template #body="slotProps">
            {{ slotProps.index + 1 }}
          </template>
        </Column>

        <Column v-for="col of columnsMetrics" :key="col.fieldMetrics" :field="col.fieldMetrics" :header="col.headerMetrics" >
          <template #editor="{ data, field }">
            <InputText v-model="data[field]" autofocus fluid/>
          </template>
        </Column>

        <Column class="w-24 !text-end">
          <template #body="{ data }">
            <Button class="deleteButton" icon="pi pi-trash" @click="selectRow(data)"  rounded ></Button>
          </template>
        </Column>

      </DataTable>
    </div>
    <div style="margin: 15px">
      <Button @click="addEpic"> New Track</Button>
    </div>




  </div>


</template>
<script setup>

import {ref, onMounted} from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import 'primeicons/primeicons.css'

import {PatchData} from "@/service/PatchData";

const Metrics = ref([])
onMounted(() => {
  const metricRaw = sessionStorage.getItem('metricsData')
  if (metricRaw) {
    Metrics.value = JSON.parse(metricRaw)
  }
});


const empty = null
const addEpic = () => {
  const currentLength = Metrics.value?.length || 0;

  const newEpicGroup = {
    id: currentLength ? currentLength + 1 : 0,
    metrics: empty,
  };

  Metrics.value.push(newEpicGroup);
};


const selectRow = (data) => {
  const index = Metrics.value.findIndex((item) => item.id === data.id);
  if (index !== -1) {
    Metrics.value.splice(index, 1);
    sessionStorage.setItem('metricsData', JSON.stringify(Metrics.value));
  }
};



const columnsMetrics = ref([
  { fieldMetrics: 'metrics', headerMetrics: 'Metrics' },
  { fieldMetrics: 'times', headerMetrics: 'Time' },
])

const onCellEditComplete = async (event) => {
  let { data, newValue, field } = event;
  data[field] = newValue;

  sessionStorage.setItem('metricsData', JSON.stringify(Metrics.value));
  await PatchData();

};

</script>
<style>
.deleteButton {
  scale: 75%;
  margin-left: 50px;
}
</style>
