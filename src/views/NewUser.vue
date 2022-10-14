<script setup>
import UserRegistration from "../components/UserRegistration.vue";
import PageHeader from "../components/common/PageHeader.vue";

const props = defineProps({ update: Boolean });
const editMode = props.update || false;
</script>

<template>
  <main>
    <PageHeader
      title="User Profile"
      subtitle="Update Personal Profile Details"
    />
    <UserRegistration :edit="editMode" />
  </main>
</template>
