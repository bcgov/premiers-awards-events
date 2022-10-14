<template>
  <div>
    <Message show v-if="user && isRegistered" variant="info" :closable="false">
      <p v-if="user.role === 'inactive'">
        Your registration is currently under review. Please check back regularly
        for updates.
      </p>
      <p v-else>
        You are currently registered as a(n) <b>{{ user.role }}</b
        >.
      </p>
    </Message>
    <Message
      show
      v-if="activeMessage"
      :variant="message.type"
      :life="5000"
      :sticky="false"
    >
      <p>
        {{ message.text }}
      </p>
    </Message>

    <Card v-if="user && (!isRegistered || edit)">
      <template #content>
        <form>
          <InputText
            id="input-user-register-username"
            :disabled="true"
            :value="user.username"
          >
          </InputText>

          <InputText
            id="input-user-register-firstname"
            v-model="user.firstname"
            placeholder="Enter user's given name"
          >
          </InputText>

          <InputText
            id="input-user-register-lastname"
            v-model="user.lastname"
            placeholder="Enter user's last name"
          />

          <InputText
            type="email"
            id="input-user-register-email"
            v-model="user.email"
            placeholder="Enter user's email"
          >
          </InputText>
          <Button
            v-if="edit"
            @click="update"
            :disabled="!validation"
            class="m-2"
            type="button"
            variant="info"
            >Update</Button
          >

          <Button
            v-else
            @click="register"
            :disabled="!validation"
            class="m-2"
            type="button"
            variant="info"
            >Register</Button
          >
        </form>
      </template>
    </Card>
  </div>
</template>

<script>
import { useAuthUserStore } from "../stores/users";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import useVuelidate from "@vuelidate/core";
import { required, email } from "@vuelidate/validators";
import { useMessageStore } from "../stores/messages";
import apiRoutesUsers from "../services/api-routes.users";

export default {
  props: {
    edit: Boolean,
  },
  setup(props) {
    const userStore = useAuthUserStore();
    const messageStore = useMessageStore();
    const { message } = storeToRefs(useMessageStore());
    const activeMessage = ref(false);
    const { user } = storeToRefs(useAuthUserStore());
    const rules = {
      firstname: { required },
      lastname: { required },
      email: { required, email },
    };

    const edit = props.edit || false;

    const v$ = useVuelidate(rules, user);

    const validation = function () {
      return !!this.user.guid && !!this.user.username;
    };

    const isRegistered = function () {
      const currentUser = userStore.getUser;
      return this.mode === "register" && !!currentUser.role;
    };

    const register = async function () {
      try {
        activeMessage.value = true;
        messageStore.setMessage({
          text: "Registering user...",
          type: "info",
          spinner: true,
        });
        // handle data submission
        const response = await apiRoutesUsers.registerUser(user.value);
        messageStore.setMessage({
          text: "Successfully registered user!",
          type: "success",
        });
      } catch (err) {
        console.error(err);
        activeMessage.value = true;
        messageStore.setMessage({
          text: "User could not be registered.",
          type: "error",
        });
      }
    };

    const update = async function () {
      try {
        activeMessage.value = true;
        messageStore.setMessage({
          text: "Updating user...",
          type: "info",
          spinner: true,
        });

        // handle data submission
        const response = await apiRoutesUsers.updateUser(
          user.value.guid,
          user.value
        );
        messageStore.setMessage({
          text: "Successfully updated user!",
          type: "success",
        });
      } catch (err) {
        console.error(err);
        activeMessage.value = true;
        messageStore.setMessage({
          text: "User could not be updated.",
          type: "error",
        });
      }
    };

    return {
      user,
      message,
      rules,
      edit,
      v$,
      isRegistered,
      validation,
      register,
      update,
      activeMessage,
    };
  },
};
</script>
