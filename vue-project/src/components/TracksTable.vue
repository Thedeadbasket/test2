<template>
  <div class="card">
    <div>
      <DataTable
          v-model:editingRows="editingRows"
          :value="Tracks"
          editMode="row"
          data-key="id"
          @row-edit-save="onRowEditSave"
      >

        <Column header="#" headerStyle="width:3rem">
          <template #body="slotProps">
            {{ slotProps.index + 1 }}
          </template>
        </Column>

        <!-- Track Spalte mit InputText -->
        <Column field="track" header="Tracks">
          <template #body="{ data }">
            {{ data.track || '–' }}
          </template>
          <template #editor="{ data, field }">
            <InputText
                v-model="data[field]"
                autofocus
                fluid
                style="width:10rem"
                placeholder="Track Name eingeben"
            />
          </template>
        </Column>

        <Column field="color" header="Farbe" headerStyle="width:8rem">
          <template #body="{ data }">
            <div class="color-display">
              <div
                  class="color-preview"
                  :style="{ backgroundColor: data.color }"
              ></div>
              <span>{{ data.color || '#3498db' }}</span>
            </div>
          </template>
          <template #editor="{ data, field }">
            <div class="color-editor">
              <ColorPicker
                  v-model="data[field]"
                  format="hex"
                  :inline="false"
              />
            </div>
          </template>
        </Column>

        <Column :rowEditor="true" style=" min-width: 8rem" ></Column>

        <Column class="w-24 !text-end">
          <template #body="{ data }">
            <Button
                class="deleteButton"
                icon="pi pi-trash"
                @click="selectRow(data)"
                rounded
                severity="danger"
                size="small"
            ></Button>
          </template>
        </Column>
      </DataTable>
    </div>
    <div style="margin: 20px;">
      <Button @click="addEpic">New Track</Button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import ColorPicker from 'primevue/colorpicker';
import InputText from 'primevue/inputtext';

import 'primeicons/primeicons.css';
import { PatchData } from "@/service/PatchData";
import { parseTracks } from "@/service/trackService";

const editingRows = ref([]);
const Tracks = ref([]);

onMounted(() => {
  const tracksRaw = sessionStorage.getItem('tracksData');
  if (tracksRaw) {
    Tracks.value = JSON.parse(tracksRaw);
  }
  console.log('Tracks loaded:', Tracks.value);
});

const addEpic = () => {
  const newTrack = {
    id: Math.random().toString(36).substr(2, 9), // eindeutige id
    track: '',
    color: '#3498db',
    riskbuffer: '',
  };

  Tracks.value.push(newTrack);
  sessionStorage.setItem('tracksData', JSON.stringify(Tracks.value));
  console.log('New track added:', newTrack);
};

const selectRow = async (data) => {
  console.log('Attempting to delete track:', data);
  console.log('Current tracks:', Tracks.value);

  const index = Tracks.value.findIndex((item) => item.id === data.id);
  console.log('Found index:', index);

  if (index !== -1) {
    const deletedTrack = Tracks.value.splice(index, 1)[0];
    console.log('Track deleted:', deletedTrack);


    sessionStorage.setItem('tracksData', JSON.stringify(Tracks.value));


    cleanupCustomersAfterTrackDeletion(deletedTrack.track);

    try {
      await PatchData();
      console.log('Data successfully saved after deletion');
    } catch (error) {
      console.error('Error saving data after deletion:', error);
    }
  } else {
    console.error('Track not found for deletion:', data);
  }
};

const cleanupCustomersAfterTrackDeletion = (deletedTrackName) => {
  const customersRaw = sessionStorage.getItem('customers');
  if (!customersRaw) return;

  const customers = JSON.parse(customersRaw);
  let customersChanged = false;

  customers.forEach(customer => {
    if (customer.track === deletedTrackName) {
      customer.track = "";
      customersChanged = true;
      console.log(`Cleared track "${deletedTrackName}" from customer ${customer.id}`);
    }
  });

  if (customersChanged) {
    sessionStorage.setItem('customers', JSON.stringify(customers));
    console.log('Customers data cleaned after track deletion');
  }
};

const onRowEditSave = async ({ newData, index }) => {
  if (newData.color && !newData.color.startsWith('#')) {
    newData.color = '#' + newData.color;
  }
  Tracks.value[index] = { ...newData };
  sessionStorage.setItem('tracksData', JSON.stringify(Tracks.value));
  try {
    await PatchData();
    console.log('Data successfully updated:', newData);
  } catch (error) {
    console.error('Error updating data:', error);
  }
};
</script>

<style>
.color-display {
  display: flex;
  align-items: center;
  gap: 8px;
}

.color-preview {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border: 1px solid #ccc;
  display: inline-block;
}

.color-editor {
  display: flex;
  align-items: center;
  gap: 8px;
}

.deleteButton {
  scale: 75%;
}
</style>
