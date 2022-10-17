<template>
  <main>
    <div v-if="isAdmin">
      <PageHeader
        title="Manage Users"
        subtitle="Manage user access and account types for the event registration application"
      />
      <PrimeCard v-if="loading">
        <PrimeRow class="vh-50 text-center" align-v="center">
          <PrimeColumn id="spinner"
            ><ProgressSpinner label="Loading..."></ProgressSpinner
          ></PrimeColumn>
        </PrimeRow>
      </PrimeCard>
      <a :href="adminURL">
        <PrimeButton
          class="m2 p-button-success"
          type="button"
          id="user-management-button"
          icon="pi pi-sign-in"
          label="Go to Premier's Awards Advanced User Management"
          :href="adminURL"
        ></PrimeButton>
      </a>

      <DataTable
        class="p-datatable-sm"
        :value="users"
        responsiveLayout="stack"
        :rows="10"
        ref="dt"
        stripedRows
        v-model:filters="filters"
        filterDisplay="menu"
        :globalFilterFields="[
          'guid',
          'username',
          'firstname',
          'lastname',
          'email',
          'role',
        ]"
        :loading="loading"
        showGridlines
        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
        :rowsPerPageOptions="[10, 20, 50]"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
      >
        <template #header>
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
                title="Search all by keyword"
                v-model="filters['global'].value"
                placeholder="Keyword Search"
              />
            </span>
          </div>
        </template>
        <template #empty> No users found. </template>
        <template #loading> Loading guest data. Please wait. </template>

        <PrimeColumn
          v-if="userStore.getUser.role === 'super-administrator'"
          field="guid"
          header="guid"
          key="guid"
          class="guid"
        >
          <template #body="{ data }"> {{ data.guid }} </template
          ><template #filter="{ filterModel }">
            <InputText
              type="text"
              v-model="filterModel.value"
              class="p-column-filter"
              placeholder="Search by ID#"
            /> </template
        ></PrimeColumn>

        <PrimeColumn field="username" header="Username" key="username">
          <template #body="{ data }"> {{ data.username }} </template
          ><template #filter="{ filterModel }">
            <InputText
              type="text"
              v-model="filterModel.value"
              class="p-column-filter"
              placeholder="Search by Username"
            /> </template
        ></PrimeColumn>

        <PrimeColumn field="firstname" header="First Name" key="firstname">
          <template #body="{ data }"> {{ data.firstname }} </template
          ><template #filter="{ filterModel }">
            <InputText
              type="text"
              v-model="filterModel.value"
              class="p-column-filter"
              placeholder="Search by First Name"
            /> </template
        ></PrimeColumn>

        <PrimeColumn field="lastname" header="Last Name" key="lastname">
          <template #body="{ data }"> {{ data.lastname }} </template
          ><template #filter="{ filterModel }">
            <InputText
              type="text"
              v-model="filterModel.value"
              class="p-column-filter"
              placeholder="Search by Last Name"
            /> </template
        ></PrimeColumn>

        <PrimeColumn field="email" header="Email" key="email">
          <template #body="{ data }"> {{ data.email }} </template
          ><template #filter="{ filterModel }">
            <InputText
              type="text"
              v-model="filterModel.value"
              class="p-column-filter"
              placeholder="Search by Email"
            /> </template
        ></PrimeColumn>

        <PrimeColumn field="role" header="Role" key="role">
          <template #body="{ data }">
            {{ lookup("roles", data.role) }} </template
          ><template #filter="{ filterModel }">
            <InputText
              type="text"
              v-model="filterModel.value"
              class="p-column-filter"
              placeholder="Search by role"
            /> </template
        ></PrimeColumn>

        <PrimeColumn
          field="eventregistrar"
          header="Eligible to Register?"
          key="eventregistrar"
          dataType="boolean"
          filterField="eventregistrar"
          sortable
        >
          <template #body="{ data }"
            ><span
              v-if="
                data.role === 'administrator' ||
                data.role === 'super-administrator'
              "
              ><i
                class="true-icon pi pi-check-circle"
                style="font-size: 2rem"
              ></i
              ><br />
              <div>Eligible as Admin</div></span
            >
            <span v-else>
              <i
                :class="{
                  'true-icon pi pi-check-circle': data.eventregistrar,
                  'false-icon pi pi-times-circle': !data.eventregistrar,
                }"
                style="font-size: 2rem"
              ></i
              ><br />
              <div v-if="data.eventregistrar">Eligible Event Registrar</div>
              <div v-else>Pending</div></span
            >
          </template>
          <template #filter="{ filterModel }">
            <TriStateCheckbox v-model="filterModel.value" /> </template
        ></PrimeColumn>

        <PrimeColumn
          field="createdAt"
          header="Created:"
          key="createdAt"
          :sortable="true"
        >
          <template #body="{ data }">
            {{ formatDate(data.createdAt) }},<br />{{
              formatTime(data.createdAt)
            }} </template
          ><template #filter="{ filterModel }">
            <InputText
              type="text"
              v-model="filterModel.value"
              class="p-column-filter"
              placeholder="Search by Date Created"
            /> </template
        ></PrimeColumn>

        <PrimeColumn
          field="updatedAt"
          header="Updated:"
          key="updatedAt"
          :sortable="true"
        >
          <template #body="{ data }">
            {{ formatDate(data.updatedAt) }},<br />
            {{ formatTime(data.updatedAt) }} </template
          ><template #filter="{ filterModel }">
            <InputText
              type="text"
              v-model="filterModel.value"
              class="p-column-filter"
              placeholder="Search by Date Updated"
            /> </template
        ></PrimeColumn>
        <PrimeColumn
          :exportable="false"
          style="min-width: 8rem"
          header="Edit User:"
        >
          <template #body="slotProps">
            <PrimeButton
              v-if="
                slotProps.data.role !== 'super-administrator' &&
                slotProps.data.role !== userStore.getUser.role
              "
              icon="pi pi-pencil"
              class="p-button-rounded p-button-success mr-2"
              @click="editUser(slotProps.data)"
              >Edit</PrimeButton
            >
            <div
              v-if="
                slotProps.data.role !== 'super-administrator' &&
                slotProps.data.role !== 'administrator' &&
                slotProps.data.role !== 'inactive' &&
                slotProps.data.role !== userStore.getUser.role
              "
            >
              <PrimeButton
                v-if="!slotProps.data.eventregistrar"
                label="Activate"
                class="p-button-primary"
                @click="toggleRegistrar(slotProps.data)"
              />
              <PrimeButton
                v-else-if="slotProps.data.eventregistrar"
                label="Deactivate"
                class="p-button-danger"
                @click="toggleRegistrar(slotProps.data)"
              />
            </div>

            <div>
              <router-link to="/user/update">
                <PrimeButton
                  v-if="selfAssignment(slotProps.data.guid)"
                  icon="pi pi-pencil"
                  class="p-button-rounded p-button-success mr-2"
              /></router-link>
            </div>
          </template>
        </PrimeColumn>
      </DataTable>
      <PrimeDialog
        v-model:visible="userDialog"
        :style="{ width: '450px' }"
        header="Edit User Role"
        :modal="true"
        class="p-fluid"
      >
        <a :href="adminURL" v-if="user.role === 'nominator'">
          <PrimeButton
            class="m2 p-button-success"
            type="button"
            id="user-management-button"
            icon="pi pi-sign-in"
            label="Go to Premier's Awards Advanced User Management"
            :href="adminURL"
          ></PrimeButton>
        </a>
        <div class="dropdown" v-if="user.role !== 'nominator'">
          <label for="organization">Role:</label>
          <DropDown
            v-if="isSuperAdmin"
            id="organization"
            v-model="user.role"
            :options="dropdownRoles"
            optionLabel="text"
            optionValue="value"
            placeholder="Select a Role"
          />
          <DropDown
            v-else-if="isAdmin"
            id="organization"
            v-model="user.role"
            :options="adminRoles"
            optionLabel="text"
            optionValue="value"
            placeholder="Select a Role"
          />
        </div>
        <template #footer>
          <small v-if="user.role === 'nominator'"
            ><p class="p-error">
              Nominators cannot have their role changed here. Please navigate to
              Advanced User Management to modify nominator roles.
            </p></small
          >
          <PrimeButton
            label="Cancel"
            icon="pi pi-times"
            class="p-button-text"
            @click="hideDialog"
          />
          <PrimeButton
            v-if="!selfAssignment(user.guid) && user.role !== 'nominator'"
            label="Save"
            icon="pi pi-check"
            class="p-button-text"
            @click="saveUser"
          />
        </template>
      </PrimeDialog>
      <PrimeDialog
        v-model:visible="deleteUserDialog"
        :style="{ width: '450px' }"
        header="Confirm"
        :modal="true"
      >
        <div class="confirmation-content">
          <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
          <span v-if="registration"
            >Are you sure you want to delete user <b>{{ user.username }}</b> for
            contact {{ user.firstname }} {{ user.lastname }}?</span
          >
        </div>
        <template #footer>
          <PrimeButton
            label="No"
            icon="pi pi-times"
            class="p-button-text"
            @click="deleteUserDialog = false"
          />
          <PrimeButton
            label="Yes"
            icon="pi pi-check"
            class="p-button-text"
            @click="deleteUser"
          />
        </template>
      </PrimeDialog>
    </div>
  </main>
