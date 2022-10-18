<!-- List of all guests with option to add to a table. -->
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
        class="p-datatable-sm"
        :value="guests"
        :paginator="true"
        responsiveLayout="stack"
        breakpoint="450px"
        :rows="10"
        ref="dt"
        stripedRows
        v-model:filters="filters"
        filterDisplay="menu"
        :globalFilterFields="['firstname', 'lastname']"
        :loading="loading"
        showGridlines
        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
        :rowsPerPageOptions="[10, 20, 50]"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
      >
        <template #header>
          <div style="text-align: left">
            <span class="p-input-icon-left">
              <i class="pi pi-search" />
              <InputText
                title="Search Guest List."
                v-model="filters['global'].value"
                placeholder="Search Guest List"
              />
            </span>
          </div>
        </template>
        <template #empty> No guests found. </template>
        <template #loading> Loading guest data. Please wait. </template>

        <PrimeColumn field="firstname" header="First Name" key="firstname">
          <template #body="{ data }">
            {{ data.firstname }}
          </template></PrimeColumn
        >
        <PrimeColumn field="lastname" header="Last Name" key="lastname">
          <template #body="{ data }">
            {{ data.lastname }}
          </template></PrimeColumn
        >
        <PrimeColumn
          field="assignedTable"
          header="Table"
          key="assignedTable"
          dataType="boolean"
        >
          <template #body="{ data }"
            ><span>
              <i
                class="pi pi-check-circle"
                :class="{
                  'true-icon pi-check-circle': data.assignedTable,
                  'false-icon pi-times-circle': !data.assignedTable,
                }"
                style="font-size: 2rem"
              ></i
              ><br />{{ data.assignedTable ? " Assigned" : " Pending" }}</span
            >
          </template>
          <template #filter="{ filterModel }">
            <TriStateCheckbox v-model="filterModel.value" /> </template
        ></PrimeColumn>
        <PrimeColumn field="details" header="Guest Details" key="registration">
          <template #body="{ data }">
            {{ lookup("attendancetypes", data.attendancetype) }}
            <br />
            Organization:
            {{
              lookup("organizations", data.organization) || data.organization
            }}

            <br />
            Registration:
            <router-link
              :to="`/admin/edit/${data.registration}`"
              class="registration-link"
              >{{ data.registration }}</router-link
            >
          </template></PrimeColumn
        >

        <PrimeColumn :exportable="false" style="min-width: 8rem" header="Add:">
          <template #body="slotProps">
            <PrimeButton
              v-if="!tableStore.getIsFull"
              icon="pi pi-pencil"
              label="Add Guest to Table"
              class="p-button-rounded p-button-success mr-2 edit-button"
              @click="onAdd(slotProps.data)"
            />
          </template>
        </PrimeColumn>
      </DataTable>
    </div>
    <div></div>
  </div>
</template>

<script>
import formServices from "../../services/settings.services";
import apiRoutes from "../../services/api-routes.services";
import { ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useGuestsStore } from "../../stores/guests";
import { useTablesStore } from "../../stores/tables";

export default {
  props: {
    tableID: String,
  },
  setup(props) {
    const guestStore = useGuestsStore();
    const guests = ref();
    const columns = ref(formServices.get("guestSelection") || []);
    const organizations = ref(formServices.get("organizations") || []);

    const dt = ref();
    const loading = ref(false);
    let message = ref(false);
    const messageText = ref({ severity: null, text: "" });
    const tableStore = useTablesStore();

    //Get all guest data
    const fillList = async function () {
      loading.value = true;
      try {
        guests.value = await (await apiRoutes.getAllGuests()).data;
        guests.value.map((each) => {
          each.assignedTable = each.table ? true : false;
        });
      } catch (error) {
        loading.value = false;
        console.warn(error);
        message.value = true;
        messageText.value = {
          severity: "error",
          text: "Could not fetch guests.",
        };
      } finally {
        loading.value = false;
        setTimeout(() => (message.value = false), 1500);
      }
    };

    const loadLazyData = () => {
      fillList();
    };

    onMounted(() => {
      loadLazyData();
    });

    //Sorting Filters for DataList

    const filters = ref(formServices.get("guestFilters") || {});

    //Helper Functions

    const lookup = function (key, value) {
      return formServices.lookup(key, value);
    };

    //PrimeDialog controls
    const guest = ref({});

    //add new guest to table
    const onAdd = async function (guest) {
      await tableStore.fillOnlyTable(props.tableID);
      const { table } = storeToRefs(useTablesStore());
      const tablevalue = table.value;
      const tableGUID = tablevalue["_id"];
      const guestID = guest._id;
      try {
        loading.value = true;
        if (guest.table != null) {
          await guestStore.removeGuestFromTable(
            guestID,
            { table: null },
            {
              _id: guest.table,
            }
          );
        }
        await guestStore.addGuestToTable(
          guestID,
          { table: tableGUID, organization: guest.organization },
          tablevalue
        );
      } catch (error) {
        loading.value = false;
        console.warn(error);
        message.value = true;
        messageText.value = {
          severity: "error",
          text: "Guest and table could not be updated.",
        };
      } finally {
        loading.value = false;
        setTimeout(() => (message.value = false), 1500);
        fillList();
      }
    };

    return {
      columns,
      tableStore,
      dt,
      filters,
      loading,
      message,
      messageText,
      organizations,
      guests,
      guest,
      lookup,
      loadLazyData,
      onAdd,
    };
  },
};
</script>

<style scoped>
.p-datatable-sm tr td {
  font-size: 16px;
  padding: 0.3rem;
}

.guid {
  line-break: anywhere;
}
.p-datatable-wrapper {
  line-height: 1rem;
}

.checkbox-group {
  display: flex;
  flex-wrap: wrap;
}

.edit-button {
  margin-left: 0;
}
</style>
