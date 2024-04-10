<!-- Guest Selector for Tables -->
<template>
  <div>
    <ProgressSpinner v-if="loading" />
    <PrimeMessage v-else-if="message" :severity="messageText.severity" :closable="false">{{ messageText.text }}
    </PrimeMessage>
    <div v-else id="visual-table-list">
      <span class="flex justify-content-end pt-2">
        <PrimeButton :icon="`pi ${draggable ? 'pi-times' : 'pi-table'}`" label="Arrange Tables" class="min-w-min w-auto"
          @click="toggleDraggable" />
      </span>
      <div v-if="specialTables.length > 0" id="special-tables-section" class="py-5">
        <TableDisplay :tables="specialTables" :key="key" :draggable="draggable" />
      </div>
    </div>
  </div>
</template>

<script>
import { useFinancialStore } from "../stores/financial";
import { useTablesStore } from "../stores/tables";
import TableDisplay from "./common/TableDisplay.vue";
import { storeToRefs } from "pinia";
import { ref, onMounted, computed } from "vue";
import formServices from "../services/settings.services";

export default {
  props: {
    key: Number,
  },
  emits: ["loadedTables"],
  setup(props, { emit }) {
    const financialStore = useFinancialStore();
    const { registrations } = storeToRefs(useFinancialStore());

    const lookupKey = function (key, value) {
      return formServices.lookup(key, value);
    };

    const tableStore = useTablesStore();
    const { tables } = storeToRefs(useTablesStore());
    const specialTables = ref([]);
    const standardTables = ref([]);

    const computedTables = computed(() => {
      return tables.value.sort((a, b) => a.tablename - b.tablename);
    });

    const columns = ref(formServices.get("tableSelection") || []);
    const organizations = ref(
      (formServices.get("organizations") || []).map((each) => each.value)
    );

    let message = ref(false);
    const messageText = ref({ severity: null, text: "" });
    const loading = ref(false);

    //Fill tables with all tables and registrations
    const fillList = async function () {
      financialStore.$reset;
      tableStore.$reset;
      loading.value = true;
      try {
        return await tableStore.fillTables().then(() => {
          financialStore.fillAllRegistrations();
        });
      } catch (error) {
        loading.value = false;
        console.warn(error);
        message.value = true;
        messageText.value = {
          severity: "error",
          text: "Could not fetch tables and/or registrations.",
        };
      } finally {
        await new Promise((resolve) => setTimeout(resolve, 1)).then(() => {
          loading.value = false;
          message.value = false;
          emit("loadedTables");
        });
      }
    };

    //After table fill, append additional information and sort based on table data
    const loadLazyData = () => {
      fillList()
        .then(() => {
          tables.value.forEach((table) => {
            table.status = computed(() => {
              if (table.guests.length >= table.tablecapacity) {
                return "full-table";
              }
              if (table.guests.length > 0) {
                return "half-table";
              }
              return "empty-table";
            });
            table.registrationOrganizations = computed(() => {
              const newTableData = table.organizations.map(
                (x) => x.organization
              );
              const dataSet = new Set(newTableData);
              const newArray = Array.from(dataSet);
              const formattedArray = newArray
                .map((x) => (x ? lookupKey("organizations", x) : ""))
                .join("\r\n");
              return formattedArray;
            });
          });
        })
        .then(() => {
          tables.value.sort((a, b) => {
            if (typeof a.tableindex === 'undefined' || typeof b.tableindex === 'undefined') return 0;
            if (a.tableindex < b.tableindex) return -1;
            if (a.tableindex > b.tableindex) return 1;
            return 0;
          });
          tables.value.forEach((table) => {
            specialTables.value.push(table);
          });
        });
    };

    onMounted(() => {
      loadLazyData();
    });

    // Manage draggable status of tables
    let draggable = ref(false);
    const toggleDraggable = () => {
      draggable.value = !draggable.value;
    }

    return {
      fillList,
      loadLazyData,
      tables,
      specialTables,
      standardTables,
      registrations,
      organizations,
      message,
      loading,
      messageText,
      tableStore,
      columns,
      computedTables,
      draggable,
      toggleDraggable
    };
  },
  components: {
    TableDisplay,
  },
};
</script>
<style lang="scss" scoped>
#visual-table-list {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.5em;
}
</style>
