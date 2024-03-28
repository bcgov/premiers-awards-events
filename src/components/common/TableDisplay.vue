<!-- Use an object array of tables to generate an icon layout -->
<template>
  <div class="table-display px-5">
    <div class="table-details" v-for="table of tables" :key="table">
      <TableIcon :table="table" />
      <div class="table-name" v-tooltip.top.hover="`${table.registrationOrganizations
      ? table.registrationOrganizations
      : ''
      }`
      ">
        <router-link :to="`/admin/table/${table.guid}`">{{
      table.tablename
    }}</router-link>
      </div>
      <div class="table-seats-taken">
        {{ table.guests.length }} / {{ table.tablecapacity }} Guests
      </div>
      <div class="table-free-seats">
        {{ table.tablecapacity - table.guests.length }} Seat{{ table.tablecapacity - table.guests.length === 1 ? '' :
      's' }} Free
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
  grid-template-columns: repeat(8, 1fr);

  .table-details {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}

@media only screen and (max-width: 960px) {
  .table-display {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media only screen and (max-width: 400px) {
  .table-display {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
