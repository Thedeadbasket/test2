<template>
  <div class="container">
    <Button @click="saveAllData" label="Alles speichern zur Datenbank" icon="pi pi-save" />
  </div>
  <div class="container">
    <input v-model="saveId" placeholder="Speicher-ID eingeben" type="text" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import Button from 'primevue/button';

const saveId = ref('');

const saveAllData = async () => {
  try {
    const customers = JSON.parse(sessionStorage.getItem('customers') || '[]');
    const rawTracks = JSON.parse(sessionStorage.getItem('tracksData') || '[]');
    const risks = JSON.parse(sessionStorage.getItem('risks') || '[]');
    const metrics = JSON.parse(sessionStorage.getItem('metricsData') || '[]');

    const id = saveId.value || 'Estimate';

    const requestBody = {
      fileName: id,
      estimation: customers.map(c => ({
        epicGroup: c.epicGroup,
        epic: c.epic,
        story: c.story,
        task: c.task,
        track: c.track,
        estimate: c.estimate,
        resultingEstimate: c.resultingEstimate,
        override: c.override
      })),
      risks: risks.map(r => ({
        objectiveRisk: r.objectiveRisk,
        impactInDays: r.impactInDays,
        likelihoodInPercent: r.likelihoodInPercent,
        teamMultiplier: r.teamMultiplier,
        riskbuffer: r.riskbuffer,
        affectedTrack: r.affectedTrack
      })),
      metric: metrics.map(m => ({
        metrics: m.metrics,
        times: m.times,
      })),
      tracks: rawTracks.map(t => ({
        track: t.track,
        color: t.color,
        riskbuffer: t.riskbuffer,
        resultingEstimate: t.resultingEstimate,
        totalEstimate: t.totalEstimate,
        addins: t.addins,
        delta: t.delta,
        plannedTime: t.plannedTime,
        kw: t.kw || [] // Füge das kw Array hinzu, falls vorhanden
      }))
    };

    console.log('Request Body:', requestBody);

    const response = await axios.post('http://localhost:3010/data', requestBody);
    console.log('Daten erfolgreich gespeichert:', response.data);
  } catch (error) {
    console.error('Fehler beim Speichern:', error.response?.data || error.message);
  }
};
</script>

<style scoped>
.container {
  margin: 10px;
}
</style>