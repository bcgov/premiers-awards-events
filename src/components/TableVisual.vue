<!-- Guest Selector for Tables -->
<template>
  <div>
    <ProgressSpinner v-if="loading" />
    <PrimeMessage
      v-else-if="message"
      :severity="messageText.severity"
      :closable="false"
      >{{ messageText.text }}
    </PrimeMessage>
    <div v-else id="visual-table-list">
      <span class="flex justify-content-end pt-4 gap-1">
        <div class="flex flex-column">
          <FloatLabel>
            <label for="table-grid-input">Table Columns</label>
            <InputNumber
              :inputStyle="{ width: '40px' }"
              id="table-grid-input"
              v-model="gridwidth"
              showButtons
              buttonLayout="horizontal"
              :step="1"
              :min="1"
              :max="20"
              decrementButtonClass="p-button-danger"
              incrementButtonClass="p-button-success"
              incrementButtonIcon="pi pi-plus"
              decrementButtonIcon="pi pi-minus"
              class="table-grid-width-customize"
            />
          </FloatLabel>
        </div>
        <PrimeButton
          :icon="`pi ${draggable ? 'pi-times' : 'pi-table'}`"
          label="Arrange Tables"
          class="min-w-min w-auto"
          @click="toggleDraggable"
        />
        <PrimeButton
          label="Download PDF"
          class="min-w-min w-auto"
          @click="downloadPdf"
        />
      </span>
      <div
        v-if="specialTables.length > 0"
        id="special-tables-section"
        class="py-5"
      >
        <TableDisplay
          :tables="specialTables"
          :key="key"
          :draggable="draggable"
          :gridwidth="gridwidth"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { useFinancialStore } from "../stores/financial";
import { useTablesStore } from "../stores/tables";
import { useSettingsStore } from "../stores/settings";
import TableDisplay from "./common/TableDisplay.vue";
import { storeToRefs } from "pinia";
import { ref, onMounted, computed } from "vue";

import tableRoutes from "../services/api-routes.tables.js";

import { saveAs } from "file-saver";

export default {
  props: {
    key: Number,
  },
  emits: ["loadedTables"],
  async setup(props, { emit }) {
    const financialStore = useFinancialStore();
    const settingsStore = useSettingsStore();
    settingsStore.getAll();
    const gridwidth = ref(8);
    const { registrations } = storeToRefs(useFinancialStore());

    const lookupKey = function (key, value) {
      return settingsStore.lookup(key, value);
    };

    const tableStore = useTablesStore();
    const { tables } = storeToRefs(useTablesStore());
    const specialTables = ref([]);
    const standardTables = ref([]);

    const computedTables = computed(() => {
      return tables.value.sort((a, b) => a.tablename - b.tablename);
    });

    const columns = await settingsStore.get("tableSelection");
    const organizations = await settingsStore.get("organizations");

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
    const loadLazyData = async () => {
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
            if (
              typeof a.tableindex === "undefined" ||
              typeof b.tableindex === "undefined"
            )
              return 0;
            if (a.tableindex < b.tableindex) return -1;
            if (a.tableindex > b.tableindex) return 1;
            return 0;
          });
          tables.value.forEach((table) => {
            specialTables.value.push(table);
          });
        });
    };

    await loadLazyData();

    // Manage draggable status of tables
    let draggable = ref(false);
    const toggleDraggable = () => {
      draggable.value = !draggable.value;
    };

    const downloadPdf = async () => {
      const res = await tableRoutes.getPdfLayout(gridwidth.value, "base64");

      saveAs(res.data, `Table layout x ${gridwidth.value}.pdf`);
    };

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
      toggleDraggable,
      downloadPdf,
      gridwidth,
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
