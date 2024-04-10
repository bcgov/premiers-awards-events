<!-- Use an object array of tables to generate an icon layout -->
<template>
  <div class="table-display px-5">
    <div
      :class="`${draggable ? 'wiggle' : ''} ${draggedItem === index ? 'dragging' : ''} ${dragOverIndex === index ? 'dragover' : ''} table-details`"
      v-for="(table, index) in sortedTables" :key="table._id" @dragstart="draggable ? dragStart(index) : null"
      @dragover.prevent @drop="draggable ? drop(index) : null" @dragend="dragEnd" @dragenter="dragOver(index)"
      :draggable="draggable">
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
import { ref, computed } from "vue";
import { useTablesStore } from "../../stores/tables";

export default {
  props: {
    tables: Array,
    draggable: Boolean,
  },

  components: {
    TableIcon,
  },

  setup({ tables }) {
    const tableStore = useTablesStore();
    const currentUrl = window.location.href;

    //Manage table reordering function
    const updateTableIndex = () => {
      // Check if the URL contains the tables page

      const tableSeating = currentUrl.includes('/admin/tables/event/planning');
      if (tableSeating) {
        tables.forEach((item, index) => {
          tables[index] = { ...item, tableindex: ref(index + 1) }; // Updating reactive index key-value pair
        });

        tables.forEach((data) => {
          const newTableIndex = data.tableindex;
          tableStore.updateTable(data._id, { ...data, tableindex: newTableIndex })
        })
      }
    };

    let draggedItem = ref(null);
    let dragOverIndex = ref(null);

    const dragStart = (index) => {
      draggedItem.value = index;
    }

    const dragEnd = () => {
      draggedItem.value = null;
      dragOverIndex.value = null;
    }

    const dragOver = (index) => {
      if (draggedItem.value !== null && draggedItem.value !== index) {
        dragOverIndex.value = index;
      }
    }

    const drop = (index) => {
      const currentItem = tables[draggedItem.value];
      tables.splice(draggedItem.value, 1); // Remove the item from its original position
      tables.splice(index, 0, currentItem); // Insert the item at the new position
      updateTableIndex();
      draggedItem.value = null;
    }


    const sortedTables = computed(() => {
      return [...tables].sort((a, b) => a.tableindex - b.tableindex);
    });


    return {
      draggedItem,
      dragOverIndex,
      dragStart,
      dragEnd,
      dragOver,
      drop,
      sortedTables
    }
  }
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

  /* Add a class to gray out items */
  .table-details.dragging {
    opacity: 0.5;
  }

  /* Add a class to show the cursor where the item would drop */
  .table-details.dragover {
    border: 2px dashed black;
  }

  @keyframes wiggle {
    0% {
      transform: rotate(0deg);
    }

    10% {
      transform: rotate(-5deg);
    }

    20% {
      transform: rotate(5deg);
    }

    30% {
      transform: rotate(-5deg);
    }

    40% {
      transform: rotate(5deg);
    }

    50% {
      transform: rotate(-5deg);
    }

    60% {
      transform: rotate(5deg);
    }

    70% {
      transform: rotate(-5deg);
    }

    80% {
      transform: rotate(5deg);
    }

    90% {
      transform: rotate(-5deg);
    }

    100% {
      transform: rotate(0deg);
    }
  }

  .wiggle {
    animation: wiggle 2s linear infinite;
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
