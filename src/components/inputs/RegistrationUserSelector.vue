<!-- Selector for Tables -->
<template>
  <div>
    <ProgressSpinner v-if="loading" />
    <PrimeMessage
      v-else-if="message"
      :severity="messageText.severity"
      @close="
        () => {
          message = false;
        }
      "
      >{{ messageText.text }}</PrimeMessage
    >
    <div v-else>
      <div>
        <PrimeCard id="add-users-card">
          <template #header> Add new users to read/edit access on registration by entering their IDIR: </template>
          <template #content>
            <div class="form-item text-field">
              <label for="user" id="user-help">Add IDIR:</label>
              <InputText
                id="user"
                type="user"
                aria-describedby="user-help"
                v-model.trim="userIdir"
              />
            </div>
            <PrimeButton
              block
              icon="pi pi-arrow-up-right"
              label="Add User by IDIR"
              class="p-button-rounded p-button-info info-button"
              @click="addUser()"
            >
            </PrimeButton>
          </template>
        </PrimeCard>
        <PrimeCard id="current-users-card">
          <template #header> Current Users: </template>
          <template #content>
            <div class="users-chips">
              <label for="users-list" id="user-help">Remove Users.</label>
              <div>
                <PrimeChip
                  v-for="each of registration.users"
                  v-bind:key="each"
                  :label="each.username"
                  class="mb-2"
                  :removable="each.username !== registration.registrar"
                  @remove="removeUser(each)"
                ></PrimeChip>
              </div>
            </div>
          </template>
        </PrimeCard>
      </div>
    </div>
  </div>
</template>

<script>
import { useFinancialStore } from "../../stores/financial";
import { useAuthUserStore } from "../../stores/users";
import { storeToRefs } from "pinia";
import { ref, onMounted, computed } from "vue";
import router from "../../router";

export default {
  setup() {
    const financialStore = useFinancialStore();
    const userStore = useAuthUserStore();
    const { registration, registrations } = storeToRefs(useFinancialStore());
    const { users } = storeToRefs(useAuthUserStore());

    let message = ref(false);
    const messageText = ref({ severity: null, text: "" });
    const loading = ref(false);
    const userIdir = ref("");

    const addUser = async () => {
      if (userIdir.value) {
        try {
          const userLookup = await userStore
            .getUserById(userIdir.value.toUpperCase())
            .then((data) => {
              const { guid, username } = data;
              const userExists = registration.value.users.filter((each) =>
                guid.includes(each.guid)
              );
              if (guid.length === 0 || userExists.length > 0) {
                throw "User Not Found or user already added";
              }
              guid.length > 0
                ? financialStore.pushFinancialInformation({
                    users: { guid, username },
                  })
                : null;
            });
        } catch (error) {
          loading.value = false;
          console.warn(error);
          message.value = true;
          messageText.value = {
            severity: "error",
            text: "User could not be added. Make sure user has started user registration.",
          };
        }
      } else {
        return;
      }
    };

    const removeUser = async (user) => {
      try {
        const { guid = "", username = "" } = user || {};
        const userDelete = await financialStore.pullFinancialInformation({
          users: { guid, username },
        });
      } catch (error) {
        loading.value = false;
        console.warn(error);
        message.value = true;
        messageText.value = {
          severity: "error",
          text: "User access could not be removed.",
        };
      }
    };

    return {
      registrations,
      registration,
      message,
      loading,
      messageText,
      addUser,
      removeUser,
      userIdir,
    };
  },
};
</script>
<style></style>
