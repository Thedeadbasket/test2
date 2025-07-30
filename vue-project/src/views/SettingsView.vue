<script setup>

import TracksTable from "@/components/TracksTable.vue";
import MetricsTable from "@/components/MetricsTable.vue";

</script>

<template>
  <div class="parent">
    <div class="first">
      <MetricsTable/>
    </div>
    <div class="second">
      <TracksTable/>
    </div>
  </div>

</template>

<style>
  .parent {
    display: inline-flex;
  }
  .first {
    margin: 50px;
  }
  .second {
    margin: 50px;
  }
</style>