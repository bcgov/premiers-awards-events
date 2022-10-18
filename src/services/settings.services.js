/*!
 * Form services/utilities (Vue)
 * File: forms.services.js
 * Copyright(c) 2022 BC Gov
 * MIT Licensed
 */
import { FilterMatchMode, FilterOperator } from "primevue/api";

const schemaData = {
  navItems: [
    {
      label: "Registrations",
      to: "/admin",
    },
    {
      label: "Guests",
      to: "/admin/guests",
    },
    {
      label: "Tables",
      to: "/admin/tables",
    },
    {
      label: "Event Planning",
      to: "/admin/tables/event/planning",
    },
  ],
  registrationSelection: [
    { field: "organization", text: "Organization" },
    { field: "branch", text: "Branch" },
    { field: "primarycontact", text: "Primary Contact" },
    { field: "primaryemail", text: "Primary Contact's Email" },
    { field: "financialcontact", text: "Financial Contact" },
    { field: "clientministry", text: "Client / Ministry Code" },
    { field: "respcode", text: "RESP Code" },
    { field: "serviceline", text: "Service Line" },
    { field: "stob", text: "STOB" },
    { field: "project", text: "Project Code" },
  ],
  guestSelection: [
    { field: "organization", text: "Organization" },
    { field: "firstname", text: "First Name" },
    { field: "lastname", text: "Last Name" },
    { field: "attendancetype", text: "Attendance Type" },
    { field: "accessibility", text: "Accessibility Requirements" },
    { field: "dietary", text: "Dietary Requirements" },
  ],
  tableSelection: [
    { field: "tablename", text: "Table Name" },
    { field: "tabletype", text: "Type of Table" },
    { field: "tablecapacity", text: "Table Capacity" },
    { field: "tableguestcount", text: "Number of Guests at Table" },
    { field: "tablefull", text: "Table Full?" },
    { field: "organizations", text: "Organizations at Table" },
  ],
  roles: [
    { value: "inactive", text: "Inactive" },
    { value: "registrar", text: "Registrar" },
    { value: "nominator", text: "Nominator" },
    { value: "administrator", text: "Administrator" },
    { value: "super-administrator", text: "Super-Administrator" },
  ],
  organizations: [
    { value: "org-1", text: "BC Public Service Agency" },
    { value: "org-2", text: "Environmental Assessment Office" },
    {
      value: "org-3",
      text: "Government Communications and Public Engagement",
    },
    {
      value: "org-4",
      text: "Ministry of Advanced Education and Skills Training",
    },
    { value: "org-5", text: "Ministry of Agriculture and Food" },
    {
      value: "org-6",
      text: "Ministry of Attorney General and Responsible for Housing",
    },
    { value: "org-7", text: "Ministry of Children and Family Development" },
    { value: "org-8", text: "Ministry of Citizens’ Services" },
    { value: "org-9", text: "Ministry of Education and Child Care" },
    {
      value: "org-10",
      text: "Ministry of Energy, Mines and Low Carbon Innovation",
    },
    {
      value: "org-11",
      text: "Ministry of Environment and Climate Change Strategy",
    },
    { value: "org-12", text: "Ministry of Finance" },
    {
      value: "org-13",
      text: "Ministry of Forests",
    },
    { value: "org-14", text: "Ministry of Health" },
    {
      value: "org-15",
      text: "Ministry of Indigenous Relations and Reconciliation",
    },
    {
      value: "org-16",
      text: "Ministry of Jobs, Economic Recovery and Innovation",
    },
    { value: "org-17", text: "Ministry of Labour" },
    {
      value: "org-18",
      text: "Ministry of Land, Water and Resource Stewardship",
    },
    { value: "org-19", text: "Ministry of Mental Health and Addictions" },
    { value: "org-20", text: "Ministry of Municipal Affairs" },
    {
      value: "org-21",
      text: "Ministry of Public Safety and Solicitor General and Emergency B.C.",
    },
    {
      value: "org-22",
      text: "Ministry of Social Development & Poverty Reduction",
    },
    { value: "org-23", text: "Ministry of Tourism, Arts, Culture and Sport" },
    { value: "org-24", text: "Ministry of Transportation & Infrastructure" },
    { value: "org-25", text: "Office of the Premier" },
  ],
  attendancetypes: [
    { value: "minister", text: "Minister" },
    { value: "deputyminister", text: "Deputy Minister" },
    { value: "assistantminister", text: "Assistant Deputy Minister" },
    { value: "associateminister", text: "Associate Deputy Minister" },
    { value: "finalist", text: "Finalist" },
    { value: "finalistguest", text: "Finalist Guest" },
    { value: "generalattendee", text: "General Attendee" },
  ],
  dietaryoptions: [
    { value: "dairyfree", text: "Dairy-Free" },
    { value: "glutenfree", text: "Gluten-Free" },
    { value: "sugarfree", text: "Sugar-Free" },
    { value: "shellfishfree", text: "Shellfish-Free" },
    { value: "vegetarian", text: "Vegetarian" },
    { value: "vegan", text: "Vegan" },
    { value: "peanutfree", text: "Peanut-Free" },
    { value: "nutfree", text: "Nut-Free" },
    { value: "other", text: "Other" },
  ],
  accessibilityoptions: [
    { value: "wheelchairrequired", text: "Wheelchair Required" },
    { value: "attendantrequired", text: "Attendant Required" },
    { value: "mobilityneeds", text: "Mobility Needs" },
  ],
  tabletypes: [
    { value: "Standard", text: "Standard" },
    { value: "Reserved", text: "Reserved" },
  ],
  registrationFilters: {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },

    organization: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
    branch: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
    },
    primarycontact: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
    },
    financialcontact: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
    },
    primaryemail: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
    },
    clientministry: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
    },
    respcode: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
    },
    serviceline: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
    },
    stob: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
    },
    project: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
    },
    guestCount: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
    submitted: { value: null, matchMode: FilterMatchMode.EQUALS },
    createdAt: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
    },
    updatedAt: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
    },
    guestList: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
    allAssigned: { value: null, matchMode: FilterMatchMode.EQUALS },
  },
  guestFilters: {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },

    organization: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
    firstname: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
    },
    lastname: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
    },
    attendancetype: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
    accessibility: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
    dietary: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
    createdAt: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
    },
    updatedAt: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
    },
    assignedTable: { value: null, matchMode: FilterMatchMode.EQUALS },
  },
  tableFilters: {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    guid: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
    },
    tablename: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
    },
    tabletype: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
    tablecapacity: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
    guestCount: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
    tableStatus: { value: null, matchMode: FilterMatchMode.EQUALS },
    organizations: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
    },
    createdAt: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
    },
    updatedAt: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
    },
  },
  userFilters: {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    guid: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
    },
    username: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
    },
    firstname: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
    },
    lastname: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
    },
    email: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
    },
    role: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
    },
    createdAt: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
    },
    updatedAt: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
    },
    eventregistrar: { value: null, matchMode: FilterMatchMode.EQUALS },
  },
};

export default {
  /**
   * get enumerated data by key
   * **/

  get: function get(key) {
    return schemaData[key] !== "undefined" ? schemaData[key] : null;
  },

  /**
   * get enumerated data by key
   * **/

  lookup: function lookup(key, value) {
    if (schemaData[key] === "undefined") return null;
    const found = schemaData[key].filter((item) => item.value === value);
    return found.length > 0 ? found[0].text : null;
  },
};
