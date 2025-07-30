<template>
  <div>
    <input placeholder="Load Data" type="file" @change="loadData" accept=".json" />
  </div>

</template>

<script setup>


const loadData = (event) => {
  const file = event.target.files[0];
  if (file && file.type === 'application/json') {
    const reader = new FileReader();
    reader.onload = (e) => {
      const jsonData = JSON.parse(e.target.result);
      if (jsonData.customers && jsonData.tracks && jsonData.risks) {
        sessionStorage.setItem('customers', JSON.stringify(jsonData.customers));
        sessionStorage.setItem('tracksData', JSON.stringify(jsonData.tracks));
        sessionStorage.setItem('risks', JSON.stringify(jsonData.risks));
        sessionStorage.setItem('metrics', JSON.stringify(jsonData.metrics));
        alert('Daten erfolgreich geladen');
      } else {
        alert('Die Datei enthält nicht das erwartete Format');
      }
    };
    reader.readAsText(file);
  } else {
    alert('Bitte eine gültige JSON-Datei hochladen');
  }
};
</script>
