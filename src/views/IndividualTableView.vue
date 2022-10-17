<script>
import GuestList from "../components/GuestList.vue";
import TableList from "../components/TableList.vue";
import PageHeader from "../components/common/PageHeader.vue";
import GuestPicker from "../components/inputs/GuestPicker.vue";
import { useAuthUserStore } from "../stores/users";
import { useMessageStore } from "../stores/messages";
import { useTablesStore } from "../stores/tables";
import { storeToRefs } from "pinia";
import { useFinancialStore } from "../stores/financial";
import { ref, reactive } from "vue";

export default {
  props: {
    id: String,
  },
  setup(props) {
    const { message } = storeToRefs(useMessageStore());
    const activeMessage = ref(false);
    const loading = ref(false);

    const userStore = useAuthUserStore();
    userStore.login();

    const financialStore = useFinancialStore();

    const tableStore = useTablesStore();

    tableStore.fillTable(props.id);

    const guestCount = () => {
      return String(tableStore.getGuestCount);
    };

    const isAdmin = () => {
      return userStore.isAdmin;
    };

    const guestInfoDialog = ref(false);
    const addGuestDialog = ref(false);

    //PrimeDialog controls

    const guestInfo = () => {
      guestInfoDialog.value = true;
    };

    const addGuest = () => {
      addGuestDialog.value = true;
    };

    const keycount = reactive({
      count: 0,
      increment() {
        this.count++;
      },
    });

    return {
      userStore,
      financialStore,
      tableStore,
      guestCount,
      isAdmin,
      guestInfoDialog,
      addGuestDialog,
      guestInfo,
      activeMessage,
      message,
      loading,
      addGuest,
      keycount,
    };
  },
  components: {
    GuestList,
    PageHeader,
    TableList,
    GuestPicker,
  },
};
</script>

<template>
  <main class="individual-table-view">
    <PageHeader class="pageheader">Manage Table Details</PageHeader>

    <ProgressSpinner v-if="loading" />
    <div v-else class="page-body">
      <TableList :tableID="id" :detailsView="true" :key="keycount.count" />

      <div class="registration-buttons">
        <PrimeButton
          type="button"
          label="Total Guests"
          icon="pi pi-users"
          class="p-button-warning"
          :badge="guestCount()"
          @click="guestInfo()"
          badgeClass="p-badge-danger"
        />
        <PrimeButton
          v-if="!tableStore.getIsFull"
          type="button"
          label="Add guest"
          icon="pi pi-users"
          class="p-button"
          @click="addGuest()"
        />
      </div>
      <GuestList :tableID="id" :key="keycount.count" />

      <PrimeDialog
        v-model:visible="guestInfoDialog"
        header="Guest Information"
        :modal="true"
        class="p-fluid"
        >Total Number of Guests: {{ guestCount() }}.
      </PrimeDialog>

      <PrimeDialog
        v-model:visible="addGuestDialog"
        :style="{ width: '90vw' }"
        position="bottom"
        header="Add a new Guest"
        :modal="true"
        class="p-fluid"
        @hide="keycount.increment()"
        ><GuestPicker :tableID="id"
      /></PrimeDialog>
    </div>
  </main>
</template>

<style lang="scss">
.individual-table-view {
  #registration-info {
    .p-card-content {
      font-size: 1rem;
    }
  }

  #personal-registration-table {
    .p-datatable {
      padding: 1rem;
    }
  }

  #personal-registration-guests-table {
    .p-datatable {
      padding: 1rem;
    }
  }
  .registration-buttons {
    display: flex;
    justify-content: flex-end;
    padding: 1rem;
    gap: 1rem;
  }
  .submission-buttons {
    display: flex;
    justify-content: flex-end;
    padding: 1rem;
  }
}
</style>
