<template>
  <div>
    <div class="card">
      <h5>{{ title }}</h5>
      <TabMenu :model="items" :activeIndex="activeIndex" />
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
  setup(props) {
    const items = ref(props.menuitems);
    const title = props.title;
    const activeIndex = ref(0);

    return { title, items, activeIndex };
  },
};
</script>

<style scoped></style>
