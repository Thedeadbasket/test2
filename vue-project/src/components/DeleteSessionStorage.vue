<template>
  <Button @click="deleteEEE">Delete All Data</Button>
</template>

<script setup>
import Button from "primevue/button";
const deleteEEE = () => {
  sessionStorage.clear();
  localStorage.clear();
  console.log("Session and local Storage cleared!");
};
</script>