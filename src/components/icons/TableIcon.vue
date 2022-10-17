<!-- Table Icon Common Component -->
<template>
  <div class="table-icon">
    <i :class="tableClass"></i>
  </div>
</template>

<script>
import { computed } from "vue";

export default {
  props: {
    table: Object,
  },
  setup(props) {
    const fullIcon = "pi pi-circle-fill full-table";
    const halfIcon = "pi pi-circle-fill half-table";
    const emptyIcon = "pi pi-circle empty-table";
    const defaultIcon = "pi pi-circle-fill default-table";

    //Apply conditional styling based on table status
    const tableClass = computed(() => {
      if (props.table.status === "full-table") {
        return fullIcon;
      }
      if (props.table.status === "half-table") {
        return halfIcon;
      }
      if (props.table.status === "empty-table") {
        return emptyIcon;
      }
      return defaultIcon;
    });

    return {
      tableClass,
    };
  },
};
</script>

<style lang="scss">
.table-icon {
  $fullColor: red;
  $emptyColor: green;
  $defaultColor: purple;
  $tableSize: 4rem;
  .full-table {
    color: $fullColor;
    font-size: $tableSize;
  }
  .half-table {
    background: -moz-linear-gradient(right, $fullColor 50%, $emptyColor 51%);
    background: -webkit-linear-gradient(right, $fullColor 50%, $emptyColor 51%);
    background: linear-gradient(to right, $fullColor 50%, $emptyColor 51%);
    -webkit-background-clip: text;
    -moz-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    font-size: $tableSize;
  }
  .empty-table {
    color: $emptyColor;
    font-size: $tableSize;
  }
  .default-table {
    color: $defaultColor;
    font-size: $tableSize;
  }
}
</style>
