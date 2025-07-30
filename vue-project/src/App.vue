<template>
  <div id="app">
    <header>
      <NavBar />
    </header>

    <router-view />
  </div>
  <WelcomePopup
      v-if="showWelcomePopup"
      @close="closeWelcomePopup"
  />
</template>

<script setup lang="ts">

import NavBar from "@/components/NavBar.vue";
import WelcomePopup from "@/components/WelcomePopup.vue";
import { FirstVisitChecker } from "@/service/FirstVisitChecker";
import {ref} from "vue";
import {onMounted} from "vue";

const showWelcomePopup = ref(false);
const closeWelcomePopup = () => {
  showWelcomePopup.value = false;
};
onMounted(() => {
  const isFirstVisit = FirstVisitChecker();
  if (isFirstVisit) {
    showWelcomePopup.value = true;
  }
});
</script>