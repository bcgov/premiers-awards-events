<template>
  <div>
    <DataTable :value="data" responsiveLayout="scroll">
      <Column
        v-for="col of columns"
        :field="col.field"
        :header="col.text"
        :key="col.field"
      ></Column>
    </DataTable>
  </div>
</template>

<script>
// import { ref } from "vue";

export default {
  props: {
    data: Array,
    columns: Array,
  },
  setup(props) {
    const data = props.data;
    const columns = props.columns;

    return { columns, data };
  },
};
</script>
