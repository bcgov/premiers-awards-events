<template>
  <div>
    <Card>
      <Row style="height: 200px" class="text-center" align-v="center">
        <Column>
          <router-link to="/"
            ><Button>Return to Registration Homepage</Button></router-link
          >
          <Message severity="warn"
            >Please wait while the registration is initialized...</Message
          >
        </Column>
      </Row>
    </Card>
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

    /* WorkingVersion

    financialStore
      .createRegistration(guid)
      .then(function (data) {
        if (data) router.push(`/edit/${data.guid}`);
      })
      .catch(() => {
        financialStore
          .fill(guid)
          .then(() => router.push(`/registration/${guid}`));
      })
      .catch((err) => {
        console.error(err);
        messages.setMessage({
          text: "Registration could not be created. Please contact the site administrator for assistance",
          type: "danger",
        });
      });

      */
  },
};
</script>
