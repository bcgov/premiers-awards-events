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
      text: "Post-Secondary Education and Future Skills",
    },
    { value: "org-2", text: "Agriculture and Food" },
    { value: "org-3", text: "Attorney General" },
    { value: "org-4", text: "Children and Family Development" },
    { value: "org-5", text: "Citizens’ Services" },
    { value: "org-6", text: "Education and Child Care" },
    {
      value: "org-7",
      text: "Emergency Management and Climate Readiness",
    },
    {
      value: "org-8",
      text: "Energy, Mines and Low Carbon Innovation",
    },
    {
      value: "org-9",
      text: "Environment and Climate Change Strategy",
    },
    { value: "org-10", text: "Finance" },
    {
      value: "org-11",
      text: "Forests",
    },
    { value: "org-12", text: "Health" },
    {
      value: "org-13",
      text: "Indigenous Relations and Reconciliation",
    },
    {
      value: "org-14",
      text: "Jobs, Economic Development and Innovation",
    },
    { value: "org-15", text: "Labour" },
    { value: "org-16", text: "Mental Health and Addictions" },
    { value: "org-17", text: "Municipal Affairs" },

    {
      value: "org-18",
      text: "Public Safety and Solicitor General",
    },
    {
      value: "org-19",
      text: "Social Development and Poverty Reduction",
    },
    { value: "org-20", text: "Tourism, Arts, Culture and Sport" },
    { value: "org-21", text: "Transportation & Infrastructure" },
    { value: "org-22", text: "BC Public Service Agency" },
    {
      value: "org-23",
      text: "Government Communications and Public Engagement",
    },
    { value: "org-24", text: "Office of the Premier" },
    { value: "org-25", text: "Water, Land and Resource Stewardship" },
    { value: "org-26", text: "Housing" },
    { value: "org-27", text: "Crown Agencies Secretariat" },
    { value: "org-28", text: "Environmental Assessment Office" },
    { value: "org-29", text: "Declaration Act Secretariat" }
  ],
  attendancetypes: [
    { value: "minister", text: "Minister" },
    { value: "deputyminister", text: "Deputy Minister" },
    { value: "assistantminister", text: "Assistant Deputy Minister" },
    { value: "associateminister", text: "Associate Deputy Minister" },
    { value: "finalist", text: "Finalist" },
    { value: "finalistguest", text: "Finalist Guest" },
    { value: "generalattendee", text: "General Guest" },
    { value: "partner", text: "Partner" },
    { value: "volunteer", text: "Volunteer" },
    { value: "guest", text: "Guest" },
    { value: "presenter", text: "Presenter" },
    { value: "judge", text: "Premier's Awards Judge" }, // PA-184 Fixed spelling mistakes
    { value: "adjudicator", text: "Premier's Awards Adjudicator" },
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
    { value: "she/her/hers", text: "She / Her / Hers" },
    { value: "they/them/theirs", text: "They / Them / Theirs" },
    { value: "undisclosed", text: "Prefer not to disclose" }, // PA-168 - Added additional option. This has to be added in Mongo as well.
  ],
  supportingfinalistoptions: [
    { value: "Andrew Sharp", text: "Andrew Sharp - Emerging Leader" },
    { value: "Katie Olthuis", text: "Katie Olthuis - Emerging Leader" },
    { value: "Kaylee Tower", text: "Kaylee Tower - Emerging Leader" },
    { value: "Leah Wilcock", text: "Leah Wilcock - Emerging Leader" },
    {
      value: "Community Risk Reduction Dashboard",
      text: "Community Risk Reduction Dashboard - Evidence-Based Design",
    },
    {
      value: "International Credentials Recognition Act",
      text: "International Credentials Recognition Act - Evidence-Based Design",
    },
    {
      value: "Provincial Court Family Rules",
      text: "Provincial Court Family Rules - Evidence-Based Design",
    },
    {
      value: "Nancy Carter, KC",
      text: "Nancy Carter, KC - Hall of Excellence",
    },
    {
      value: "Susan Kelly",
      text: "Susan Kelly - Hall of Excellence",
    },
    {
      value: "Hospital at Home Program",
      text: "Hospital at Home Program - Innovation",
    },
    {
      value: "Nurses Respond to B.C.'s Toxic Drug Crisis",
      text: "Nurses Respond to B.C.'s Toxic Drug Crisis - Innovation",
    },
    {
      value: "Real-Time Virtual Support",
      text: "Real-Time Virtual Support - Innovation",
    },
    {
      value: "Cliff Chapman",
      text: "Cliff Chapman - Leadership",
    },
    {
      value: "Daryn Martiniuk",
      text: "Daryn Martiniuk - Leadership",
    },
    {
      value: "Marie Ty",
      text: "Marie Ty  - Leadership",
    },
    {
      value: "Richard Rogers",
      text: "Richard Rogers - Legacy",
    },
    {
      value: "Rodney Chapman",
      text: "Rodney Chapman - Legacy",
    },
    {
      value: "BC Pharmacare Minor Ailments and Contraception Service",
      text: "BC Pharmacare Minor Ailments and Contraception Service - Organizational Excellence",
    },
    {
      value: "Natural Resource Ministry Permitting Transformation",
      text: "Natural Resource Ministry Permitting Transformation - Organizational Excellence",
    },
    {
      value: "Returning St. Joseph’s Mission Residential School",
      text: "Returning St. Joseph’s Mission Residential School - Organizational Excellence",
    },
    {
      value: "Canada’s First Cervical Cancer Self-Screening Program",
      text: "Canada’s First Cervical Cancer Self-Screening Program - Partnership",
    },
    {
      value: "Gender-Based Violence Action Plan",
      text: "Gender-Based Violence Action Plan - Partnership",
    },
    {
      value: "Indigenous-Focused Graduation Requirement",
      text: "Indigenous-Focused Graduation Requirement - Partnership",
    },
    {
      value: "Kicking Horse Canyon: More than a Highway",
      text: "Kicking Horse Canyon: More than a Highway - Regional Impact",
    },
    {
      value:
        "Building Change: Infrastructure Program Expansion Supports Reconciliation",
      text: "Building Change: Infrastructure Program Expansion Supports Reconciliation - Regional Impact",
    },
    {
      value: "Remote Community Energy Strategy",
      text: "Remote Community Energy Strategy - Regional Impact",
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
    if (key == "organizations") {
      const orgs = schemaData[key];
      return orgs.sort((a, b) => {
        const aValue = JSON.stringify(Object.values(a).sort());
        const bValue = JSON.stringify(Object.values(b).sort());
        if (aValue < bValue) return -1;
        if (aValue > bValue) return 1;
        return 0;
      });
    }
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
