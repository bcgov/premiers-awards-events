<!-- Navbar common component -->
<template>
  <div>
    <div class="card navigation-card">
      <h5 v-if="title" class="spacer">{{ title }}</h5>
      <div class="spacer" v-else></div>
      <TabMenu
        class="admin-nav"
        :model="menuitems"
        :activeIndex="activeIndex"
      />
      <RouterView />
    </div>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  props: {
    title: String,
    menuitems: Array,
  },
  setup() {
    const activeIndex = ref(0);

    return { activeIndex };
  },
};
</script>

<style lang="scss">
.navigation-card {
  .spacer {
    margin: 1rem;
  }
}
</style>