</template>

<script>
import formServices from "../services/settings.services";
import { useAuthUserStore } from "../stores/users";
import { ref } from "vue";
import { storeToRefs } from "pinia";
import PageHeader from "../components/common/PageHeader.vue";

export default {
  setup() {
    const userStore = useAuthUserStore();
    const { users } = storeToRefs(useAuthUserStore());
    const isAdmin = userStore.isAdmin;
    const isSuperAdmin = userStore.isSuperAdmin;
    const dt = ref();
    const roles = ref(formServices.get("roles") || []);
    const dropdownRoles = (formServices.get("roles") || []).filter(
      (item) => item.value !== "nominator"
    );
    const adminRoles = (formServices.get("roles") || [])
      .filter((item) => item.value !== "super-administrator")
      .filter((item) => item.value !== "nominator");

    const adminURL =
      process.env.NODE_ENV === "production"
        ? `https://premiersawards.gww.gov.bc.ca/nominations/admin/user/list`
        : process.env.NODE_ENV === "dev"
        ? "https://engagement.gww.gov.bc.ca/nominations/admin/user/list"
        : "http://localhost:3002/event-registrations/admin/user/list";

    const selfAssignment = (guid) => {
      const user = userStore.getUser;
      return guid === user.guid;
    };

    let loading = ref(false);
    const load = async function () {
      try {
        loading.value = true;
        userStore.$reset;
        await userStore.getUsers();
        loading.value = false;
      } catch (err) {
        loading.value = false;
        console.warn(err);
      }
    };
    const lookup = function (key, value) {
      return formServices.lookup(key, value);
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

    //User Filters
    const filters = ref(formServices.get("userFilters") || {});
    const clearFilters = () => {
      initFilters();
    };
    const initFilters = () => {
      filters.value = formServices.get("userFilters") || {};
    };

    const exportCSV = () => {
      dt.value.exportCSV();
    };

    const user = ref({});
    const submitted = ref(false);
    const userDialog = ref(false);
    const deleteUserDialog = ref(false);

    //PrimeDialog controls
    const editUser = (prod) => {
      user.value = { ...prod };
      userDialog.value = true;
    };

    const hideDialog = () => {
      userDialog.value = false;
      submitted.value = false;
    };

    const toggleRegistrar = async function (userData) {
      user.value = userData;

      let registrarStatus = userData.eventregistrar ? false : true;
      userStore
        .updateUser(user.value["guid"], { eventregistrar: registrarStatus })
        .then(() => {
          user.value = {};
        })
        .then(load())
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          load();
        });
    };

    const saveUser = async function (event) {
      event.preventDefault();
      submitted.value = true;
      let eligibleRegistrar = false;
      if (user.value.role !== "inactive" && user.value.role !== undefined) {
        eligibleRegistrar = true;
      }

      await userStore
        .updateUser(user.value["guid"], user.value)
        .then(async () => {
          await userStore.updateUser(user.value["guid"], {
            eventregistrar: eligibleRegistrar,
          });
        })
        .then(() => {
          userDialog.value = false;
          user.value = {};
        })
        .then(load())
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          load();
        });
    };

    const deleteUser = async function () {
      userStore
        .removeUser(user.value["guid"])
        .then(() => {
          userDialog.value = false;
          user.value = {};
        })
        .then(load())
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          load();
        });
    };

    load();
    return {
      users,
      dt,
      userStore,
      loading,
      isAdmin,
      isSuperAdmin,
      selfAssignment,
      lookup,
      formatDate,
      formatTime,
      filters,
      clearFilters,
      exportCSV,
      userDialog,
      editUser,
      saveUser,
      deleteUser,
      user,
      roles,
      dropdownRoles,
      adminRoles,
      submitted,
      hideDialog,
      deleteUserDialog,
      adminURL,
      toggleRegistrar,
    };
  },
  components: { PageHeader },
};
</script>

<style scoped>
#user-management-button {
  margin-bottom: 1em;
}
</style>
