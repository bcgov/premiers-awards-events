<!-- Navbar common component -->
<template>
  <div>
    <div class="card navigation-card">
      <h5 v-if="title" class="spacer">{{ title }}</h5>
      <div class="spacer" v-else></div>
      <TabMenu
        class="admin-nav"
        :model="activeMenuitems"
        :activeIndex="active"
      ><template #item="{ item, props }">
                <router-link v-slot="{ href, navigate }" :to="item.to" custom>
                    <a :href="href" v-bind="props.action" @click="navigate">
                        <span v-bind="props.icon" />
                        <span v-bind="props.label">{{ item.label }}</span>
                    </a>
                </router-link>
            </template></TabMenu>
      <RouterView />
    </div>
  </div>
</template>

<script>
import { ref, watch } from "vue";
import { useRoute } from "vue-router";

export default {
  props: {
    title: String,
    menuitems: Array,
  },
  setup(props) {
    const route = useRoute();
    const active = ref(0);

    const indexedMenuItems = props.menuitems.map((obj, index) => {
        return { ...obj, index: index + 1 };
    });
    const activeMenuitems = ref(indexedMenuItems)

    //check current path and update reference location of active
    const updateActive = (items) => {
    const index = items.findIndex(item => item.to === route.path);
    if (index !== -1) {
        active.value = items[index].index - 1;
    }
    };

    updateActive(indexedMenuItems);

    return { activeMenuitems, active };
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
