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
import { storeToRefs } from "pinia";
import { ref, onMounted } from "vue";
import router from "../router/index.js";

export default {
  props: {
    extraRegistration: String,
  },
  setup(props) {
    const userStore = useAuthUserStore();
    const financialStore = useFinancialStore();
    const messages = useMessageStore();

    const { guid, username, firstname, lastname, email } = userStore.getUser;

    const fillList = async () => {
      await financialStore
        .fillAllUserRegistrations(guid)
        .then((data) => {
          if (data && props.extraRegistration) {
            const { registrations } = storeToRefs(useFinancialStore());

            financialStore.fillAllUserRegistrations(guid).then(() => {
              const registrationCount = registrations.value.length + 1;
              const guidExtra = `${guid}${registrationCount}`;

              financialStore
                .createRegistration(
                  guidExtra,
                  username,
                  firstname,
                  lastname,
                  email,
                  guid
                )
                .then((newData) => {
                  if (newData) router.push(`/registration/${newData.guid}`);
                });
            });
          } else if (data) {
            const { registrations } = storeToRefs(useFinancialStore());
            const userRegistration = registrations.value.filter((each) => {
              return each.registrar === username;
            });
            const registrationSelection =
              userRegistration.length > 0
                ? userRegistration[0]["_id"]
                : registrations.value[0]["_id"];
            router.push(`/registration/${registrationSelection}`);
          } else {
            financialStore
              .createRegistration(guid, username, firstname, lastname, email)
              .then((data) => {
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
    };

    onMounted(() => {
      fillList();
    });
  },
};
</script>
