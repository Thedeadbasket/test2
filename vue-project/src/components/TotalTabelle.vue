<script setup lang="ts">

</script>

<template>
  <div class="table-wrapper">
    <table>
      <thead>
      <tr>
        <th>Rolle / Tag</th>
        <th v-for="date in displayedDates" :key="date" class="date-header">
          {{ formatDate(date) }}
        </th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="role in roles" :key="role">
        <td class="role-cell">{{ role }}</td>
        <td v-for="date in displayedDates" :key="date" class="cell">
          <input
              type="number"
              min="0"
              step="0.5"
              v-model.number="schedule[role][date]"
              @input="validateValue(role, date)"
              class="number-input"
          />
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>

</style>