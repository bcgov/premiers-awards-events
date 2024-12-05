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

      <DataTable
        class="p-datatable-sm"
        :value="users"
        responsiveLayout="stack"
        :rows="10"
        ref="dt"
        stripedRows
        v-model:filters="filters"
        sortField="createdAt"
        :sortOrder="-1"
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
            <div v-for="role in data.roles">{{ lookup("roles", role) }}</div>
          </template>
          <template #filter="{ filterModel }">
            <DropDown
              v-model="filterModel.value"
              :options="rolesFilter"
              optionLabel="text"
              placeholder="Any"
              class="p-column-filter"
              :showClear="true"
            >
              <template #value="slotProps">
                <div v-if="slotProps.value">
                  <div>{{ lookup("roles", slotProps.value) }}</div>
                </div>
                <span v-else>
                  {{ slotProps.placeholder }}
                </span>
              </template>
              <template #option="slotProps">
                <div class="item">
                  <div>{{ lookup("roles", slotProps.option) }}</div>
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
            }} </template
          ><template #filter="{ filterModel }">
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
            {{ formatTime(data.updatedAt) }} </template
          ><template #filter="{ filterModel }">
            <PrimeCalendar
              v-model="filterModel.value"
              dateFormat="mm/dd/yy"
              placeholder="mm/dd/yyyy"
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
            ></div>

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
            optionLabel="label"
            optionValue="key"
            placeholder="Select a Role"
          />
          <DropDown
            v-else-if="isAdmin"
            id="organization"
            v-model="user.role"
            :options="adminRoles"
            optionLabel="label"
            optionValue="key"
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
import { useSettingsStore } from "../stores/settings";
import { useAuthUserStore } from "../stores/users";
import { ref } from "vue";
import { storeToRefs } from "pinia";
import PageHeader from "../components/common/PageHeader.vue";

export default {
  setup() {
    const userStore = useAuthUserStore();
    const settings = useSettingsStore();
    const { users } = storeToRefs(useAuthUserStore());
    const isAdmin = userStore.isAdmin;
    const isSuperAdmin = userStore.isSuperAdmin;
    const dt = ref();
    const roles = ref(settings.lookup("roles") || []);
    const rolesFilter = ref(
      (settings.lookup("roles") || []).map((each) => each.value)
    );
    const dropdownRoles = settings
      .lookup("roles")
      .filter((item) => item.key !== "nominator");
    const adminRoles = (settings.lookup("roles") || [])
      .filter((item) => item.key !== "super-administrator")
      .filter((item) => item.key !== "nominator");

    const selfAssignment = (guid) => {
      const user = userStore.getUser;
      return guid === user.guid;
    };

    let loading = ref(false);
    const load = async function () {
      try {
        loading.value = true;
        userStore.$reset;
        await userStore.getUsers().then(() => {
          users.value.forEach((user) => {
            user.createdAt = new Date(user.createdAt);
            user.updatedAt = new Date(user.updatedAt);
          });
        });
        loading.value = false;
      } catch (err) {
        loading.value = false;
        console.warn(err);
      }
    };
    const lookup = function (key, value) {
      return settings.lookup(key, value);
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
    const filters = ref(settings.lookup("userFilters") || {});
    const clearFilters = () => {
      initFilters();
    };
    const initFilters = () => {
      filters.value = settings.lookup("userFilters") || {};
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

    const saveUser = async function (event) {
      event.preventDefault();
      submitted.value = true;
      await userStore
        .updateUser(user.value["guid"], user.value)
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
      rolesFilter,
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
