<!-- Guest Selector for Tables -->
<template>
  <div>
    <ProgressSpinner v-if="loading" />
    <PrimeMessage
      v-else-if="message"
      :severity="messageText.severity"
      :closable="false"
      >{{ messageText.text }}</PrimeMessage
    >
    <div v-else id="visual-table-list">
      <div v-if="specialTables.length > 0" id="special-tables-section">
        <h4>Named/Specialty Tables</h4>
        <TableDisplay :tables="specialTables" :key="key" />
      </div>
      <div id="standard-tables-section">
        <h4>Standard Table Layout</h4>
        <TableDisplay :tables="standardTables" :key="key" />
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
            const nameA = a.tablename[0];
            const numberA = a.tablename[1];
            const nameB = b.tablename[0];
            const numberB = b.tablename[1];

            if (numberA === numberB && nameA >= nameB) {
              return 1;
            }
            if (nameA > nameB && numberA < numberB) {
              return -1;
            }
            return 0;
          });
          tables.value.forEach((table) => {
            if (table.tablename.length > 2) {
              specialTables.value.push(table);
            } else {
              standardTables.value.push(table);
            }
          });
        });
    };

    onMounted(() => {
      loadLazyData();
    });

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
#special-tables-section {
  .table-display {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
}
</style>
