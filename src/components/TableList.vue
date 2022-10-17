<template>
  <div>
    <ProgressSpinner v-if="loading" />
    <PrimeMessage
      v-else-if="message"
      :severity="messageText.severity"
      :closable="false"
      >{{ messageText.text }}</PrimeMessage
    >
    <div v-else>
      <DataTable
        class="p-datatable-sm table-data-view"
        :value="tables"
        responsiveLayout="stack"
        :key="dataTableRender"
        :paginator="!detailsView"
        :rows="10"
        ref="dt"
        stripedRows
        v-model:filters="filters"
        filterDisplay="menu"
        :globalFilterFields="[
          'tablename',
          'tabletype',
          'tablecapacity',
          'tableguestcount',
          'tablefull',
          'organizations',
        ]"
        :loading="loading"
        showGridlines
        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
        :rowsPerPageOptions="[10, 20, 50]"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
      >
        <template #header v-if="!detailsView">
          <div style="text-align: left">
            <PrimeButton
              icon="pi pi-external-link"
              label="Export"
              @click="exportCSV($event)"
            />
            <PrimeButton
              type="button"
              icon="pi pi-filter-slash"
              label="Clear"
              class="p-button-outlined"
              @click="clearFilters()"
            />
            <span class="p-input-icon-left">
              <i class="pi pi-search" />
              <InputText
                v-model="filters['global'].value"
                placeholder="Keyword Search"
              />
            </span>
          </div>
        </template>
        <template #empty> No tables found. </template>
        <template #loading> Loading table data. Please wait. </template>
        <PrimeColumn
          field="tablename"
          header="Table Name"
          key="tablename"
          class="tablename"
        >
          <template #body="{ data }">
            <router-link
              v-if="!detailsView"
              :to="`/admin/table/${data.guid}`"
              >{{ data.tablename }}</router-link
            ><span v-else>{{ data.tablename }}</span>
          </template>
          <template #filter="{ filterModel }">
            <InputText
              type="text"
              v-model="filterModel.value"
              class="p-column-filter"
              :placeholder="`Search by Table Name`"
            /> </template
        ></PrimeColumn>

        <PrimeColumn
          field="tabletype"
          header="Type of Table"
          key="tabletype"
          class="tabletype"
        >
          <template #body="{ data }">
            {{ data.tabletype }}
          </template>

          <template #filter="{ filterModel }">
            <DropDown
              v-model="filterModel.value"
              :options="['Standard', 'Reserved']"
              optionLabel="text"
              placeholder="Any"
              class="p-column-filter"
              :showClear="true"
            >
              <template #value="slotProps">
                <div v-if="slotProps.value">
                  <div>{{ slotProps.value }}</div>
                </div>
                <span v-else>
                  {{ slotProps.placeholder }}
                </span>
              </template>
              <template #option="slotProps">
                <div class="item">
                  <div>{{ slotProps.option }}</div>
                </div>
              </template>
            </DropDown>
          </template></PrimeColumn
        >

        <PrimeColumn
          field="tablecapacity"
          header="Table Capacity"
          key="tablecapacity"
          class="tablecapacity"
        >
          <template #body="{ data }">
            {{ data.tablecapacity }}
          </template>
          <template #filter="{ filterModel }">
            <InputNumber
              v-model="filterModel.value"
              showButtons
              buttonLayout="horizontal"
              :step="1"
              decrementButtonClass="p-button-danger"
              incrementButtonClass="p-button-success"
              incrementButtonIcon="pi pi-plus"
              decrementButtonIcon="pi pi-minus"
            /> </template
        ></PrimeColumn>

        <PrimeColumn
          v-if="!detailsView"
          field="guestCount"
          header="Number of Guests"
          key="guestCount"
          class="guestCount"
        >
          <template #body="{ data }">
            {{ data.guestCount || 0 }}
          </template>
          <template #filter="{ filterModel }">
            <InputNumber
              v-model="filterModel.value"
              showButtons
              buttonLayout="horizontal"
              :step="1"
              decrementButtonClass="p-button-danger"
              incrementButtonClass="p-button-success"
              incrementButtonIcon="pi pi-plus"
              decrementButtonIcon="pi pi-minus"
            />
          </template>
        </PrimeColumn>

        <PrimeColumn
          field="tableStatus"
          header="Table Status"
          key="guests"
          class="tableStatus"
          datatype="boolean"
        >
          <template #body="{ data }"
            ><span>
              <i
                class="pi"
                :class="{
                  'true-icon pi-plus-circle': data.tableStatus,
                  'false-icon pi-ban': !data.tableStatus,
                }"
                style="font-size: 2rem"
              ></i
              ><br />{{ data.tableStatus ? " Space Available" : " Full" }}</span
            >
          </template>
          <template #filter="{ filterModel }">
            <TriStateCheckbox v-model="filterModel.value" /> </template
        ></PrimeColumn>

        <PrimeColumn
          field="organizations"
          header="Organizations"
          key="organizations"
          class="organizations"
        >
          <template #body="{ data }">
            {{
              [
                ...new Set(
                  data.organizations.map(
                    (each) =>
                      (each = lookup("organizations", each.organization))
                  )
                ),
              ].join("\r\n")
            }}
          </template>
          <template #filter="{ filterModel }">
            <InputText
              type="text"
              v-model="filterModel.value"
              class="p-column-filter"
              :placeholder="`Search by Organization`"
            /> </template
        ></PrimeColumn>
        <PrimeColumn
          field="createdAt"
          header="Created:"
          key="createdAt"
          :sortable="true"
          dataType="date"
        >
          <template #body="{ data }">
            {{ formatDate(data.createdAt) }},<br />{{
              formatTime(data.createdAt)
            }}
          </template>
          <template #filter="{ filterModel }">
            <PrimeCalendar
              v-model="filterModel.value"
              dateFormat="mm/dd/yy"
              placeholder="mm/dd/yyyy"
            /> </template
        ></PrimeColumn>

        <PrimeColumn
          field="updatedAt"
          header="Updated:"
          key="updatedAt"
          :sortable="true"
          dataType="date"
        >
          <template #body="{ data }">
            {{ formatDate(data.updatedAt) }},<br />
            {{ formatTime(data.updatedAt) }}
          </template>
          <template #filter="{ filterModel }">
            <PrimeCalendar
              v-model="filterModel.value"
              dateFormat="mm/dd/yy"
              placeholder="mm/dd/yyyy"
            /> </template
        ></PrimeColumn>
        <PrimeColumn :exportable="false" style="min-width: 8rem">
          <template #body="slotProps">
            <PrimeButton
              label="Edit"
              icon="pi pi-pencil"
              class="p-button-rounded p-button-success mr-2 edit-button"
              @click="editTable(slotProps.data)"
            />
            <PrimeButton
              icon="pi pi-trash"
              label="Delete"
              class="p-button-rounded p-button-warning delete-button"
              @click="confirmDeleteTable(slotProps.data)"
            />
          </template>
        </PrimeColumn>
      </DataTable>
    </div>
    <div>
      <PrimeDialog
        v-model:visible="tableDialog"
        :style="{ width: '450px' }"
        header="Table Details"
        :modal="true"
        class="p-fluid"
        @hide="() => loadLazyData()"
        ><InputTable :tableID="table.guid" :detailsView="detailsView"
      /></PrimeDialog>
      <PrimeDialog
        v-model:visible="deleteTableDialog"
        :style="{ width: '450px' }"
        header="Confirm"
        :modal="true"
      >
        <div class="confirmation-content">
          <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
          <span v-if="table"
            >Are you sure you want to delete table # <b>{{ table.tablename }}</b
            >?<br />
            This will reset all associated guests.<br /><b
              >This action cannot be undone.</b
            ></span
          >
        </div>
        <template #footer>
          <PrimeButton
            label="No"
            icon="pi pi-times"
            class="p-button-text"
            @click="deleteTableDialog = false"
          />
          <PrimeButton
            label="Yes"
            icon="pi pi-check"
            class="p-button-text"
            @click="deleteTable"
          />
        </template>
      </PrimeDialog>
    </div>
  </div>
