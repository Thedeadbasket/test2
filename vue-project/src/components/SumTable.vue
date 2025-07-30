<template>
  <div class="table-wrapper">
    <DataTable
        :key="tableKey"
        :value="tracks"
        :row-style="getRowStyle"
        rowGroupMode="rowspan"
        sortMode="single"
        :sortOrder="1"
        show-gridlines
    >


      <Column
          v-for="label in displayedLabels"
          :key="label.field"

          :field="label.field"
          :header="label.label"
          class="row"
      />

    </DataTable>



  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, nextTick, onUnmounted } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import {EstimationCalc} from "@/service/EstimationCalc";
import {TotalEstimateCalc} from "@/service/TotalEstimateCalc";
import {AddinsCalc} from "@/service/AddinsCalc";
import {DeltaCalc} from "@/service/DeltaCalc";


const savedName = ref('');

const customers = ref([]);
const selectedTrack = ref();
const customer = ref ([]);

const tableKey = ref(0);

const tracks = ref([]);

const displayedLabels = ref([
  {field: 'riskbuffer', label: 'Risks'},
  {field: 'addins', label: 'AddIns'},
  {field: 'resultingEstimate', label: 'Estimate'},
  {field: 'totalEstimate', label: 'Total Estimate'},
  {field: 'delta', label: 'Delta Abs'},
])

// Storage watcher mit Polling für bessere Kompatibilität
let storageWatchInterval;

function startStorageWatcher() {
  let lastTracksData = sessionStorage.getItem('tracksData');
  let lastScheduleData = sessionStorage.getItem('schedule');
  let lastCustomersData = sessionStorage.getItem('customers');
  let lastRisksData = sessionStorage.getItem('risks');

  storageWatchInterval = setInterval(() => {
    // Check tracksData
    const currentTracksData = sessionStorage.getItem('tracksData');
    if (currentTracksData !== lastTracksData) {
      lastTracksData = currentTracksData;
      if (currentTracksData) {
        console.log('TracksData changed - updating...');
        updateFromTracksData(currentTracksData);
      }
    }

    // Check schedule
    const currentScheduleData = sessionStorage.getItem('schedule');
    if (currentScheduleData !== lastScheduleData) {
      lastScheduleData = currentScheduleData;
      console.log('Schedule changed - recalculating delta...');
      updateFromScheduleData();
    }

    // Check customers
    const currentCustomersData = sessionStorage.getItem('customers');
    if (currentCustomersData !== lastCustomersData) {
      lastCustomersData = currentCustomersData;
      if (currentCustomersData) {
        console.log('Customers changed - updating...');
        updateFromCustomersData(currentCustomersData);
      }
    }

    // Check risks
    const currentRisksData = sessionStorage.getItem('risks');
    if (currentRisksData !== lastRisksData) {
      lastRisksData = currentRisksData;
      if (currentRisksData) {
        console.log('Risks changed - updating...');
        updateFromRisksData(currentRisksData);
      }
    }
  }, 1000); // Check every second
}

async function updateFromTracksData(tracksDataString) {
  const newTracks = JSON.parse(tracksDataString);

  console.log('Before calculations - Total Estimates:', newTracks.map(t => ({ track: t.track, totalEstimate: t.totalEstimate })));

  EstimationCalc(customer.value);
  console.log('After EstimationCalc');

  AddinsCalc();
  console.log('After AddinsCalc');

  // TotalEstimateCalc ausführen um totalEstimate zu berechnen
  TotalEstimateCalc(newTracks);
  console.log('After TotalEstimateCalc');

  DeltaCalc();
  console.log('After DeltaCalc');

  const updatedTracksRaw = sessionStorage.getItem('tracksData');
  if (updatedTracksRaw) {
    const updatedTracks = JSON.parse(updatedTracksRaw);
    console.log('Final tracks from sessionStorage:', updatedTracks.map(t => ({ track: t.track, totalEstimate: t.totalEstimate })));
    tracks.value = updatedTracks;
    tableKey.value++;
  }

  await nextTick();
  console.log('Tracks updated automatically:', tracks.value);
}

async function updateFromScheduleData() {
  console.log('Before DeltaCalc - Total Estimates:', tracks.value.map(t => ({ track: t.track, totalEstimate: t.totalEstimate })));

  DeltaCalc();

  const tracksRaw = sessionStorage.getItem('tracksData');
  if (tracksRaw) {
    const updatedTracks = JSON.parse(tracksRaw);
    console.log('After DeltaCalc from sessionStorage:', updatedTracks.map(t => ({ track: t.track, totalEstimate: t.totalEstimate })));
    tracks.value = updatedTracks;
    tableKey.value++;
    await nextTick();
  }
  console.log('Schedule updated, Delta recalculated');
}

async function updateFromCustomersData(customersDataString) {
  customer.value = JSON.parse(customersDataString);

  EstimationCalc(customer.value);
  TotalEstimateCalc(tracks.value);
  DeltaCalc();

  const tracksRaw = sessionStorage.getItem('tracksData');
  if (tracksRaw) {
    tracks.value = JSON.parse(tracksRaw);
    tableKey.value++;
  }

  console.log('Customers updated automatically:', customer.value);
}

async function updateFromRisksData(risksDataString) {
  const parsedRisks = JSON.parse(risksDataString);
  customers.value = parsedRisks;

  EstimationCalc(customer.value);
  TotalEstimateCalc(tracks.value);
  DeltaCalc();

  const tracksRaw = sessionStorage.getItem('tracksData');
  if (tracksRaw) {
    tracks.value = JSON.parse(tracksRaw);
    tableKey.value++;
  }

  console.log('Risks updated automatically');
}

function getRowStyle(rowData) {
  const track = rowData.track;
  const trackInfo = tracks.value.find(t => t.track === track);
  if (trackInfo && trackInfo.color) {
    return {
      backgroundColor: trackInfo.color
    };
  }
  return {};
}

onMounted(() => {
  const risksRaw = sessionStorage.getItem('risks');
  const tracksRaw = sessionStorage.getItem('tracksData');
  const customerRaw = sessionStorage.getItem('customers');

  if (customerRaw) {
    customer.value = JSON.parse(customerRaw);
  }
  EstimationCalc(customer.value)
  if (tracksRaw) {
    tracks.value = JSON.parse(tracksRaw);
  }
  AddinsCalc()
  TotalEstimateCalc(tracks.value)
  DeltaCalc()

  console.log(tracks);
  console.log(tracks.value);
  if (risksRaw) {
    const parsedRisks = JSON.parse(risksRaw);
    if (Array.isArray(parsedRisks) && parsedRisks.length > 0) {
      customers.value = parsedRisks;
    } else {
      addEpic();
    }
  } else {
    addEpic();
  }

  // Start storage watcher
  startStorageWatcher();
});

onUnmounted(() => {
  if (storageWatchInterval) {
    clearInterval(storageWatchInterval);
  }
});
</script>
<style scoped>
.row{
  width: 6rem;
}
.table-wrapper {
  max-width: 40rem;
  margin-left: auto; /* Ändert die Ausrichtung nach rechts */
}

</style>