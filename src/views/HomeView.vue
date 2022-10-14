<template>
  <main>
    <PageHeader
      title="Welcome"
      subtitle="Premier's Awards Event Registration"
    />
    <div v-if="() => isRegistrar">
      <Card>
        <template #content
          >You are logged in as
          <b>{{ userStore.getUser.username }}</b></template
        >
      </Card>
    </div>
    <div v-else>
      <p>
        This event registration tool is restricted to authorized registrars.
        Please contact your organization's representative to request attendance.
        If you are your organization's representative and wish to register a
        group for attendance, please create an account at the link below.
      </p>
      <router-link to="/register/">
        <Button block variant="info">
          Create a profile to register attendees for the Premier's Awards
          {{ year }} Event.
        </Button>
      </router-link>
    </div>

    <div v-if="() => isRegistrar">
      <div>
        <Card title="Event Registration">
          <template #title>
            Premier's Awards {{ year }} Event Registration
          </template>
          <template #content>
            <router-link to="/create/registration/">
              <Button block variant="info"> Register </Button>
            </router-link></template
          ></Card
        >
      </div>
    </div>
  </main>
</template>

<script setup>
import { useAuthUserStore } from "../stores/users";
import { ref } from "vue";
import router from "../router/index.js";
import settings from "../services/settings.services";
import PageHeader from "../components/common/PageHeader.vue";

const userStore = useAuthUserStore();
const isLoggedIn = userStore.isAuthenticated;
const isRegistrar = userStore.isRegistrar;
const user = userStore.getUser;
const year = ref(settings.get("year") || "");

const reroute = async function (uri) {
  await router.push(uri);
};

//userStore.login();
</script>