</template>

<script>
import formServices from "../services/settings.services";
import InputTable from "./inputs/InputTable.vue";
import { ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useFinancialStore } from "../stores/financial";
import { useTablesStore } from "../stores/tables";
import router from "../router";

export default {
  props: {
    data: Array,
    detailsView: Boolean,
    tableID: String,
  },
  setup(props) {
    const financialStore = useFinancialStore();

    const tableStore = useTablesStore();
    const { tables } = storeToRefs(useTablesStore());

    const columns = ref(formServices.get("tableSelection") || []);
    const organizations = ref(
      (formServices.get("organizations") || []).map((each) => each.value)
    );
    const dataTableRender = ref(0);
    const dt = ref();

    let message = ref(false);
    const messageText = ref({ severity: null, text: "" });

    //Define filters for table sorting and searching
    const filters = ref(formServices.get("tableFilters") || {});
    const clearFilters = () => {
      initFilters();
    };
    const initFilters = () => {
      filters.value = formServices.get("tableFilters") || {};
    };

    const loading = ref(false);

    //Fill tables datatables with appropriate data based on props
    const fillList = async function () {
      financialStore.$reset;
      loading.value = true;
      try {
        if (props.tableID) return await tableStore.fillTable(props.tableID);
        else return await tableStore.fillTables();
      } catch (error) {
        loading.value = false;
        console.warn(error);
        message.value = true;
        messageText.value = {
          severity: "error",
          text: "Could not fetch tables.",
        };
      } finally {
        loading.value = false;
        setTimeout(() => (message.value = false), 1500);
      }
    };

    const loadLazyData = () => {
      fillList().then(() => {
        tables.value.forEach((table) => {
          table.createdAt = new Date(table.createdAt);
          table.updatedAt = new Date(table.updatedAt);
          table.guestCount = Number(table.guests.length);
          table.tableStatus =
            table.guests.length < table.tablecapacity ? true : false;
        });
      });
    };

    onMounted(() => {
      loadLazyData();
    });

    //Helper Functions

    const lookup = function (key, value) {
      return formServices.lookup(key, value);
    };

    const exportCSV = () => {
      dt.value.exportCSV();
    };

    const formatDate = (value) => {
      const date = new Date(value);
      return date.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    };

    const formatTime = (value) => {
      const date = new Date(value);

      return date.toLocaleTimeString("en-US", {
        hour12: true,
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    //PrimeDialog Controls

    const table = ref({});
    const tableDialog = ref(false);
    const deleteTableDialog = ref(false);

    const editTable = (prod) => {
      table.value = { ...prod };
      tableDialog.value = true;
    };
    const confirmDeleteTable = (prod) => {
      table.value = prod;
      deleteTableDialog.value = true;
    };

    const hideDialog = () => {
      tableDialog.value = false;
    };

    //Table Information Controls

    const deleteTable = async function () {
      loading.value = true;
      try {
        tableStore
          .deleteTable(table.value["_id"])
          .then(fillList())
          .then(() => {
            loading.value = false;
            message.value = true;
            messageText.value = {
              severity: "success",
              text: "Successfully deleted table and reset all connected guests.",
            };
          });
      } catch (error) {
        loading.value = false;
        console.warn(error);
        message.value = true;
        messageText.value = {
          severity: "error",
          text: "Could not delete table.",
        };
      } finally {
        deleteTableDialog.value = false;

        await new Promise((resolve) => setTimeout(resolve, 1500)).then(() => {
          message.value = false;
          if (props.detailsView) router.push("/admin/tables");
          else fillList();
        });
      }
    };

    return {
      columns,
      organizations,
      table,
      tableDialog,
      deleteTableDialog,
      dataTableRender,
      filters,
      loading,
      message,
      messageText,
      dt,
      clearFilters,
      exportCSV,
      formatDate,
      formatTime,
      lookup,
      editTable,
      confirmDeleteTable,
      deleteTable,
      hideDialog,
      loadLazyData,
      tables,
    };
  },
  components: { InputTable },
};
</script>

<style lang="scss" scoped>
.table-data-view {
  white-space: pre;

  .p-datatable-header {
    div {
      display: flex;
      flex-wrap: wrap;
    }
  }

  .p-button {
    margin-left: 1em;
    margin-right: 1em;
    .edit-button {
      margin: 2em;
    }
    .delete-button {
      margin: none;
    }
  }

  .p-input-icon-left {
    margin-left: 1em;
    margin-right: 1em;
  }
}
</style>
