<!-- Use an object array of tables to generate an icon layout -->
<template>
  <div class="table-display">
    <div class="table-details" v-for="table of tables" :key="table">
      <TableIcon
        :table="table"
        v-tooltip.top.hover="
          `${
            table.registrationOrganizations
              ? table.registrationOrganizations
              : ''
          }`
        "
      />
      <div class="table-name">
        <router-link :to="`/admin/table/${table.guid}`">{{
          table.tablename
        }}</router-link>
      </div>
      <div class="table-seats-taken">
        {{ table.guests.length }} / {{ table.tablecapacity }} Seats Taken
      </div>
      <div class="table-free-seats">
        {{ table.tablecapacity - table.guests.length }} Seats Free
      </div>
    </div>
  </div>
</template>

<script>
import TableIcon from "../icons/TableIcon.vue";

export default {
  props: {
    tables: Array,
  },

  components: {
    TableIcon,
  },
};
</script>
<style lang="scss" scoped>
.table-display {
  display: grid;
  grid-template-columns: repeat(12, 1fr);

  .table-details {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}
@media only screen and (max-width: 960px) {
  .table-display {
    grid-template-columns: repeat(6, 1fr);
  }
}
</style>
