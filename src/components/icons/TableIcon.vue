<!-- Table Icon Common Component -->
<template>
  <div class="table-icon">
    <div class="p-1">
      <SpeedDial :model="tableGuests" :radius="90" type="circle" :buttonClass="tableClass" @click="getGuests()"
        :tooltipOptions="{ position: 'top' }" :showIcon="tableGuests.length > 0 ? 'pi pi-users' : 'pi'"
        hideIcon="pi pi-times" :disabled="tableGuests.length <= 0" />
    </div>

  </div>
</template>

<script>
import { computed, ref } from "vue";
import apiRoutesTables from "../../services/api-routes.tables";
import router from "../../router";

export default {
  props: {
    table: Object,
  },
  setup(props) {
    const defaultButton = "p-button-raised"
    const fullIcon = `${defaultButton} full-table`;
    const halfIcon = `${defaultButton} half-table`;
    const emptyIcon = `${defaultButton} empty-table`;
    const defaultIcon = `${defaultButton} default-table`;


    //Apply conditional styling based on table status
    const tableClass = computed(() => {
      if (props.table.status === "full-table") {
        return fullIcon;
      }
      if (props.table.status === "half-table") {
        return halfIcon;
      }
      if (props.table.status === "empty-table") {
        return emptyIcon;
      }
      return defaultIcon;
    });

    // Load guest data to each table icon on request
    let tableGuests = ref(props.table.guests);
    const getGuests = async () => {
      const newGuests = (await apiRoutesTables.getGuestsByTable(props.table.guid));
      const newGuestData = newGuests.data[0].guests || null;
      if (newGuests) {
        tableGuests.value = newGuestData.map(each => ({
          ...each,
          label: `${each.seat}\n${each.firstname}\n${each.lastname}`,
          icon: 'pi pi-user',
          command: () => {
            router.push(`/admin/edit/${each.registration}`);
          }
        }));
      }
    }

    return {
      tableClass,
      tableGuests,
      getGuests,
    };
  },
};
</script>

<style lang="scss">
.table-icon {
  $fullColor: red;
  $emptyColor: green;
  $defaultColor: purple;
  $tableSize: 4rem;

  .full-table {
    background-color: $fullColor;
  }

  .half-table {
    /* For modern browsers */
    background: linear-gradient(to right, red 0%, red 50%, green 50%, green 100%);

    /* For older browsers */
    background: -webkit-linear-gradient(left, red 0%, red 50%, green 50%, green 100%);
    background: -moz-linear-gradient(left, red 0%, red 50%, green 50%, green 100%);
    background: -o-linear-gradient(left, red 0%, red 50%, green 50%, green 100%);
    background: -ms-linear-gradient(left, red 0%, red 50%, green 50%, green 100%);

  }

  .empty-table {
    background-color: $emptyColor;

  }

  .default-table {
    background-color: $defaultColor;

  }

  .p-speeddial {
    position: relative !important;

    .p-button:disabled {
      border: solid;
      border-color: $emptyColor;
    }
  }
}
</style>
