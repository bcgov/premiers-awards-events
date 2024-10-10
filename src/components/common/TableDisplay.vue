<!-- Use an object array of tables to generate an icon layout -->
<template>
  <div class="table-display px-5" :style="{ '--custom-grid': gridwidth }">
    <div
      :class="`${draggable ? 'wiggle' : ''} ${
        draggedItem === index ? 'dragging' : ''
      } ${dragOverIndex === index ? 'dragover' : ''} table-details`"
      v-for="(table, index) in sortedTables"
      :key="table._id"
      @dragstart="draggable ? dragStart(index) : null"
      @dragover.prevent
      @drop="draggable ? drop(index) : null"
      @dragend="dragEnd"
      @dragenter="dragOver(index)"
      :draggable="draggable"
    >
      <TableIcon :table="table" />
      <div
        class="table-name"
        v-tooltip.top.hover="
          `${
            table.registrationOrganizations
              ? table.registrationOrganizations
              : ''
          }`
        "
      >
        <router-link :to="`/admin/table/${table.guid}`">{{
          table.tablename
        }}</router-link>
      </div>
      <div class="table-seats-taken">
        {{ table.guests.length }} / {{ table.tablecapacity }} Guests
      </div>
      <div class="table-free-seats">
        {{ table.tablecapacity - table.guests.length }} Seat{{
          table.tablecapacity - table.guests.length === 1 ? "" : "s"
        }}
        Free
      </div>
    </div>
  </div>
</template>

<script>
import TableIcon from "../icons/TableIcon.vue";
import { ref, computed, reactive } from "vue";
import { useTablesStore } from "../../stores/tables";

export default {
  props: {
    tables: Array,
    draggable: Boolean,
    gridwidth: Number,
  },

  components: {
    TableIcon,
  },

  setup({ tables }) {
    const tableStore = useTablesStore();
    const currentUrl = window.location.href;
    // create a reactive reference of the tables array
    const reactiveTables = reactive([...tables]);

    //Manage table reordering function
    const updateTableIndex = () => {
      // Check if the URL contains the tables page

      const tableSeating = currentUrl.includes("/admin/tables/event/planning");
      if (tableSeating) {
        reactiveTables.forEach((item, index) => {
          reactiveTables[index] = { ...item, tableindex: ref(index + 1) }; // Updating reactive index key-value pair
        });

        reactiveTables.forEach((data) => {
          const newTableIndex = data.tableindex;
          tableStore.updateTable(data._id, {
            ...data,
            tableindex: newTableIndex,
          });
        });
      }
    };

    // Manage drag and drop rearrangment

    let draggedItem = ref(null);
    let dragOverIndex = ref(null);

    const dragStart = (index) => {
      draggedItem.value = index;
    };

    const dragEnd = () => {
      draggedItem.value = null;
      dragOverIndex.value = null;
    };

    const dragOver = (index) => {
      if (draggedItem.value !== null && draggedItem.value !== index) {
        dragOverIndex.value = index;
      }
    };

    /*
    const drop = (index) => {
      const currentItem = reactiveTables[draggedItem.value];
      reactiveTables.splice(draggedItem.value, 1);
      reactiveTables.splice(index, 0, currentItem);
      updateTableIndex();
      draggedItem.value = null;
    };
    */

    /*
      PA-165 Replaced the drop function to swap the table indices instead of using splice. 
      So, when table at index 2 is dropped on table at index 4, table @ 2 becomes @ 4, and table @ 4 becomes @ 2
    */
    const drop = (index) => {
      const source = reactiveTables[draggedItem.value],
        target = reactiveTables[index];

      //console.log(`${source.tableindex} -> ${target.tableindex}`);
      //console.log(`${draggedItem.value} -> ${index}`);
      target.tableindex = source.tableindex;
      source.tableindex = index + 1;

      reactiveTables[target.tableindex - 1] = target;
      reactiveTables[source.tableindex - 1] = source;

      updateTableIndex();
      draggedItem.value = null;
    };

    const sortedTables = computed(() => {
      return [...reactiveTables].sort((a, b) => a.tableindex - b.tableindex);
    });

    return {
      draggedItem,
      dragOverIndex,
      dragStart,
      dragEnd,
      dragOver,
      drop,
      sortedTables,
      reactiveTables,
    };
  },
};
</script>
<style lang="scss" scoped>
.table-display {
  display: grid;
  grid-template-columns: repeat(var(--custom-grid), 1fr);

  .table-details {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  /* Add a class to gray out items */
  .table-details.dragging {
    opacity: 0.5;
  }

  /* Add a class to show the cursor where the item would drop */
  .table-details.dragover {
    border-right: 5px dashed black;
    border-radius: 0px;
    border-spacing: 3px;
  }

  @keyframes wiggle {
    0% {
      transform: rotate(0deg);
    }

    10% {
      transform: rotate(-1deg);
    }

    20% {
      transform: rotate(1deg);
    }

    30% {
      transform: rotate(-1deg);
    }

    40% {
      transform: rotate(1deg);
    }

    50% {
      transform: rotate(-1deg);
    }

    60% {
      transform: rotate(1deg);
    }

    70% {
      transform: rotate(-1deg);
    }

    80% {
      transform: rotate(1deg);
    }

    90% {
      transform: rotate(-1deg);
    }

    100% {
      transform: rotate(0deg);
    }
  }

  .wiggle {
    animation: wiggle 2s linear infinite;
    border: 2px solid #999;
    border-radius: 10px;
    box-shadow: 0 0 5px #999;
    cursor: move;
    /* fallback if grab cursor is unsupported */
    cursor: grab;
    cursor: -moz-grab;
    cursor: -webkit-grab;
  }

  .wiggle:active {
    cursor: grabbing;
    cursor: -moz-grabbing;
    cursor: -webkit-grabbing;
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
