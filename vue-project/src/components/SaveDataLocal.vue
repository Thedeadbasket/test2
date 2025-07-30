<template>
  <div>
    <Button @click="saveAllData" label="Local speichern" icon="pi pi-save" />
  </div>
</template>

<script setup>
import Button from 'primevue/button';
import axios from 'axios';

const saveAllData = async () => {
  const customers = JSON.parse(sessionStorage.getItem('customers') || '[]');
  const rawTracks = JSON.parse(sessionStorage.getItem('tracksData') || '[]');
  const risks = JSON.parse(sessionStorage.getItem('risks') || '[]');
  const metrics = JSON.parse(sessionStorage.getItem('metricsData') || '[]');

  const trackNames = rawTracks.map(t => t.tracks);
  const cumstomersNames = customers.map(t => t.epicGroup);
  const risksNames = risks.map(t => t.risks)
  const metricsNames = metrics.map(t => t.metrics)


  const requestBody = {
    fileName: "1",
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
    risks: {
      objectiveRisk: risks[0]?.objectiveRisk,
      impactInDays: risks[0]?.impactInDays,
      likelihoodInPercent: risks[0]?.likelihoodInPercent,
      teamMultiplier: risks[0]?.teamMultiplier,
      riskbuffer: risks[0]?.riskbuffer,
      affectedTrack: risks[0]?.affectedTrack,
    },
    metric: {
      metrics: metrics[0]?.metrics,
      time: {
        times: metrics[0]?.Time
      }
    },
    tracks: trackNames
  };

  console.log(requestBody);

  try {
    const response = await axios.post('http://localhost:3010/data', requestBody);
    console.log('Daten erfolgreich gespeichert:', response.data);
  } catch (error) {
    console.error('Fehler beim Speichern:', error.response?.data || error.message);
  }


  const allData = { metrics, customers, rawTracks, risks };
  const jsonString = JSON.stringify(allData, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = 'Estimate.json';
  link.click();

  URL.revokeObjectURL(url);
};
</script>
