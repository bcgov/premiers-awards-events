<template>
  <main>
    <PageHeader
      :subtitle="`Welcome to the registration system for the ${year} Premier's Awards.`"
      :content="userGreeting"
    />
    <div v-if="userStore.isRegistrar">
      <router-link to="/create/registration/">
        <PrimeButton block variant="info"> Register </PrimeButton>
      </router-link>
    </div>
    <div>
      <PrimeCard v-if="!userStore.isRegistrar">
        <template #content>
          <div v-if="settings.getIsSalesOpen">
            <p>
              This event registration tool is restricted to authorized
              registrars.
            </p>
            <p>
              Please contact your organization's representative to request
              attendance.
            </p>
            <p>
              If you are your organization's representative and wish to register
              a group for attendance, please create an account at the link
              below.
            </p>
            <router-link to="/register/">
              <PrimeButton block variant="info">
                Create a profile to register guests for the Premier's Awards
                {{ settings.year }} Event.
              </PrimeButton>
            </router-link>
          </div>
          <div v-else>
            <p>
              New registrations for the {{ settings.year }} Premier's Awards are
              currently closed.
            </p>
            <p>
              Please check back in the future for further updates. Any inquiries
              regarding outstanding registrations, or any other questions,
              should be sent via email to
              <a href="mailto: PremiersAwards@gov.bc.ca"
                >PremiersAwards@gov.bc.ca</a
              >.
            </p>
          </div></template
        >
      </PrimeCard>
    </div>
  </main>
</template>

<script setup>
import { useAuthUserStore } from "../stores/users";
import { computed } from "vue";
import { useSettingsStore } from "../stores/settings";
import PageHeader from "../components/common/PageHeader.vue";
import { storeToRefs } from "pinia";

const userStore = useAuthUserStore();
const settings = useSettingsStore();

// PA-191 Year in heading was "undefined"
const globalSettings = settings.lookup("globalSettings"),
  year = globalSettings['year'] || new Date().getFullYear();

const userGreeting = computed(() =>
  userStore.isRegistrar
    ? `You are logged in as ${userStore.getUser.username}.`
    : ""
);

const { selected } = storeToRefs(useSettingsStore());
</script>
