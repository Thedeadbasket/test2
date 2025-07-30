<script setup>
import { ref } from 'vue';
import Button from 'primevue/button';
import Select from 'primevue/select';

import axios from 'axios';


const saveId = ref('');

const saveAllData = async () => {
  try {

    const response = await axios.get(`http://localhost:3010/data/${saveId.value}`);
    console.log('Daten erfolgreich geladen:', response.data);

    const data = response.data;


    if (data.estimation && data.tracks && data.risks && data.metric) {

      sessionStorage.setItem('customers', JSON.stringify(data.estimation));
      sessionStorage.setItem('tracksData', JSON.stringify(data.tracks));
      sessionStorage.setItem('risks', JSON.stringify(data.risks));
      sessionStorage.setItem('metricsData', JSON.stringify(data.metric));


    }
  } catch (error) {
    console.error('Fehler beim Laden:', error.response?.data || error.message);

  }

};
</script>

<template>

  <div class="container">
    <Button @click="saveAllData" label="Laden" icon="pi pi-save" />
  </div>

  <div class="container">
    <input v-model="saveId" placeholder="Filename eingeben" type="text" />
  </div>

</template>

<style scoped>
.container {
  margin: 10px;
}
</style>
