<template>
  <div class="card overflow-x-auto">
    <OrganizationChart :value="data">
      <template #default="slotProps">
        <span>{{ slotProps.node.label }}</span>
      </template>
    </OrganizationChart>
  </div>
</template>

<script setup>
import { ref } from "vue";
import OrganizationChart from 'primevue/organizationchart';
import Datatable from "@/components/Datatable.vue";


const data = ref({
  label: 'Total LOE',
  children: [
    {
      label: 'Oversight',

    },
    {
      label: 'Product LOE',
      children: [
        {
          label: 'Add-Ins'
        },
        {
          label: 'Risks'
        },
        {
          label: 'Stroy + QA',
          children: [
            {
              label: 'implementation'
            },
            {
              label: 'QA'
            }

          ]
        }
      ]
    }
  ]
});
</script>
