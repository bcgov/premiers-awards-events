<!-- Handles new event registrations -->
<template>
  <div>
    <PrimeCard>
      <PrimeRow style="height: 200px" class="text-center" align-v="center">
        <PrimeColumn>
          <router-link to="/"
            ><PrimeButton
              >Return to Registration Homepage</PrimeButton
            ></router-link
          >
          <PrimeMessage severity="warn"
            >Please wait while the registration is initialized...</PrimeMessage
          >
        </PrimeColumn>
      </PrimeRow>
    </PrimeCard>
  </div>
</template>

<script>
import { useAuthUserStore } from "../stores/users";
import { useFinancialStore } from "../stores/financial";
import { useMessageStore } from "../stores/messages";
import router from "../router/index.js";

export default {
  setup() {
    const userStore = useAuthUserStore();
    const financialStore = useFinancialStore();
    const messages = useMessageStore();

    const { guid, username, firstname, lastname, email } = userStore.getUser;

    financialStore
      .fill(guid)
      .then(function (data) {
        if (data) router.push(`/registration/${guid}`);
        else {
          financialStore
            .createRegistration(guid, username, firstname, lastname, email)
            .then(function (data) {
              if (data) router.push(`/edit/${data.guid}`);
            });
        }
      })
      .catch((err) => {
        console.error(err);
        messages.setMessage({
          text: "Registration could not be created. Please contact the site administrator for assistance",
          type: "danger",
        });
      });
  },
};
</script>
