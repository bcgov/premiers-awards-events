<template>
  <div v-if="isAdmin">
    <PageHeader
      title="Manage Users"
      subtitle="Manage User Access and Accounts"
    />
    <Card v-if="loading">
      <Row class="vh-50 text-center" align-v="center">
        <Column id="spinner"><Spinner label="Loading..."></Spinner></Column>
      </Row>
    </Card>

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
          <Button
            icon="pi pi-external-link"
            label="Export"
            @click="exportCSV($event)"
          />
          <Button
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
      <template #empty> No users found. </template>
      <template #loading> Loading guest data. Please wait. </template>

      <Column
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
      ></Column>

      <Column field="username" header="Username" key="username">
        <template #body="{ data }"> {{ data.username }} </template
        ><template #filter="{ filterModel }">
          <InputText
            type="text"
            v-model="filterModel.value"
            class="p-column-filter"
            placeholder="Search by Username"
          /> </template
      ></Column>

      <Column field="firstname" header="First Name" key="firstname">
        <template #body="{ data }"> {{ data.firstname }} </template
        ><template #filter="{ filterModel }">
          <InputText
            type="text"
            v-model="filterModel.value"
            class="p-column-filter"
            placeholder="Search by First Name"
          /> </template
      ></Column>

      <Column field="lastname" header="Last Name" key="lastname">
        <template #body="{ data }"> {{ data.lastname }} </template
        ><template #filter="{ filterModel }">
          <InputText
            type="text"
            v-model="filterModel.value"
            class="p-column-filter"
            placeholder="Search by Last Name"
          /> </template
      ></Column>

      <Column field="email" header="Email" key="email">
        <template #body="{ data }"> {{ data.email }} </template
        ><template #filter="{ filterModel }">
          <InputText
            type="text"
            v-model="filterModel.value"
            class="p-column-filter"
            placeholder="Search by Email"
          /> </template
      ></Column>

      <Column field="role" header="Role" key="role">
        <template #body="{ data }"> {{ lookup("roles", data.role) }} </template
        ><template #filter="{ filterModel }">
          <InputText
            type="text"
            v-model="filterModel.value"
            class="p-column-filter"
            placeholder="Search by role"
          /> </template
      ></Column>

      <Column
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
      ></Column>

      <Column
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
      ></Column>
      <Column :exportable="false" style="min-width: 8rem" header="Edit User:">
        <template #body="slotProps">
          <Button
            v-if="
              slotProps.data.role !== 'super-administrator' &&
              slotProps.data.role !== userStore.getUser.role
            "
            icon="pi pi-pencil"
            class="p-button-rounded p-button-success mr-2"
            @click="editUser(slotProps.data)"
          />
          <!-- <Button
            v-if="
              slotProps.data.role !== 'super-administrator' &&
              userStore.getUser.role === 'super-administrator'
            "
            icon="pi pi-trash"
            class="p-button-rounded p-button-warning"
            @click="confirmDeleteRegistration(slotProps.data)"
          /> -->
          <router-link to="/user/update">
            <Button
              v-if="selfAssignment(slotProps.data.guid)"
              icon="pi pi-pencil"
              class="p-button-rounded p-button-success mr-2"
          /></router-link>
        </template>
      </Column>
    </DataTable>
    <Dialog
      v-model:visible="userDialog"
      :style="{ width: '450px' }"
      header="Edit User Role"
      :modal="true"
      class="p-fluid"
    >
      <div class="dropdown">
        <label for="organization">Role:</label>
        <Dropdown
          v-if="isSuperAdmin"
          id="organization"
          v-model="user.role"
          :options="roles"
          optionLabel="text"
          optionValue="value"
          placeholder="Select a Role"
        />
        <Dropdown
          v-else-if="isAdmin"
          id="organization"
          v-model="user.role"
          :options="adminRoles"
          optionLabel="text"
          optionValue="value"
          placeholder="Select a Role"
        />
        <small class="p-error" v-if="submitted && !user.role"
          >Role is required.</small
        >
      </div>
      <template #footer>
        <Button
          label="Cancel"
          icon="pi pi-times"
          class="p-button-text"
          @click="hideDialog"
        />
        <Button
          v-if="!selfAssignment(user.guid)"
          label="Save"
          icon="pi pi-check"
          class="p-button-text"
          @click="saveUser"
        />
      </template>
    </Dialog>
    <Dialog
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
        <Button
          label="No"
          icon="pi pi-times"
          class="p-button-text"
          @click="deleteUserDialog = false"
        />
        <Button
          label="Yes"
          icon="pi pi-check"
          class="p-button-text"
          @click="deleteUser"
        />
      </template>
    </Dialog>
  </div>
</template>

<script>
import formServices from "../services/settings.services";
import { useAuthUserStore } from "../stores/users";
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { FilterMatchMode, FilterOperator } from "primevue/api";
import PageHeader from "../components/common/PageHeader.vue";

export default {
  setup() {
    const userStore = useAuthUserStore();
    const { users } = storeToRefs(useAuthUserStore());
    const isAdmin = userStore.isAdmin;
    const isSuperAdmin = userStore.isSuperAdmin;
    const dt = ref();
    const roles = ref(formServices.get("roles") || []);
    const adminRoles = (formServices.get("roles") || []).filter(
      (item) => item.value !== "super-administrator"
    );

    const selfAssignment = (guid) => {
      const user = userStore.getUser;
      return guid === user.guid;
    };

    let loading = ref(false);
    const items = ref([]);
    const load = async function () {
      try {
        loading.value = true;
        userStore.$reset;
        await userStore.getUsers();
        loading.value = false;
        // loading = false;
      } catch (err) {
        loading.value = false;
        console.warn(err);
        // await this.$store.dispatch("handleError", {
        //   text: "An error occurred. Users could not be retrieved",
        //   type: "danger",
        // });
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

    //Dialog controls
    const editUser = (prod) => {
      user.value = { ...prod };
      userDialog.value = true;
    };

    const confirmDeleteGuest = (prod) => {
      user.value = { ...prod };
      deleteUserDialog.value = true;
    };

    const hideDialog = () => {
      userDialog.value = false;
      submitted.value = false;
    };

    const saveUser = async function (event) {
      event.preventDefault();
      submitted.value = true;

      userStore
        .updateUser(user.value["guid"], user.value)
        .then(() => {
          userDialog.value = false;
          user.value = {};
        })
        .then(load())
        .catch((error) => {
          console.log(error);
          // error.response.status Check status code
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
          // error.response.status Check status code
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
      adminRoles,
      submitted,
      hideDialog,
      deleteUserDialog,
    };
  },
  components: { PageHeader },
};
</script>

<style scoped></style>
