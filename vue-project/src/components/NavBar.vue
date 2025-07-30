<template>
  <div class="card">
    <Menubar :model="items" >

    </Menubar>
  </div>
</template>

<script setup>
import { ref } from "vue";

import Menubar from 'primevue/menubar';
import { useRouter } from 'vue-router';

const router = useRouter();
import 'primeicons/primeicons.css'



const items = ref([
  {
    label: 'Home',
    icon: 'pi pi-home',
    command: () => {
      router.push('/');
    }
  },
  {
    label: 'Estimation',
    icon: 'pi pi-star',
    command: () => {
      router.push('/estimation');
    }
  },
  {
    label: 'Risk',
    icon: 'pi pi-search',
    command: () => {
      router.push('/risk');
    }
  },

  {
    label: 'Staffing Plan',
    icon: 'pi pi-envelope',
    command: () => {
      router.push('/staff');
    }
  },
  {
    label: 'Analysis',
    icon: 'pi pi-eye',
    command: () => {
      router.push('/analysis');
    }
  },
  {
    label: 'Settings',
    icon: 'pi pi-cog',
    command: () => {
      router.push('/settings');
    }
  }
]);
</script>