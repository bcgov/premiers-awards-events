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
import Sidebar from "primevue/sidebar";
import Menu from "primevue/menu";
import Message from "primevue/message";
import TabMenu from "primevue/tabmenu";
import Menubar from "primevue/menubar";
import Badge from "primevue/badge";
import ProgressSpinner from "primevue/progressspinner";

//Form Component imports
import Checkbox from "primevue/checkbox";
import Dropdown from "primevue/dropdown";
import InputMask from "primevue/inputmask";
import InputNumber from "primevue/inputnumber";
import InputText from "primevue/inputtext";
import Steps from "primevue/steps";

//DataTable Component Imports
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import ColumnGroup from "primevue/columngroup";
import Row from "primevue/row";
import Dialog from "primevue/dialog";
import TriStateCheckbox from "primevue/tristatecheckbox";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(PrimeVue, { ripple: true });
app.use(ConfirmationService);
app.use(DialogService);

//Component Initialization
app.component("Button", Button);
app.component("Card", Card);
app.component("ConfirmDialog", ConfirmDialog);
app.component("DynamicDialog", DynamicDialog);
app.component("Sidebar", Sidebar);
app.component("Menu", Menu);
app.component("Message", Message);
app.component("TabMenu", TabMenu);
app.component("Menubar", Menubar);
app.component("Badge", Badge);
app.component("Spinner", ProgressSpinner);

app.component("Dropdown", Dropdown);
app.component("Checkbox", Checkbox);
app.component("InputMask", InputMask);
app.component("InputNumber", InputNumber);
app.component("InputText", InputText);
app.component("Steps", Steps);

app.component("DataTable", DataTable);
app.component("Column", Column);
app.component("ColumnGroup", ColumnGroup);
app.component("Row", Row);
app.component("Dialog", Dialog);
app.component("TriStateCheckbox", TriStateCheckbox);

app.mount("#app");
