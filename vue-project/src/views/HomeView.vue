<template>
  <div>

    <div class="main-content">
      <h1>Willkommen auf der Seite</h1>


      <div class="navigation-buttons">
        <div class="buttonLoadSave">
          <SaveDataLocal />
        </div>
        <div class="buttonLoadSave">
          <LoadData />
        </div>
        <div class="buttonLoadSave">
          <DeleteSessionStorage />
        </div>
        <div class="buttonLoadSave">
          <LadenFromDatabank />
        </div>
        <div class="buttonLoadSave">
          <SaveToDatabank />
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">

import SaveDataLocal from "@/components/SaveDataLocal.vue";
import LoadData from "@/components/LoadData.vue";
import DeleteSessionStorage from "@/components/DeleteSessionStorage.vue";
import LadenFromDatabank from "@/components/LadenFromDatabank.vue";
import SaveToDatabank from "@/components/SaveToDatabank.vue";



</script>

<style>
.main-content {
  padding: 20px;
}

.navigation-buttons {

  margin-top: 10px;
}

.buttonLoadSave {
  margin: 10px;
}
</style>