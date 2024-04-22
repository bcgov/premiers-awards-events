<!-- Table Icon Common Component -->
<template>
  <div class="table-icon">
    <div class="p-1">
      <SpeedDial
        :model="tableGuests"
        :radius="radiusCalc()"
        type="circle"
        :buttonClass="tableClass"
        @click="getGuests()"
        :tooltipOptions="{ position: 'top' }"
        :showIcon="tableGuests.length > 0 ? 'pi pi-users' : 'pi'"
        hideIcon="pi pi-times"
        :disabled="tableGuests.length <= 0"
      />
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
  setup({ table }) {
    const defaultButton = "p-button-raised";
    const classMap = {
      "full-table": `${defaultButton} full-table`,
      "half-table": `${defaultButton} half-table`,
      "empty-table": `${defaultButton} empty-table`,
      default: `${defaultButton} default-table`,
    };

    const tableClass = computed(() => {
      const statusClass = classMap[table.status] || classMap.default;
      if (table.tabletype === "Reserved") {
        return `${statusClass} reserved-table`;
      }
      return statusClass;
    });

    // Load guest data to each table icon on request
    let tableGuests = ref(table.guests);
    const getGuests = async () => {
      const newGuests = await apiRoutesTables.getGuestsByTable(table.guid);
      const newGuestData = newGuests.data[0].guests || null;
      if (newGuests) {
        tableGuests.value = newGuestData.map((each) => ({
          ...each,
          label: `${each.seat}\n${each.firstname}\n${each.lastname}`,
          icon: "pi pi-user",
          command: () => {
            router.push(`/admin/edit/${each.registration}`);
          },
        }));
      }
    };

    //Adjust radius when more than 10 guests seated at a table
    const radiusCalc = () => {
      let radius = 90;
      const guestCount = tableGuests.value.length;
      if (guestCount > 10) {
        radius += (guestCount - 10) * 4;
      }
      return radius;
    };

    return {
      tableClass,
      tableGuests,
      getGuests,
      radiusCalc,
    };
  },
};
</script>

<style lang="scss">
.table-icon {
  $fullColor: red;
  $emptyColor: green;
  $defaultColor: purple;
  $reservedColor: purple;
  $tableSize: 4rem;

  .full-table {
    background-color: $fullColor;
  }

  .half-table {
    /* For modern browsers */
    background: linear-gradient(
      to right,
      red 0%,
      red 50%,
      green 50%,
      green 100%
    );

    /* For older browsers */
    background: -webkit-linear-gradient(
      left,
      red 0%,
      red 50%,
      green 50%,
      green 100%
    );
    background: -moz-linear-gradient(
      left,
      red 0%,
      red 50%,
      green 50%,
      green 100%
    );
    background: -o-linear-gradient(
      left,
      red 0%,
      red 50%,
      green 50%,
      green 100%
    );
    background: -ms-linear-gradient(
      left,
      red 0%,
      red 50%,
      green 50%,
      green 100%
    );
  }

  .empty-table {
    background-color: $emptyColor;
  }

  .default-table {
    background-color: $defaultColor;
  }

  .p-speeddial {
    position: relative !important;

    .reserved-table {
      border: solid;
      border-color: $reservedColor !important;
      border-width: thick;
    }

    .p-button:disabled {
      border: solid;
      border-color: $emptyColor;
    }
  }
}
</style>
