<!-- Selector for Tables -->
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
      <div>
        <PrimeCard>
          <template #content>
            <DropDown
              id="tabletype"
              v-model="currentRegistration"
              :options="registrations"
              optionLabel="customName"
              optionValue="_id"
              placeholder="Select the registration."
            />

            <PrimeButton
              block
              variant="info"
              :disabled="!currentRegistration"
              icon="pi pi-arrow-up-right"
              label="Go To Registration"
              class="p-button-rounded p-button-info info-button"
              @click="registrationPick()"
            >
            </PrimeButton>
            <PrimeButton
              block
              :disabled="
                currentRegistration ||
                (!settingsStore.getIsSalesOpen && !userStore.isAdmin)
              "
              icon="pi pi-arrow-up-right"
              label="Create New Registration"
              class="p-button-rounded p-button-info info-button"
              @click="registrationPick()"
            >
            </PrimeButton>
          </template>
        </PrimeCard>
      </div>
    </div>
  </div>
</template>

<script>
import { useFinancialStore } from "../../stores/financial";
import { useAuthUserStore } from "../../stores/users";
import { useSettingsStore } from "../../stores/settings";
import { storeToRefs } from "pinia";
import { ref, onMounted, computed } from "vue";
import router from "../../router";

export default {
  setup() {
    const financialStore = useFinancialStore();
    const userStore = useAuthUserStore();
    const settingsStore = useSettingsStore();
    const { registrations } = storeToRefs(useFinancialStore());

    let message = ref(false);
    const messageText = ref({ severity: null, text: "" });
    const loading = ref(false);
    const currentRegistration = ref(registrations[0]);

    //Fill tables datatables with appropriate data based on props
    const fillList = async function () {
      const user = userStore.getUser;
      financialStore.$reset;
      loading.value = true;
      try {
        return await financialStore.fillAllUserRegistrations(user.guid);
      } catch (error) {
        loading.value = false;
        console.warn(error);
        message.value = true;
        messageText.value = {
          severity: "error",
          text: "Could not fetch registrations.",
        };
      } finally {
        loading.value = false;
        setTimeout(() => (message.value = false), 1500);
      }
    };

    const loadLazyData = () => {
      fillList().then(() => {
        registrations.value.forEach((registration) => {
          registration["customName"] = computed(() => {
            const submissionStatus = registration["submitted"]
              ? "SUBMITTED"
              : "PENDING SUBMISSION";
            return `Registrar: ${registration["registrar"]} ID: ${registration["_id"]} - ${submissionStatus}`;
          });
        });
      });
    };

    onMounted(() => {
      loadLazyData();
    });

    const registrationPick = () => {
      if (currentRegistration.value) {
        router.push(`/registration/${currentRegistration.value}`).then(() => {
          router.go();
        });
      } else {
        router.push("/create/registration/extraRegistration");
      }
    };

    return {
      fillList,
      loadLazyData,
      registrations,
      message,
      loading,
      messageText,
      currentRegistration,
      registrationPick,
      settingsStore,
      userStore,
    };
  },
};
</script>
<style></style>
