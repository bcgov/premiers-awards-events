import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import PrimeVue from "primevue/config";

//Common component imports
import Button from "primevue/button";
import Card from "primevue/card";
import ConfirmationService from "primevue/confirmationservice";
import ConfirmDialog from "primevue/confirmdialog";
import DialogService from "primevue/dialogservice";
import DynamicDialog from "primevue/dynamicdialog";
import Message from "primevue/message";
import TabMenu from "primevue/tabmenu";
import Menubar from "primevue/menubar";
import ProgressSpinner from "primevue/progressspinner";
import Accordion from "primevue/accordion";
import AccordionTab from "primevue/accordiontab";
import Fieldset from "primevue/fieldset";
import Tooltip from "primevue/tooltip";

//Form Component imports
import Checkbox from "primevue/checkbox";
import Dropdown from "primevue/dropdown";
import InputMask from "primevue/inputmask";
import InputNumber from "primevue/inputnumber";
import InputText from "primevue/inputtext";
import PickList from "primevue/picklist";

//DataTable Component Imports
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import ColumnGroup from "primevue/columngroup";
import Row from "primevue/row";
import Dialog from "primevue/dialog";
import TriStateCheckbox from "primevue/tristatecheckbox";
import Calendar from "primevue/calendar";
import AutoComplete from "primevue/autocomplete";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(PrimeVue, { ripple: true });
app.use(ConfirmationService);
app.use(DialogService);

//Component Initialization
app.component("PrimeButton", Button);
app.component("PrimeCard", Card);
app.component("ConfirmDialog", ConfirmDialog);
app.component("DynamicDialog", DynamicDialog);
app.component("PrimeMessage", Message);
app.component("TabMenu", TabMenu);
app.component("MenuBar", Menubar);
app.component("ProgressSpinner", ProgressSpinner);
app.directive("tooltip", Tooltip);

app.component("DropDown", Dropdown);
app.component("CheckBox", Checkbox);
app.component("InputMask", InputMask);
app.component("InputNumber", InputNumber);
app.component("InputText", InputText);
app.component("PickList", PickList);
app.component("PrimeAccordion", Accordion);
app.component("AccordionTab", AccordionTab);
app.component("FieldSet", Fieldset);

app.component("DataTable", DataTable);
app.component("PrimeColumn", Column);
app.component("ColumnGroup", ColumnGroup);
app.component("PrimeRow", Row);
app.component("PrimeDialog", Dialog);
app.component("TriStateCheckbox", TriStateCheckbox);
app.component("PrimeCalendar", Calendar);
app.component("AutoComplete", AutoComplete);

app.mount("#app");
