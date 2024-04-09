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
          `orgList`,
        ]"
        :loading="loading"
        showGridlines
        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
        :rowsPerPageOptions="[10, 20, 50]"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
        :exportFilename="exportNameFunction()"
        @rowReorder="onRowReorder"
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
              <FloatLabel>
              <InputText
              id="keyword-search-tables"
                v-model="filters['global'].value"
              />
              <label for="keyword-search-tables"><i class="pi pi-search" />{{"  "}}Keyword Search</label>
            </FloatLabel>
            </span>
          </div>
        </template>
        <template #empty> No tables found. </template>
        <template #loading> Loading table data. Please wait. </template>
        <!-- <PrimeColumn
          v-if="currentUrl.includes('/admin/tables')"
          rowReorder headerStyle="width: 3rem" field="tableindex" key="tableindex" class="tableindex"></PrimeColumn> -->
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
          dataType="numeric"
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
          dataType="numeric"
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
            <TriStateCheckbox v-model="filterModel.value" /> Space
            Available?</template
          ></PrimeColumn
        >

        <PrimeColumn
          field="organizations"
          header="Government Organizations"
          key="organizations"
          class="organizations"
          filterField="orgList"
        >
          <template #body="{ data }">
            {{ data.organizations ? 
              [
                ...new Set(
                  data.organizations.map(
                    (each) =>
                      (each = lookup("organizations", each.organization))
                  )
                ),
              ].filter(Boolean).join("\r\n") : null
            }}
          </template>
          <template #filter="{ filterModel }">
            <DropDown
              v-model="filterModel.value"
              :options="organizationsFilter"
              optionLabel="text"
              placeholder="Any"
              class="p-column-filter"
              :showClear="true"
            >
              <template #value="slotProps">
                <div v-if="slotProps.value">
                  <div>{{ lookup("organizations", slotProps.value) }}</div>
                </div>
                <span v-else>
                  {{ slotProps.placeholder }}
                </span>
              </template>
              <template #option="slotProps">
                <div class="item">
                  <div>{{ lookup("organizations", slotProps.option) }}</div>
                </div>
              </template>
            </DropDown>
          </template></PrimeColumn
        >
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
            <div class="p-buttonset">
            <PrimeButton
              label=""
              v-tooltip.top="'Edit'"
              icon="pi pi-pencil"
              class="p-button-rounded p-button-success m-0 p-0 edit-button"
              @click="editTable(slotProps.data)"
            />
            <ConfirmDialog></ConfirmDialog>
            <PrimeButton
              v-if="detailsView"
              label=""
              v-tooltip.top="'Reset Table'"
              icon="pi pi-replay"
              class="p-button-rounded p-button-warning m-0 p-0 reset-button"
              @click="resetTable(slotProps.data)"
            />
            <PrimeButton
              icon="pi pi-trash"
              label=""
              v-tooltip.top="'Delete Table'"
              class="p-button-rounded p-button-danger m-0 p-0 delete-button"
              @click="confirmDeleteTable(slotProps.data)"
            />
          </div>
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
import { useConfirm } from "primevue/useconfirm";
import router from "../router";
import { useGuestsStore } from "../stores/guests";

export default {
  props: {
    data: Array,
    detailsView: Boolean,
    tableID: String,
  },
  setup(props) {
    const confirm = useConfirm();
    const financialStore = useFinancialStore();
    const guestStore = useGuestsStore();

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

    const organizationsFilter = ref(
      (formServices.get("organizations") || []).map((each) => each.value)
    );
    const filteredOrganizations = ref();
    //filters organizations on drop-down
    const searchOrganization = (event) => {
      setTimeout(() => {
        if (!event.query.trim().length) {
          filteredOrganizations.value = organizations.value;
        } else {
          filteredOrganizations.value = organizations.value.filter(
            (organization) => {
              return organization.text
                .toLowerCase()
                .startsWith(event.query.toLowerCase());
            }
          );
        }
      }, 100);
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
          table["orgList"] = table.organizations
            .map((each) => each.organization)
            .filter(Boolean)
            .join("\r\n");
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
      dt.value.value.map((each) => {
        const organizations = {
          
          organizations: each.organizations ?
          [
                ...new Set(
                  each.organizations.map(
                    (each) =>
                      (each = lookup("organizations", each.organization))
                  )
                ),
              ].filter(Boolean).join("\r\n") : null
        };

        const tableStatus = {
          tableStatus: each.tableStatus ? "Space Available" : "Full Table"
        }

        each = Object.assign(
          each,
          organizations,
          tableStatus
        );
      });
      dt.value.exportCSV()
      loadLazyData();
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
    const resetTable = (event) => {
      confirm.require({
        target: event.currentTarget,
        message: 'Are you sure you want to reset the guest list for this table?',
        icon: 'pi pi-exclamation-triangle',
        rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
        acceptClass: 'p-button-sm',
        rejectLabel: 'Cancel',
        acceptLabel: 'Save',
        accept: async () => {

          const guestLoop = new Promise(async (resolve) => {
            for (const guest of event.guests) {
              await guestStore.updateGuest(guest, { table: null, seat: "" });
            }
            resolve();
          });

          loading.value = true;
          if (event._id && event.guestCount > 0) {
            guestLoop
              .then(async () => {
                await tableStore.updateTable(event._id, { guests: [], organizations: [] })
              })
              .catch((error) => {
                loading.value = false;
                console.warn(error);
                message.value = true;
                messageText.value = {
                  severity: "error",
                  text: "Guests and table could not be updated.",
                };
              }).finally(() => {
                new Promise((resolve) => setTimeout(resolve, 1500))
                  .then(() => {
                    message.value = false;
                  })
                  .then(() => {
                    loading.value = false;
                    location.reload();
                  });
              })
          } else {
            await tableStore.updateTable(event._id, { guests: [], organizations: [] }).then(() => {
              loading.value = false;
              location.reload();
            })
            

          }
        },
        reject: () => {
        }
      });

    };

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

    const exportNameFunction = () => {
      const date = new Date();
      const currentDay = String(date.getDate()).padStart(2, '0');
      const currentMonth = String(date.getMonth()+1).padStart(2,"0");
      const currentYear = date.getFullYear();
      const exportName = `Tables - ${currentDay}-${currentMonth}-${currentYear}`
      return exportName;
    }

    const currentUrl = window.location.href;
       //Manage row reordering function
       const onRowReorder = (event) => {
      // Check if the URL contains the tables page

      const tableSeating = currentUrl.includes('/admin/tables');
      if (tableSeating) {
        tables.value = event.value;
        event.value.forEach((item, index) => {
          // console.log(event.value[index], 'this is the loop before')
          event.value[index] = { ...item, tableindex: ref(index + 1) }; // Updating reactive index key-value pair
          // console.log(event.value[index], 'this is the loop after')
        });

        tables.value.forEach((data) => {
          const newTableIndex = data.tableindex;
          console.log(newTableIndex, 'this is table index and id', data._id, data.tableindex, 'this is data')
          tableStore.updateTable(data._id, { ...data, tableindex: newTableIndex })
        })
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
      filteredOrganizations,
      searchOrganization,
      organizationsFilter,
      resetTable,
      exportNameFunction,
      currentUrl,
      onRowReorder
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

  .p-input-icon-left {
    margin-left: 1em;
    margin-right: 1em;
  }
}
</style>
