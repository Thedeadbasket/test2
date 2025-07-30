<script>
import StaffingPlan from "@/components/StaffingPlan.vue";
import {defineComponent} from "vue";
import SumTable from "@/components/SumTable.vue";

export default defineComponent({
  components: {SumTable, StaffingPlan}
})


</script>
<template>
  <div class="staffplan-view">
    <StaffingPlan />
  </div>
  <div class="sumtable-view">
    <SumTable />
  </div>

</template>


<style>
.sumtable-view {
  text-align: right;
}
.staffplan-view {
  margin-bottom: 50px;
}
</style>