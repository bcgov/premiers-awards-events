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
    { field: "pronouns", text: "Pronouns" },
    { field: "supportingfinalist", text: "Supporting Finalist" },
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
    {
      value: "org-1",
      text: "Ministry of Post-Secondary Education and Future Skills",
    },
    { value: "org-2", text: "Ministry of Agriculture and Food" },
    { value: "org-3", text: "Ministry of Attorney General" },
    { value: "org-4", text: "Ministry of Children and Family Development" },
    { value: "org-5", text: "Ministry of Citizens’ Services" },
    { value: "org-6", text: "Ministry of Education and Child Care" },
    {
      value: "org-7",
      text: "Ministry of Emergency Management and Climate Readiness",
    },
    {
      value: "org-8",
      text: "Ministry of Energy, Mines and Low Carbon Innovation",
    },
    {
      value: "org-9",
      text: "Ministry of Environment and Climate Change Strategy",
    },
    { value: "org-10", text: "Environmental Assessment Office" },
    { value: "org-11", text: "Ministry of Finance" },
    {
      value: "org-12",
      text: "Ministry of Forests",
    },
    { value: "org-13", text: "Ministry of Health" },
    {
      value: "org-14",
      text: "Ministry of Indigenous Relations and Reconciliation",
    },
    {
      value: "org-15",
      text: "Ministry of Jobs, Economic Development and Innovation",
    },
    { value: "org-16", text: "Ministry of Labour" },
    { value: "org-17", text: "Ministry of Mental Health and Addictions" },
    { value: "org-18", text: "Ministry of Municipal Affairs" },

    {
      value: "org-19",
      text: "Ministry of Public Safety and Solicitor General",
    },
    {
      value: "org-20",
      text: "Ministry of Social Development & Poverty Reduction",
    },
    { value: "org-21", text: "Ministry of Tourism, Arts, Culture and Sport" },
    { value: "org-22", text: "Ministry of Transportation & Infrastructure" },
    { value: "org-23", text: "BC Public Service Agency" },
    {
      value: "org-24",
      text: "Government Communications and Public Engagement",
    },
    { value: "org-25", text: "Office of the Premier" },
    { value: "org-26", text: "Water, Land and Resource Stewardship" },
    { value: "org-27", text: "Ministry of Housing" },
    {
      value: "org-28",
      text: "Declaration Act Secretariat",
    },
  ],
  attendancetypes: [
    { value: "minister", text: "Minister" },
    { value: "deputyminister", text: "Deputy Minister" },
    { value: "assistantminister", text: "Assistant Deputy Minister" },
    { value: "associateminister", text: "Associate Deputy Minister" },
    { value: "finalist", text: "Finalist" },
    { value: "finalistguest", text: "Finalist Guest" },
    { value: "generalattendee", text: "General Attendee" },
    { value: "partner", text: "Partner" },
    { value: "volunteer", text: "Volunteer" },
    { value: "guest", text: "Guest" },
    { value: "presenter", text: "Presenter" },
    { value: "judge", text: "Premiere's Awards Judge" },
    { value: "adjudicator", text: "Premiere's Awards Adjudicator" },
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
  pronounsoptions: [
    { value: "he/him/his", text: "He / Him / His" },
    { value: "she/he/hers", text: "She / Her / Hers" },
    { value: "they/them/theirs", text: "They / Them / Theirs" },
  ],
  supportingfinalistoptions: [
    { value: "Thyren Jacobs", text: "Thyren Jacobs - Emerging Leader" },
    { value: "Connie Chapman", text: "Connie Chapman - Emerging Leader" },
    { value: "Zak Zawaduk", text: "Zak Zawaduk - Emerging Leader" },
    {
      value: "Foundry: Work and Education Program",
      text: "Foundry: Work and Education Program - Evidence-Based Design",
    },
    {
      value: "Northern Spotten Owl Breeding and Release Program",
      text: "Northern Spotten Owl Breeding and Release Program - Evidence-Based Design",
    },
    {
      value: "Clean Transportation",
      text: "Clean Transportation - Evidence-Based Design",
    },
    {
      value: "Strengthening British Columbia’s Evacuee Emergency Supports",
      text: "Strengthening British Columbia’s Evacuee Emergency Supports - Innovation",
    },
    {
      value: "Declaration Act Action Plan: The Way Forward",
      text: "Declaration Act Action Plan: The Way Forward - Innovation",
    },
    {
      value: "Diagnostic Services",
      text: "Diagnostic Services - Innovation",
    },
    {
      value: "Teresa Butler",
      text: "Teresa Butler - Leadership",
    },
    {
      value: "Christie Harvie",
      text: "Christie Harvie - Leadership",
    },
    {
      value: "Carling Helander",
      text: "Carling Helander  - Leadership",
    },
    {
      value: "Deborah Schwartz",
      text: "Deborah Schwartz - Legacy",
    },
    {
      value: "Marj Hallihan",
      text: "Marj Hallihan - Legacy",
    },
    {
      value: "BC Corrections: Connections and Healing Through Culture",
      text: "BC Corrections: Connections and Healing Through Culture - Organizational Excellence",
    },
    {
      value: "Climate Preparedness and Adaptation Strategy",
      text: "Climate Preparedness and Adaptation Strategy - Organizational Excellence",
    },
    {
      value: "FireSmart BC: Empowering Citizens in Wildfire Protection",
      text: "FireSmart BC: Empowering Citizens in Wildfire Protection - Organizational Excellence",
    },
    {
      value: "Guardian Shared Compliance and Enforcement Pilot Project",
      text: "Guardian Shared Compliance and Enforcement Pilot Project - Partnership",
    },
    {
      value: "Indigenous Jurisdiction in Child and Family Services",
      text: "Indigenous Jurisdiction in Child and Family Services - Partnership",
    },
    {
      value:
        "Welcoming Displaced Ukrainians: A Government-Community Partnership",
      text: "Welcoming Displaced Ukrainians: A Government-Community Partnership - Partnership",
    },
    {
      value: "First Nations Jurisdiction Over Education",
      text: "First Nations Jurisdiction Over Education - Regional Impact",
    },
    {
      value: "REMP Capital Region Tsunami Information Portal",
      text: "REMP Capital Region Tsunami Information Portal - Regional Impact",
    },
    {
      value: "Working Together: Protecting the Great Bear Sea",
      text: "Working Together: Protecting the Great Bear Sea - Regional Impact",
    },
    {
      value: "Not applicable",
      text: "Not applicable",
    },
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
    attendancetype: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
    pronouns: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
    supportingfinalist: {
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
    hasNotes: { value: null, matchMode: FilterMatchMode.EQUALS },
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
    orgList: {
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
      constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
    },
    updatedAt: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
    },
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
